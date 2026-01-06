-- Daily cron job to detect day-31 timeouts
-- Run this via Supabase scheduled function or external cron

SELECT cron.schedule(
  'detect-timeout-violations',
  '0 0 * * *', -- Daily at midnight
  $$
  SELECT detect_timeout_violations();
  $$
);

-- Function to update days_since_last_action daily
CREATE OR REPLACE FUNCTION increment_days_since_action()
RETURNS void AS $$
BEGIN
  UPDATE analyzer_items
  SET days_since_last_action = COALESCE(days_since_last_action, 0) + 1
  WHERE 
    round_status = 'active'
    AND last_mail_received_at IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule daily increment
SELECT cron.schedule(
  'increment-days-since-action',
  '0 1 * * *', -- Daily at 1 AM
  $$
  SELECT increment_days_since_action();
  $$
);
