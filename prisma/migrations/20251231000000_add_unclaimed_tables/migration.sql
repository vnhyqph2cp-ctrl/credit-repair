-- CreateEnum
CREATE TYPE "UnclaimedStatus" AS ENUM ('PENDING', 'CLAIMED', 'REJECTED', 'FUNDED');

-- CreateEnum
CREATE TYPE "UnclaimedAgreementType" AS ENUM ('FINDER_FEE', 'POWER_OF_ATTORNEY');

-- CreateTable
CREATE TABLE "unclaimedProperties" (
    "unclaimedPropertyId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "holder" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "assetType" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "status" "UnclaimedStatus" NOT NULL DEFAULT 'PENDING',
    "claimUrl" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unclaimedProperties_pkey" PRIMARY KEY ("unclaimedPropertyId")
);

-- CreateTable
CREATE TABLE "unclaimedAgreements" (
    "unclaimedAgreementId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "unclaimedPropertyId" TEXT NOT NULL,
    "agreementType" "UnclaimedAgreementType" NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "feePercentage" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "unclaimedAgreements_pkey" PRIMARY KEY ("unclaimedAgreementId")
);

-- CreateIndex
CREATE INDEX "unclaimedProperties_customerId_idx" ON "unclaimedProperties"("customerId");

-- CreateIndex
CREATE INDEX "unclaimedProperties_status_state_idx" ON "unclaimedProperties"("status", "state");

-- CreateIndex
CREATE UNIQUE INDEX "unclaimedAgreements_customerId_unclaimedPropertyId_agreeme_key" ON "unclaimedAgreements"("customerId", "unclaimedPropertyId", "agreementType");

-- AddForeignKey
ALTER TABLE "unclaimedProperties" ADD CONSTRAINT "unclaimedProperties_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unclaimedAgreements" ADD CONSTRAINT "unclaimedAgreements_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unclaimedAgreements" ADD CONSTRAINT "unclaimedAgreements_unclaimedPropertyId_fkey" FOREIGN KEY ("unclaimedPropertyId") REFERENCES "unclaimedProperties"("unclaimedPropertyId") ON DELETE RESTRICT ON UPDATE CASCADE;
