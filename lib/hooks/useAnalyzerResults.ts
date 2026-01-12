"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface AnalyzerResults {
  analysis: any;
  plan: any;
  createdAt: string;
}

export function useAnalyzerResults(creditReportId: string) {
  const [data, setData] = useState<AnalyzerResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!creditReportId) return;

    const fetchResults = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("credit_reports")
        .select("analysis_json, plan_json, created_at")
        .eq("id", creditReportId)
        .single();

      if (error) {
        console.error("Analyzer results fetch failed:", error);
        setLoading(false);
        return;
      }

      setData({
        analysis: data.analysis_json,
        plan: data.plan_json,
        createdAt: data.created_at,
      });

      setLoading(false);
    };

    fetchResults();
  }, [creditReportId]);

  return { data, loading };
}
