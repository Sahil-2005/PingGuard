-- =============================================================================
-- V1__baseline.sql
-- Baseline migration: captures the existing schema that Hibernate 'ddl-auto:
-- update' previously managed. Flyway will mark this as the starting point.
-- =============================================================================

-- ---- USERS ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(255) NOT NULL,
    tier            VARCHAR(20)  NOT NULL DEFAULT 'FREE',  -- FREE | PRO | ENTERPRISE
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ---- MONITORS ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS monitors (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name             VARCHAR(255) NOT NULL,
    url              VARCHAR(2048) NOT NULL,
    type             VARCHAR(20)  NOT NULL DEFAULT 'HTTP',    -- HTTP | HTTPS | TCP
    status           VARCHAR(20)  NOT NULL DEFAULT 'UNKNOWN', -- UNKNOWN | UP | DOWN
    interval_seconds INT          NOT NULL DEFAULT 300,
    enabled          BOOLEAN      NOT NULL DEFAULT TRUE,
    owner_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitors_owner_id ON monitors(owner_id);
CREATE INDEX IF NOT EXISTS idx_monitors_owner_enabled ON monitors(owner_id, enabled);

-- ---- PING_RESULTS -----------------------------------------------------------
-- Note: This table will be converted to a TimescaleDB hypertable in V2.
-- The index on (monitor_id, checked_at) is critical for time-series queries.
CREATE TABLE IF NOT EXISTS ping_results (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    monitor_id        UUID        NOT NULL REFERENCES monitors(id) ON DELETE CASCADE,
    status_code       INT,
    response_time_ms  BIGINT      NOT NULL,
    success           BOOLEAN     NOT NULL,
    error_message     TEXT,
    checked_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ping_monitor_time
    ON ping_results(monitor_id, checked_at DESC);
