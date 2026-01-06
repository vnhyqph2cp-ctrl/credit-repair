// Mail Classification + Enforcement Edge Function
// Classifies incoming mail evidence and applies enforcement rules

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MailEvidencePayload {
  analyzer_item_id: number;
  bureau: 'equifax' | 'experian' | 'transunion';
  furnisher_name?: string;
  received_date: string;
  envelope_image_url: string;
  document_image_urls: string[];
  ocr_text?: string;
}

interface ClassificationResult {
  classification: string;
  procedural_violation: boolean;
  deadline_reset: boolean;
  next_action: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const payload: MailEvidencePayload = await req.json();

    // Step 1: Get analyzer item context
    const { data: analyzerItem, error: fetchError } = await supabaseClient
      .from('analyzer_items')
      .select('*')
      .eq('id', payload.analyzer_item_id)
      .single();

    if (fetchError || !analyzerItem) {
      throw new Error('Analyzer item not found');
    }

    // Step 2: Classify the mail
    const classification = classifyMail(payload.ocr_text || '', analyzerItem);

    // Step 3: Apply enforcement rules
    const enforcement = applyEnforcementRules(classification, analyzerItem);

    // Step 4: Insert mail evidence
    const { data: mailEvidence, error: insertError } = await supabaseClient
      .from('mail_evidence')
      .insert({
        analyzer_item_id: payload.analyzer_item_id,
        bureau: payload.bureau,
        furnisher_name: payload.furnisher_name,
        received_date: payload.received_date,
        envelope_image_url: payload.envelope_image_url,
        document_image_urls: payload.document_image_urls,
        ocr_text: payload.ocr_text,
        classification: enforcement.classification,
        procedural_violation: enforcement.procedural_violation,
        deadline_reset: enforcement.deadline_reset,
        next_action: enforcement.next_action,
        classified_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    // Step 5: Update analyzer item state based on enforcement
    const updates: any = {
      days_since_last_action: 0,
      last_mail_received_at: payload.received_date,
    };

    if (enforcement.procedural_violation) {
      updates.procedural_violation = true;
      updates.dispute_ground = 'procedural_violation';
      updates.dispute_strength = Math.min(5, (analyzerItem.dispute_strength || 3) + 1);
    }

    // Update AI action based on classification
    if (['stall_identity_request', 'stall_generic', 'no_response_timeout'].includes(enforcement.classification)) {
      updates.ai_action = 'auto_dispute';
    } else if (enforcement.classification === 'verification_completed') {
      updates.ai_action = 'recommend_dispute';
    } else if (enforcement.classification === 'deletion') {
      updates.ai_action = 'ignore';
      updates.round_status = 'closed';
      updates.outcome = 'deleted';
    }

    updates.next_action = enforcement.next_action;

    const { error: updateError } = await supabaseClient
      .from('analyzer_items')
      .update(updates)
      .eq('id', payload.analyzer_item_id);

    if (updateError) {
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        mail_evidence: mailEvidence,
        enforcement,
        analyzer_updates: updates,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

function classifyMail(ocrText: string, analyzerItem: any): string {
  const text = ocrText.toLowerCase();

  // Deletion
  if (text.includes('deleted') || text.includes('removed from report')) {
    return 'deletion';
  }

  // Reinsertion
  if (text.includes('reinserted') || text.includes('added back')) {
    return 'reinsertion';
  }

  // Identity stall
  if (
    text.includes('verify your identity') ||
    text.includes('provide identification') ||
    text.includes('proof of address') ||
    text.includes('social security')
  ) {
    return 'stall_identity_request';
  }

  // Generic stall
  if (
    text.includes('need more time') ||
    text.includes('still investigating') ||
    text.includes('additional time required') ||
    text.includes('extended investigation')
  ) {
    return 'stall_generic';
  }

  // Request additional info
  if (
    text.includes('please provide') ||
    text.includes('please verify') ||
    text.includes('please confirm') ||
    text.includes('we need')
  ) {
    return 'request_additional_info';
  }

  // Verification completed
  if (
    text.includes('verified as accurate') ||
    text.includes('reporting is correct') ||
    text.includes('information confirmed')
  ) {
    return 'verification_completed';
  }

  // Partial update
  if (text.includes('updated') || text.includes('modified')) {
    return 'partial_update';
  }

  // Full update
  if (text.includes('corrected') || text.includes('adjusted balance')) {
    return 'full_update';
  }

  // Acknowledgment only
  if (
    text.includes('received your dispute') ||
    text.includes('we have received') ||
    text.includes('investigating')
  ) {
    return 'acknowledgment_only';
  }

  return 'invalid_response';
}

function applyEnforcementRules(
  classification: string,
  analyzerItem: any
): ClassificationResult {
  const result: ClassificationResult = {
    classification,
    procedural_violation: false,
    deadline_reset: false,
    next_action: '',
  };

  const roundNumber = analyzerItem.round_number || 1;
  const identityOnFile = analyzerItem.identity_verification_on_file || false;

  switch (classification) {
    case 'stall_identity_request':
      // RULE: Identity stall after Round 1 with verification on file = violation
      if (roundNumber >= 2 && identityOnFile) {
        result.procedural_violation = true;
        result.next_action = 'File procedural violation - identity already verified in Round 1';
      } else if (roundNumber === 1) {
        result.next_action = 'Provide identity verification (first request only)';
      } else {
        result.procedural_violation = true;
        result.next_action = 'Escalate - repeated identity requests without basis';
      }
      break;

    case 'stall_generic':
      // RULE: Any generic stall = automatic violation
      result.procedural_violation = true;
      result.next_action = 'File procedural violation - 30-day deadline is mandatory';
      break;

    case 'no_response_timeout':
      // RULE: Day 31+ with no response = violation
      result.procedural_violation = true;
      result.next_action = 'File FCRA violation - no response within 30 days';
      break;

    case 'request_additional_info':
      // RULE: Additional info request after verification sent = violation
      if (identityOnFile) {
        result.procedural_violation = true;
        result.next_action = 'Refuse additional info - verification already provided';
      } else {
        result.next_action = 'Evaluate request legitimacy';
      }
      break;

    case 'verification_completed':
      result.next_action = 'Proceed to dispute - verification does not equal accuracy';
      break;

    case 'deletion':
      result.next_action = 'Monitor for reinsertion - document deletion date';
      break;

    case 'reinsertion':
      result.procedural_violation = true;
      result.next_action = 'File reinsertion violation - requires consumer notice';
      break;

    case 'partial_update':
    case 'full_update':
      result.next_action = 'Review update accuracy - may require new dispute';
      break;

    case 'acknowledgment_only':
      result.next_action = 'Wait for investigation result - 30-day clock running';
      break;

    default:
      result.next_action = 'Manual review required - unclear response';
  }

  return result;
}
