export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        <h1 className="text-5xl font-bold neon-text mb-12 text-center">
          About 3B Credit Builder
        </h1>

        <div className="space-y-8">
          
          <section className="glass-card p-8">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              What This Is
            </h2>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p>
                <strong className="text-white">3B Credit Builder is a compliance enforcement system</strong> — 
                not credit repair software.
              </p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>We don't guess.</li>
                <li>We don't send generic disputes.</li>
                <li>We don't compensate for bureau mistakes.</li>
              </ul>
              <p>
                We <strong className="text-cyan-400">enforce accurate reporting</strong> using evidence, 
                timelines, and federal standards.
              </p>
            </div>
          </section>

          <section className="glass-card p-8">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              How It Works (Plain English)
            </h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-cyan-400 pl-6">
                <h3 className="text-xl font-bold mb-2">Step 1 – Snapshot (Optional Preview)</h3>
                <p className="text-gray-300">A free preview to show what the system sees.</p>
              </div>

              <div className="border-l-4 border-purple-400 pl-6">
                <h3 className="text-xl font-bold mb-2">Step 2 – Epic Credit Report (via MyFreeScoreNow)</h3>
                <p className="text-gray-300">Your full, authoritative credit file from all three bureaus.</p>
              </div>

              <div className="border-l-4 border-pink-400 pl-6">
                <h3 className="text-xl font-bold mb-2">Step 3 – Analyzer Engine</h3>
                <p className="text-gray-300 mb-3">AI reviews your Epic Report and builds:</p>
                <ul className="text-gray-300 space-y-1 ml-4 list-disc">
                  <li>Dispute candidates</li>
                  <li>Procedural violations</li>
                  <li>Enforcement timelines</li>
                  <li>Action plans</li>
                </ul>
              </div>

              <div className="border-l-4 border-green-400 pl-6">
                <h3 className="text-xl font-bold mb-2">Step 4 – Projects & Enforcement</h3>
                <p className="text-gray-300">
                  Each dispute becomes a project you can track from open → resolved.
                </p>
              </div>
            </div>
          </section>

          <section className="glass-card p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-2 border-cyan-400/30">
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">
              Why This Is Different
            </h2>
            <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
              <p><strong className="text-white">Credit bureaus already know the law.</strong></p>
              <p>We don't teach them — we hold them accountable.</p>
              <p className="mb-3">This system exists to:</p>
              <ul className="space-y-2 ml-6 list-disc">
                <li>Detect inaccuracies</li>
                <li>Enforce deadlines</li>
                <li>Document violations</li>
                <li>Track outcomes</li>
              </ul>
            </div>
          </section>

          <section className="glass-card p-6 text-center">
            <p className="text-gray-400">
              Powered by <strong className="text-cyan-400">MyFreeScoreNow</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
