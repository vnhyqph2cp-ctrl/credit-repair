/**
 * Consumer Credit Dispute Letter Prompts
 *
 * IMPORTANT:
 * - These prompts are ONLY for consumer-authored dispute letters
 * - They are NOT legal notices
 * - They are NOT enforcement actions
 * - They are NOT used after procedural violations are detected
 *
 * Once enforcement begins, AI-generated letters STOP.
 * Enforcement actions use evidence packages and formal filings only.
 *//**
 * ⚠️ ENFORCEMENT BOUNDARY
 * This module MUST NOT be used after:
 * - Day 31 timeout
 * - Any procedural violation
 * - Escalation-required state
 *
 * AI-generated letters STOP at enforcement.
 */


export type LetterTone =
  | "neutral"      // First-round, cooperative consumer dispute
  | "procedural"   // Follow-up, process-focused
  | "assertive";   // Firm but compliant (still non-enforcement)

const COMMON_RULES = `
You are assisting a consumer in drafting a non-legal credit dispute letter.

STRICT RULES:
- Do NOT threaten lawsuits, fines, penalties, or legal action.
- Do NOT claim fraud unless explicitly stated by the consumer.
- Do NOT demand documents the bureau is not required to provide.
- Do NOT state or imply enforcement, violations, or regulatory action.
- Reference the Fair Credit Reporting Act (FCRA) accurately.
- Use calm, factual, non-emotional language.
- This letter is mailed by the consumer.
- This is NOT legal advice.
- Format as a complete letter ready to print and mail.
- Include placeholder fields in [brackets] for consumer completion.
`;

export function buildConsumerDisputePrompt(
  tone: LetterTone,
  context: {
    bureau: string;
    creditor: string;
    reason: string;
  }
): string {
  const base = `
${COMMON_RULES}

Bureau: ${context.bureau}
Creditor: ${context.creditor}
Dispute Reason: ${context.reason}

Generate a complete consumer dispute letter addressing the accuracy of this account.
`;

  if (tone === "neutral") {
    return `
${base}

Tone:
- Neutral
- Cooperative
- Concise

Goal:
- Request reinvestigation under FCRA §1681i
- Ask for correction or removal if the information cannot be verified as accurate

Style:
- First-round dispute
- Safe, factual, non-confrontational
`;
  }

  if (tone === "procedural") {
    return `
${base}

Tone:
- Firm
- Procedural
- Calm

Goal:
- Emphasize the bureau’s reinvestigation obligations under FCRA §1681i
- Reference prior correspondence without accusation

Style:
- Follow-up dispute
- Process-focused
- Still non-enforcement
`;
  }

  // assertive
  return `
${base}

Tone:
- Assertive but compliant
- Direct, professional

Goal:
- Reiterate accuracy obligations under FCRA §1681
- Request correction or removal if the information cannot be verified

Style:
- Appropriate for repeated inaccuracies
- Rights-aware but NOT threatening
`;
}
