"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage(
          "Check your email for a password reset link."
        );
      }
    } catch {
      setError("Unable to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-black/60" />

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold mb-4">
            Reset your password
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Enter your email and we’ll send you a secure reset link.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-black/50 border border-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-teal"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-green-800 bg-green-950/30 p-3 text-sm text-green-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-neon-teal px-6 py-3 font-semibold text-black hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Sending link…" : "Send reset link"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
