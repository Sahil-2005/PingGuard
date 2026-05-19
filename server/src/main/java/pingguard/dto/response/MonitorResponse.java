package pingguard.dto.response;

import pingguard.entity.MonitorStatus;
import pingguard.entity.MonitorType;

import java.time.Instant;
import java.util.UUID;

public record MonitorResponse(
    UUID id, 
    String name, 
    String url,
    MonitorType type, 
    MonitorStatus status,
    int intervalSeconds, 
    boolean enabled,
    Instant createdAt
) {}
