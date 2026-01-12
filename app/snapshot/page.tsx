"use client";

import Image from "next/image";
import Link from "next/link";

export default function SnapshotPage() {
  return (
    <div className="relative min-h-screen bg-black">
      <Image
        src="/backgrounds/SnapShot_page.webp"
        alt="Snapshot"
        fill
        priority
        className="object-cover opacity-60"
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <SnapshotCard
          href="/snapshot/credit"
          title="Credit Snapshot"
          headline="FREE Credit Report"
          color="pink"
        />
        <SnapshotCard
          href="/snapshot/funding"
          title="Funding Snapshot"
          headline="Up to $750,000"
          color="green"
        />
      </div>
    </div>
  );
}

function SnapshotCard({
  href,
  title,
  headline,
  color,
}: {
  href: string;
  title: string;
  headline: string;
  color: "pink" | "green";
}) {
  return (
    <Link
      href={href}
      className={`flex-1 flex items-center justify-center transition hover:bg-${color}-900/20`}
    >
      <div className="text-center">
        <h1 className="text-6xl font-black">{title}</h1>
        <p className="mt-6 text-3xl font-bold">{headline}</p>
        <div className="mt-10 btn btn-primary">Get Started</div>
      </div>
    </Link>
  );
}
