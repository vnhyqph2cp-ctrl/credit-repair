-- Add reseller role and referral tracking to Customer table

-- Add role column (default to 'user')
ALTER TABLE "Customer" 
ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'user' CHECK ("role" IN ('user', 'reseller', 'admin'));

-- Add referral_code column (unique for resellers)
ALTER TABLE "Customer" 
ADD COLUMN IF NOT EXISTS "referral_code" TEXT UNIQUE;

-- Add reseller_id column (tracks who referred this customer)
ALTER TABLE "Customer" 
ADD COLUMN IF NOT EXISTS "reseller_id" TEXT REFERENCES "Customer"("id") ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "Customer_reseller_id_idx" ON "Customer"("reseller_id");
CREATE INDEX IF NOT EXISTS "Customer_role_idx" ON "Customer"("role");

-- Comments for clarity
COMMENT ON COLUMN "Customer"."role" IS 'User role: user (default), reseller, or admin';
COMMENT ON COLUMN "Customer"."referral_code" IS 'Unique referral code for resellers to share';
COMMENT ON COLUMN "Customer"."reseller_id" IS 'ID of the reseller who referred this customer';
