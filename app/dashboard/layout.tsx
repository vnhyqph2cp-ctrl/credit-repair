// app/dashboard/layout.tsx

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-950">
        <div className="px-5 py-4 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          3B Dashboard
        </div>
        <nav className="flex-1 px-4 py-4 text-xs space-y-1">
          <Link
            href="/dashboard"
            className="block rounded-md bg-slate-900/80 px-3 py-2 text-slate-100"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/monitoring"
            className="block rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/60"
          >
            Monitoring
          </Link>
          <Link
            href="/dashboard/disputes"
            className="block rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/60"
          >
            Disputes
          </Link>
          <Link
            href="/dashboard/funding"
            className="block rounded-md px-3 py-2 text-slate-400 hover:bg-slate-900/60"
          >
            Funding
          </Link>
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-[11px] text-slate-500">
          <p className="font-semibold text-slate-300 mb-1">Tester build</p>
          <p>V0.1 • Layout only • For internal preview.</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
            Dashboard • Overview
          </p>
          <span className="text-xs text-slate-400">Tester build · v0.1</span>
        </header>

        {children}
      </div>
    </div>
  );
}
