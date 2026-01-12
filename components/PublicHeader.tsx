// components/PublicHeader.tsx
import Link from "next/link";
import Image from "next/image";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-black/90 backdrop-blur-xl shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" aria-label="3B Credit Builder home">
          <Image
            src="/brand/logo.png"
            alt="3B Credit Builder"
            width={140}
            height={56}
            priority
            className="h-14 w-auto hover:scale-105 transition-transform"
          />
        </Link>

        {/* Public navigation */}
        <nav className="flex items-center gap-8">
          <Link
            href="/about"
            className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition"
          >
            About
          </Link>

          <Link
            href="/pricing"
            className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition"
          >
            Pricing
          </Link>

          <Link
            href="/snapshot"
            className="text-sm font-semibold text-slate-300 hover:text-cyan-400 transition"
          >
            Free Snapshot
          </Link>

          <Link
            href="/login"
            className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-6 py-2.5 text-sm font-bold text-black shadow-lg hover:scale-105 transition-all"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
