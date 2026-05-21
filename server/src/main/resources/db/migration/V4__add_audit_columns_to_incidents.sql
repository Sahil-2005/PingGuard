-- =============================================================================
-- V4__add_audit_columns_to_incidents.sql
-- Add the missing created_at and updated_at columns required by BaseEntity
-- =============================================================================

ALTER TABLE incidents
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
