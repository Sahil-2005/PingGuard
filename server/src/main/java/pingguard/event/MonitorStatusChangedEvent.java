package pingguard.event;

import org.springframework.context.ApplicationEvent;
import pingguard.entity.Monitor;
import pingguard.entity.MonitorStatus;
import pingguard.entity.Incident;

/**
 * Event fired whenever a Monitor changes status (e.g. UP -> DOWN, or DOWN -> UP).
 */
public class MonitorStatusChangedEvent extends ApplicationEvent {

    private final Monitor monitor;
    private final MonitorStatus oldStatus;
    private final MonitorStatus newStatus;
    private final Incident incident; // The incident created (or resolved) during this transition

    public MonitorStatusChangedEvent(Object source, Monitor monitor, MonitorStatus oldStatus, MonitorStatus newStatus, Incident incident) {
        super(source);
        this.monitor = monitor;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.incident = incident;
    }

    public Monitor getMonitor() {
        return monitor;
    }

    public MonitorStatus getOldStatus() {
        return oldStatus;
    }

    public MonitorStatus getNewStatus() {
        return newStatus;
    }

    public Incident getIncident() {
        return incident;
    }
}
