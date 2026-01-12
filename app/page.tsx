import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      
      {/* Background Image */}
      <Image
        src="/backgrounds/Main-Landing.webp"
        alt="3B Credit Builder landing background"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        quality={75}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />

      {/* CTA Hit Zones */}
      <div className="relative z-20 w-full max-w-7xl mx-auto aspect-[16/9] min-h-[600px] flex items-center justify-center">

        {/* FREE SNAPSHOT */}
        <Link
          href="/snapshot"
          aria-label="Start free credit snapshot"
          className="absolute top-[43%] left-[16%] w-[19.5%] h-[11%] rounded-[3rem]
            bg-gradient-to-r from-red-600/50 to-pink-600/50
            backdrop-blur-md border-4 border-red-400/80
            shadow-[0_0_80px_rgba(239,68,68,0.9)]
            transition-all duration-300
            hover:from-red-500/70 hover:to-pink-500/70
            hover:border-red-200 hover:shadow-[0_0_120px_rgba(239,68,68,1)]
            hover:scale-105 active:scale-95
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-teal"
        >
          <span className="sr-only">Start Free Snapshot</span>
        </Link>

        {/* SIGN UP */}
        <Link
          href="/signup"
          aria-label="Sign up for 3B Credit Builder"
          className="absolute top-[43%] right-[16%] w-[19.5%] h-[11%] rounded-[3rem]
            bg-gradient-to-r from-teal-600/50 to-cyan-600/50
            backdrop-blur-md border-4 border-teal-400/80
            shadow-[0_0_80px_rgba(20,184,166,0.9)]
            transition-all duration-300
            hover:from-teal-500/70 hover:to-cyan-500/70
            hover:border-teal-200 hover:shadow-[0_0_120px_rgba(20,184,166,1)]
            hover:scale-105 active:scale-95
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-teal"
        >
          <span className="sr-only">Sign Up Now</span>
        </Link>

        {/* PRICING */}
        <Link
          href="/pricing"
          aria-label="View pricing"
          className="absolute top-[64%] left-[16%] w-[19.5%] h-[11%] rounded-[3rem]
            bg-gradient-to-r from-purple-600/50 to-pink-600/50
            backdrop-blur-md border-4 border-purple-400/80
            shadow-[0_0_80px_rgba(168,85,247,0.9)]
            transition-all duration-300
            hover:from-purple-500/70 hover:to-pink-500/70
            hover:border-purple-200 hover:shadow-[0_0_120px_rgba(168,85,247,1)]
            hover:scale-105 active:scale-95
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-teal"
        >
          <span className="sr-only">View Pricing</span>
        </Link>

        {/* ABOUT */}
        <Link
          href="/about"
          aria-label="Learn more about 3B Credit Builder"
          className="absolute top-[64%] right-[16%] w-[19.5%] h-[11%] rounded-[3rem]
            bg-gradient-to-r from-teal-600/50 to-cyan-600/50
            backdrop-blur-md border-4 border-teal-400/80
            shadow-[0_0_80px_rgba(20,184,166,0.9)]
            transition-all duration-300
            hover:from-teal-500/70 hover:to-cyan-500/70
            hover:border-teal-200 hover:shadow-[0_0_120px_rgba(20,184,166,1)]
            hover:scale-105 active:scale-95
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-teal"
        >
          <span className="sr-only">About 3B Credit Builder</span>
        </Link>

        {/* LOGIN */}
        <Link
          href="/login"
          aria-label="Member login"
          className="absolute bottom-[4.5%] left-1/2 -translate-x-1/2 w-[22%] h-[11%] rounded-[3rem]
            bg-gradient-to-r from-purple-700/50 to-indigo-700/50
            backdrop-blur-md border-4 border-purple-400/80
            shadow-[0_0_80px_rgba(99,102,241,0.9)]
            transition-all duration-300
            hover:from-purple-600/70 hover:to-indigo-600/70
            hover:border-purple-200 hover:shadow-[0_0_120px_rgba(99,102,241,1)]
            hover:scale-105 active:scale-95
            cursor-pointer focus:outline-none focus:ring-2 focus:ring-neon-teal"
        >
          <span className="sr-only">Member Login</span>
        </Link>

      </div>
    </main>
  );
}
