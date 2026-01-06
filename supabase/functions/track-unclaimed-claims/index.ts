import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch all unclaimed properties with their current status
    const { data: properties, error: fetchError } = await supabase
      .from('unclaimedProperties')
      .select(`
        unclaimedPropertyId,
        customerId,
        state,
        holder,
        amountCents,
        assetType,
        status,
        claimUrl,
        metadata,
        createdAt,
        updatedAt,
        customer:Customer(email, name),
        agreements:unclaimedAgreements(*)
      `)
      .order('createdAt', { ascending: false });

    if (fetchError) {
      throw fetchError;
    }

    // Calculate statistics
    const stats = {
      total: properties?.length || 0,
      byStatus: {
        PENDING: 0,
        CLAIMED: 0,
        REJECTED: 0,
        FUNDED: 0,
      },
      byState: {} as Record<string, number>,
      totalAmountCents: 0,
      totalPotentialCents: 0,
      withAgreements: 0,
      withoutAgreements: 0,
    };

    properties?.forEach((prop: any) => {
      // Count by status
      stats.byStatus[prop.status as keyof typeof stats.byStatus]++;

      // Count by state
      stats.byState[prop.state] = (stats.byState[prop.state] || 0) + 1;

      // Sum amounts
      stats.totalAmountCents += prop.amountCents || 0;
      if (prop.status === 'FUNDED') {
        stats.totalPotentialCents += prop.amountCents || 0;
      }

      // Count agreements
      if (prop.agreements && prop.agreements.length > 0) {
        stats.withAgreements++;
      } else {
        stats.withoutAgreements++;
      }
    });

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      stats,
      properties: properties || [],
      summary: {
        totalValue: `$${((stats.totalAmountCents || 0) / 100).toFixed(2)}`,
        fundedValue: `$${((stats.totalPotentialCents || 0) / 100).toFixed(2)}`,
        claimRate: stats.total > 0 
          ? `${((stats.byStatus.CLAIMED + stats.byStatus.FUNDED) / stats.total * 100).toFixed(1)}%`
          : '0%',
      },
    };

    return new Response(
      JSON.stringify(response, null, 2),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error tracking unclaimed claims:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to track unclaimed claims',
        timestamp: new Date().toISOString(),
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});
