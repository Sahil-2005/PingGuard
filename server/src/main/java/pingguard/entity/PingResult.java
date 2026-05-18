package pingguard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "ping_results",
       indexes = @Index(name = "idx_ping_monitor_time", columnList = "monitor_id, checked_at"))
@Getter
@Setter
@NoArgsConstructor
public class PingResult extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "monitor_id", nullable = false)
    private Monitor monitor;

    private int statusCode;
    private long responseTimeMs;
    private boolean success;
    private String errorMessage;

    @Column(nullable = false)
    private Instant checkedAt;
}
