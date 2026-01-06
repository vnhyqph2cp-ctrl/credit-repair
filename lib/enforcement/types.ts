type NewType = 'DAY_31_TIMEOUT' | 'IDENTITY_STALL' | 'ADDRESS_CYCLING' | 'GENERIC_STALL' | 'CLOCK_MANIPULATION' | 'INCOMPLETE_INVESTIGATION' | 'REINSERTION_NO_NOTICE';

/**
 * 3B ANALYZER + MAIL ENFORCEMENT DOCTRINE
 * Day-1 Production Standard — Type Definitions
 * 
 * This is not a credit-repair workflow.
 * This is a compliance enforcement system.
 * Evidence-driven. Time-aware. Procedure-first. Emotion-free.
 */

// Define ViolationType locally
export type ViolationType = 
  NewType;

type NewType_1 = 'IDENTITY_VERIFICATION' | 'INVESTIGATION_PENDING' | 'RESPONSE_RECEIVED' | 'STALLED' | 'VIOLATION_DETECTED' | 'RESOLVED_DELETED' | 'RESOLVED_VERIFIED' | 'RESOLVED_UPDATED' | 'ESCALATION_REQUIRED' | 'NO_RESPONSE';

// Define RoundStatus locally since it's not exported from Prisma
export type RoundStatus = 
  NewType_1;

// ═══════════════════════════════════════════════════════════════════
// MAIL CLASSIFICATION
// ═══════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════
// MAIL CLASSIFICATION METADATA
// ═══════════════════════════════════════════════════════════════════

export const MAIL_CLASSIFICATION_INFO: Record<MailClassification, {
  label: string;
  description: string;
  triggersViolation: boolean;
  requiresEscalation: boolean;
  color: 'neutral' | 'warning' | 'error' | 'success';
}> = {
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
    description: 'Bureau requesting more time or additional ID after Round 1 verification',
    triggersViolation: true,
    requiresEscalation: true,
    color: 'error',
  },
  GENERIC_RESPONSE: {
    label: 'Generic Response',
    description: 'Boilerplate acknowledgment with no investigation results',
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
    description: '30+ days with no communication from bureau',
    triggersViolation: true,
    requiresEscalation: true,
    color: 'error',
  },
  DELETION_CONFIRMATION: {
    label: 'Deletion Confirmation',
    description: 'Item successfully removed from credit report',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'success',
  },
  REINSERTION_NOTICE: {
    label: 'Reinsertion Notice',
    description: 'Previously deleted item re-added to report',
    triggersViolation: false,
    requiresEscalation: true,
    color: 'error',
  },
  PROCEDURAL_FAILURE: {
    label: 'Procedural Failure',
    description: 'Address cycling, clock manipulation, or other violations',
    triggersViolation: true,
    requiresEscalation: true,
    color: 'error',
  },
  FURNISHER_RESPONSE: {
    label: 'Furnisher Response',
    description: 'Direct communication from data furnisher',
    triggersViolation: false,
    requiresEscalation: false,
    color: 'neutral',
  },
};

// ═══════════════════════════════════════════════════════════════════
// VIOLATION TYPE METADATA
// ═══════════════════════════════════════════════════════════════════

export const VIOLATION_INFO: Record<ViolationType, {
  label: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  remedyAction: string;
}> = {
  DAY_31_TIMEOUT: {
    label: 'Day 31+ Timeout',
    description: 'No substantive response within 30 days of dispute filing',
    severity: 'critical',
    remedyAction: 'Item must be deleted. File CFPB complaint if not resolved immediately.',
  },
  IDENTITY_STALL: {
    label: 'Identity Stall',
    description: 'Bureau requesting ID verification after Round 1 completion',
    severity: 'major',
    remedyAction: 'Reject request. Cite prior verification. Escalate if bureau persists.',
  },
  ADDRESS_CYCLING: {
    label: 'Address Cycling',
    description: 'Bureau repeatedly claiming address mismatch or cycling addresses',
    severity: 'major',
    remedyAction: 'Document pattern. File procedural violation complaint.',
  },
  GENERIC_STALL: {
    label: 'Generic Stall',
    description: 'Non-responsive acknowledgment letter without investigation details',
    severity: 'minor',
    remedyAction: 'Log as procedural deficiency. Monitor for Day 31 timeout.',
  },
  CLOCK_MANIPULATION: {
    label: 'Clock Manipulation',
    description: 'Bureau attempting to reset statutory 30-day timeline',
    severity: 'critical',
    remedyAction: 'Reject reset. Cite original filing date. Escalate to regulatory authority.',
  },
  INCOMPLETE_INVESTIGATION: {
    label: 'Incomplete Investigation',
    description: 'Bureau addressed some items but ignored others without explanation',
    severity: 'major',
    remedyAction: 'Demand completion of investigation for all disputed items.',
  },
  REINSERTION_NO_NOTICE: {
    label: 'Reinsertion Without Notice',
    description: 'Previously deleted item re-added without required 5-day advance notice',
    severity: 'critical',
    remedyAction: 'Immediate deletion required. FCRA § 611(a)(5)(B) violation.',
  },
};

