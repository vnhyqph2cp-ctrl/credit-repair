// components/PublicHeader.tsx
import Link from "next/link";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-black/90 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/">
          <img
            src="/brand/logo.png"
            alt="3B Credit Builder"
            className="h-14 w-auto hover:scale-105 transition-transform"
          />
        </Link>
        <nav className="flex items-center gap-8">
          <Link href="/about" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition">
            Pricing
          </Link>
          <Link href="/snapshot" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition">
            Free Snapshot
          </Link>
          <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition">
            Login
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-7 py-3 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
