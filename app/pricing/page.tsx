import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="pricing-page">
      {/* Header */}
      <div className="pricing-header">
        <Link href="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Home
        </Link>
        <h1>Choose Your Plan</h1>
        <p>Transparent pricing. No hidden fees. Cancel anytime.</p>
      </div>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {/* Free Snapshot */}
        <div className="pricing-card">
          <div className="plan-badge">Free</div>
          <div className="plan-name">Credit Snapshot</div>
          <div className="plan-price">
            <span className="currency">$</span>
            <span className="amount">0</span>
          </div>
          <div className="plan-description">Get started with basic credit monitoring</div>
          
          <ul className="plan-features">
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
              Basic Credit Summary
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Monthly Updates
            </li>
            <li className="disabled">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              AI Analyzer
            </li>
            <li className="disabled">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Dispute Tools
            </li>
          </ul>

          <Link href="/register" className="plan-button">
            Get Started Free
          </Link>
        </div>

        {/* Basic Plan */}
        <div className="pricing-card">
          <div className="plan-badge">Basic</div>
          <div className="plan-name">Credit Builder</div>
          <div className="plan-price">
            <span className="currency">$</span>
            <span className="amount">29</span>
            <span className="period">/mo</span>
          </div>
          <div className="plan-description">Everything you need to build credit</div>
          
          <ul className="plan-features">
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
              Weekly Credit Monitoring
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Credit Score Tracking
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Progress Dashboard
            </li>
            <li className="disabled">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              AI Analyzer
            </li>
          </ul>

          <Link href="/register" className="plan-button">
            Start Building
          </Link>
        </div>

        {/* Analyzer Plan - Featured */}
        <div className="pricing-card featured">
          <div className="plan-badge">Most Popular</div>
          <div className="plan-name">AI Analyzer</div>
          <div className="plan-price">
            <span className="currency">$</span>
            <span className="amount">79</span>
            <span className="period">/mo</span>
          </div>
          <div className="plan-description">AI-powered credit optimization</div>
          
          <ul className="plan-features">
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
              Personalized Action Plan
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Dispute Letter Generator
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Priority Support
            </li>
          </ul>

          <Link href="/register" className="plan-button primary">
            Start Optimizing
          </Link>
        </div>

        {/* Ultimate Plan */}
        <div className="pricing-card">
          <div className="plan-badge premium">Ultimate</div>
          <div className="plan-name">Full Service</div>
          <div className="plan-price">
            <span className="currency">$</span>
            <span className="amount">149</span>
            <span className="period">/mo</span>
          </div>
          <div className="plan-description">Complete credit repair solution</div>
          
          <ul className="plan-features">
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

          <Link href="/register" className="plan-button">
            Go Ultimate
          </Link>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="pricing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>Can I cancel anytime?</h3>
            <p>Yes! Cancel anytime with no penalties or long-term commitments.</p>
          </div>
          <div className="faq-item">
            <h3>What payment methods do you accept?</h3>
            <p>We accept all major credit cards, debit cards, and ACH transfers.</p>
          </div>
          <div className="faq-item">
            <h3>Is there a money-back guarantee?</h3>
            <p>Yes! 30-day money-back guarantee on all paid plans.</p>
          </div>
          <div className="faq-item">
            <h3>Can I upgrade or downgrade?</h3>
            <p>Absolutely! Change plans anytime to fit your needs.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pricing-cta">
        <h2>Ready to transform your credit?</h2>
        <p>Join thousands of users building better credit with 3B Credit Builder</p>
        <Link href="/register" className="cta-button">
          Get Started Today
        </Link>
      </div>
    </div>
  );
}