// ═══════════════════════════════════════════════════════════════════
// ROUND STATUS METADATA
// ═══════════════════════════════════════════════════════════════════

export const ROUND_STATUS_INFO: Record<RoundStatus, {
  label: string;
  description: string;
  allowedTransitions: RoundStatus[];
}> = {
    IDENTITY_VERIFICATION: {
        label: 'Identity Verification',
        description: 'Round 1 mandatory - establishing consumer identity with bureau',
        allowedTransitions: ['INVESTIGATION_PENDING'],
    },
    INVESTIGATION_PENDING: {
        label: 'Investigation Pending',
        description: 'Dispute filed, waiting for bureau response within 30 days',
        allowedTransitions: ['RESPONSE_RECEIVED', 'NO_RESPONSE', 'VIOLATION_DETECTED'],
    },
    RESPONSE_RECEIVED: {
        label: 'Response Received',
        description: 'Mail received from bureau, undergoing classification',
        allowedTransitions: ['RESOLVED_DELETED', 'RESOLVED_VERIFIED', 'RESOLVED_UPDATED', 'STALLED', 'VIOLATION_DETECTED'],
    },
    STALLED: {
        label: 'Stalled',
        description: 'Bureau using procedural tactics to delay investigation',
        allowedTransitions: ['INVESTIGATION_PENDING', 'VIOLATION_DETECTED', 'ESCALATION_REQUIRED'],
    },
    VIOLATION_DETECTED: {
        label: 'Violation Detected',
        description: 'Procedural or statutory violation identified',
        allowedTransitions: ['ESCALATION_REQUIRED', 'RESOLVED_DELETED'],
    },
    RESOLVED_DELETED: {
        label: 'Resolved - Deleted',
        description: 'Item successfully removed from credit report',
        allowedTransitions: [],
    },
    RESOLVED_VERIFIED: {
        label: 'Resolved - Verified',
        description: 'Bureau verified item accuracy with documentation',
        allowedTransitions: [],
    },
    RESOLVED_UPDATED: {
        label: 'Resolved - Updated',
        description: 'Item information corrected but not deleted',
        allowedTransitions: [],
    },
    ESCALATION_REQUIRED: {
        label: 'Escalation Required',
        description: 'Ready for legal/regulatory enforcement action',
        allowedTransitions: ['RESOLVED_DELETED', 'RESOLVED_VERIFIED'],
    },
    NO_RESPONSE: {
        label: "",
        description: "",
        allowedTransitions: []
    }
};

// ═══════════════════════════════════════════════════════════════════
// ENFORCEMENT CONSTANTS
// ═══════════════════════════════════════════════════════════════════

export const ENFORCEMENT_CONSTANTS = {
  // Statutory timelines
  INVESTIGATION_DEADLINE_DAYS: 30,
  GRACE_PERIOD_DAYS: 1, // Total enforcement threshold: 31 days
  REINSERTION_NOTICE_DAYS: 5,
  
  // Round 1 requirements
  ROUND_1_MANDATORY_VERIFICATION: true,
  
  // Violation thresholds
  ADDRESS_CYCLING_THRESHOLD: 2, // 2+ address rejections = violation
  GENERIC_STALL_THRESHOLD: 1, // Any generic stall after verification = escalation candidate
} as const;

// ═══════════════════════════════════════════════════════════════════
// NEXT ACTION GENERATION
// ═══════════════════════════════════════════════════════════════════

export interface NextActionContext {
  roundStatus: RoundStatus;
  daysElapsed: number;
  hasViolation: boolean;
  violationType?: ViolationType;
  lastClassification?: MailClassification;
  verificationComplete: boolean;
}

