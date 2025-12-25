import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Simple top nav for dashboard sections */}
        <nav className="mb-6 flex gap-4 border-b border-white/10 pb-3 text-sm">
          <a
            href="/dashboard"
            className="text-white/90 hover:text-white border-b-2 border-transparent hover:border-[#00D9FF] pb-1"
          >
            Overview
          </a>
          <a
            href="/dashboard/profile"
            className="text-white/70 hover:text-white border-b-2 border-transparent hover:border-[#00D9FF] pb-1"
          >
            Profile
          </a>
          <a
            href="/dashboard/customers"
            className="text-white/70 hover:text-white border-b-2 border-transparent hover:border-[#00D9FF] pb-1"
          >
            Customers
          </a>
        </nav>

        <section>{children}</section>
      </div>
    </div>
  );
}
