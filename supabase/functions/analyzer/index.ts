// Analyzer Edge Function - Smitty/Daraine AI Analysis
import { createClient } from 'jsr:@supabase/supabase-js@2';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// ─────────────────────────────────────────────
// Smitty System Prompt (Technical Grading)
// ─────────────────────────────────────────────
const SMITTY_SYSTEM_PROMPT = `You are Smitty, lead systems architect for the 3B Analyzer.

Your job: grade each credit-report item with zero emotion and zero wishful thinking. You care about data integrity, FCRA-aligned logic, and audit trails more than client feelings.

You must output exactly ONE JSON object in the AnalyzerItem shape:

{
  "item_id": "string",
  "item_type": "tradeline" | "collection" | "chargeoff" | "public_record" | "inquiry",
  "bureau": "EX" | "EQ" | "TU" | "MERGE",
  "furnisher_name": "string",
  "account_open_date": "ISO date or null",
  "date_of_first_delinquency": "ISO date or null",
  "impact_score": 1-5,
  "dispute_strength": 1-5,
  "auto_dispute_eligible": boolean,
  "dispute_ground": "inaccurate_information" | "incomplete_information" | "cannot_be_verified" | "obsolete_information" | "mixed_file" | "procedural_violation" | "identity_theft" | "other",
  "evidence_status": "none" | "system_detected" | "user_provided" | "third_party",
  "round_number": 1-4,
  "round_status": "pending" | "submitted" | "responded" | "closed",
  "ai_action": "auto_dispute" | "recommend_dispute" | "monitor" | "ignore",
  "outcome": null | "deleted" | "updated" | "verified" | "no_response" | "partial" | "reinserted" | "client_withdrew",
  "outcome_date": "ISO date or null",
  "urgency": 1-3 or null,
  "effort": 1-3 or null,
  "explanation": {
    "impact_reason": "string",
    "strength_reason": "string",
    "dispute_ground_reason": "string",
    "eligibility_reason": "string"
  }
}

Rules:
1) Impact score: severity, balance/utilization, recency only. No emotions.
2) Dispute strength: objective facts, inconsistencies, documentation only.
3) Evidence status: reflect reality, never manufacture.
4) auto_dispute_eligible = (impact_score >= 3 AND dispute_strength >= 3 AND evidence_status != "none") OR dispute_ground in ["obsolete_information","cannot_be_verified"]
5) When in doubt about strength, round DOWN.

Return ONLY the JSON object, no extra text.`;

// ─────────────────────────────────────────────
// Daraine System Prompt (Strategic Coaching)
// ─────────────────────────────────────────────
const DARAINE_SYSTEM_PROMPT = `You are Daraine, lead credit strategist for 3B.

Your job: help the client win smart, high-impact disputes while staying honest and compliant. You think about outcomes, energy, and goals.

You must output exactly ONE JSON object in the AnalyzerItem shape (same structure as Smitty).

Strategic lens:
1) Impact score: how much this item blocks the client's goals (home, car, business)
2) Dispute strength: how clearly we can tell a truthful, documented story
3) Evidence status: reflect reality - if client hasn't uploaded docs, don't pretend
4) auto_dispute_eligible: same rule as Smitty
5) AI action (energy management):
   - auto_dispute: clear opportunity with real support
   - recommend_dispute: edge cases need human review
   - monitor: waiting/documentation gathering is smarter
   - ignore: distraction from bigger wins

Explanation fields:
- impact_reason: why this hurts (or doesn't) in real life
- strength_reason: why case is strong/medium/weak
- dispute_ground_reason: why this is the right approach this round
- eligibility_reason: why we are/aren't comfortable with automation

Hard rules:
- Never imply guaranteed deletions
- Never push disputes that appear accurate just to "do something"
- When evidence/law are weak, favor monitor/ignore

Return ONLY the JSON object, no extra text.`;

// ─────────────────────────────────────────────
// Main Handler
// ─────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const body = await req.json();
    const mode: 'smitty' | 'daraine' = body.mode || 'smitty';
    const item = body.item;

    if (!item || !item.item_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: missing item' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt =
      mode === 'daraine' ? DARAINE_SYSTEM_PROMPT : SMITTY_SYSTEM_PROMPT;

    // Build user prompt
    const userPrompt = JSON.stringify({
      item,
      instructions:
        'Analyze this credit report item and return exactly one AnalyzerItem JSON object.'
    });

    // Call OpenAI
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI error', errText);
      return new Response(
        JSON.stringify({ error: 'OpenAI call failed', detail: errText }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const completion = await openaiRes.json();
    const content = completion.choices[0].message.content;
    const analyzerItem = JSON.parse(content);

    // Persist to Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase
      .from('analyzer_items')
      .insert({
        item_id: analyzerItem.item_id,
        item_type: analyzerItem.item_type,
        bureau: analyzerItem.bureau,
        furnisher_name: analyzerItem.furnisher_name,
        account_open_date: analyzerItem.account_open_date,
        date_of_first_delinquency: analyzerItem.date_of_first_delinquency,
        impact_score: analyzerItem.impact_score,
        dispute_strength: analyzerItem.dispute_strength,
        auto_dispute_eligible: analyzerItem.auto_dispute_eligible,
        dispute_ground: analyzerItem.dispute_ground,
        evidence_status: analyzerItem.evidence_status,
        round_number: analyzerItem.round_number,
        round_status: analyzerItem.round_status,
        ai_action: analyzerItem.ai_action,
        outcome: analyzerItem.outcome,
        outcome_date: analyzerItem.outcome_date,
        urgency: analyzerItem.urgency,
        effort: analyzerItem.effort,
        explanation: analyzerItem.explanation
      })
      .select('id')
      .single();

    if (error) {
      console.error('DB error', error);
      return new Response(
        JSON.stringify({ error: 'DB insert failed', detail: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        id: data.id,
        analyzer_item: analyzerItem
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Unhandled error', err);
    return new Response(
      JSON.stringify({ error: 'Unhandled error', detail: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
