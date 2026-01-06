-- Mail Enforcement System Migration
-- Adds mail evidence tracking and procedural violation detection

-- Add new fields to analyzer_items
ALTER TABLE analyzer_items
  ADD COLUMN round_number integer NOT NULL DEFAULT 1,
  ADD COLUMN round_status text NULL CHECK (round_status IN ('active', 'waiting', 'closed')),
  ADD COLUMN outcome text NULL CHECK (outcome IN ('deleted', 'updated', 'verified', 'escalated', 'pending')),
  ADD COLUMN procedural_violation boolean NOT NULL DEFAULT false,
  ADD COLUMN days_since_last_action integer NULL,
  ADD COLUMN last_mail_received_at timestamptz NULL,
  ADD COLUMN identity_verification_on_file boolean NOT NULL DEFAULT false,
  ADD COLUMN next_action text NULL;

-- Create mail_evidence table
CREATE TABLE mail_evidence (
  id bigserial PRIMARY KEY,
  analyzer_item_id bigint NOT NULL REFERENCES analyzer_items(id) ON DELETE CASCADE,
  bureau text NOT NULL CHECK (bureau IN ('equifax', 'experian', 'transunion')),
  furnisher_name text NULL,

  -- Evidence
  received_date timestamptz NOT NULL,
  envelope_image_url text NOT NULL,
  document_image_urls text[] NOT NULL,
  ocr_text text NULL,

  -- Classification
  classification text NULL CHECK (classification IN (
    'acknowledgment_only',
    'verification_completed',
    'stall_identity_request',
    'stall_generic',
    'no_response_timeout',
    'partial_update',
    'full_update',
    'deletion',
    'reinsertion',
    'request_additional_info',
    'invalid_response'
  )),
  procedural_violation boolean NOT NULL DEFAULT false,
  deadline_reset boolean NOT NULL DEFAULT false,
  next_action text NULL,

  -- Metadata
  classified_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for mail_evidence
CREATE INDEX idx_mail_evidence_analyzer_item ON mail_evidence(analyzer_item_id);
CREATE INDEX idx_mail_evidence_bureau ON mail_evidence(bureau);
CREATE INDEX idx_mail_evidence_classification ON mail_evidence(classification);
CREATE INDEX idx_mail_evidence_received_date ON mail_evidence(received_date DESC);
CREATE INDEX idx_mail_evidence_procedural_violation ON mail_evidence(procedural_violation) WHERE procedural_violation = true;

-- Indexes for new analyzer_items fields
CREATE INDEX idx_analyzer_items_round_status ON analyzer_items(round_status);
CREATE INDEX idx_analyzer_items_procedural_violation ON analyzer_items(procedural_violation) WHERE procedural_violation = true;
CREATE INDEX idx_analyzer_items_last_mail ON analyzer_items(last_mail_received_at DESC);

-- RLS Policies for mail_evidence
ALTER TABLE mail_evidence ENABLE ROW LEVEL SECURITY;

-- Users can view their own mail evidence
CREATE POLICY mail_evidence_select_own ON mail_evidence
  FOR SELECT
  USING (
    analyzer_item_id IN (
      SELECT ai.id FROM analyzer_items ai
      JOIN snapshot s ON ai.snapshot_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- Users can insert mail evidence for their own items
CREATE POLICY mail_evidence_insert_own ON mail_evidence
  FOR INSERT
  WITH CHECK (
    analyzer_item_id IN (
      SELECT ai.id FROM analyzer_items ai
      JOIN snapshot s ON ai.snapshot_id = s.id
      WHERE s.user_id = auth.uid()
    )
  );

-- Service role can manage all mail evidence
CREATE POLICY mail_evidence_service_all ON mail_evidence
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role')
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Function to update days_since_last_action
CREATE OR REPLACE FUNCTION update_analyzer_days_since_action()
RETURNS trigger AS $$
BEGIN
  UPDATE analyzer_items
  SET 
    last_mail_received_at = NEW.received_date,
    days_since_last_action = 0
  WHERE id = NEW.analyzer_item_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update days since action when mail is received
CREATE TRIGGER update_days_on_mail_received
  AFTER INSERT ON mail_evidence
  FOR EACH ROW
  EXECUTE FUNCTION update_analyzer_days_since_action();

-- Function to detect day-31 timeouts (run daily via cron)
CREATE OR REPLACE FUNCTION detect_timeout_violations()
RETURNS void AS $$
BEGIN
  UPDATE analyzer_items
  SET 
    procedural_violation = true,
    ai_action = 'auto_dispute',
    next_action = 'File FCRA violation - no response within 30 days'
  WHERE 
    round_status = 'active'
    AND days_since_last_action >= 31
    AND procedural_violation = false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
