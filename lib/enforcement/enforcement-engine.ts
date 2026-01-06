/**
 * 3B Analyzer + Mail Enforcement Doctrine
 * 
 * Core Position: Enforce accurate reporting, not compensate for bureau failures.
 * We do not give bureaus answers. We hold them accountable to federal standards.
 * 
 * This is a compliance enforcement system — evidence-driven, time-aware, procedure-first.
 */

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

// Enums matching Prisma schema
export enum MailClassification {
  VERIFICATION_REQUEST = 'VERIFICATION_REQUEST',
  VERIFICATION_ACCEPTED = 'VERIFICATION_ACCEPTED',
  DELETION_CONFIRMATION = 'DELETION_CONFIRMATION',
  STALL_LETTER = 'STALL_LETTER',
  GENERIC_RESPONSE = 'GENERIC_RESPONSE',
  PARTIAL_UPDATE = 'PARTIAL_UPDATE',
  REINSERTION_NOTICE = 'REINSERTION_NOTICE',
  FURNISHER_RESPONSE = 'FURNISHER_RESPONSE',
  PROCEDURAL_FAILURE = 'PROCEDURAL_FAILURE',
  NO_RESPONSE = 'NO_RESPONSE'
}

export enum RoundStatus {
  IDENTITY_VERIFICATION = 'IDENTITY_VERIFICATION',
  INVESTIGATION_PENDING = 'INVESTIGATION_PENDING',
  RESPONSE_RECEIVED = 'RESPONSE_RECEIVED',
  STALLED = 'STALLED',
  VIOLATION_DETECTED = 'VIOLATION_DETECTED',
  ESCALATION_REQUIRED = 'ESCALATION_REQUIRED',
  RESOLVED_DELETED = 'RESOLVED_DELETED',
  RESOLVED_VERIFIED = 'RESOLVED_VERIFIED',
  RESOLVED_UPDATED = 'RESOLVED_UPDATED'
}

export enum ViolationType {
  DAY_31_TIMEOUT = 'DAY_31_TIMEOUT',
  IDENTITY_STALL = 'IDENTITY_STALL',
  GENERIC_STALL = 'GENERIC_STALL',
  ADDRESS_CYCLING = 'ADDRESS_CYCLING',
  CLOCK_MANIPULATION = 'CLOCK_MANIPULATION',
  REINSERTION_NO_NOTICE = 'REINSERTION_NO_NOTICE'
}

// ============================================================================
// ENFORCEMENT RULES (Non-Negotiable)
// ============================================================================

/**
 * Rule 1: Identity Verification — Round 1 (Mandatory)
 * 
 * Purpose: Eliminate "we don't believe it's you" stall letters
 * No dispute proceeds without verification completion
 */
export async function enforceIdentityVerification(memberId: string, bureau: string): Promise<boolean> {
  const verification = await prisma.identityVerification.findUnique({
    where: {
      memberId_bureau: { memberId, bureau }
    }
  });

  if (!verification) {
    // Create identity verification requirement
    await prisma.identityVerification.create({
      data: {
        memberId,
        bureau,
        verificationSentAt: new Date(),
        verificationMethod: 'certified_mail',
        verificationStatus: 'pending'
      }
    });
    return false; // Not verified
  }

  return verification.verificationStatus === 'verified';
}

/**
 * Rule 2: Timing Enforcement (Strict)
 * 
 * The statutory clock starts when the dispute is received.
 * 30 days + 1 day = enforcement threshold.
 * We do not reset clocks for excuses.
 */
export function calculateResponseDeadline(disputeFiledAt: Date): Date {
  const deadline = new Date(disputeFiledAt);
  deadline.setDate(deadline.getDate() + 31); // 30 days + 1 grace day
  return deadline;
}

export function isTimingViolation(disputeFiledAt: Date, responseDate: Date | null): boolean {
  const deadline = calculateResponseDeadline(disputeFiledAt);
  const now = new Date();
  
  // If past deadline and no response, it's a violation
  if (now > deadline && !responseDate) {
    return true;
  }
  
  // If response came after deadline, it's still a violation
  if (responseDate && responseDate > deadline) {
    return true;
  }
  
  return false;
}

/**
 * Rule 3: Stall Letter Recognition & Classification
 * 
 * System must recognize and classify bureau stall tactics.
 * If identity is verified and information is still inaccurate,
 * the burden shifts fully to the furnisher/bureau.
 */
