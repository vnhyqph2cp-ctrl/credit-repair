"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const ref = params.get("ref");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      alert(error.message);
      return;
    }

    // Attach referral if present
    if (ref && data.user) {
      await fetch("/api/auth/attach-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: data.user.id,
          ref,
        }),
      });
    }

    alert("Account created. You can sign in now.");
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleRegister}
        className="surface card glow-soft col gap-4 w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold">Create your 3B account</h1>

        {ref && (
          <div className="surface-teal card col" style={{ padding: 12 }}>
            <small className="text-muted">Referral code applied</small>
            <strong style={{ fontSize: "14px", color: "rgb(var(--accent))" }}>
              {ref}
            </strong>
          </div>
        )}

        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />

        <button className="btn glow-neon" type="submit">
          Create Account
        </button>

        <a className="btn" href="/login">
          Already have an account? Sign in
        </a>
      </form>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
