/**
 * 3B ANALYZER + MAIL ENFORCEMENT DOCTRINE
 * =====================================
 *
 * DEFINITIONS ONLY
 *
 * This is NOT a credit-repair workflow.
 * This is a compliance enforcement model.
 *
 * Evidence-driven.
 * Time-aware (but not time-executing).
 * Procedure-first.
 * Emotion-free.
 *
 * ⚠️ No side effects allowed in this file.
 */

/* ──────────────────────────────────────────────
   VIOLATION TYPES
   ────────────────────────────────────────────── */

export type ViolationType =
  | 'DAY_31_TIMEOUT'
  | 'IDENTITY_STALL'
  | 'ADDRESS_CYCLING'
  | 'GENERIC_STALL'
  | 'CLOCK_MANIPULATION'
  | 'INCOMPLETE_INVESTIGATION'
  | 'REINSERTION_NO_NOTICE';

/* ──────────────────────────────────────────────
   ROUND STATUS (STATE MACHINE)
   ────────────────────────────────────────────── */

export type RoundStatus =
  | 'IDENTITY_VERIFICATION'
  | 'INVESTIGATION_PENDING'
  | 'RESPONSE_RECEIVED'
  | 'STALLED'
  | 'VIOLATION_DETECTED'
  | 'ESCALATION_REQUIRED'
  | 'RESOLVED_DELETED'
  | 'RESOLVED_VERIFIED'
  | 'RESOLVED_UPDATED'
  | 'NO_RESPONSE';

/* ──────────────────────────────────────────────
   MAIL CLASSIFICATION
   ────────────────────────────────────────────── */

export type MailClassification =
  | 'VERIFICATION_REQUEST'
  | 'VERIFICATION_ACCEPTED'
  | 'STALL_LETTER'
  | 'GENERIC_RESPONSE'
  | 'PARTIAL_UPDATE'
  | 'NO_RESPONSE'
  | 'DELETION_CONFIRMATION'
  | 'REINSERTION_NOTICE'
  | 'PROCEDURAL_FAILURE'
  | 'FURNISHER_RESPONSE';

/* ──────────────────────────────────────────────
   MAIL CLASSIFICATION METADATA
   ────────────────────────────────────────────── */

export const MAIL_CLASSIFICATION_INFO: Record<
  MailClassification,
  {
    label: string;
    description: string;
    triggersViolation: boolean;
    requiresEscalation: boolean;
    color: 'neutral' | 'warning' | 'error' | 'success';
  }
> = {
  VERIFICATION_REQUEST: {
    label: 'Verification Request',
    description: 'Bureau requesting identity verification (Round 1 only)',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'neutral',
  },
  VERIFICATION_ACCEPTED: {
    label: 'Verification Accepted',
    description: 'Identity verified, investigation proceeding',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'success',
  },
  STALL_LETTER: {
    label: 'Stall Letter',
    description: 'Post-verification delay or ID re-request',
    triggersViolation: true,
    requiresEscalation: true,
    color: 'error',
  },
  GENERIC_RESPONSE: {
    label: 'Generic Response',
    description: 'Boilerplate acknowledgment with no results',
    triggersViolation: true,
    requiresEscalation: false,
    color: 'warning',
  },
  PARTIAL_UPDATE: {
    label: 'Partial Update',
    description: 'Some items addressed, others ignored',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'warning',
  },
  NO_RESPONSE: {
    label: 'No Response',
    description: 'No bureau communication within statutory window',
    triggersViolation: true,
    requiresEscalation: true,
    color: 'error',
  },
  DELETION_CONFIRMATION: {
    label: 'Deletion Confirmation',
    description: 'Item removed from credit report',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'success',
  },
  REINSERTION_NOTICE: {
    label: 'Reinsertion Notice',
    description: 'Deleted item re-added',
    triggersViolation: false,
    requiresEscalation: true,
    color: 'error',
  },
  PROCEDURAL_FAILURE: {
    label: 'Procedural Failure',
    description: 'Address cycling, clock manipulation, etc.',
    triggersViolation: true,
    requiresEscalation: true,
    color: 'error',
  },
  FURNISHER_RESPONSE: {
    label: 'Furnisher Response',
    description: 'Direct response from data furnisher',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'neutral',
  },
};

/* ──────────────────────────────────────────────
   VIOLATION METADATA
   ────────────────────────────────────────────── */

export const VIOLATION_INFO: Record<
  ViolationType,
  {
    label: string;
    description: string;
    severity: 'minor' | 'major' | 'critical';
    remedyAction: string;
  }
> = {
  DAY_31_TIMEOUT: {
    label: 'Day 31+ Timeout',
    description: 'No response within statutory timeline',
    severity: 'critical',
    remedyAction: 'Item must be deleted. Escalate immediately.',
  },
  IDENTITY_STALL: {
    label: 'Identity Stall',
    description: 'ID requested after verification completed',
    severity: 'major',
    remedyAction: 'Reject request and escalate if repeated.',
  },
  ADDRESS_CYCLING: {
    label: 'Address Cycling',
    description: 'Repeated address mismatch claims',
    severity: 'major',
    remedyAction: 'Document pattern and escalate.',
  },
  GENERIC_STALL: {
    label: 'Generic Stall',
    description: 'Non-substantive acknowledgment',
    severity: 'minor',
    remedyAction: 'Monitor for Day 31 timeout.',
  },
  CLOCK_MANIPULATION: {
    label: 'Clock Manipulation',
    description: 'Attempt to reset statutory timeline',
    severity: 'critical',
    remedyAction: 'Reject reset and escalate.',
  },
  INCOMPLETE_INVESTIGATION: {
    label: 'Incomplete Investigation',
    description: 'Not all disputed items addressed',
    severity: 'major',
    remedyAction: 'Demand completion.',
  },
  REINSERTION_NO_NOTICE: {
    label: 'Reinsertion Without Notice',
    description: 'Item reinserted without required notice',
    severity: 'critical',
    remedyAction: 'Immediate deletion required.',
  },
};

/* ──────────────────────────────────────────────
   ENFORCEMENT CONSTANTS (READ-ONLY)
   ────────────────────────────────────────────── */

export const ENFORCEMENT_CONSTANTS = {
  INVESTIGATION_DEADLINE_DAYS: 30,
  GRACE_PERIOD_DAYS: 1,
  REINSERTION_NOTICE_DAYS: 5,
  ROUND_1_MANDATORY_VERIFICATION: true,
  ADDRESS_CYCLING_THRESHOLD: 2,
  GENERIC_STALL_THRESHOLD: 1,
} as const;
