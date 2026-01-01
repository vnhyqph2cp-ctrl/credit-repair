export default function FreePreview() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Get a Free Credit Preview
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Get a quick snapshot of your credit without requiring credit monitoring or a credit card.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  )
}
