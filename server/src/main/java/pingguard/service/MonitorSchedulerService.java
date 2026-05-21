package pingguard.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.context.event.EventListener;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.stereotype.Service;
import pingguard.entity.Monitor;
import pingguard.repository.MonitorRepository;
import pingguard.job.PingUrlJob;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MonitorSchedulerService {

    private final Scheduler scheduler;
    private final MonitorRepository monitorRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void syncMonitorsOnStartup() {
        log.info("Synchronizing monitors with Quartz Scheduler on startup...");
        monitorRepository.findAll().forEach(monitor -> {
            try {
                scheduleMonitor(monitor);
            } catch (SchedulerException e) {
                log.error("Failed to schedule monitor on startup: {}", monitor.getId(), e);
            }
        });
        log.info("Monitor synchronization complete.");
    }

    public void scheduleMonitor(Monitor monitor) throws SchedulerException {
        String jobId = "ping-" + monitor.getId();

        // Prevent Duplicate scheduling
        if(scheduler.checkExists(JobKey.jobKey(jobId, "pings"))) {
           return;
        }

        JobDetail job = JobBuilder.newJob(PingUrlJob.class)
                .withIdentity(jobId, "pings")
                .usingJobData("monitorId", monitor.getId().toString())
                .storeDurably()
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("trigger-" + monitor.getId(), "pings")
                .startNow()
                .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                        .withIntervalInSeconds(monitor.getIntervalSeconds())
                        .repeatForever())
                .build();

        scheduler.scheduleJob(job, trigger);
        log.info("Scheduled monitor {} every {}s", monitor.getName(), monitor.getIntervalSeconds());
    }

    public void unscheduleMonitor(UUID monitorId) throws SchedulerException {
        scheduler.deleteJob(JobKey.jobKey("ping-" + monitorId, "pings"));
    }

    public void rescheduleMonitor(Monitor monitor) throws SchedulerException {
        unscheduleMonitor(monitor.getId());
        scheduleMonitor(monitor);
    }
}
