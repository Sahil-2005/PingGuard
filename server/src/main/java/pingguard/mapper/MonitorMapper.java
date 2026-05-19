package pingguard.mapper;

import org.springframework.stereotype.Component;
import pingguard.dto.request.CreateMonitorRequest;
import pingguard.dto.response.MonitorResponse;
import pingguard.entity.Monitor;
import pingguard.entity.User;
import pingguard.entity.MonitorType;

@Component
public class MonitorMapper {

    public MonitorResponse toResponse(Monitor monitor) {
        return new MonitorResponse(
            monitor.getId(),
            monitor.getName(),
            monitor.getUrl(),
            monitor.getType(),
            monitor.getStatus(),
            monitor.getIntervalSeconds(),
            monitor.isEnabled(),
            monitor.getCreatedAt()
        );
    }

    public Monitor toEntity(CreateMonitorRequest req, User owner) {
        Monitor monitor = new Monitor();
        monitor.setName(req.name());
        monitor.setUrl(req.url());
        monitor.setType(req.type() != null ? req.type() : MonitorType.HTTP);
        monitor.setIntervalSeconds(req.intervalSeconds() != null ? req.intervalSeconds() : 300);
        monitor.setOwner(owner);
        return monitor;
    }
}
