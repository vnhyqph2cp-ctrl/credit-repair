'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/browser';

export default function MailEvidenceUpload({ analyzerItemId }: { analyzerItemId: number }) {
  const [uploading, setUploading] = useState(false);
  const [bureau, setBureau] = useState<'equifax' | 'experian' | 'transunion'>('equifax');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const supabase = createClient();
      
      // Upload envelope
      const envelopeFile = formData.get('envelope') as File;
      const envelopePath = `mail-evidence/${analyzerItemId}/envelope-${Date.now()}.${envelopeFile.name.split('.').pop()}`;
      
      const { error: envelopeError } = await supabase.storage
        .from('evidence')
        .upload(envelopePath, envelopeFile);
      
      if (envelopeError) throw envelopeError;

      // Upload documents
      const documentFiles = formData.getAll('documents') as File[];
      const documentPaths: string[] = [];
      
      for (let i = 0; i < documentFiles.length; i++) {
        const file = documentFiles[i];
        const path = `mail-evidence/${analyzerItemId}/doc-${i}-${Date.now()}.${file.name.split('.').pop()}`;
        const { error: docError } = await supabase.storage
          .from('evidence')
          .upload(path, file);
        
        if (docError) throw docError;
        documentPaths.push(path);
      }

      // Create mail evidence record
      const response = await fetch('/api/enforcement/mail-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analyzerItemId,
          bureau,
          receivedDate: formData.get('received_date'),
          envelopePath,
          documentPaths,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save mail evidence');
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Bureau Selection */}
      <div>
        <label htmlFor="bureau" className="block text-sm font-medium mb-2">Bureau</label>
        <select
          id="bureau"
          value={bureau}
          onChange={(e) => setBureau(e.target.value as any)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        >
          <option value="equifax">Equifax</option>
          <option value="experian">Experian</option>
          <option value="transunion">TransUnion</option>
        </select>
      </div>

      {/* Received Date */}
      <div>
        <label htmlFor="received_date" className="block text-sm font-medium mb-2">Date Received</label>
        <input
          id="received_date"
          type="date"
          name="received_date"
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
      </div>

      {/* Envelope Image */}
      <div>
        <label htmlFor="envelope" className="block text-sm font-medium mb-2">Envelope Photo</label>
        <input
          id="envelope"
          type="file"
          name="envelope"
          accept="image/*"
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <p className="text-xs text-gray-400 mt-1">
          📸 Include postmark date for deadline tracking
        </p>
      </div>

      {/* Document Images */}
      <div>
        <label htmlFor="documents" className="block text-sm font-medium mb-2">Letter/Document Photos</label>
        <input
          id="documents"
          type="file"
          name="documents"
          accept="image/*"
          multiple
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
        />
        <p className="text-xs text-gray-400 mt-1">
          📄 Upload all pages of the response
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {uploading ? 'Processing...' : 'Upload & Classify'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        System will automatically classify mail and detect violations
      </p>
    </form>
  );
}
