-- Migration 0005: Drug Interactions table
-- Doctors write drug interaction notes for specific patients.
-- Only the authoring doctor can edit/delete their own notes.

CREATE TABLE IF NOT EXISTS drug_interactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Core clinical fields
  drug_a           TEXT NOT NULL,          -- First drug name
  drug_b           TEXT NOT NULL,          -- Second drug name (or "class")
  severity         TEXT NOT NULL DEFAULT 'moderate'
                     CHECK (severity IN ('mild','moderate','severe','contraindicated')),
  interaction_type TEXT NOT NULL DEFAULT 'pharmacodynamic'
                     CHECK (interaction_type IN (
                       'pharmacokinetic','pharmacodynamic','food_drug','allergy','other'
                     )),
  description      TEXT NOT NULL,          -- Clinical notes written by doctor
  recommendation   TEXT,                   -- What to do / avoid

  -- Metadata
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by patient
CREATE INDEX IF NOT EXISTS idx_drug_interactions_patient ON drug_interactions(patient_id);
-- Index for lookup by doctor
CREATE INDEX IF NOT EXISTS idx_drug_interactions_doctor  ON drug_interactions(doctor_user_id);

-- Add audit_action enum value for drug interaction events (safe if already exists)
DO $$ BEGIN
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'drug_interaction_write';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TYPE audit_action ADD VALUE IF NOT EXISTS 'drug_interaction_delete';
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
