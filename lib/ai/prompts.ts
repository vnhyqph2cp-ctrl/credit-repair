// lib/ai/prompts.ts

export type Voice = "standard" | "smitty" | "darain";

const COMMON_RULES = `
You are generating a consumer credit dispute letter.
Rules you must follow:
- Do NOT threaten lawsuits, fines, or penalties.
- Do NOT claim fraud unless explicitly stated by the user.
- Do NOT demand documents the bureau does not provide.
- Reference the Fair Credit Reporting Act (FCRA) accurately.
- Use calm, factual language.
- The consumer prints and mails the letter themselves.
- No legal advice language.
- Format as a complete letter ready to print.
- Include placeholder fields in [brackets] for user to fill in.
`;

export function buildPrompt(voice: Voice, context: {
  bureau: string;
  creditor: string;
  reason: string;
}) {
  const base = `
${COMMON_RULES}

Bureau: ${context.bureau}
Creditor: ${context.creditor}
Dispute Reason: ${context.reason}

Generate a complete dispute letter addressing this specific issue.
`;

  if (voice === "standard") {
    return `
${base}
Tone: neutral, cooperative, concise.
Goal: Request investigation and correction if unverifiable.
Style: Safe, factual, first-time dispute approach.
`;
  }

  if (voice === "smitty") {
    return `
${base}
Tone: firm, procedural, FCRA-forward.
Goal: Emphasize reinvestigation obligations under FCRA §1681i.
Style: Knowledgeable, process-focused, suitable for follow-up disputes.
`;
  }

  return `
${base}
Tone: assertive but compliant.
Goal: Highlight accuracy obligations under FCRA §1681 and request deletion if unverifiable.
Style: Direct, rights-focused, suitable for chronic errors or escalation.
`;
}
