package pingguard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private UUID id;
    private Instant startTime;
    private Instant endTime;
    private String cause;
}
