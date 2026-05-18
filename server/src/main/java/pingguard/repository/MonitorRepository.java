package pingguard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pingguard.entity.Monitor;

import java.util.List;
import java.util.UUID;

public interface MonitorRepository extends JpaRepository<Monitor, UUID> {
    List<Monitor> findByOwnerIdAndEnabledTrue(UUID ownerId);
    List<Monitor> findByEnabledTrue();
}
