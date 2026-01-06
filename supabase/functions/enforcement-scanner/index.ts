/**
 * Automated Timing Violation Scanner
 * 
 * This Edge Function runs daily (via cron or scheduled task)
 * to automatically detect DAY_31_TIMEOUT violations.
 * 
 * The statutory clock does not stop. We enforce it.
 * 
 * Deploy: supabase functions deploy enforcement-scanner
 * Schedule: Run daily at 9:00 AM EST
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const now = new Date();
    const violations: any[] = [];
    
    // Find all items in INVESTIGATION_PENDING that are past deadline with no response
    const { data: pendingItems, error: fetchError } = await supabase
      .from('analyzerItems')
      .select('*')
      .eq('roundStatus', 'INVESTIGATION_PENDING')
      .lt('responseDeadline', now.toISOString())
      .is('lastResponseAt', null);
    
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`[Enforcement Scanner] Found ${pendingItems?.length || 0} items past deadline`);
    
    for (const item of pendingItems || []) {
      
      const daysFromDispute = Math.floor(
        (now.getTime() - new Date(item.disputeFiledAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Create NO_RESPONSE mail evidence
      const { data: evidence, error: evidenceError } = await supabase
        .from('mailEvidence')
        .insert({
          memberId: item.memberId,
          analyzerItemId: item.id,
          receivedAt: now.toISOString(),
          classification: 'NO_RESPONSE',
          bureau: item.bureau,
          roundNumber: item.roundNumber,
          daysFromDispute,
          triggersViolation: true,
          violationType: 'DAY_31_TIMEOUT',
          rawText: 'AUTO-GENERATED: No response received within statutory 30-day period',
          manualClassification: false
        })
        .select()
        .single();
      
      if (evidenceError) {
        console.error(`[Enforcement Scanner] Failed to create evidence for ${item.id}:`, evidenceError);
        continue;
      }
      
      // Update item to VIOLATION_DETECTED
      const { error: updateError } = await supabase
        .from('analyzerItems')
        .update({
          roundStatus: 'VIOLATION_DETECTED',
          proceduralViolation: true,
          violationType: 'DAY_31_TIMEOUT',
          violationDetails: `No response received by deadline: ${item.responseDeadline}`,
          nextAction: 'File CFPB complaint for 30-day statutory violation under FCRA § 611(a)(1)(A)',
          lastResponseAt: now.toISOString(),
          updatedAt: now.toISOString()
        })
        .eq('id', item.id);
      
      if (updateError) {
        console.error(`[Enforcement Scanner] Failed to update ${item.id}:`, updateError);
        continue;
      }
      
      violations.push({
        itemId: item.id,
        creditor: item.creditor,
        bureau: item.bureau,
        daysFromDispute,
        deadline: item.responseDeadline
      });
      
      console.log(`[Enforcement Scanner] ✓ Violation detected: ${item.creditor} (${item.bureau}) - Day ${daysFromDispute}`);
    }
    
    // Summary report
    const report = {
      timestamp: now.toISOString(),
      itemsScanned: pendingItems?.length || 0,
      violationsDetected: violations.length,
      violations
    };
    
    console.log('[Enforcement Scanner] Scan complete:', report);
    
    return new Response(
      JSON.stringify(report),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    );
    
  } catch (error) {
    console.error('[Enforcement Scanner] Fatal error:', error);
    
    return new Response(
      JSON.stringify({
        error: 'Enforcement scanner failed',
        details: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
