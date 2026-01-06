import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Header */}
      <div className="about-header">
        <Link href="/" className="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Home
        </Link>
        <h1>Build Credit. Build Wealth. Build Better.</h1>
        <p>The complete credit optimization platform powered by AI</p>
      </div>

      {/* Hero Stats */}
      <div className="hero-stats">
        <div className="stat-box">
          <div className="stat-number">10,000+</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">127</div>
          <div className="stat-label">Avg. Point Increase</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">94%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Everything You Need to Master Your Credit</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3>3-Bureau Credit Reports</h3>
            <p>Complete access to Equifax, Experian, and TransUnion reports in one place. See exactly what lenders see.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3>AI-Powered Analyzer</h3>
            <p>Advanced machine learning analyzes your credit profile and identifies optimization opportunities automatically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <h3>Smart Dispute Letters</h3>
            <p>Generate legally-compliant dispute letters customized to your specific situation with AI assistance.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20v-6M6 20V10M18 20V4"/>
              </svg>
            </div>
            <h3>Progress Tracking</h3>
            <p>Visual dashboards show your credit improvement over time with detailed analytics and milestone celebrations.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h3>Document Vault</h3>
            <p>Secure storage for all your credit documents, dispute letters, and evidence in one encrypted location.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h3>Funding Readiness</h3>
            <p>Get qualified for business funding with our proven credit optimization and funding readiness tools.</p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Pull Your Credit</h3>
            <p>Get your complete 3-bureau credit report with detailed analysis in minutes.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI examines every line item and creates a personalized action plan.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Take Action</h3>
            <p>Follow step-by-step guidance to dispute errors and optimize your credit profile.</p>
          </div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Track Progress</h3>
            <p>Watch your score improve with real-time monitoring and milestone tracking.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>"Increased my credit score by 142 points in just 6 months. The AI analyzer found issues I never knew existed!"</p>
            <div className="author">- Sarah M.</div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>"Finally got approved for a business loan thanks to 3B. The dispute tools are incredibly powerful."</p>
            <div className="author">- Marcus T.</div>
          </div>
          <div className="testimonial-card">
            <div className="stars">★★★★★</div>
            <p>"Best investment I've made. The platform pays for itself with the money I save on interest rates."</p>
            <div className="author">- Jennifer L.</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="about-cta">
        <h2>Ready to Transform Your Credit?</h2>
        <p>Join thousands of users who have already improved their credit scores</p>
        <div className="cta-buttons">
          <Link href="/register" className="cta-button primary">
            Get Started Free
          </Link>
          <Link href="/pricing" className="cta-button secondary">
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
