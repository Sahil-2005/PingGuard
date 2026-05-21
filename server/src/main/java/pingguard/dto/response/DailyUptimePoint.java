package pingguard.dto.response;

import java.time.LocalDate;

/**
 * A single data point in the 30-day daily uptime bar chart.
 * Each point represents one calendar day's aggregated uptime percentage.
 */
public record DailyUptimePoint(
        LocalDate day,
        double    uptimePct
) {}
