"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function MFSNCallbackPage() {
  const router = useRouter();
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          setStatus("error");
          setErrorMessage("You must be logged in.");
          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mfsn-verify-score`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const json = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMessage(json.error ?? "Verification failed. Please contact support.");
          return;
        }

        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (err) {
        console.error(err);
        setStatus("error");
        setErrorMessage("Something went wrong. Please try again.");
      }
    }

    verify();
  }, [router, supabase]);

  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-lg text-center">
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/dashboard" className="hover:text-cyan-400">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Verifying Snapshot</span>
        </nav>

        {status === "verifying" && (
          <>
            <h1 className="text-2xl font-black">Verifying Your Snapshot</h1>
            <p className="text-slate-300 mt-3">
              Please wait while we securely verify your identity and prepare your credit Snapshot.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-black text-emerald-400">Verification Complete</h1>
            <p className="text-slate-300 mt-3">
              Your Snapshot is ready. Redirecting you to your dashboard…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-black text-red-400">Verification Error</h1>
            <p className="text-slate-300 mt-3">{errorMessage}</p>
            <a
              href="/dashboard"
              className="inline-flex mt-6 rounded-full border border-slate-700 bg-slate-950 px-6 py-3 font-semibold text-slate-200 hover:border-cyan-500/50"
            >
              Return to Dashboard
            </a>
          </>
        )}
      </div>
    </main>
  );
}
