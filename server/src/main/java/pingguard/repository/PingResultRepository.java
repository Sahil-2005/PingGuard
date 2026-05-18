package pingguard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pingguard.entity.PingResult;

import java.util.List;
import java.util.UUID;

public interface PingResultRepository extends JpaRepository<PingResult, UUID> {
    List<PingResult> findTop50ByMonitorIdOrderByCheckedAtDesc(UUID monitorId);
    void deleteByMonitorId(UUID monitorId);
}
