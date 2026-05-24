package pingguard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pingguard.entity.PingResult;

import java.util.List;
import java.util.UUID;

/**
 * Repository for analytics queries against ping_results (hypertable) and
 * the ping_results_hourly continuous aggregate.
 *
 * <p>All native SQL queries target TimescaleDB-specific views and functions.
 * Spring projections are used so we never materialise full PingResult entities
 * for these aggregation queries — only the columns we need are fetched.
 */
public interface AnalyticsRepository extends JpaRepository<PingResult, UUID> {

    // -------------------------------------------------------------------------
    // Continuous Aggregate Refresh
    // -------------------------------------------------------------------------

    @org.springframework.data.jpa.repository.Modifying
    @Query(value = "CALL refresh_continuous_aggregate('ping_results_hourly', NULL, NULL)", nativeQuery = true)
    void refreshContinuousAggregate();

    // -------------------------------------------------------------------------
    // Uptime Summary Projections
    // -------------------------------------------------------------------------

    /**
     * 24-hour uptime % and average latency.
     * Hits raw ping_results (hypertable hot-tier) — accurate to the minute.
     */
    @Query(value = """
            SELECT
                ROUND(
                    100.0 * COUNT(*) FILTER (WHERE success = true)
                    / NULLIF(COUNT(*), 0),
                    2
                )                           AS uptimePercentage,
                ROUND(AVG(response_time_ms)::numeric, 2) AS avgLatencyMs
            FROM ping_results
            WHERE monitor_id  = :monitorId
              AND checked_at >= NOW() - INTERVAL '24 hours'
            """,
            nativeQuery = true)
    UptimeSummaryProjection getUptime24h(@Param("monitorId") UUID monitorId);

    /**
     * 7-day uptime % and average latency.
     * Hits ping_results_hourly (continuous aggregate) — O(hours) not O(pings).
     */
    @Query(value = """
            SELECT
                ROUND(
                    100.0 * SUM(successful_pings)
                    / NULLIF(SUM(total_checks), 0),
                    2
                )                            AS uptimePercentage,
                ROUND(AVG(avg_latency_ms)::numeric, 2) AS avgLatencyMs
            FROM ping_results_hourly
            WHERE monitor_id = :monitorId
              AND bucket     >= NOW() - INTERVAL '7 days'
            """,
            nativeQuery = true)
    UptimeSummaryProjection getUptime7d(@Param("monitorId") UUID monitorId);

    /**
     * 30-day uptime % and average latency.
     * Hits ping_results_hourly (continuous aggregate).
     */
    @Query(value = """
            SELECT
                ROUND(
                    100.0 * SUM(successful_pings)
                    / NULLIF(SUM(total_checks), 0),
                    2
                )                            AS uptimePercentage,
                ROUND(AVG(avg_latency_ms)::numeric, 2) AS avgLatencyMs
            FROM ping_results_hourly
            WHERE monitor_id = :monitorId
              AND bucket     >= NOW() - INTERVAL '30 days'
            """,
            nativeQuery = true)
    UptimeSummaryProjection getUptime30d(@Param("monitorId") UUID monitorId);

    // -------------------------------------------------------------------------
    // Chart Time-Series Projections
    // -------------------------------------------------------------------------

    /**
     * Hourly latency series for the last 24 hours.
     * Powers the LatencyLineChart on the monitor detail page.
     */
    @Query(value = """
            SELECT
                bucket                                    AS bucket,
                ROUND(avg_latency_ms::numeric, 2)         AS avgLatencyMs,
                ROUND(max_latency_ms::numeric, 2)         AS maxLatencyMs
            FROM ping_results_hourly
            WHERE monitor_id = :monitorId
              AND bucket     >= NOW() - INTERVAL '24 hours'
            ORDER BY bucket ASC
            """,
            nativeQuery = true)
    List<LatencyBucketProjection> getLatencySeries24h(@Param("monitorId") UUID monitorId);

    /**
     * Daily uptime percentage series for the last 30 days.
     * Powers the UptimeBarChart on the monitor detail page.
     */
    @Query(value = """
            SELECT
                time_bucket('1 day', bucket)::date        AS day,
                ROUND(
                    100.0 * SUM(successful_pings)
                    / NULLIF(SUM(total_checks), 0),
                    2
                )                                         AS uptimePct
            FROM ping_results_hourly
            WHERE monitor_id = :monitorId
              AND bucket     >= NOW() - INTERVAL '30 days'
            GROUP BY time_bucket('1 day', bucket)
            ORDER BY time_bucket('1 day', bucket) ASC
            """,
            nativeQuery = true)
    List<DailyUptimeProjection> getDailyUptime30d(@Param("monitorId") UUID monitorId);

    // -------------------------------------------------------------------------
    // Last ping timestamp (used to populate AnalyticsSummaryResponse.lastCheckedAt)
    // -------------------------------------------------------------------------
    @Query(value = """
            SELECT checked_at
            FROM   ping_results
            WHERE  monitor_id = :monitorId
            ORDER  BY checked_at DESC
            LIMIT  1
            """,
            nativeQuery = true)
    java.time.Instant findLastCheckedAt(@Param("monitorId") UUID monitorId);

    // =========================================================================
    // Projection interfaces — Spring Data maps native query columns to these.
    // Column aliases in SQL MUST match the getter names exactly (camelCase).
    // =========================================================================

    interface UptimeSummaryProjection {
        Double getUptimePercentage();
        Double getAvgLatencyMs();
    }

    interface LatencyBucketProjection {
        java.time.Instant getBucket();
        Double getAvgLatencyMs();
        Double getMaxLatencyMs();
    }

    interface DailyUptimeProjection {
        java.time.LocalDate getDay();
        Double getUptimePct();
    }
}
