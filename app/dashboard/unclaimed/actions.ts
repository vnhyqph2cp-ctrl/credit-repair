"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * Accept unclaimed property consent
 */
export async function acceptUnclaimedConsent(data: {
  propertyId: string;
  finderFeePercent: number;
}) {
  try {
    const customer = await requireAuth();

    // Get the property
    const property = await prisma.unclaimedProperty.findUnique({
      where: { id: data.propertyId },
    });

    if (!property || property.customerId !== customer.id) {
      throw new Error("Property not found or unauthorized");
    }

    // Create agreement
    const agreement = await prisma.unclaimedAgreement.create({
      data: {
        customerId: customer.id,
        unclaimedPropertyId: data.propertyId,
        agreementType: 'FINDER_FEE',
        feePercentage: data.finderFeePercent,
        termsAccepted: true,
        signedAt: new Date(),
      },
    });

    // Update property status
    await prisma.unclaimedProperty.update({
      where: { id: data.propertyId },
      data: {
        status: "CLAIMED",
      },
    });

    return { success: true, agreementId: agreement.id };
  } catch (error) {
    console.error("Accept consent error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to accept consent",
    };
  }
}

/**
 * Get unclaimed properties for a customer
 */
export async function getUnclaimedProperties() {
  try {
    const customer = await requireAuth();

    const properties = await prisma.unclaimedProperty.findMany({
      where: { customerId: customer.id },
      include: {
        agreements: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, properties };
  } catch (error) {
    console.error("Get properties error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get properties",
      properties: [],
    };
  }
}

