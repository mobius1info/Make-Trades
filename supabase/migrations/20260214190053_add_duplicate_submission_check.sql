/*
  # Add duplicate submission protection

  1. New Functions
    - `check_recent_submission(p_email text, p_telegram text)` - checks if the same email or telegram
      was submitted within the last 24 hours across demo_requests and contact_submissions tables.
      Returns JSON with `is_duplicate` boolean.

  2. Security
    - Function is accessible to anon role for pre-submission checks
    - Uses security definer with restricted search_path to safely query tables
*/

CREATE OR REPLACE FUNCTION check_recent_submission(p_email text, p_telegram text DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_count integer := 0;
  cooldown_interval interval := interval '24 hours';
BEGIN
  SELECT count(*) INTO recent_count
  FROM demo_requests
  WHERE (lower(trim(email)) = lower(trim(p_email))
         OR (p_telegram IS NOT NULL AND p_telegram != '' AND lower(trim(telegram)) = lower(trim(p_telegram))))
    AND requested_at > now() - cooldown_interval;

  IF recent_count = 0 THEN
    SELECT count(*) INTO recent_count
    FROM contact_submissions
    WHERE (lower(trim(email)) = lower(trim(p_email))
           OR (p_telegram IS NOT NULL AND p_telegram != '' AND lower(trim(telegram)) = lower(trim(p_telegram))))
      AND submitted_at > now() - cooldown_interval;
  END IF;

  RETURN json_build_object('is_duplicate', recent_count > 0);
END;
$$;

GRANT EXECUTE ON FUNCTION check_recent_submission(text, text) TO anon;
GRANT EXECUTE ON FUNCTION check_recent_submission(text, text) TO authenticated;