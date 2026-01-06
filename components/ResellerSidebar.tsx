"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function ResellerSidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      {/* Logo Header */}
      <div className="sidebar-header">
        <Link href="/dashboard/reseller" className="sidebar-logo">
          <img src="/brand/3B Credit Logo100x100 .png" alt="3B Credit" className="sidebar-logo-img" />
          <div className="logo-text">
            <div className="logo-title">Reseller Portal</div>
            <div className="logo-subtitle">Partner Dashboard</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <Link 
          href="/dashboard/reseller" 
          className={`nav-link ${pathname === '/dashboard/reseller' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link 
          href="/dashboard/reseller/downline" 
          className={`nav-link ${pathname === '/dashboard/reseller/downline' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <span className="nav-text">Downline</span>
        </Link>

        <Link 
          href="/dashboard/reseller/commissions" 
          className={`nav-link ${pathname === '/dashboard/reseller/commissions' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span className="nav-text">Commissions</span>
        </Link>

        <Link 
          href="/dashboard/reseller/referrals" 
          className={`nav-link ${pathname === '/dashboard/reseller/referrals' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <span className="nav-text">Referrals</span>
        </Link>

        <Link 
          href="/dashboard/reseller/reports" 
          className={`nav-link ${pathname === '/dashboard/reseller/reports' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <span className="nav-text">Reports</span>
        </Link>

        <Link 
          href="/dashboard/reseller/training" 
          className={`nav-link ${pathname === '/dashboard/reseller/training' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <span className="nav-text">Training</span>
        </Link>

        <Link 
          href="/dashboard/reseller/support" 
          className={`nav-link ${pathname === '/dashboard/reseller/support' ? 'active' : ''}`}
        >
          <div className="nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <span className="nav-text">Support</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <Link href="/dashboard/reseller/settings" className="footer-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M12 1v6m0 6v6m-9-9h6m6 0h6"/>
          </svg>
          <span>Settings</span>
        </Link>
        <Link href="/api/auth/signout" className="footer-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  );
}
