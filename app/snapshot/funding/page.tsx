'use client';

import { useEffect } from 'react';

export default function FundingSnapshotPage() {
  useEffect(() => {
    // Immediately redirect to MFSN Funding Snapshot
    window.location.href = 'https://myfreescorenow.com/En/fundingSnapshot/User/Register/6153';
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Redirecting to Funding Snapshot...</p>
        <p className="text-gray-400">If you are not redirected automatically, <a href="https://myfreescorenow.com/En/fundingSnapshot/User/Register/6153" className="text-cyan-400 underline">click here</a>.</p>
      </div>
    </div>
  );
}

