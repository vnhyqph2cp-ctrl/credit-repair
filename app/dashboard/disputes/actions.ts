// app/dashboard/disputes/actions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/ai/openai";
import { buildPrompt, Voice } from "@/lib/ai/prompts";
import { startDisputeRound } from "@/lib/dispute-rounds";

export async function generateDispute({
  voice,
  context,
}: {
  voice: Voice;
  context?: { bureau: string; creditor: string; reason: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: customer } = await supabase
    .from("Customer")
    .select("plan_tier")
    .eq("user_id", user.id)
    .single();

  if (!customer) throw new Error("Customer not found");

  if (customer.plan_tier === "basic") {
    throw new Error("Upgrade required");
  }

  if (customer.plan_tier === "standard" && voice !== "standard") {
    throw new Error("Voice upgrade required");
  }

  // Default context if not provided (for backward compatibility)
  const disputeContext = context || {
    bureau: "Equifax",
    creditor: "Capital One",
    reason: "Inaccurate balance reported",
  };

  // Check if AI is enabled
  if (!process.env.OPENAI_API_KEY || process.env.AI_DISPUTE_ENABLED === "false") {
    // Fallback to templates if AI disabled
    return getFallbackTemplate(voice);
  }

  try {
    const prompt = buildPrompt(voice, disputeContext);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast, cost-effective, strong writing
      messages: [{ role: "system", content: prompt }],
      temperature: 0.3, // conservative = compliant
      max_tokens: 1000,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) throw new Error("No output from AI");

    // Optional audit log (create table if needed)
    // await supabase.from("ai_audit").insert({
    //   user_id: user.id,
    //   feature: "dispute_generator",
    //   voice,
    //   created_at: new Date().toISOString(),
    // });

    return text;
  } catch (error) {
    console.error("AI generation failed:", error);
    // Fallback to templates on error
    return getFallbackTemplate(voice);
  }
}

function getFallbackTemplate(voice: Voice): string {
  const templates: Record<Voice, string> = {
    standard: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Credit Bureau Address]

Re: Dispute of Inaccurate Credit Reporting

To Whom It May Concern,

I am writing to formally dispute the accuracy of the following item(s) on my credit report. After reviewing my report, I believe the information listed below may be inaccurate or incomplete.

Account Name: [Creditor Name]
Account Number: [Partial or Last 4 Digits]
Reason for Dispute: [Brief factual reason]

Under the Fair Credit Reporting Act (15 U.S.C. §1681), I am requesting that you investigate this matter and verify the accuracy of the information being reported. If the information cannot be verified, please remove or correct it accordingly.

Please provide me with the results of your investigation once it is complete.

Thank you for your time and attention.

Sincerely,
[Your Name]`,

    smitty: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Credit Bureau Address]

Re: Formal Dispute – Request for Verification

To Whom It May Concern,

This letter serves as a formal dispute regarding the accuracy of information currently appearing on my credit report.

Account Name: [Creditor Name]
Account Number: [Partial or Last 4 Digits]

Pursuant to the Fair Credit Reporting Act (15 U.S.C. §1681a and §1681i), I am requesting a reasonable reinvestigation of this account. Please ensure that verification is obtained directly from the furnisher and that the information reported is complete, accurate, and timely.

If this information cannot be verified through proper investigation, it must be deleted or corrected in accordance with federal law.

Please send written confirmation of the results of your investigation.

Sincerely,
[Your Name]`,

    darain: `[Your Name]
[Your Address]
[City, State ZIP]
[Date]

[Credit Bureau Name]
[Credit Bureau Address]

Re: Notice of Dispute – Failure to Ensure Accurate Reporting

To Whom It May Concern,

I am disputing the continued reporting of the account listed below, which remains inaccurate and/or unverifiable.

Account Name: [Creditor Name]
Account Number: [Partial or Last 4 Digits]

Under the Fair Credit Reporting Act (15 U.S.C. §1681), consumer reporting agencies are required to maintain reasonable procedures to ensure maximum possible accuracy. The continued reporting of this account raises concerns regarding compliance with these obligations.

If you are unable to provide proper verification of this account, including confirmation of accuracy and completeness, I am requesting immediate deletion.

Please provide written confirmation of your investigation results.

Sincerely,
[Your Name]`,
  };

  return templates[voice];
}

/**
 * Start a new dispute round
 */
export async function startRound(
  memberId: string,
  roundNumber: 1 | 2 | 3
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== memberId) {
    return { success: false, error: "Unauthorized" };
  }

  return await startDisputeRound(memberId, roundNumber);
}

