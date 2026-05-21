package pingguard.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import pingguard.entity.MonitorStatus;
import pingguard.entity.User;
import pingguard.event.MonitorStatusChangedEvent;
import pingguard.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class EmailAlertService {

    private static final Logger log = LoggerFactory.getLogger(EmailAlertService.class);

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    /**
     * Listens for monitor status changes and sends an email alert asynchronously.
     * Only triggers when going UP -> DOWN (Alert) or DOWN -> UP (Resolved).
     */
    @Async
    @EventListener
    public void handleMonitorStatusChange(MonitorStatusChangedEvent event) {
        var monitor = event.getMonitor();
        var oldStatus = event.getOldStatus();
        var newStatus = event.getNewStatus();

        // Only alert on meaningful transitions (DOWN or UP from DOWN)
        if (newStatus == MonitorStatus.DOWN && oldStatus != MonitorStatus.DOWN) {
            sendIncidentAlert(event);
        } else if (newStatus == MonitorStatus.UP && oldStatus == MonitorStatus.DOWN) {
            sendResolvedAlert(event);
        }
    }

    private void sendIncidentAlert(MonitorStatusChangedEvent event) {
        var monitor = event.getMonitor();
        var ownerId = monitor.getOwner().getId();
        User owner = userRepository.findById(ownerId).orElse(null);
        if (owner == null) return;
        
        var ownerEmail = owner.getEmail();
        var incident = event.getIncident();
        var cause = incident != null && incident.getCause() != null ? incident.getCause() : "Unknown cause";

        log.info("Sending DOWN alert email to {} for monitor {}", ownerEmail, monitor.getName());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ownerEmail);
        message.setFrom("alerts@pingguard.com");
        message.setSubject("🚨 PingGuard Alert: " + monitor.getName() + " is DOWN");
        message.setText("""
                Hello %s,
                
                Your monitor '%s' (%s) is currently DOWN.
                
                Time: %s
                Cause: %s
                
                Please check your PingGuard dashboard for more details.
                
                - The PingGuard Team
                """.formatted(
                        owner.getDisplayName(),
                        monitor.getName(),
                        monitor.getUrl(),
                        incident != null ? incident.getStartTime().toString() : "Now",
                        cause
                ));

        mailSender.send(message);
    }

    private void sendResolvedAlert(MonitorStatusChangedEvent event) {
        var monitor = event.getMonitor();
        var ownerId = monitor.getOwner().getId();
        User owner = userRepository.findById(ownerId).orElse(null);
        if (owner == null) return;
        
        var ownerEmail = owner.getEmail();
        var incident = event.getIncident();

        log.info("Sending RESOLVED alert email to {} for monitor {}", ownerEmail, monitor.getName());

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ownerEmail);
        message.setFrom("alerts@pingguard.com");
        message.setSubject("✅ PingGuard Resolved: " + monitor.getName() + " is UP");
        message.setText("""
                Hello %s,
                
                Good news! Your monitor '%s' (%s) is back UP and responding successfully.
                
                Downtime started: %s
                Resolved at: %s
                
                - The PingGuard Team
                """.formatted(
                owner.getDisplayName(),
                monitor.getName(),
                monitor.getUrl(),
                incident != null ? incident.getStartTime().toString() : "Unknown",
                incident != null && incident.getEndTime() != null ? incident.getEndTime().toString() : "Now"
        ));

        mailSender.send(message);
    }
}