export function generateNextAction(context: NextActionContext): string {
  const { roundStatus, daysElapsed, hasViolation, violationType, lastClassification, verificationComplete } = context;

  // Critical violations take precedence
  if (hasViolation && violationType === 'DAY_31_TIMEOUT') {
    return 'IMMEDIATE ACTION: Day 31+ timeout violation. Item must be deleted per FCRA § 611(a)(1)(A). File CFPB complaint if bureau does not comply within 48 hours.';
  }

  if (hasViolation && violationType === 'REINSERTION_NO_NOTICE') {
    return 'IMMEDIATE ACTION: Reinsertion without 5-day notice violates FCRA § 611(a)(5)(B). Demand immediate deletion and file regulatory complaint.';
  }

  if (hasViolation && violationType === 'CLOCK_MANIPULATION') {
    return 'ESCALATION REQUIRED: Bureau attempting to reset statutory timeline. Reject reset, cite original filing date, escalate to state AG or CFPB.';
  }

  // Status-based actions
  switch (roundStatus) {
    case 'IDENTITY_VERIFICATION':
      if (!verificationComplete) {
        return 'ROUND 1 MANDATORY: Submit identity verification package via certified mail. This eliminates "we don\'t believe it\'s you" stall letters and establishes procedural control.';
      }
      return 'Awaiting bureau confirmation of identity verification before proceeding with dispute filing.';

    case 'INVESTIGATION_PENDING':
      if (daysElapsed >= 31) {
        return 'VIOLATION: 30-day investigation deadline exceeded. Item must be deleted. File CFPB complaint immediately.';
      }
      if (daysElapsed >= 25) {
        return `WARNING: Day ${daysElapsed} of 30-day investigation period. Monitor closely for Day 31 timeout violation.`;
      }
      return `Monitoring: Day ${daysElapsed} of 30-day statutory investigation period. Deadline enforcement at Day 31.`;

    case 'RESPONSE_RECEIVED':
      if (lastClassification === 'GENERIC_RESPONSE') {
        return 'Generic acknowledgment received with no investigation results. Log as procedural deficiency. If no substantive response by Day 31, escalate for violation.';
      }
      if (lastClassification === 'PARTIAL_UPDATE') {
        return 'Partial response received. Verify which items were addressed. File follow-up dispute for unresolved items.';
      }
      if (lastClassification === 'STALL_LETTER') {
        return 'STALL DETECTED: Bureau requesting additional time/information after verification. Reject request. Cite Round 1 verification. Escalate if bureau persists.';
      }
      return 'Response received and classified. Review evidence and determine next round strategy or closure.';

    case 'STALLED':
      return 'PROCEDURAL STALL: Bureau using delay tactics. Document stall pattern. If Day 31 approaches, prepare violation complaint. Consider escalation to CFPB.';

    case 'VIOLATION_DETECTED':
      return `VIOLATION CONFIRMED: ${violationType ? VIOLATION_INFO[violationType].remedyAction : 'Review violation details and execute remedy action per enforcement protocol.'}`;

    case 'ESCALATION_REQUIRED':
      return 'ESCALATION: Case ready for legal/regulatory action. Compile evidence package, prepare CFPB complaint or legal demand letter.';

    case 'RESOLVED_DELETED':
      return 'SUCCESS: Item deleted from credit report. Verify deletion on next snapshot. Monitor for improper reinsertion.';

    case 'RESOLVED_VERIFIED':
      return 'CLOSED: Bureau provided documentation verifying item accuracy. Evaluate documentation quality. Consider furnisher dispute if bureau evidence is insufficient.';

    case 'RESOLVED_UPDATED':
      return 'PARTIAL SUCCESS: Item information corrected. Verify corrections on next snapshot. Evaluate if further action needed.';

    default:
      return 'Review case status and determine appropriate next action.';
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIL EVIDENCE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface MailEvidenceUpload {
  memberId: string;
  analyzerItemId?: string;
  bureau: string;
  roundNumber: number;
  receivedAt: Date;
  postmarkDate?: Date;
  classification: MailClassification;
  envelopeImage?: File | string;
  documentImages?: (File | string)[];
  rawText?: string;
  notes?: string;
}

export interface ViolationDetectionResult {
  hasViolation: boolean;
  violationType?: ViolationType;
  violationDetails?: string;
  triggeredBy: 'timing' | 'classification' | 'pattern';
  recommendedAction: string;
}
