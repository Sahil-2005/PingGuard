-- -- =============================================================================
-- -- V2__convert_to_hypertable.sql
-- -- Phase 6: Analytics & Telemetry
-- --
-- -- 1. Promotes ping_results to a TimescaleDB hypertable (partitioned by time).
-- -- 2. Creates a Continuous Aggregate materialised view (ping_results_hourly)
-- --    that pre-computes per-hour stats per monitor.
-- -- 3. Attaches a refresh policy so the aggregate stays current automatically.
-- -- =============================================================================

-- -- -----------------------------------------------------------------------------
-- -- Step 1: Promote ping_results to a TimescaleDB hypertable.
-- --
-- -- 'checked_at' is the time-partitioning column.
-- -- 'migrate_data => true' moves any existing rows into the new chunk structure.
-- -- 'if_not_exists => true' makes the migration idempotent (safe to re-run).
-- -- -----------------------------------------------------------------------------

-- -- 1. Drop the existing primary key (PostgreSQL names it tablename_pkey by default)
-- ALTER TABLE ping_results DROP CONSTRAINT ping_results_pkey;

-- -- 2. Create a new composite primary key including the time column
-- ALTER TABLE ping_results ADD PRIMARY KEY (id, checked_at);

-- SELECT create_hypertable(
--     'ping_results',
--     'checked_at',
--     migrate_data  => true,
--     if_not_exists => true
-- );

-- -- Partition into 1-day chunks. This keeps each chunk small enough for fast
-- -- queries on recent data and enables efficient compression of older chunks.
-- SELECT set_chunk_time_interval('ping_results', INTERVAL '1 day');

-- -- -----------------------------------------------------------------------------
-- -- Step 2: Create the Continuous Aggregate — ping_results_hourly.
-- --
-- -- This is a materialised view maintained automatically by TimescaleDB.
-- -- It pre-computes hourly aggregates per monitor so that 7d/30d queries
-- -- hit the aggregate (fast) instead of raw ping_results (slower at scale).
-- -- -----------------------------------------------------------------------------
-- CREATE MATERIALIZED VIEW IF NOT EXISTS ping_results_hourly
-- WITH (timescaledb.continuous) AS
-- SELECT
--     time_bucket('1 hour', checked_at)           AS bucket,
--     monitor_id,
--     COUNT(*)                                     AS total_checks,
--     COUNT(*) FILTER (WHERE success = true)       AS successful_checks,
--     ROUND(AVG(response_time_ms)::numeric, 2)     AS avg_latency_ms,
--     MAX(response_time_ms)                         AS max_latency_ms,
--     MIN(response_time_ms)                         AS min_latency_ms
-- FROM ping_results
-- GROUP BY bucket, monitor_id
-- WITH NO DATA;   -- Do not backfill on creation; the refresh policy will handle it.

-- -- Create an index on the aggregate to accelerate monitor-specific queries.
-- CREATE INDEX IF NOT EXISTS idx_hourly_monitor_bucket
--     ON ping_results_hourly(monitor_id, bucket DESC);

-- -- -----------------------------------------------------------------------------
-- -- Step 3: Attach a Continuous Aggregate refresh policy.
-- --
-- -- This instructs TimescaleDB to automatically refresh the aggregate every 30
-- -- minutes, keeping data that is between 2 days old and 30 minutes old current.
-- -- The 30-minute end_offset prevents refreshing in-progress (open) time buckets.
-- -- -----------------------------------------------------------------------------
-- SELECT add_continuous_aggregate_policy(
--     'ping_results_hourly',
--     start_offset      => INTERVAL '2 days',
--     end_offset        => INTERVAL '30 minutes',
--     schedule_interval => INTERVAL '30 minutes',
--     if_not_exists     => true
-- );




-- 1. Drop the existing primary key 
ALTER TABLE ping_results DROP CONSTRAINT IF EXISTS ping_results_pkey;

-- 2. Create the composite primary key required by TimescaleDB
ALTER TABLE ping_results ADD PRIMARY KEY (id, checked_at);

-- 3. Convert the standard PostgreSQL table into a TimescaleDB Hypertable
SELECT create_hypertable('ping_results', 'checked_at', migrate_data => true);

-- 4. Create a Standard View (Dynamic, Real-time, No transaction blocks!)
CREATE VIEW ping_results_hourly AS
SELECT
    time_bucket('1 hour', checked_at) AS bucket,
    monitor_id,
    AVG(response_time_ms) AS avg_latency_ms,
    MAX(response_time_ms) AS max_latency_ms,
    COUNT(*) AS total_pings,
    COUNT(*) FILTER (WHERE success = true) AS successful_pings
FROM ping_results
GROUP BY bucket, monitor_id;