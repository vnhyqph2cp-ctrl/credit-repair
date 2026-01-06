'use client';

interface MailEvidence {
  id: number;
  bureau: string;
  received_date: string;
  classification: string | null;
  procedural_violation: boolean;
  envelope_image_url: string;
  document_image_urls: string[];
  next_action: string | null;
  classified_at: string | null;
}

export default function EvidenceGallery({ evidence }: { evidence: MailEvidence[] }) {
  if (evidence.length === 0) {
    return (
      <div className="border border-dashed border-gray-700 rounded-lg p-12 text-center">
        <p className="text-gray-400">No mail evidence uploaded yet</p>
        <p className="text-sm text-gray-500 mt-2">
          Upload envelope and letter photos to start tracking responses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {evidence.map((item) => (
        <div
          key={item.id}
          className={`border rounded-lg p-4 ${
            item.procedural_violation
              ? 'border-red-500 bg-red-500/5'
              : 'border-gray-700 bg-gray-800/50'
          }`}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="font-semibold text-white mb-1">
                {item.bureau.toUpperCase()} Response
              </div>
              <div className="text-sm text-gray-400">
                Received: {new Date(item.received_date).toLocaleDateString()}
              </div>
            </div>
            {item.procedural_violation && (
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                VIOLATION
              </div>
            )}
          </div>

          {/* Classification */}
          {item.classification && (
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Classification</div>
              <div className="text-sm font-medium text-teal-400">
                {item.classification.replace(/_/g, ' ').toUpperCase()}
              </div>
            </div>
          )}

          {/* Next Action */}
          {item.next_action && (
            <div className="mb-3 bg-blue-500/10 border border-blue-500/30 rounded p-2">
              <div className="text-xs text-gray-400 mb-1">Next Action</div>
              <div className="text-sm text-white">{item.next_action}</div>
            </div>
          )}

          {/* Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="relative aspect-square bg-gray-900 rounded border border-gray-700 overflow-hidden group cursor-pointer">
              <img
                src={item.envelope_image_url}
                alt="Envelope"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-xs font-semibold">Envelope</span>
              </div>
            </div>
            {item.document_image_urls.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square bg-gray-900 rounded border border-gray-700 overflow-hidden group cursor-pointer"
              >
                <img
                  src={url}
                  alt={`Document page ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-semibold">Page {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Timestamp */}
          {item.classified_at && (
            <div className="text-xs text-gray-500 mt-3">
              Classified: {new Date(item.classified_at).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
