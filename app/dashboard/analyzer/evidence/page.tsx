import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import MailEvidenceUpload from './components/MailEvidenceUpload';
import EvidenceGallery from './components/EvidenceGallery';

export default async function EvidencePage(props: {
  searchParams: Promise<{ item?: string }>;
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();

  const itemId = searchParams.item ? parseInt(searchParams.item) : null;

  if (!itemId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Mail Evidence</h1>
        <p className="text-gray-400">Select an analyzer item to manage evidence.</p>
      </div>
    );
  }

  // Fetch analyzer item
  const { data: analyzerItem } = await supabase
    .from('analyzer_items')
    .select('*')
    .eq('id', itemId)
    .single();

  // Fetch all mail evidence for this item
  const { data: mailEvidence } = await supabase
    .from('mail_evidence')
    .select('*')
    .eq('analyzer_item_id', itemId)
    .order('received_date', { ascending: false });

  if (!analyzerItem) {
    return <div className="p-6">Analyzer item not found.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Mail Evidence Tracker</h1>
        <div className="text-sm text-gray-400">
          <div className="mb-1">
            <span className="font-semibold">Account:</span> {analyzerItem.account_name}
          </div>
          <div>
            <span className="font-semibold">Account #:</span> {analyzerItem.account_number}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/30 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-1">Round</div>
            <div className="text-xl font-bold text-teal-400">
              {analyzerItem.round_number || 1}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Mail Received</div>
            <div className="text-xl font-bold text-white">
              {mailEvidence?.length || 0}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Days Since Action</div>
            <div className={`text-xl font-bold ${
              (analyzerItem.days_since_last_action || 0) >= 31 
                ? 'text-red-500' 
                : (analyzerItem.days_since_last_action || 0) >= 25
                ? 'text-yellow-500'
                : 'text-white'
            }`}>
              {analyzerItem.days_since_last_action || 0}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Violation</div>
            <div className={`text-xl font-bold ${
              analyzerItem.procedural_violation ? 'text-red-500' : 'text-gray-500'
            }`}>
              {analyzerItem.procedural_violation ? 'YES' : 'NO'}
            </div>
          </div>
        </div>
      </div>

      {/* Next Action */}
      {analyzerItem.next_action && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="text-xs text-gray-400 mb-1">System Next Action</div>
          <div className="text-white font-medium">{analyzerItem.next_action}</div>
        </div>
      )}

      {/* Upload New Evidence */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Upload Mail Evidence</h2>
        <MailEvidenceUpload analyzerItemId={itemId} />
      </div>

      {/* Evidence Gallery */}
      <div>
        <h2 className="text-xl font-bold mb-4">Evidence History</h2>
        <EvidenceGallery evidence={mailEvidence || []} />
      </div>
    </div>
  );
}
