package pingguard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pingguard.entity.Incident;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    
    // Finds an open incident (no end time) for a specific monitor
    Optional<Incident> findFirstByMonitorIdAndEndTimeIsNullOrderByStartTimeDesc(UUID monitorId);
}
