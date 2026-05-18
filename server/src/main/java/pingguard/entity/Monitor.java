package pingguard.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "monitors")
@Getter
@Setter
@NoArgsConstructor
public class Monitor extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String url;

    @Enumerated(EnumType.STRING)
    private MonitorType type = MonitorType.HTTP;

    @Enumerated(EnumType.STRING)
    private MonitorStatus status = MonitorStatus.UNKNOWN;

    private int intervalSeconds = 300; // default 5 min

    private boolean enabled = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "monitor", cascade = CascadeType.ALL)
    private List<PingResult> pingResults = new ArrayList<>();
}
