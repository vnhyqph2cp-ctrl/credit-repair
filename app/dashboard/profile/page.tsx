"use client";

export default function ProfilePage() {
  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <button className="change-avatar-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            Change Photo
          </button>
        </div>

        <div className="profile-info">
          <h1>John Thompson</h1>
          <div className="profile-meta">
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              john.thompson@example.com
            </div>
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Member since Dec 2025
            </div>
            <div className="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              3B ID: 3B-2025-001
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="profile-section">
        <h2>Achievement Badges</h2>
        <div className="badges-grid">
          <div className="badge-card earned">
            <div className="badge-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="7"/>
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
              </svg>
            </div>
            <div className="badge-name">First Report</div>
            <div className="badge-date">Earned Dec 15, 2025</div>
          </div>

          <div className="badge-card earned">
            <div className="badge-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div className="badge-name">Analyzer Complete</div>
            <div className="badge-date">Earned Dec 20, 2025</div>
          </div>

          <div className="badge-card earned">
            <div className="badge-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="badge-name">First Dispute</div>
            <div className="badge-date">Earned Jan 2, 2026</div>
          </div>

          <div className="badge-card locked">
            <div className="badge-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="badge-name">Funding Ready</div>
            <div className="badge-date">Not yet earned</div>
          </div>

          <div className="badge-card locked">
            <div className="badge-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="badge-name">Score Master</div>
            <div className="badge-date">Reach 750+ score</div>
          </div>

          <div className="badge-card locked">
            <div className="badge-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="badge-name">Ultimate User</div>
            <div className="badge-date">Subscribe to Ultimate</div>
          </div>
        </div>
      </div>

      {/* Credit Journey Stats */}
      <div className="profile-section">
        <h2>Credit Journey</h2>
        <div className="journey-grid">
          <div className="journey-stat">
            <div className="journey-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="20" x2="12" y2="10"/>
                <line x1="18" y1="20" x2="18" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="16"/>
              </svg>
            </div>
            <div className="journey-value">+47</div>
            <div className="journey-label">Score Increase</div>
          </div>

          <div className="journey-stat">
            <div className="journey-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="journey-value">8</div>
            <div className="journey-label">Disputes Filed</div>
          </div>

          <div className="journey-stat">
            <div className="journey-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="journey-value">12</div>
            <div className="journey-label">Items Removed</div>
          </div>

          <div className="journey-stat">
            <div className="journey-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="journey-value">21</div>
            <div className="journey-label">Days Active</div>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="profile-section">
        <h2>Account Settings</h2>
        <div className="settings-grid">
          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-info">
                <h3>Personal Information</h3>
                <p>Update your name, email, and contact details</p>
              </div>
              <button className="edit-btn">Edit</button>
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-info">
                <h3>Password & Security</h3>
                <p>Change password and manage security settings</p>
              </div>
              <button className="edit-btn">Edit</button>
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-info">
              <h3>Notifications</h3>
              <p>Manage email and push notification preferences</p>
            </div>
            <div className="toggle-group">
              <label className="toggle-item">
                <span>Email notifications</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="toggle-item">
                <span>Score alerts</span>
                <input type="checkbox" defaultChecked />
              </label>
              <label className="toggle-item">
                <span>Marketing emails</span>
                <input type="checkbox" />
              </label>
            </div>
          </div>

          <div className="setting-card">
            <div className="setting-header">
              <div className="setting-info">
                <h3>Subscription</h3>
                <p>Current Plan: <strong>AI Analyzer ($79/mo)</strong></p>
              </div>
              <button className="edit-btn">Manage</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

