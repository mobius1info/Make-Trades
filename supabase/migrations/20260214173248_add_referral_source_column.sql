/*
  # Add referral source column to demo_requests and leads tables

  1. Modified Tables
    - `demo_requests`
      - Added `referral_source` (text) - how the user heard about MakeTrades
    - `leads`
      - Added `referral_source` (text) - how the user heard about MakeTrades

  2. Notes
    - Column is nullable for backward compatibility with existing data
    - New form submissions will always include this field
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'demo_requests' AND column_name = 'referral_source'
  ) THEN
    ALTER TABLE demo_requests ADD COLUMN referral_source text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'referral_source'
  ) THEN
    ALTER TABLE leads ADD COLUMN referral_source text DEFAULT '';
  END IF;
END $$;