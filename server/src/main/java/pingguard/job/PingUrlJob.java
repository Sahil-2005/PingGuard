package pingguard.job;

import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pingguard.repository.MonitorRepository;
import pingguard.service.PingService;

import java.util.UUID;

@Component
@DisallowConcurrentExecution
public class PingUrlJob implements Job {

    @Autowired
    private PingService pingService;

    @Autowired
    private MonitorRepository monitorRepo;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        try {
            UUID monitorId = UUID.fromString(context.getJobDetail().getJobDataMap().getString("monitorId"));

            monitorRepo.findById(monitorId).ifPresent(monitor -> {
                pingService.executeCheck(monitor).subscribe();
            });
        } catch (Exception e) {
            throw new JobExecutionException("Failed to execute PingUrlJob", e);
        }
    }
}
