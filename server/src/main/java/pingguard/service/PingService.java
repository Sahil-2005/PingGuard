package pingguard.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import pingguard.entity.Monitor;
import pingguard.entity.MonitorStatus;
import pingguard.entity.PingResult;
import pingguard.repository.MonitorRepository;
import pingguard.repository.PingResultRepository;
import pingguard.repository.IncidentRepository;
import pingguard.entity.Incident;
import pingguard.event.MonitorStatusChangedEvent;
import org.springframework.context.ApplicationEventPublisher;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class PingService {

    private final WebClient pingWebClient;
    private final PingResultRepository pingResultRepository;
    private final MonitorRepository monitorRepository;
    private final IncidentRepository incidentRepository;
    private final ApplicationEventPublisher eventPublisher;

    public Mono<PingResult> executeCheck(Monitor monitor) {
        Instant start = Instant.now();

        return pingWebClient.get()
                .uri(monitor.getUrl())
                .exchangeToMono(response -> {
                    long duration = Duration.between(start, Instant.now()).toMillis();
                    PingResult result = new PingResult();
                    result.setMonitor(monitor);
                    result.setStatusCode(response.statusCode().value());
                    result.setResponseTimeMs(duration);
                    result.setSuccess(response.statusCode().is2xxSuccessful());
                    result.setCheckedAt(Instant.now());
                    return Mono.just(result);
                })
                .onErrorResume(ex -> {
                    long duration = Duration.between(start, Instant.now()).toMillis();
                    PingResult result = new PingResult();
                    result.setMonitor(monitor);
                    result.setStatusCode(0);
                    result.setResponseTimeMs(duration);
                    result.setSuccess(false);
                    result.setErrorMessage(ex.getMessage());
                    result.setCheckedAt(Instant.now());
                    return Mono.just(result);
                })
                .publishOn(Schedulers.boundedElastic())
                .doOnNext(result -> {
                    pingResultRepository.save(result);
                    
                    MonitorStatus oldStatus = monitor.getStatus();
                    MonitorStatus newStatus = result.isSuccess() ? MonitorStatus.UP : MonitorStatus.DOWN;
                    
                    if (oldStatus != newStatus) {
                        monitor.setStatus(newStatus);
                        monitorRepository.save(monitor);
                        
                        Incident incident = null;
                        
                        if (newStatus == MonitorStatus.DOWN) {
                            // Create a new incident
                            incident = new Incident();
                            incident.setMonitor(monitor);
                            incident.setCause(result.getErrorMessage() != null ? result.getErrorMessage() : "Status Code: " + result.getStatusCode());
                            incidentRepository.save(incident);
                        } else if (newStatus == MonitorStatus.UP) {
                            // Resolve existing incident
                            var openIncident = incidentRepository.findFirstByMonitorIdAndEndTimeIsNullOrderByStartTimeDesc(monitor.getId());
                            if (openIncident.isPresent()) {
                                incident = openIncident.get();
                                incident.setEndTime(Instant.now());
                                incidentRepository.save(incident);
                            }
                        }
                        
                        // Publish event
                        eventPublisher.publishEvent(new MonitorStatusChangedEvent(this, monitor, oldStatus, newStatus, incident));
                    }
                    
                    log.info("Ping {} → {} ({}ms)",
                            monitor.getUrl(),
                            newStatus,
                            result.getResponseTimeMs());
                });
    }
}
