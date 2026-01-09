import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden min-h-screen bg-black flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/backgrounds/Main-Landing.webp"
        alt="3B Credit Builder"
        fill
        priority
        className="object-cover"
        quality={75}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 z-10" />
      
      {/* Responsive Button Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto aspect-[16/9] flex items-center justify-center">
        {/* FREE SNAPSHOT - moved inward more */}
        <Link 
          href="/snapshot" 
          className="absolute top-[43%] left-[16%] w-[19.5%] h-[11%] rounded-[3rem] bg-gradient-to-r from-red-600/50 to-pink-600/50 hover:from-red-500/70 hover:to-pink-500/70 backdrop-blur-md border-4 border-red-400/80 hover:border-red-200 transition-all duration-300 cursor-pointer shadow-[0_0_80px_rgba(239,68,68,0.9)] hover:shadow-[0_0_120px_rgba(239,68,68,1)] hover:scale-105 active:scale-95"
          aria-label="Start Free Snapshot"
        />
        
        {/* SIGN UP NOW - moved inward more */}
        <Link 
          href="/signup" 
          className="absolute top-[43%] right-[16%] w-[19.5%] h-[11%] rounded-[3rem] bg-gradient-to-r from-teal-600/50 to-cyan-600/50 hover:from-teal-500/70 hover:to-cyan-500/70 backdrop-blur-md border-4 border-teal-400/80 hover:border-teal-200 transition-all duration-300 cursor-pointer shadow-[0_0_80px_rgba(20,184,166,0.9)] hover:shadow-[0_0_120px_rgba(20,184,166,1)] hover:scale-105 active:scale-95"
          aria-label="Sign Up Now"
        />
        
        {/* HOW MUCH - moved inward more + down */}
        <Link 
          href="/pricing" 
          className="absolute top-[64%] left-[16%] w-[19.5%] h-[11%] rounded-[3rem] bg-gradient-to-r from-purple-600/50 to-pink-600/50 hover:from-purple-500/70 hover:to-pink-500/70 backdrop-blur-md border-4 border-purple-400/80 hover:border-purple-200 transition-all duration-300 cursor-pointer shadow-[0_0_80px_rgba(168,85,247,0.9)] hover:shadow-[0_0_120px_rgba(168,85,247,1)] hover:scale-105 active:scale-95"
          aria-label="Calculate My Gains"
        />
        
        {/* TELL ME MORE - moved inward more + down */}
        <Link 
          href="/about" 
          className="absolute top-[64%] right-[16%] w-[19.5%] h-[11%] rounded-[3rem] bg-gradient-to-r from-teal-600/50 to-cyan-600/50 hover:from-teal-500/70 hover:to-cyan-500/70 backdrop-blur-md border-4 border-teal-400/80 hover:border-teal-200 transition-all duration-300 cursor-pointer shadow-[0_0_80px_rgba(20,184,166,0.9)] hover:shadow-[0_0_120px_rgba(20,184,166,1)] hover:scale-105 active:scale-95"
          aria-label="Learn More About 3B"
        />
        
        {/* MEMBER LOGIN - moved up 0.5% */}
        <Link 
          href="/login" 
          className="absolute bottom-[4.5%] left-1/2 -translate-x-1/2 w-[22%] h-[11%] rounded-[3rem] bg-gradient-to-r from-purple-700/50 to-indigo-700/50 hover:from-purple-600/70 hover:to-indigo-600/70 backdrop-blur-md border-4 border-purple-400/80 hover:border-purple-200 transition-all duration-300 cursor-pointer shadow-[0_0_80px_rgba(99,102,241,0.9)] hover:shadow-[0_0_120px_rgba(99,102,241,1)] hover:scale-105 active:scale-95"
          aria-label="Member Login"
        />
      </div>
    </main>
  );
}
