import Link from "next/link";
import Image from "next/image";
import { CreditGauge } from "@/components/ui/CreditGauge";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      <Image
        src="/backgrounds/Main-Landing.webp"
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30 z-10" />
      
      <div className="relative z-20 landing-center py-28">
        <h1 className="landing-headline">
          Build Real Credit — Backed by Systems, Not Guesswork
        </h1>
        
        <p className="landing-subhead">
          3B Credit Builder enforces accurate reporting using automation,
          timelines, and compliance — not generic disputes.
        </p>

        <div className="landing-cta-row mt-10">
          <Link href="/snapshot" className="btn btn-large glow-neon btn-3d">
            Start Free Snapshot
          </Link>
          <Link href="/login" className="btn btn-large glow-soft btn-3d">
            Returning Member Login
          </Link>
        </div>

        <div className="mt-16 flex flex-col items-center gap-3">
          <CreditGauge value={742} label="3B System Score" />
        </div>
      </div>
    </main>
  );
}
