"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function MFSNEnrollPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      const { data: { session } } = await supabase.auth.getSession();

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
        setError(json.error ?? "Failed to start enrollment. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard/mfsn/verify-pending");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="mb-6 text-sm text-slate-500">
          <a href="/dashboard" className="hover:text-cyan-400">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Connect MyFreeScoreNow</span>
        </nav>

        <h1 className="text-3xl font-black">Connect MyFreeScoreNow</h1>
        <p className="text-slate-300 mt-2">
          Securely connect your MyFreeScoreNow account to pull your credit Snapshot into 3B Credit Builder.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Mobile</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="5555551234"
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-1">Street Address</label>
            <input
              type="text"
              name="streetAddress1"
              value={formData.streetAddress1}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                placeholder="WA"
                maxLength={2}
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Zip</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">SSN</label>
              <input
                type="text"
                name="ssn"
                value={formData.ssn}
                onChange={handleChange}
                required
                placeholder="123456789"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1">Date of Birth</label>
              <input
                type="text"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                placeholder="MM/DD/YYYY"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-950/30 border border-red-800 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 font-black text-black disabled:opacity-50"
          >
            {loading ? "Starting enrollment..." : "Connect MyFreeScoreNow →"}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-6 text-center">
          Your information is encrypted and sent securely to MyFreeScoreNow. 3B Credit Builder does not store your SSN long-term.
        </p>
      </div>
    </main>
  );
}
