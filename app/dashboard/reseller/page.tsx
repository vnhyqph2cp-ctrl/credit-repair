"use client";

export default function ResellerDashboard() {
  return (
    <div className="reseller-dashboard">
      {/* Header */}
      <div className="reseller-header">
        <div className="header-badge">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Reseller Portal
        </div>
        <h1>Partner Dashboard</h1>
        <p>Manage your downline and track commissions</p>
      </div>

      {/* Overview Stats */}
      <div className="overview-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Clients</div>
            <div className="stat-value">24</div>
            <div className="stat-change positive">+3 this month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Earnings</div>
            <div className="stat-value">$1,240</div>
            <div className="stat-change positive">+$180 this month</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Pending</div>
            <div className="stat-value">$420</div>
            <div className="stat-change">7 commissions</div>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Active Rate</div>
            <div className="stat-value">87%</div>
            <div className="stat-change">21/24 active</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="reseller-section">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <a href="/dashboard/reseller/downline" className="action-card">
            <div className="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">View Downline</div>
              <div className="action-desc">See all your clients</div>
            </div>
          </a>

          <a href="/dashboard/reseller/commissions" className="action-card">
            <div className="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">Commissions</div>
              <div className="action-desc">Track earnings</div>
            </div>
          </a>

          <a href="/dashboard/reseller/referrals" className="action-card">
            <div className="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">Referral Link</div>
              <div className="action-desc">Share & grow</div>
            </div>
          </a>

          <a href="/dashboard/reseller/reports" className="action-card">
            <div className="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div className="action-content">
              <div className="action-title">Reports</div>
              <div className="action-desc">Analytics & insights</div>
            </div>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="reseller-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">New client signup</div>
              <div className="activity-meta">john.doe@example.com • 2 hours ago</div>
            </div>
            <div className="activity-value">+$25</div>
          </div>

          <div className="activity-item">
            <div className="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">Commission earned</div>
              <div className="activity-meta">Epic Report completed • 5 hours ago</div>
            </div>
            <div className="activity-value">+$15</div>
          </div>

          <div className="activity-item">
            <div className="activity-icon info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">Client milestone</div>
              <div className="activity-meta">sarah.jones@example.com reached Analyzer • Yesterday</div>
            </div>
            <div className="activity-value">+$25</div>
          </div>

          <div className="activity-item">
            <div className="activity-icon success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div className="activity-content">
              <div className="activity-title">New client signup</div>
              <div className="activity-meta">mike.wilson@example.com • 2 days ago</div>
            </div>
            <div className="activity-value">+$25</div>
          </div>
        </div>
      </div>
    </div>
  );
}
