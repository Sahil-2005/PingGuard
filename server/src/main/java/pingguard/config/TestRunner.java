package pingguard.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pingguard.entity.Monitor;
import pingguard.entity.MonitorStatus;
import pingguard.entity.MonitorType;
import pingguard.entity.User;
import pingguard.repository.MonitorRepository;
import pingguard.repository.UserRepository;
import pingguard.service.MonitorSchedulerService;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class TestRunner implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MonitorRepository monitorRepository;
    private final MonitorSchedulerService schedulerService;

    @Override
    public void run(String... args) throws Exception {
        log.info("TestRunner: Initializing dummy data for Phase 3 Verification...");

        // 1. Create a dummy User
        String email = "test@pingguard.com";
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPasswordHash("dummyhash");
            newUser.setDisplayName("Test User");
            return userRepository.save(newUser);
        });

        // 2. Create a dummy Monitor
        String url = "https://www.google.com";
        Optional<Monitor> existingMonitor = monitorRepository.findByEnabledTrue().stream()
                .filter(m -> m.getUrl().equals(url))
                .findFirst();

        Monitor monitor;
        if (existingMonitor.isEmpty()) {
            monitor = new Monitor();
            monitor.setName("Google");
            monitor.setUrl(url);
            monitor.setType(MonitorType.HTTPS);
            monitor.setStatus(MonitorStatus.UNKNOWN);
            monitor.setIntervalSeconds(10); // Ping every 10 seconds for testing
            monitor.setEnabled(true);
            monitor.setOwner(user);
            monitor = monitorRepository.save(monitor);
        } else {
            monitor = existingMonitor.get();
        }

        // 3. Trigger Quartz Job
        log.info("TestRunner: Scheduling monitor to ping every 10 seconds...");
        schedulerService.scheduleMonitor(monitor);
    }
}
