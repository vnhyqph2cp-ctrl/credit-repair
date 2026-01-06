-- CreateEnum
CREATE TYPE "EcosystemTier" AS ENUM ('TIER0', 'TIER1', 'TIER2', 'TIER3');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'PAST_DUE', 'TRIALING');

-- CreateTable
CREATE TABLE "ThreeBCustomer" (
    "threeBId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "billingCustomerId" TEXT,
    "ecosystemTier" "EcosystemTier" NOT NULL DEFAULT 'TIER0',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ThreeBCustomer_pkey" PRIMARY KEY ("threeBId")
);

-- CreateTable
CREATE TABLE "ProviderMapping" (
    "id" TEXT NOT NULL,
    "threeBId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "externalMemberId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "affiliateCommission" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "subscriptionId" TEXT NOT NULL,
    "threeBId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "addOns" JSONB NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "canceledAt" TIMESTAMP(3),

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("subscriptionId")
);

-- CreateTable
CREATE TABLE "ThreeBCredit" (
    "id" TEXT NOT NULL,
    "threeBId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "appliedTo" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "ThreeBCredit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ThreeBCustomer_customerId_key" ON "ThreeBCustomer"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ThreeBCustomer_email_key" ON "ThreeBCustomer"("email");

-- CreateIndex
CREATE INDEX "ProviderMapping_threeBId_idx" ON "ProviderMapping"("threeBId");

-- CreateIndex
CREATE INDEX "ProviderMapping_provider_externalMemberId_idx" ON "ProviderMapping"("provider", "externalMemberId");

-- CreateIndex
CREATE INDEX "Subscription_threeBId_idx" ON "Subscription"("threeBId");

-- CreateIndex
CREATE INDEX "Subscription_product_planId_idx" ON "Subscription"("product", "planId");

-- CreateIndex
CREATE INDEX "ThreeBCredit_threeBId_idx" ON "ThreeBCredit"("threeBId");

-- CreateIndex
CREATE INDEX "ThreeBCredit_appliedTo_idx" ON "ThreeBCredit"("appliedTo");

-- AddForeignKey
ALTER TABLE "ProviderMapping" ADD CONSTRAINT "ProviderMapping_threeBId_fkey" FOREIGN KEY ("threeBId") REFERENCES "ThreeBCustomer"("threeBId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_threeBId_fkey" FOREIGN KEY ("threeBId") REFERENCES "ThreeBCustomer"("threeBId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreeBCredit" ADD CONSTRAINT "ThreeBCredit_threeBId_fkey" FOREIGN KEY ("threeBId") REFERENCES "ThreeBCustomer"("threeBId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThreeBCredit" ADD CONSTRAINT "ThreeBCredit_appliedTo_fkey" FOREIGN KEY ("appliedTo") REFERENCES "Subscription"("subscriptionId") ON DELETE SET NULL ON UPDATE CASCADE;