export async function classifyMailEvidence(
  mailData: {
    memberId: string;
    analyzerItemId: string | null;
    receivedAt: Date;
    rawText: string;
    bureau: string;
    roundNumber: number;
    envelopeImageUrl?: string;
    documentImageUrls?: string[];
    postmarkDate?: Date;
  }
): Promise<{ classification: MailClassification; triggersViolation: boolean; violationType?: ViolationType }> {
  
  const text = mailData.rawText.toLowerCase();
  
  // Check if identity verification already completed (read-only, no mutation during classification)
  const verification = await prisma.identityVerification.findUnique({
    where: {
      memberId_bureau: { memberId: mailData.memberId, bureau: mailData.bureau }
    }
  });
  const isIdentityVerified = verification?.verificationStatus === 'verified';
  
  // Classification logic
  let classification: MailClassification;
  let triggersViolation = false;
  let violationType: ViolationType | undefined;
  
  // VERIFICATION_REQUEST
  if (text.includes('verify your identity') || text.includes('additional identification')) {
    classification = MailClassification.VERIFICATION_REQUEST;
    
    // If this is Round 2+ and identity already verified in Round 1, it's a stall tactic
    if (mailData.roundNumber > 1 && isIdentityVerified) {
      classification = MailClassification.STALL_LETTER;
      triggersViolation = true;
      violationType = ViolationType.IDENTITY_STALL;
    }
  }
  // STALL_LETTER
  else if (
    text.includes('need more time') ||
    text.includes('insufficient identification') ||
    text.includes('require additional information') ||
    text.includes('unable to process') ||
    text.includes('extend our investigation')
  ) {
    classification = MailClassification.STALL_LETTER;
    triggersViolation = true;
    violationType = ViolationType.GENERIC_STALL;
  }
  // DELETION_CONFIRMATION
  else if (
    text.includes('removed from your report') ||
    text.includes('deleted from your file') ||
    text.includes('no longer appears')
  ) {
    classification = MailClassification.DELETION_CONFIRMATION;
  }
  // REINSERTION_NOTICE
  else if (
    text.includes('reinserted') ||
    text.includes('re-inserted') ||
    text.includes('added back')
  ) {
    classification = MailClassification.REINSERTION_NOTICE;
    triggersViolation = true;
    violationType = ViolationType.REINSERTION_NO_NOTICE;
  }
  // VERIFICATION_ACCEPTED
  else if (
    text.includes('identity verified') ||
    text.includes('investigation in progress') ||
    text.includes('reviewing your dispute')
  ) {
    classification = MailClassification.VERIFICATION_ACCEPTED;
  }
  // ADDRESS_CYCLING / PROCEDURAL_FAILURE
  else if (
    text.includes('address does not match') ||
    text.includes('unable to locate') ||
    text.includes('return to sender')
  ) {
    classification = MailClassification.PROCEDURAL_FAILURE;
    triggersViolation = true;
    violationType = ViolationType.ADDRESS_CYCLING;
  }
  // GENERIC_RESPONSE (boilerplate acknowledgment)
  else if (
    text.includes('received your request') ||
    text.includes('under review') ||
    (text.length < 300 && !text.includes('deleted') && !text.includes('verified'))
  ) {
    classification = MailClassification.GENERIC_RESPONSE;
  }
  // PARTIAL_UPDATE
  else if (
    text.includes('some items') ||
    text.includes('partially resolved')
  ) {
    classification = MailClassification.PARTIAL_UPDATE;
  }
  // FURNISHER_RESPONSE
  else if (
    text.includes('data furnisher') ||
    text.includes('creditor confirms')
  ) {
    classification = MailClassification.FURNISHER_RESPONSE;
  }
  // Default to GENERIC_RESPONSE
  else {
    classification = MailClassification.GENERIC_RESPONSE;
  }
  
  return { classification, triggersViolation, violationType };
}

/**
 * Rule 4: Mail Is Evidence (Chain of Custody)
 * 
 * All incoming mail is treated as legal evidence.
 * Mail drives state changes in the Analyzer.
 */
