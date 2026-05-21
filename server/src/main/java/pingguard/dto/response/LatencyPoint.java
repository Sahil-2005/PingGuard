package pingguard.dto.response;

import java.time.Instant;

/**
 * A single data point in a latency time-series chart.
 * Each point represents one hourly bucket from ping_results_hourly.
 */
public record LatencyPoint(
        Instant bucket,
        double  avgLatencyMs,
        double  maxLatencyMs
) {}
