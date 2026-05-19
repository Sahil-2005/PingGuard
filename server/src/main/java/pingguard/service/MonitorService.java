package pingguard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pingguard.dto.request.CreateMonitorRequest;
import pingguard.dto.response.MonitorResponse;
import pingguard.entity.Monitor;
import pingguard.entity.User;
import pingguard.mapper.MonitorMapper;
import pingguard.repository.MonitorRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MonitorService {

    private final MonitorRepository monitorRepository;
    private final MonitorSchedulerService schedulerService;
    private final MonitorMapper monitorMapper;

    public MonitorResponse create(CreateMonitorRequest req, User owner) {
        Monitor monitor = monitorMapper.toEntity(req, owner);
        monitor = monitorRepository.save(monitor);
        try {
            schedulerService.scheduleMonitor(monitor);
        } catch (Exception e) {
            throw new RuntimeException("Failed to schedule monitor", e);
        }
        return monitorMapper.toResponse(monitor);
    }

    @Transactional(readOnly = true)
    public List<MonitorResponse> getAllForUser(UUID userId) {
        return monitorRepository.findByOwnerIdAndEnabledTrue(userId)
                .stream().map(monitorMapper::toResponse).collect(Collectors.toList());
    }

    public void delete(UUID monitorId, User user) {
        Monitor m = monitorRepository.findById(monitorId)
                .orElseThrow(() -> new RuntimeException("Monitor not found"));
        
        if (!m.getOwner().getId().equals(user.getId())) {
            throw new RuntimeException("Access Denied");
        }
        
        try {
            schedulerService.unscheduleMonitor(monitorId);
        } catch (Exception e) {
            // Ignore if unschedule fails, we still want to delete
        }
        
        monitorRepository.delete(m);
    }
}
