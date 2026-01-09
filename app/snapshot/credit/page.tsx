'use client';

import { useEffect } from 'react';

export default function CreditSnapshotPage() {
  useEffect(() => {
    // Immediately redirect to MFSN Credit Snapshot
    window.location.href = 'https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default';
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <p className="text-white text-xl mb-4">Redirecting to Credit Snapshot...</p>
        <p className="text-gray-400">If you are not redirected automatically, <a href="https://myfreescorenow.com/en/creditsnapshot/user/register/6153?source=default" className="text-purple-400 underline">click here</a>.</p>
      </div>
    </div>
  );
}
