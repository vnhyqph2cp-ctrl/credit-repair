import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* Background Image */}
      <Image
        src="/backgrounds/Main-Landing.webp"
        alt="3B Credit Builder"
        fill
        priority
        className="object-cover"
        quality={90}
      />
      
      {/* Interactive Button Overlays */}
      <div className="relative z-20 w-full h-screen">
        {/* FREE SNAPSHOT */}
        <Link 
          href="/snapshot" 
          className="absolute top-[38%] left-[13%] px-10 py-4 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.8)] hover:scale-105 active:scale-95"
        >
          ✨ Start Free Snapshot
        </Link>
        
        {/* SIGN UP NOW */}
        <Link 
          href="/signup" 
          className="absolute top-[38%] right-[13%] px-10 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.8)] hover:scale-105 active:scale-95"
        >
          🚀 Sign Up Now
        </Link>
        
        {/* HOW MUCH */}
        <Link 
          href="/pricing" 
          className="absolute top-[63%] left-[13%] px-10 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-600 hover:via-pink-600 hover:to-purple-700 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:scale-105 active:scale-95"
        >
          💰 Calculate My Gains
        </Link>
        
        {/* TELL ME MORE */}
        <Link 
          href="/about" 
          className="absolute top-[63%] right-[13%] px-10 py-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-600 hover:via-cyan-600 hover:to-teal-700 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(20,184,166,0.5)] hover:shadow-[0_0_30px_rgba(20,184,166,0.8)] hover:scale-105 active:scale-95"
        >
          📖 Learn More
        </Link>
        
        {/* MEMBER LOGIN */}
        <Link 
          href="/login" 
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 px-12 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center text-white font-bold text-base shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] hover:scale-105 active:scale-95"
        >
          🔐 Member Login
        </Link>
      </div>

      {/* Scroll indicator (optional) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/50 text-xs">
        {/* Can add scroll down arrow if needed */}
      </div>
    </main>
  );
}
