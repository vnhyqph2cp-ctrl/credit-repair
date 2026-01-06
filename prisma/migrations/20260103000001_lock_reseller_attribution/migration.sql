-- RLS Policy: Prevent users from changing their reseller attribution
-- This ensures referral integrity - once set, only admins can change it

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "prevent_reseller_change" ON "Customer";

-- Create policy to lock reseller_id after initial assignment
-- Users can only update profiles where reseller_id is null (not yet assigned)
-- Service role bypasses this, so admins can still update via backend
CREATE POLICY "prevent_reseller_change" 
ON "Customer"
FOR UPDATE
TO authenticated
USING (
  -- Can only update if reseller_id is currently null
  reseller_id IS NULL
)
WITH CHECK (
  -- Can only set reseller_id to null (cannot assign or change)
  reseller_id IS NULL
);

-- Comment for documentation
COMMENT ON POLICY "prevent_reseller_change" ON "Customer" IS 
  'Prevents users from changing reseller attribution after initial assignment. Service role can still update.';
