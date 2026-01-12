"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ResellerSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <aside className="w-72 min-h-screen bg-black/80 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-white/10">
        <Link href="/dashboard/reseller" className="flex items-center gap-3">
          <img
            src="/brand/3B Credit Logo100x100 .png"
            alt="3B Credit"
            className="h-10 w-10"
          />
          <div>
            <div className="text-sm font-semibold text-white">
              Reseller Portal
            </div>
            <div className="text-xs text-gray-400">
              Partner Dashboard
            </div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1 text-sm">
        <NavLink href="/dashboard/reseller" active={isActive("/dashboard/reseller")}>
          Dashboard
        </NavLink>
        <NavLink href="/dashboard/reseller/downline" active={isActive("/dashboard/reseller/downline")}>
          Downline
        </NavLink>
        <NavLink href="/dashboard/reseller/commissions" active={isActive("/dashboard/reseller/commissions")}>
          Commissions
        </NavLink>
        <NavLink href="/dashboard/reseller/referrals" active={isActive("/dashboard/reseller/referrals")}>
          Referrals
        </NavLink>
        <NavLink href="/dashboard/reseller/reports" active={isActive("/dashboard/reseller/reports")}>
          Reports
        </NavLink>
        <NavLink href="/dashboard/reseller/training" active={isActive("/dashboard/reseller/training")}>
          Training
        </NavLink>
        <NavLink href="/dashboard/reseller/support" active={isActive("/dashboard/reseller/support")}>
          Support
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10 space-y-2">
        <NavLink href="/dashboard/reseller/settings" active={isActive("/dashboard/reseller/settings")}>
          Settings
        </NavLink>

        <Link
          href="/logout"
          className="block rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition"
        >
          Sign out
        </Link>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 transition ${
        active
          ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30"
          : "text-gray-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
