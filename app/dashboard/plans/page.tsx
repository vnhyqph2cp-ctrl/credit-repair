"use client";

export default function PlansPage() {
  return (
    <div className="plans-page">
      {/* Header */}
      <div className="plans-header">
        <h1>Subscription Plans</h1>
        <p>Choose the plan that's right for your credit journey</p>
      </div>

      {/* Current Plan */}
      <div className="current-plan-card">
        <div className="plan-badge active">Current Plan</div>
        <h2>AI Analyzer</h2>
        <div className="plan-price-display">
          <span className="price-amount">$79</span>
          <span className="price-period">/month</span>
        </div>
        <p>Active since December 2025</p>
        <button className="manage-plan-btn">Manage Subscription</button>
      </div>

      {/* Available Plans */}
      <div className="plans-section">
        <h2>All Plans</h2>
        <div className="plans-grid">
          {/* Free Plan */}
          <div className="plan-card">
            <div className="plan-tier-badge">Free</div>
            <h3>Credit Snapshot</h3>
            <div className="plan-pricing">
              <span className="price">$0</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                3-Bureau Credit Snapshot
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Monthly Updates
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Basic Dashboard
              </li>
            </ul>
            <button className="plan-select-btn" disabled>Current Plan Tier</button>
          </div>

          {/* Basic Plan */}
          <div className="plan-card">
            <div className="plan-tier-badge">Basic</div>
            <h3>Credit Builder</h3>
            <div className="plan-pricing">
              <span className="price">$29</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Everything in Free
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Weekly Monitoring
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Score Tracking
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Progress Dashboard
              </li>
            </ul>
            <button className="plan-select-btn">Downgrade to Basic</button>
          </div>

          {/* Analyzer Plan - Current */}
          <div className="plan-card featured active">
            <div className="plan-tier-badge highlight">Most Popular</div>
            <h3>AI Analyzer</h3>
            <div className="plan-pricing">
              <span className="price">$79</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Everything in Basic
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                AI Credit Analyzer
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Action Plan Generator
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Dispute Letter Templates
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Priority Support
              </li>
            </ul>
            <button className="plan-select-btn active" disabled>Your Current Plan</button>
          </div>

          {/* Ultimate Plan */}
          <div className="plan-card premium">
            <div className="plan-tier-badge premium">Ultimate</div>
            <h3>Full Service</h3>
            <div className="plan-pricing">
              <span className="price">$149</span>
              <span className="period">/month</span>
            </div>
            <ul className="plan-features-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Everything in Analyzer
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Automated Dispute Rounds
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Legal Document Library
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Dedicated Success Manager
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Funding Readiness Tools
              </li>
            </ul>
            <button className="plan-select-btn premium">Upgrade to Ultimate</button>
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="billing-info-section">
        <h2>Billing Information</h2>
        <div className="billing-card">
          <div className="billing-header">
            <div>
              <h3>Payment Method</h3>
              <p>Visa ending in 4242</p>
            </div>
            <button className="edit-btn">Update</button>
          </div>
        </div>

        <div className="billing-card">
          <div className="billing-header">
            <div>
              <h3>Next Billing Date</h3>
              <p>February 4, 2026</p>
            </div>
          </div>
        </div>

        <div className="billing-card">
          <div className="billing-header">
            <div>
              <h3>Billing History</h3>
              <p>View past invoices and payments</p>
            </div>
            <button className="edit-btn">View History</button>
          </div>
        </div>
      </div>
    </div>
  );
}
            bullets={[
              "Standard dispute templates",
              "Print & mail yourself",
              "Manual sent tracking",
              "Unclaimed property search",
            ]}
          />

          <PlanCard
            title="Plan 2 — Standard"
            tier="standard"
            price="$79/mo"
            current={currentPlan}
            bullets={[
              "AI-generated disputes",
              "Personalized per account",
              "Dashboard tracking",
              "Everything in Basic",
            ]}
          />

          <PlanCard
            title="Plan 3 — The Works"
            tier="works"
            price="$149/mo"
            current={currentPlan}
            bullets={[
              "Standard + Smitty + Darain voices",
              "Multiple rounds & escalation",
              "Maximum control & options",
              "Everything in Standard",
            ]}
          />
        </div>

        {/* NOTE */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-gray-300">
          <p className="font-semibold mb-2">💡 All plans include:</p>
          <ul className="space-y-1 ml-4">
            <li>• Credit monitoring</li>
            <li>• Analyzer results</li>
            <li>• Unclaimed property alerts</li>
            <li>• 30-day money back guarantee</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
