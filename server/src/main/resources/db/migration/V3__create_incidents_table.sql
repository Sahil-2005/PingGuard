-- =============================================================================
-- V3__create_incidents_table.sql
-- Creates the incidents table to track when monitors go offline and when they
-- recover.
-- =============================================================================

CREATE TABLE IF NOT EXISTS incidents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitor_id      UUID NOT NULL,
    start_time      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time        TIMESTAMPTZ,
    cause           VARCHAR(500),
    CONSTRAINT fk_incident_monitor FOREIGN KEY (monitor_id) REFERENCES monitors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_incidents_monitor_id ON incidents(monitor_id);
