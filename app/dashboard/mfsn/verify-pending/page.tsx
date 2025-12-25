export default function MFSNVerifyPendingPage() {
  return (
    <main className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
      <div className="max-w-lg">
        <nav className="mb-6 text-sm text-slate-500 text-center">
          <a href="/dashboard" className="hover:text-cyan-400">Dashboard</a>
          <span className="mx-2">/</span>
          <span className="text-slate-300">Verification Pending</span>
        </nav>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h1 className="text-2xl font-black">Check Your Email</h1>
          <p className="text-slate-300 mt-3">
            We've sent a secure verification link to your email via MyFreeScoreNow.
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            Once you complete verification, your credit Snapshot will appear in your 3B Credit Builder dashboard.
          </p>

          <a
            href="/dashboard"
            className="inline-flex mt-8 rounded-full border border-slate-700 bg-slate-950 px-6 py-3 font-semibold text-slate-200 hover:border-cyan-500/50"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
