import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center space-y-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Get started
        </p>

        <h1 className="text-3xl font-semibold">
          Join 3B Credit Builder
        </h1>

        <p className="text-sm text-muted-foreground">
          Connect your credit monitoring, run the 3B Analyzer, and choose the
          level of support that fits your goals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/pricing"
            className="rounded-full bg-neon-teal px-6 py-3 font-semibold text-black hover:brightness-110"
          >
            View plans
          </Link>

          <Link
            href="/register"
            className="rounded-full border border-white/20 px-6 py-3 font-semibold hover:bg-white/5"
          >
            Create account
          </Link>
        </div>

        <p className="text-sm text-muted-foreground pt-6">
          Already a member?{" "}
          <Link href="/login" className="text-neon-teal hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
