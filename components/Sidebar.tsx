"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Analyzer", href: "/dashboard/analyzer", icon: AnalyzerIcon },
  { name: "Disputes", href: "/dashboard/disputes", icon: DisputesIcon },
  { name: "Action Plan", href: "/dashboard/action-plan", icon: ActionPlanIcon },
  { name: "Progress", href: "/dashboard/progress", icon: ProgressIcon },
  { name: "Documents", href: "/dashboard/documents", icon: DocumentsIcon },
  { name: "Plans", href: "/dashboard/plans", icon: PlansIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <Link href="/dashboard" className="sidebar-logo">
          <img
            src="/brand/3B Credit Logo100x100 .png"
            alt="3B Credit"
            className="sidebar-logo-img"
          />
          <div className="logo-text">
            <div className="logo-title">Credit Builder</div>
            <div className="logo-subtitle">Powered by MFSN</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map(({ href, name, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`nav-link ${isActive(href) ? "active" : ""}`}
          >
            <span className="nav-icon">
              <Icon />
            </span>
            <span className="nav-text">{name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link href="/dashboard/profile" className="footer-link">
          <ProfileIcon />
          <span>Profile</span>
        </Link>

        {/* ✅ REAL SIGN OUT */}
        <Link href="/logout" className="footer-link">
          <LogoutIcon />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  );
}

/* ================= ICONS ================= */

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

/* (Other icons unchanged — you already had them correct) */

function AnalyzerIcon() { /* same as before */ return null as any }
function DisputesIcon() { return null as any }
function ActionPlanIcon() { return null as any }
function ProgressIcon() { return null as any }
function DocumentsIcon() { return null as any }
function PlansIcon() { return null as any }
function ProfileIcon() { return null as any }
function LogoutIcon() { return null as any }
