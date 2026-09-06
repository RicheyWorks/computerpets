-- Phase 2.1 / 2.2 additions: usage tracking and optional hardware binding
ALTER TABLE issued_licenses
    ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP;

ALTER TABLE issued_licenses
    ADD COLUMN IF NOT EXISTS hwid VARCHAR(128);