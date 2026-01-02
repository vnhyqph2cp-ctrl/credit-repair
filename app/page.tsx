export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6">
      
      {/* HERO */}
      <section className="max-w-3xl text-center mt-24">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Build Better Credit With a Clear Plan — Not Guesswork
        </h1>

        <p className="mt-6 text-lg text-gray-300">
          Get a free credit preview or start full analysis if you're ready to move forward.
        </p>

        {/* CTA BLOCK */}
        <div className="mt-10 flex flex-col items-center gap-4">
          
          {/* PRIMARY CTA */}
          <a
            href="/start-analysis"
            className="w-full md:w-auto px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-lg text-center"
          >
            Start Full Credit Analysis
          </a>

          <p className="text-sm text-gray-400">
            Requires credit monitoring • Takes a few minutes
          </p>

          {/* SECONDARY CTA */}
          <a
            href="/free-preview"
            className="mt-4 text-blue-400 hover:text-blue-300 underline"
          >
            Get a Free Credit Preview
          </a>

          <p className="text-xs text-gray-500">
            No credit card • Optional
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-4xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div>
          <h3 className="font-semibold text-lg">Connect Credit Monitoring</h3>
          <p className="mt-2 text-gray-400">
            Secure, read-only access to your credit reports.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Analyze What's Hurting Your Credit</h3>
          <p className="mt-2 text-gray-400">
            No disputes or actions without your review.
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-lg">Choose How You Want to Fix It</h3>
          <p className="mt-2 text-gray-400">
            DIY templates → AI guidance → Advanced strategies.
          </p>
        </div>
      </section>

      {/* TRUST STRIP */}
      <footer className="mt-20 mb-10 text-sm text-gray-500">
        Secure • You stay in control • No pressure
      </footer>
    </main>
  );
}
