import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AnalyzerPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // ─────────────────────────────────────────────
  // Epic Credit Report (3-Bureau Full File)
  // NOTE: Stored in "Snapshot" table (legacy naming)
  // Contains full 3B report payload + extracted scores
  // Source: MFSN /api/auth/3B/report.json
  // ─────────────────────────────────────────────
  const { data: snapshot } = await supabase
    .from("Snapshot") // legacy table name
    .select("id, status, createdAt, scoreEQ, scoreEX, scoreTU")
    .eq("customerId", user.id)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  // ❌ No Epic Report yet
  if (!snapshot) {
    return (
      <main className="analyzer-page">
        <div className="analyzer-hero">
          <div className="hero-icon locked">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h1 className="analyzer-title">Analyzer Locked</h1>
          <p className="analyzer-subtitle">
            You need to complete your Epic Credit Report before AI analysis can begin.
          </p>

          <div className="analyzer-actions">
            <Link href="/snapshot" className="btn-analyzer btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 9l-5 5-3-3-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Pull Epic Credit Report</span>
            </Link>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>3-Bureau Analysis</h3>
              <p>Complete data from Equifax, Experian, and TransUnion</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>AI-Powered</h3>
              <p>Smart detection of inaccuracies and dispute opportunities</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3>Action Plan</h3>
              <p>Clear step-by-step path to better credit</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ⏳ Report exists but not ready
  if (snapshot.status !== "ready") {
    return (
      <main className="analyzer-page">
        <div className="analyzer-hero">
          <div className="hero-icon processing">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="spinner">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
              <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h1 className="analyzer-title">Processing Your Report</h1>
          <p className="analyzer-subtitle">
            Your Epic Credit Report is being analyzed. This usually takes 2-3 minutes.
          </p>

          <div className="progress-steps">
            <div className="step completed">
              <div className="step-icon">✓</div>
              <div className="step-label">Report Pulled</div>
            </div>
            <div className="step active">
              <div className="step-icon">
                <div className="pulse-dot"></div>
              </div>
              <div className="step-label">AI Analysis</div>
            </div>
            <div className="step">
              <div className="step-icon">3</div>
              <div className="step-label">Generate Plan</div>
            </div>
          </div>

          <p className="text-muted-sm">We'll automatically unlock your results when ready</p>
        </div>
      </main>
    );
  }

  // ✅ Analyzer unlocked - show results dashboard
  const avgScore = Math.round(
    ((snapshot.scoreEQ || 0) + (snapshot.scoreEX || 0) + (snapshot.scoreTU || 0)) / 3
  );

  return (
    <main className="analyzer-page">
      <div className="analyzer-header">
        <div className="header-content">
          <h1 className="page-title">Credit Analyzer</h1>
          <p className="page-subtitle">AI-powered analysis of your 3-bureau credit report</p>
        </div>
        <div className="header-stats">
          <div className="stat-badge">
            <div className="stat-label">Average Score</div>
            <div className="stat-value">{avgScore}</div>
          </div>
        </div>
      </div>

      <div className="analyzer-grid">
        {/* Credit Scores */}
        <div className="analyzer-card score-card">
          <div className="card-header">
            <h2 className="card-title">Credit Scores</h2>
            <span className="badge badge-success">Current</span>
          </div>
          <div className="score-grid">
            <div className="score-item">
              <div className="bureau-name">Equifax</div>
              <div className="score-value">{snapshot.scoreEQ || "N/A"}</div>
            </div>
            <div className="score-item">
              <div className="bureau-name">Experian</div>
              <div className="score-value">{snapshot.scoreEX || "N/A"}</div>
            </div>
            <div className="score-item">
              <div className="bureau-name">TransUnion</div>
              <div className="score-value">{snapshot.scoreTU || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Run Analysis */}
        <div className="analyzer-card action-card">
          <div className="card-header">
            <h2 className="card-title">AI Analysis</h2>
            <span className="badge badge-info">Ready</span>
          </div>
          <p className="card-description">
            Run our AI engine to identify disputes, violations, and opportunities to boost your score.
          </p>
          <Link href="/dashboard/analyzer/run" className="btn-analyzer btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Run Analysis</span>
          </Link>
        </div>

        {/* Results */}
        <div className="analyzer-card results-card">
          <div className="card-header">
            <h2 className="card-title">Analysis Results</h2>
          </div>
          <Link href="/dashboard/analyzer/results" className="result-link">
            <div className="result-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="result-content">
              <div className="result-title">View Previous Results</div>
              <div className="result-subtitle">See your dispute suggestions and action items</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Action Plan */}
        <div className="analyzer-card action-plan-card">
          <div className="card-header">
            <h2 className="card-title">Action Plan</h2>
          </div>
          <Link href="/dashboard/action-plan" className="result-link">
            <div className="result-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="result-content">
              <div className="result-title">View Your Action Plan</div>
              <div className="result-subtitle">Personalized steps to improve your credit</div>
            </div>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </main>
  );
}

