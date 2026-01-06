-- Commission Tracking System
-- Lightweight, accounting-safe, ready to scale

-- Create reseller_commissions table
CREATE TABLE IF NOT EXISTS reseller_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reseller_id UUID NOT NULL REFERENCES "Customer"(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES "Customer"(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ,
  
  -- Ensure reseller_id is actually a reseller
  CONSTRAINT valid_reseller CHECK (
    EXISTS (
      SELECT 1 FROM "Customer" 
      WHERE id = reseller_id 
      AND role = 'reseller'
    )
  )
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reseller_commissions_reseller_id 
  ON reseller_commissions(reseller_id);
  
CREATE INDEX IF NOT EXISTS idx_reseller_commissions_user_id 
  ON reseller_commissions(user_id);
  
CREATE INDEX IF NOT EXISTS idx_reseller_commissions_status 
  ON reseller_commissions(status);
  
CREATE INDEX IF NOT EXISTS idx_reseller_commissions_created_at 
  ON reseller_commissions(created_at DESC);

-- RLS Policies
ALTER TABLE reseller_commissions ENABLE ROW LEVEL SECURITY;

-- Resellers can view their own commissions
CREATE POLICY "resellers_view_own_commissions" 
ON reseller_commissions
FOR SELECT
TO authenticated
USING (
  reseller_id = auth.uid()
);

-- Only service role can insert/update commissions
-- (No policy needed - authenticated users blocked by default)

-- Comments for documentation
COMMENT ON TABLE reseller_commissions IS 
  'Tracks commissions earned by resellers for client milestones';
  
COMMENT ON COLUMN reseller_commissions.amount IS 
  'Commission amount in USD (e.g., 25.00)';
  
COMMENT ON COLUMN reseller_commissions.reason IS 
  'Milestone that triggered commission (e.g., "Epic Report Completed")';
  
COMMENT ON COLUMN reseller_commissions.metadata IS 
  'Additional context (e.g., plan tier, subscription ID)';
  
COMMENT ON COLUMN reseller_commissions.status IS 
  'Payment status: pending → approved → paid (or cancelled)';
