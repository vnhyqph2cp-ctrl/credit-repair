// tests/enforcement-engine.test.ts
/**
 * Enforcement Engine Integration Test
 * 
 * Tests the full flow of mail evidence ingestion and violation detection
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/prisma';
import {
  ingestMailEvidence,
  calculateResponseDeadline,
  isTimingViolation,
  enforceIdentityVerification,
} from '@/lib/enforcement/enforcement-engine';

describe('Enforcement Engine', () => {
  let testCustomerId: string;
  let testAnalyzerItemId: number;

  beforeAll(async () => {
    // Create test customer
    const customer = await prisma.customer.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test Customer',
      },
    });
    testCustomerId = customer.id;

    // Create test analyzer item
    const analyzerItem = await prisma.analyzerItem.create({
      data: {
        customerId: testCustomerId,
        bureau: 'Equifax',
        creditor: 'Test Creditor',
        issueType: 'late_payment',
        priority: 80,
        defaultRound: 1,
      },
    });
    testAnalyzerItemId = analyzerItem.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.mailEvidence.deleteMany({
      where: { analyzerItemId: testAnalyzerItemId },
    });
    await prisma.analyzerItem.delete({
      where: { id: testAnalyzerItemId },
    });
    await prisma.identityVerification.deleteMany({
      where: { memberId: testCustomerId },
    });
    await prisma.customer.delete({
      where: { id: testCustomerId },
    });
  });

  it('should calculate response deadline correctly', () => {
    const filedDate = new Date('2026-01-01');
    const deadline = calculateResponseDeadline(filedDate);
    
    expect(deadline.getDate()).toBe(1); // Jan 1 + 31 days = Feb 1
    expect(deadline.getMonth()).toBe(1); // February (0-indexed)
  });

  it('should detect timing violations', () => {
    const filedDate = new Date('2025-12-01');
    const noResponse = null;
    
    const isViolation = isTimingViolation(filedDate, noResponse);
    expect(isViolation).toBe(true); // Past 31 days
  });

  it('should enforce identity verification', async () => {
    const isVerified = await enforceIdentityVerification(testCustomerId, 'Equifax');
    expect(isVerified).toBe(false); // First call creates pending verification

    // Verify the verification record was created
    const verification = await prisma.identityVerification.findUnique({
      where: {
        memberId_bureau: { memberId: testCustomerId, bureau: 'Equifax' },
      },
    });
    expect(verification).toBeTruthy();
    expect(verification?.verificationStatus).toBe('pending');

    // Mark as verified
    await prisma.identityVerification.update({
      where: {
        memberId_bureau: { memberId: testCustomerId, bureau: 'Equifax' },
      },
      data: { verificationStatus: 'verified' },
    });

    // Now it should return true
    const isVerifiedNow = await enforceIdentityVerification(testCustomerId, 'Equifax');
    expect(isVerifiedNow).toBe(true);
  });

  it('should ingest mail evidence successfully', async () => {
    const evidence = await ingestMailEvidence({
      memberId: testCustomerId,
      analyzerItemId: testAnalyzerItemId,
      receivedAt: new Date(),
      rawText: 'We have deleted the item as requested.',
      bureau: 'Equifax',
      roundNumber: 1,
      classifiedBy: 'test-classifier',
    });

    expect(evidence).toBeTruthy();
    expect(evidence.classification).toBe('DELETION_CONFIRMATION');
    expect(evidence.triggersViolation).toBe(false);
  });

  it('should detect stall letter and trigger violation', async () => {
    const evidence = await ingestMailEvidence({
      memberId: testCustomerId,
      analyzerItemId: testAnalyzerItemId,
      receivedAt: new Date(),
      rawText: 'We need additional information to verify your identity.',
      bureau: 'Equifax',
      roundNumber: 2, // Identity verification should be done by round 2
      classifiedBy: 'test-classifier',
    });

    expect(evidence.classification).toBe('STALL_LETTER');
    expect(evidence.triggersViolation).toBe(true);
    expect(evidence.violationType).toBe('IDENTITY_STALL');
  });

  it('should detect timing violation after 31 days', async () => {
    // Create a dispute filed 35 days ago
    const filedDate = new Date();
    filedDate.setDate(filedDate.getDate() - 35);

    const analyzerItem = await prisma.analyzerItem.create({
      data: {
        customerId: testCustomerId,
        bureau: 'TransUnion',
        creditor: 'Old Creditor',
        issueType: 'collection',
        priority: 90,
        defaultRound: 1,
        disputeFiledAt: filedDate,
      },
    });

    // Ingest mail evidence with no response flag
    const evidence = await ingestMailEvidence({
      memberId: testCustomerId,
      analyzerItemId: analyzerItem.id,
      receivedAt: new Date(),
      rawText: '',
      bureau: 'TransUnion',
      roundNumber: 1,
      classifiedBy: 'test-classifier',
    });

    expect(evidence.classification).toBe('NO_RESPONSE');
    expect(evidence.triggersViolation).toBe(true);
    expect(evidence.violationType).toBe('DAY_31_TIMEOUT');

    // Cleanup
    await prisma.mailEvidence.deleteMany({
      where: { analyzerItemId: analyzerItem.id },
    });
    await prisma.analyzerItem.delete({
      where: { id: analyzerItem.id },
    });
  });
});
