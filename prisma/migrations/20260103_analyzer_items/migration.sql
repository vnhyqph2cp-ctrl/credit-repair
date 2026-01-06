-- Analyzer Items Table (Smitty/Daraine AI Analysis)
CREATE TABLE analyzer_items (
  id bigserial PRIMARY KEY,
  item_id text NOT NULL,
  item_type text NOT NULL CHECK (item_type IN ('tradeline','collection','chargeoff','public_record','inquiry')),
  bureau text NOT NULL CHECK (bureau IN ('EX','EQ','TU','MERGE')),
  furnisher_name text NOT NULL,
  account_open_date timestamptz NULL,
  date_of_first_delinquency timestamptz NULL,
  impact_score smallint NOT NULL CHECK (impact_score BETWEEN 1 AND 5),
  dispute_strength smallint NOT NULL CHECK (dispute_strength BETWEEN 1 AND 5),
  auto_dispute_eligible boolean NOT NULL,
  dispute_ground text NOT NULL CHECK (dispute_ground IN ('inaccurate_information','incomplete_information','cannot_be_verified','obsolete_information','mixed_file','procedural_violation','identity_theft','other')),
  evidence_status text NOT NULL CHECK (evidence_status IN ('none','system_detected','user_provided','third_party')),
  round_number smallint NOT NULL CHECK (round_number BETWEEN 1 AND 4),
  round_status text NOT NULL CHECK (round_status IN ('pending','submitted','responded','closed')),
  ai_action text NOT NULL CHECK (ai_action IN ('auto_dispute','recommend_dispute','monitor','ignore')),
  outcome text NULL CHECK (outcome IN ('deleted','updated','verified','no_response','partial','reinserted','client_withdrew')),
  outcome_date timestamptz NULL,
  urgency smallint NULL CHECK (urgency BETWEEN 1 AND 3),
  effort smallint NULL CHECK (effort BETWEEN 1 AND 3),
  explanation jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_analyzer_item_item_id ON analyzer_items (item_id);
CREATE INDEX idx_analyzer_item_round ON analyzer_items (item_id, round_number);
CREATE INDEX idx_analyzer_item_status ON analyzer_items (round_status);
CREATE INDEX idx_analyzer_item_ai_action ON analyzer_items (ai_action);
CREATE INDEX idx_analyzer_item_auto_eligible ON analyzer_items (auto_dispute_eligible) WHERE auto_dispute_eligible = true;

-- RLS Policies (enable RLS first)
ALTER TABLE analyzer_items ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access" ON analyzer_items
  FOR ALL
  USING (auth.role() = 'service_role');

-- Users can only see their own analyzer items (requires linking to Customer table)
-- Note: You may need to add customer_id or user_id column to link this properly
-- For now, admins can see all
CREATE POLICY "Admins can view all" ON analyzer_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Customer"
      WHERE id = auth.uid()::text
      AND role = 'admin'
    )
  );
