import Link from "next/link";

export default function SnapshotPage() {
  return (
    <main className="container py-16">
      <h1 className="text-4xl font-bold mb-3">Free Credit Snapshot</h1>
      <p className="opacity-70 max-w-2xl mb-10">
        Start here. Get a quick analysis and a clear next step.
      </p>

      <div className="surface p-6 rounded-xl mb-8">
        <div className="text-sm opacity-70 mb-2">Step 1</div>
        <div className="text-xl font-semibold mb-2">Connect your credit data</div>
        <div className="opacity-70">
          (This is where we’ll plug into your existing flow / provider.)
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Link href="/signup" className="btn btn-large glow-neon btn-3d">
          Continue to Join 3B
        </Link>
        <Link href="/" className="btn btn-large glow-soft btn-3d">
          Back to Home
        </Link>
      </div>
    </main>
  );
}
