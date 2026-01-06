import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DisputesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login"); // MFSN login

  // ─────────────────────────────────────────────
  // Epic Credit Report (3-Bureau Full File)
  // NOTE: Stored in "Snapshot" table (legacy naming)
  // IMPORTANT: Snapshot (public /snapshot) is lead-gen ONLY.
  // Dashboard report pull must happen via /dashboard/mfsn.
  // ─────────────────────────────────────────────
  const { data: snapshot } = await supabase
    .from("Snapshot") // legacy table name
    .select("status, scoreAvg, scoreEQ, scoreEX, scoreTU, createdAt")
    .eq("customerId", user.id)
    .order("createdAt", { ascending: false })
    .limit(1)
    .maybeSingle();

  const hasEpicReport = snapshot?.status === "ready";
  const avgScore = snapshot?.scoreAvg ?? 0;

  // ─── Analyzer / Action Plan ───
  const { data: plan } = await supabase.rpc("resolve_dispute_profile", {
    p_user_id: user.id,
  });

  const hasAnalyzer = Array.isArray(plan) && plan.length > 0;

  // ─── Progress Logic ───
  // 20% = logged in but no report
  // 45% = report ready but no analyzer
  // 70% = analyzer exists, action plan next
  const progress = !hasEpicReport ? 20 : !hasAnalyzer ? 45 : 70;

  // ─── Next step (NO /snapshot in dashboard) ───
  const nextStep = !hasEpicReport
    ? { label: "Connect MFSN & Pull Epic Report", href: "/dashboard/mfsn" }
    : !hasAnalyzer
    ? { label: "Run Analyzer", href: "/dashboard/analyzer" }
    : { label: "View Action Plan", href: "/dashboard/action-plan" };

  // ─── Where “Credit Overview / View Report” should go ───
  // If you later add a dedicated report viewer page, swap this to that route.
  const reportHref = hasEpicReport ? "/dashboard/mfsn" : "/dashboard/mfsn";

  return (
    <main className="dispute-center">
      {/* HERO HEADER */}
      <div className="dispute-header">
        <div className="header-content">
          <div className="header-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>BUILD PHASE · {progress}%</span>
          </div>

          <h1 className="page-title">Dispute Center</h1>
          <p className="page-subtitle">
            Manage dispute rounds, track bureau responses, and monitor cleanup progress
          </p>
        </div>

        {hasEpicReport && (
          <div className="header-stats-row">
            <div className="mini-stat">
              <div className="mini-stat-label">EQ</div>
              <div className="mini-stat-value">{snapshot?.scoreEQ || "—"}</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">EX</div>
              <div className="mini-stat-value">{snapshot?.scoreEX || "—"}</div>
            </div>
            <div className="mini-stat">
              <div className="mini-stat-label">TU</div>
              <div className="mini-stat-value">{snapshot?.scoreTU || "—"}</div>
            </div>
          </div>
        )}
      </div>

      {/* STATUS OVERVIEW */}
      <section className="status-grid">
        <div className="status-card highlight">
          <div className="status-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 3v18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 9l-5 5-3-3-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="status-content">
            <h3 className="status-title">Credit Overview</h3>
            <div className="status-value">{avgScore > 0 ? avgScore : "—"}</div>
            <p className="status-description">Average credit score</p>
          </div>

          {/* ✅ NO /snapshot HERE */}
          <Link href={reportHref} className="status-action">
            <span>{hasEpicReport ? "View Epic Report" : "Connect MFSN"}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="status-card">
          <div className="status-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M13 2L3 14h8l-2 8 10-12h-8l2-8z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="status-content">
            <h3 className="status-title">Analyzer Status</h3>
            <div className="status-value">{hasAnalyzer ? "Complete" : "Pending"}</div>
            <p className="status-description">Profile analysis & prioritization</p>
          </div>
          <Link href="/dashboard/analyzer" className="status-action">
            <span>{hasAnalyzer ? "View Plan" : "Run Analyzer"}</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="status-card accent">
          <div className="status-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="status-content">
            <h3 className="status-title">Next Action</h3>
            <div className="status-value-sm">{nextStep.label}</div>
            <p className="status-description">Recommended next step</p>
          </div>
          <Link href={nextStep.href} className="status-action">
            <span>Take Action</span>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* DISPUTE TOOLS */}
      <section className="tools-section">
        <div className="section-header">
          <h2 className="section-title">Dispute Tools</h2>
          <p className="section-subtitle">
            Use these tools only when your Analyzer / Action Plan recommends disputes.
          </p>
        </div>

        <div className="tools-grid">
          <div className="tool-card featured">
            <div className="tool-header">
              <div className="tool-icon-large">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="tool-badge">Active</span>
            </div>
            <h3 className="tool-title">Dispute Rounds</h3>
            <p className="tool-description">
              Track dispute rounds and bureau response timelines.
            </p>

            <Link
              href={hasAnalyzer ? "/dashboard/disputes/generate" : "/dashboard/analyzer"}
              className="tool-button primary"
            >
              <span>{hasAnalyzer ? "View Rounds" : "Run Analyzer First"}</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="tool-card">
            <div className="tool-header">
              <div className="tool-icon-large">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h3 className="tool-title">Letter Templates</h3>
            <p className="tool-description">
              AI-assisted dispute templates customized to your profile.
            </p>

            <Link
              href={hasAnalyzer ? "/dashboard/disputes/generate" : "/dashboard/analyzer"}
              className="tool-button"
            >
              <span>{hasAnalyzer ? "Browse Templates" : "Run Analyzer First"}</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="tool-card">
            <div className="tool-header">
              <div className="tool-icon-large">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22 11.08V12a10 10 0 11-5.93-9.14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 4L12 14.01l-3-3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            <h3 className="tool-title">Dispute Outcomes</h3>
            <p className="tool-description">
              Track deletions, responses, and success rates.
            </p>

            <Link
              href={hasAnalyzer ? "/dashboard/disputes/outcomes" : "/dashboard/analyzer"}
              className="tool-button"
            >
              <span>{hasAnalyzer ? "View Outcomes" : "Run Analyzer First"}</span>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions">
        <div className="action-tile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M12 16v-4M12 8h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div className="action-content">
            <h4 className="action-title">Need Help?</h4>
            <p className="action-text">Learn best practices and compliance guidelines</p>
          </div>
          <Link href="/dashboard/action-plan" className="action-link">
            Learn More
          </Link>
        </div>

        <div className="action-tile">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="action-content">
            <h4 className="action-title">Track Evidence</h4>
            <p className="action-text">Upload proof documents for disputes</p>
          </div>
          <Link href="/dashboard/analyzer/evidence" className="action-link">
            Manage
          </Link>
        </div>
      </section>

      {/* FOOTNOTE */}
      <div className="disclaimer">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 16v-4M12 8h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <p>
          Dispute management is only recommended when inaccurate items appear on your report.
          Always verify accuracy before submitting disputes.
        </p>
      </div>
    </main>
  );
}
