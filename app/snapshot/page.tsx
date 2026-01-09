'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function SnapshotPage() {
  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
  <Image
    src="/backgrounds/SnapShot_page.webp"
    alt="Snapshot"
    fill
    priority
    className="object-cover opacity-60"
    quality={100}
  />
</div>


      {/* Split Screen Content */}
      <div className="relative z-10 flex min-h-screen">
        
        {/* LEFT - Credit Snapshot - PINK THEME */}
        <Link 
          href="/snapshot/credit" 
          className="group flex w-1/2 flex-col items-center justify-center border-r border-pink-500/30 px-8 transition-all hover:bg-pink-900/20"
        >
          <div className="text-center">
            {/* MASSIVE Bright Text with Glow */}
            <h1 className="mb-6 text-[180px] font-black leading-none text-pink-50" style={{textShadow: '0 0 100px rgba(236,72,153,1), 0 0 60px rgba(236,72,153,0.9), 0 0 40px rgba(236,72,153,0.7)'}}>
              Credit
            </h1>
            <h2 className="mb-16 text-[140px] font-black italic leading-none text-pink-100" style={{textShadow: '0 0 90px rgba(244,114,182,1), 0 0 50px rgba(244,114,182,0.9)'}}>
              Snapshot
            </h2>

            {/* Description */}
            <p className="mb-14 text-5xl font-extrabold uppercase tracking-widest text-pink-50" style={{textShadow: '0 0 40px rgba(236,72,153,0.9)'}}>
              FREE Credit Report
            </p>

            {/* Features */}
            <ul className="mb-16 space-y-5 text-left text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-pink-100" style={{textShadow: '0 0 30px rgba(236,72,153,1)'}}>✓</span>
                <span>Credit report analysis</span>
              </li>
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-pink-100" style={{textShadow: '0 0 30px rgba(236,72,153,1)'}}>✓</span>
                <span>Error identification</span>
              </li>
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-pink-100" style={{textShadow: '0 0 30px rgba(236,72,153,1)'}}>✓</span>
                <span>Action plan</span>
              </li>
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-pink-100" style={{textShadow: '0 0 30px rgba(236,72,153,1)'}}>✓</span>
                <span>No credit card</span>
              </li>
            </ul>

            {/* MASSIVE Pink Filled Button */}
            <button 
              className="rounded-full border-[8px] border-pink-400 bg-gradient-to-br from-pink-600 via-pink-500 to-pink-600 px-24 py-10 text-6xl font-black uppercase tracking-wider text-white shadow-[0_0_80px_rgba(236,72,153,1)] transition-all hover:scale-110 hover:from-pink-500 hover:to-pink-400 hover:shadow-[0_0_120px_rgba(236,72,153,1)]"
              style={{textShadow: '0 0 40px rgba(255,255,255,1), 0 4px 8px rgba(0,0,0,0.9)'}}
            >
              GET STARTED
            </button>
          </div>
        </Link>

        {/* RIGHT - Funding Snapshot - GREEN THEME */}
        <Link 
          href="/snapshot/funding" 
          className="group flex w-1/2 flex-col items-center justify-center border-l border-green-500/30 px-8 transition-all hover:bg-green-900/20"
        >
          <div className="text-center">
            {/* MASSIVE Bright Text with Glow */}
            <h1 className="mb-6 text-[180px] font-black leading-none text-green-50" style={{textShadow: '0 0 100px rgba(34,197,94,1), 0 0 60px rgba(34,197,94,0.9), 0 0 40px rgba(34,197,94,0.7)'}}>
              Funding
            </h1>
            <h2 className="mb-16 text-[140px] font-black italic leading-none text-green-100" style={{textShadow: '0 0 90px rgba(74,222,128,1), 0 0 50px rgba(74,222,128,0.9)'}}>
              Snapshot
            </h2>

            {/* Description */}
            <p className="mb-14 text-5xl font-extrabold uppercase tracking-widest text-green-50" style={{textShadow: '0 0 40px rgba(34,197,94,0.9)'}}>
              Up To $750,000
            </p>

            {/* Features */}
            <ul className="mb-16 space-y-5 text-left text-3xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-green-100" style={{textShadow: '0 0 30px rgba(34,197,94,1)'}}>✓</span>
                <span>Free eligibility report</span>
              </li>
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-green-100" style={{textShadow: '0 0 30px rgba(34,197,94,1)'}}>✓</span>
                <span>Funding analysis</span>
              </li>
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-green-100" style={{textShadow: '0 0 30px rgba(34,197,94,1)'}}>✓</span>
                <span>Multiple options</span>
              </li>
              <li className="flex items-center">
                <span className="mr-5 text-6xl text-green-100" style={{textShadow: '0 0 30px rgba(34,197,94,1)'}}>✓</span>
                <span>Won't impact credit</span>
              </li>
            </ul>

            {/* MASSIVE Green Filled Button */}
            <button 
              className="rounded-full border-[8px] border-green-400 bg-gradient-to-br from-green-600 via-green-500 to-green-600 px-24 py-10 text-6xl font-black uppercase tracking-wider text-white shadow-[0_0_80px_rgba(34,197,94,1)] transition-all hover:scale-110 hover:from-green-500 hover:to-green-400 hover:shadow-[0_0_120px_rgba(34,197,94,1)]"
              style={{textShadow: '0 0 40px rgba(255,255,255,1), 0 4px 8px rgba(0,0,0,0.9)'}}
            >
              GET STARTED
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
