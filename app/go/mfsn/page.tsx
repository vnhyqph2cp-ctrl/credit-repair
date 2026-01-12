"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export default function MFSNEnrollPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    streetAddress1: "",
    zip: "",
    city: "",
    state: "",
    ssn: "",
    dob: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to connect MyFreeScoreNow.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/mfsn-enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Enrollment failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/mfsn/verify-pending");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-neon-teal">
          Dashboard
        </Link>
        <span className="mx-2">/</span>
        <span>Connect MyFreeScoreNow</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">
          Connect MyFreeScoreNow
        </h1>
        <p className="text-muted-foreground">
          Securely connect your MyFreeScoreNow account to pull your credit
          snapshot into 3B Credit Builder.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
        </div>

        {/* Auth */}
        <div className="grid grid-cols-2 gap-4">
          <Input type="email" label="Email" name="email" value={formData.email} onChange={handleChange} />
          <Input type="password" label="Password" name="password" value={formData.password} onChange={handleChange} autoComplete="new-password" />
        </div>

        <Input label="Mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="5555551234" />
        <Input label="Street Address" name="streetAddress1" value={formData.streetAddress1} onChange={handleChange} />

        <div className="grid grid-cols-3 gap-4">
          <Input label="City" name="city" value={formData.city} onChange={handleChange} />
          <Input label="State" name="state" value={formData.state} onChange={handleChange} maxLength={2} />
          <Input label="Zip" name="zip" value={formData.zip} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="SSN" name="ssn" value={formData.ssn} onChange={handleChange} autoComplete="off" />
          <Input label="Date of Birth" name="dob" value={formData.dob} onChange={handleChange} placeholder="MM/DD/YYYY" autoComplete="off" />
        </div>

        {error && (
          <div className="rounded-lg border border-red-800 bg-red-950/30 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-neon-teal px-6 py-3 font-semibold text-black hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Starting enrollment…" : "Connect MyFreeScoreNow →"}
        </button>
      </form>

      <p className="text-xs text-muted-foreground text-center">
        Your information is encrypted and transmitted securely. 3B Credit Builder
        does not store SSNs long-term.
      </p>
    </div>
  );
}

/* ------------ helper ------------ */

function Input(props: any) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <input
        {...rest}
        required
        className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-neon-teal"
      />
    </div>
  );
}
