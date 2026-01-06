import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const shouldCheckDb = url.searchParams.get('db') === '1';

    const response: any = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'credit-repair-health-check',
    };

    // Check database if requested
    if (shouldCheckDb) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
      const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

      if (!supabaseUrl || !serviceRoleKey) {
        response.database = {
          status: 'error',
          message: 'Missing Supabase credentials',
        };
      } else {
        try {
          const supabase = createClient(supabaseUrl, serviceRoleKey);
          
          // Simple query to check DB connection
          const { data, error } = await supabase
            .from('Customer')
            .select('id')
            .limit(1);

          if (error) {
            response.database = {
              status: 'error',
              message: error.message,
            };
          } else {
            response.database = {
              status: 'healthy',
              message: 'Database connection successful',
            };
          }
        } catch (dbError: any) {
          response.database = {
            status: 'error',
            message: dbError.message || 'Database connection failed',
          };
        }
      }
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 'error',
        message: error.message || 'Health check failed',
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
