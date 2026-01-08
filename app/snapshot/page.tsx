import { createServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function SnapshotPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    redirect('/dashboard/analyzer');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold neon-text mb-4">
            Free Credit Snapshot (Preview Only)
          </h1>
          <p className="text-xl text-gray-300">
            Get a high-level preview of your credit — not a full report, not monitoring, and not analysis.
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <p className="text-gray-300 text-lg leading-relaxed mb-6">
            This Snapshot is a one-time preview designed to show what the system can see — 
            not everything it will see.
          </p>
          <p className="text-gray-300 text-lg leading-relaxed">
            To access your <strong className="text-cyan-400">Epic Credit Report</strong> (full 
            Equifax, Experian, and TransUnion data) and unlock AI analysis, you'll need to 
            continue through MyFreeScoreNow.
          </p>
        </div>

        {/* SnapshotForm would go here */}

        <div className="glass-card p-8 mt-12 border-2 border-cyan-400/30">
          <h2 className="text-2xl font-bold neon-text mb-4">
            Ready for Your Full Epic Credit Report?
          </h2>
          <p className="text-gray-300 mb-6">
            Unlock complete bureau data and AI-powered analysis
          </p>
          
          <a
            href="https://member.myfreescorenow.com/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg font-bold text-lg hover:scale-105 transition-transform"
          >
            Continue to Full Epic Credit Report – $29.90
          </a>
        </div>

        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            <strong>Important:</strong> Snapshot data is not stored or reused after signup. 
            Full analysis requires an Epic Credit Report.
          </p>
        </div>

      </div>
    </div>
  );
}
