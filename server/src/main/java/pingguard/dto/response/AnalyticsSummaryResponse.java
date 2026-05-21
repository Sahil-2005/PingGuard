package pingguard.dto.response;

import pingguard.entity.MonitorStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Complete analytics payload for a single monitor.
 * Returned by GET /api/monitors/{id}/analytics.
 *
 * <p>Uptime windows are percentages (0.0–100.0).
 * Latency values are in milliseconds.
 * latencySeries covers the last 24 hours (hourly buckets).
 * dailyUptime covers the last 30 days (daily buckets).
 */
public record AnalyticsSummaryResponse(

        // Monitor identity
        UUID          monitorId,
        String        monitorName,
        String        monitorUrl,
        MonitorStatus currentStatus,
        Instant       lastCheckedAt,

        // Uptime percentages across three rolling windows
        Double uptime24h,
        Double uptime7d,
        Double uptime30d,

        // Average latency across three rolling windows (ms)
        Double avgLatencyMs24h,
        Double avgLatencyMs7d,
        Double avgLatencyMs30d,

        // Time-series data for charts
        List<LatencyPoint>    latencySeries,   // hourly, last 24 h
        List<DailyUptimePoint> dailyUptime      // daily, last 30 days
) {}
