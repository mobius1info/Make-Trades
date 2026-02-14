/*
  # Add broker_experience column to demo_requests and leads tables

  1. Modified Tables
    - `demo_requests`
      - Added `broker_experience` (boolean, default false) - whether the user has broker experience
    - `leads`
      - Added `broker_experience` (boolean, default false) - whether the user has broker experience

  2. Notes
    - Both columns have a default value of false for backward compatibility
    - Existing rows will have broker_experience = false
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_requests' AND column_name = 'broker_experience'
  ) THEN
    ALTER TABLE demo_requests ADD COLUMN broker_experience boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'broker_experience'
  ) THEN
    ALTER TABLE leads ADD COLUMN broker_experience boolean NOT NULL DEFAULT false;
  END IF;
END $$;