export async function ingestMailEvidence(mailData: {
  memberId: string;
  analyzerItemId: string | null;
  receivedAt: Date;
  rawText: string;
  bureau: string;
  roundNumber: number;
  envelopeImageUrl?: string;
  documentImageUrls?: string[];
  postmarkDate?: Date;
  classifiedBy?: string;
  classificationNotes?: string;
}): Promise<any> {
  
  // Classify the mail
  const { classification, triggersViolation, violationType } = await classifyMailEvidence(mailData);
  
  // Calculate days from dispute
  const analyzerItem = mailData.analyzerItemId
    ? await prisma.analyzerItem.findUnique({
        where: { id: mailData.analyzerItemId },
        select: { disputeFiledAt: true }
      })
    : null;

  let daysFromDispute: number | undefined;

  if (analyzerItem?.disputeFiledAt) {
    daysFromDispute = Math.floor(
      (mailData.receivedAt.getTime() - analyzerItem.disputeFiledAt.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }
  
  // Create mail evidence record
  const evidence = await prisma.mailEvidence.create({
    data: {
      memberId: mailData.memberId,
      analyzerItemId: mailData.analyzerItemId,
      receivedAt: mailData.receivedAt,
      classification,
      bureau: mailData.bureau,
      roundNumber: mailData.roundNumber,
      envelopeImageUrl: mailData.envelopeImageUrl,
      documentImageUrls: mailData.documentImageUrls || [],
      rawText: mailData.rawText,
      postmarkDate: mailData.postmarkDate,
      daysFromDispute,
      triggersViolation,
      violationType,
      manualClassification: !!mailData.classifiedBy,
      classifiedBy: mailData.classifiedBy,
      classificationNotes: mailData.classificationNotes
    }
  });
  
  // Update analyzer item based on mail classification
  if (mailData.analyzerItemId) {
    await updateAnalyzerItemFromEvidence(mailData.analyzerItemId, evidence);
  }
  
  return evidence;
}

/**
 * Update AnalyzerItem based on received mail evidence
 * 
 * This is where mail drives state changes — no manual overrides.
 */
async function updateAnalyzerItemFromEvidence(
  analyzerItemId: string,
  evidence: any
): Promise<void> {
  
  const item = await prisma.analyzerItem.findUnique({
    where: { id: analyzerItemId }
  });
  
  if (!item) return;
  
  let updates: any = {
    lastResponseAt: evidence.receivedAt,
    updatedAt: new Date()
  };
  
  // State transitions based on classification
  switch (evidence.classification) {
    
    case MailClassification.VERIFICATION_REQUEST:
      if (item.roundNumber === 1) {
        updates.roundStatus = RoundStatus.IDENTITY_VERIFICATION;
        updates.nextAction = 'Submit identity verification documents to bureau';
      } else {
        // Identity stall in later rounds
        updates.roundStatus = RoundStatus.STALLED;
        updates.proceduralViolation = true;
        updates.violationType = ViolationType.IDENTITY_STALL;
        updates.nextAction = 'File CFPB complaint for identity verification stall tactic after Round 1';
      }
      break;
    
    case MailClassification.VERIFICATION_ACCEPTED:
      updates.roundStatus = RoundStatus.INVESTIGATION_PENDING;
      updates.nextAction = 'Wait for investigation results (30-day statutory deadline)';
      break;
    
    case MailClassification.DELETION_CONFIRMATION:
      updates.roundStatus = RoundStatus.RESOLVED_DELETED;
      updates.outcome = 'removed';
      updates.resolvedAt = new Date();
      updates.nextAction = null;
      break;
    
    case MailClassification.STALL_LETTER:
      updates.roundStatus = RoundStatus.STALLED;
      updates.proceduralViolation = true;
      updates.violationType = evidence.violationType || ViolationType.GENERIC_STALL;
      updates.violationDetails = `Stall letter received on day ${evidence.daysFromDispute || 'unknown'}`;
      updates.nextAction = 'Document stall tactic, prepare escalation if past day 31';
      break;
    
    case MailClassification.PROCEDURAL_FAILURE:
      updates.roundStatus = RoundStatus.VIOLATION_DETECTED;
      updates.proceduralViolation = true;
      updates.violationType = evidence.violationType || ViolationType.CLOCK_MANIPULATION;
      updates.nextAction = 'Prepare enforcement action for procedural violation';
      break;
    
    case MailClassification.REINSERTION_NOTICE:
      updates.proceduralViolation = true;
      updates.violationType = ViolationType.REINSERTION_NO_NOTICE;
      updates.nextAction = 'Challenge reinsertion under FCRA § 611(a)(5)(B)';
      break;
    
    case MailClassification.GENERIC_RESPONSE:
    case MailClassification.PARTIAL_UPDATE:
      updates.roundStatus = RoundStatus.RESPONSE_RECEIVED;
      updates.nextAction = 'Review response quality and determine next round strategy';
      break;
  }
  
  await prisma.analyzerItem.update({
    where: { id: analyzerItemId },
    data: updates
  });
}

/**
 * Daily enforcement scan — check all active items for timing violations
 * 
 * This runs automatically to detect DAY_31_TIMEOUT violations
 */
export async function scanForTimingViolations(): Promise<{
  violationsDetected: number;
  itemsUpdated: string[];
}> {
  
  const now = new Date();
  
  // Find all items in INVESTIGATION_PENDING that are past deadline with no response
  const pendingItems = await prisma.analyzerItem.findMany({
    where: {
      roundStatus: RoundStatus.INVESTIGATION_PENDING,
      responseDeadline: {
        lt: now
      },
      lastResponseAt: null
    }
  });
  
  const itemsUpdated: string[] = [];
  
  for (const item of pendingItems) {
    
    // Create NO_RESPONSE mail evidence
    await prisma.mailEvidence.create({
      data: {
        memberId: item.memberId,
        analyzerItemId: item.id,
        receivedAt: now,
        classification: MailClassification.NO_RESPONSE,
        bureau: item.bureau,
        roundNumber: item.roundNumber,
        daysFromDispute: Math.floor((now.getTime() - item.disputeFiledAt.getTime()) / (1000 * 60 * 60 * 24)),
        triggersViolation: true,
        violationType: ViolationType.DAY_31_TIMEOUT,
        rawText: 'AUTO-GENERATED: No response received within statutory 30-day period'
      }
    });
    
    // Update item to VIOLATION_DETECTED
    await prisma.analyzerItem.update({
      where: { id: item.id },
      data: {
        roundStatus: RoundStatus.VIOLATION_DETECTED,
        proceduralViolation: true,
        violationType: ViolationType.DAY_31_TIMEOUT,
        violationDetails: `No response received by deadline: ${item.responseDeadline.toISOString()}`,
        nextAction: 'File CFPB complaint for 30-day statutory violation under FCRA § 611(a)(1)(A)',
        lastResponseAt: now
      }
    });
    
    itemsUpdated.push(item.id);
  }
  
  return {
    violationsDetected: itemsUpdated.length,
    itemsUpdated
  };
}

/**
 * Generate next action based on current state
 * 
 * This is the "What do we do now?" engine
 */
export function generateNextAction(
  roundStatus: RoundStatus,
  proceduralViolation: boolean,
  violationType: ViolationType | null,
  daysFromDispute: number
): string | null {
  
  if (proceduralViolation && violationType) {
    switch (violationType) {
      case ViolationType.DAY_31_TIMEOUT:
        return 'File CFPB complaint for 30-day statutory violation under FCRA § 611(a)(1)(A)';
      case ViolationType.IDENTITY_STALL:
        return 'File CFPB complaint for identity verification stall tactic after Round 1';
      case ViolationType.ADDRESS_CYCLING:
        return 'File CFPB complaint for address cycling / procedural evasion';
      case ViolationType.CLOCK_MANIPULATION:
        return 'File CFPB complaint for statutory clock manipulation';
      case ViolationType.REINSERTION_NO_NOTICE:
        return 'Challenge reinsertion under FCRA § 611(a)(5)(B) — 5-day notice requirement violated';
      default:
        return 'Prepare enforcement action for procedural violation';
    }
  }
  
  switch (roundStatus) {
    case RoundStatus.IDENTITY_VERIFICATION:
      return 'Submit identity verification documents via certified mail with tracking';
    case RoundStatus.INVESTIGATION_PENDING:
      if (daysFromDispute > 25) {
        return `Investigation nearing deadline (Day ${daysFromDispute}) — prepare violation documentation`;
      }
      return `Wait for investigation results (Day ${daysFromDispute} of 30)`;
    case RoundStatus.RESPONSE_RECEIVED:
      return 'Analyze response quality and determine if escalation to Round 2 is warranted';
    case RoundStatus.STALLED:
      return 'Document stall tactic, wait until day 31 for enforcement action';
    case RoundStatus.VIOLATION_DETECTED:
      return 'File CFPB complaint with evidence package';
    case RoundStatus.ESCALATION_REQUIRED:
      return 'Prepare legal action or state AG complaint';
    case RoundStatus.RESOLVED_DELETED:
    case RoundStatus.RESOLVED_VERIFIED:
    case RoundStatus.RESOLVED_UPDATED:
      return null;
    default:
      return 'Contact support for case review';
  }
}

// ============================================================================
// ENFORCEMENT ACTION PREPARATION
// ============================================================================

/**
 * Prepare enforcement action package
 * 
 * Compiles all evidence, timeline, and violation documentation
 */
export async function prepareEnforcementAction(
  analyzerItemId: string,
  actionType: 'cfpb_complaint' | 'lawsuit' | 'state_ag' | 'regulatory_escalation'
): Promise<string> {
  
  const item = await prisma.analyzerItem.findUnique({
    where: { id: analyzerItemId },
    include: {
      mailEvidence: {
        orderBy: { receivedAt: 'asc' }
      }
    }
  });
  
  if (!item) {
    throw new Error('Analyzer item not found');
  }
  
  // Build chronological timeline
  const timeline = item.mailEvidence.map((evidence: any) => ({
    date: evidence.receivedAt,
    day: evidence.daysFromDispute,
    classification: evidence.classification,
    violationType: evidence.violationType,
    bureau: evidence.bureau,
    documentUrls: evidence.documentImageUrls
  }));
  
  // Create enforcement action
  const action = await prisma.enforcementAction.create({
    data: {
      memberId: item.memberId,
      analyzerItemId: item.id,
      actionType,
      violationType: item.violationType!,
      targetEntity: item.bureau,
      status: 'prepared',
      timeline
    }
  });
  
  return action.id;
}
