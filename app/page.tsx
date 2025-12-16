export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-20 px-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6 text-center">
          AI Credit Dispute Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Upload your credit report. Get compliant dispute letters in minutes.
          No guarantees – suggestions only per federal law.
        </p>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <a
            href="https://bouncebackbrian.gohighlevel.com/your-form"
            className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xl py-6 px-8 rounded-2xl font-semibold text-center shadow-xl hover:shadow-2xl transition-all"
          >
            Start Free Analysis →
          </a>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg shadow-sm">✅ CROA Compliant</div>
            <div className="bg-white p-4 rounded-lg shadow-sm">✅ No Upfront Fees</div>
            <div className="bg-white p-4 rounded-lg shadow-sm">✅ 3‑Day Cancellation</div>
            <div className="bg-white p-4 rounded-lg shadow-sm">✅ Secure & Encrypted</div>
          </div>
        </div>
      </div>
    </div>
  );
}
