package pingguard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import pingguard.dto.response.AnalyticsSummaryResponse;
import pingguard.dto.response.DailyUptimePoint;
import pingguard.dto.response.LatencyPoint;
import pingguard.entity.Monitor;
import pingguard.repository.AnalyticsRepository;
import pingguard.repository.AnalyticsRepository.DailyUptimeProjection;
import pingguard.repository.AnalyticsRepository.LatencyBucketProjection;
import pingguard.repository.AnalyticsRepository.UptimeSummaryProjection;
import pingguard.repository.MonitorRepository;

import java.util.List;
import java.util.UUID;

/**
 * Orchestrates analytics data for a single monitor.
 *
 * <p>Security contract: every public method accepts the requesting user's ID
 * and throws 403 if the monitor does not belong to that user.
 * This prevents horizontal privilege escalation — users may only read
 * analytics for monitors they own.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final MonitorRepository    monitorRepository;
    private final AnalyticsRepository  analyticsRepository;

    /**
     * Returns a complete analytics summary for the given monitor.
     *
     * @param monitorId       the monitor to query
     * @param requestingUserId the authenticated user's ID
     * @return populated {@link AnalyticsSummaryResponse}
     * @throws ResponseStatusException 404 if monitor not found, 403 if not the owner
     */
    public AnalyticsSummaryResponse getSummary(UUID monitorId, UUID requestingUserId) {

        // --- ownership check ------------------------------------------------
        Monitor monitor = monitorRepository.findById(monitorId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Monitor not found"));

        if (!monitor.getOwner().getId().equals(requestingUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You do not have access to this monitor");
        }

        // --- fetch uptime summaries -----------------------------------------
        UptimeSummaryProjection summary24h = analyticsRepository.getUptime24h(monitorId);
        UptimeSummaryProjection summary7d  = analyticsRepository.getUptime7d(monitorId);
        UptimeSummaryProjection summary30d = analyticsRepository.getUptime30d(monitorId);

        // --- fetch chart data -----------------------------------------------
        List<LatencyPoint> latencySeries = analyticsRepository
                .getLatencySeries24h(monitorId)
                .stream()
                .map(AnalyticsService::toLatencyPoint)
                .toList();

        List<DailyUptimePoint> dailyUptime = analyticsRepository
                .getDailyUptime30d(monitorId)
                .stream()
                .map(AnalyticsService::toDailyUptimePoint)
                .toList();

        // --- assemble response ----------------------------------------------
        return new AnalyticsSummaryResponse(
                monitor.getId(),
                monitor.getName(),
                monitor.getUrl(),
                monitor.getStatus(),
                analyticsRepository.findLastCheckedAt(monitorId),

                safeDouble(summary24h != null ? summary24h.getUptimePercentage() : null),
                safeDouble(summary7d  != null ? summary7d.getUptimePercentage()  : null),
                safeDouble(summary30d != null ? summary30d.getUptimePercentage() : null),

                safeDouble(summary24h != null ? summary24h.getAvgLatencyMs() : null),
                safeDouble(summary7d  != null ? summary7d.getAvgLatencyMs()  : null),
                safeDouble(summary30d != null ? summary30d.getAvgLatencyMs() : null),

                latencySeries,
                dailyUptime
        );
    }

    // -------------------------------------------------------------------------
    // Private mappers — keep the service method readable
    // -------------------------------------------------------------------------

    private static LatencyPoint toLatencyPoint(LatencyBucketProjection p) {
        return new LatencyPoint(
                p.getBucket(),
                safeDouble(p.getAvgLatencyMs()),
                safeDouble(p.getMaxLatencyMs())
        );
    }

    private static DailyUptimePoint toDailyUptimePoint(DailyUptimeProjection p) {
        return new DailyUptimePoint(
                p.getDay(),
                safeDouble(p.getUptimePct())
        );
    }

    /**
     * Converts a nullable Double to a primitive-safe double.
     * When no ping data exists for a window the DB returns NULL; we return 0.0
     * rather than propagating a NullPointerException.
     */
    private static double safeDouble(Double value) {
        return value != null ? value : 0.0;
    }
}
