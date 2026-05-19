package pingguard.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;
import pingguard.entity.MonitorType;

public record CreateMonitorRequest(
    @NotBlank String name,
    @NotBlank @URL String url,
    MonitorType type,
    Integer intervalSeconds
) {}
