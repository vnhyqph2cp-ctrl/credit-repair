import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="container py-16">
      <h1 className="text-4xl font-bold mb-3">Join 3B Credit Builder</h1>
      <p className="opacity-70 max-w-2xl mb-10">
        Choose a plan, unlock the full system, and start executing.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface p-6 rounded-xl">
          <div className="text-xl font-semibold mb-2">Basic</div>
          <div className="opacity-70 mb-4">Core tools + tracking</div>
          <button className="btn btn-large glow-soft btn-3d w-full">Select</button>
        </div>

        <div className="surface p-6 rounded-xl border border-teal-400/30">
          <div className="text-xl font-semibold mb-2">Pro</div>
          <div className="opacity-70 mb-4">Automation + enforcement</div>
          <button className="btn btn-large glow-neon btn-3d w-full">Select</button>
        </div>

        <div className="surface p-6 rounded-xl">
          <div className="text-xl font-semibold mb-2">Elite</div>
          <div className="opacity-70 mb-4">Everything + priority</div>
          <button className="btn btn-large glow-soft btn-3d w-full">Select</button>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/login" className="opacity-80 underline">
          Already a member? Login
        </Link>
      </div>
    </main>
  );
}
