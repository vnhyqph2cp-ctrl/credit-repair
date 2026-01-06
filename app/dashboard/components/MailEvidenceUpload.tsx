/**
 * Mail Evidence Upload Component
 * 
 * Upload envelope + document images for chain of custody
 * Automatic classification with manual override option
 */

'use client';

import { useState } from 'react';
import { Upload, Camera, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

interface MailEvidenceUploadProps {
  analyzerItemId?: string;
  bureau: string;
  roundNumber: number;
  onEvidenceUploaded?: (evidence: any) => void;
}

export default function MailEvidenceUpload({
  analyzerItemId,
  bureau,
  roundNumber,
  onEvidenceUploaded
}: MailEvidenceUploadProps) {
  
  const [envelopeImage, setEnvelopeImage] = useState<File | null>(null);
  const [documentImages, setDocumentImages] = useState<File[]>([]);
  const [rawText, setRawText] = useState('');
  const [postmarkDate, setPostmarkDate] = useState('');
  const [receivedAt, setReceivedAt] = useState(new Date().toISOString().split('T')[0]);
  const [classificationNotes, setClassificationNotes] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [classification, setClassification] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleEnvelopeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEnvelopeImage(e.target.files[0]);
    }
  };
  
  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentImages(Array.from(e.target.files));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);
    
    try {
      // In production, upload images to storage first (S3, Supabase Storage, etc.)
      // For now, we'll just send the text content
      
      const payload = {
        analyzerItemId,
        rawText,
        bureau,
        roundNumber,
        receivedAt,
        postmarkDate: postmarkDate || undefined,
        classificationNotes: classificationNotes || undefined,
        // In production: add envelopeImageUrl and documentImageUrls after upload
      };
      
      const response = await fetch('/api/enforcement/mail-evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload evidence');
      }
      
      const result = await response.json();
      setClassification(result.evidence);
      
      if (onEvidenceUploaded) {
        onEvidenceUploaded(result.evidence);
      }
      
      // Reset form
      setEnvelopeImage(null);
      setDocumentImages([]);
      setRawText('');
      setPostmarkDate('');
      setClassificationNotes('');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold">Upload Mail Evidence</h2>
      </div>
      
      {classification && (
        <div className={`mb-6 p-4 rounded-lg ${
          classification.triggersViolation 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-start gap-3">
            {classification.triggersViolation ? (
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">
                {classification.triggersViolation ? 'Violation Detected' : 'Evidence Classified'}
              </p>
              <p className="text-sm mt-1">
                <strong>Classification:</strong> {classification.classification.replace(/_/g, ' ')}
              </p>
              {classification.violationType && (
                <p className="text-sm mt-1">
                  <strong>Violation Type:</strong> {classification.violationType.replace(/_/g, ' ')}
                </p>
              )}
              <p className="text-sm mt-1">
                <strong>Days from Dispute:</strong> {classification.daysFromDispute || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Envelope Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Envelope Photo (Postmark Proof)
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleEnvelopeUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {envelopeImage && (
            <p className="mt-2 text-sm text-gray-600">✓ {envelopeImage.name}</p>
          )}
        </div>
        
        {/* Document Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Document Pages
            </div>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleDocumentUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {documentImages.length > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              ✓ {documentImages.length} document(s) selected
            </p>
          )}
        </div>
        
        {/* Received Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Received
          </label>
          <input
            type="date"
            value={receivedAt}
            onChange={(e) => setReceivedAt(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        {/* Postmark Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Postmark Date (if visible)
          </label>
          <input
            type="date"
            value={postmarkDate}
            onChange={(e) => setPostmarkDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        {/* Raw Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Letter Content <span className="text-red-500">*</span>
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            required
            rows={8}
            placeholder="Paste or type the full text of the letter here..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Include all text from the letter. This will be analyzed for classification.
          </p>
        </div>
        
        {/* Classification Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={classificationNotes}
            onChange={(e) => setClassificationNotes(e.target.value)}
            rows={3}
            placeholder="Any observations about this letter..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || !rawText}
          className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold
            hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed
            transition-colors"
        >
          {uploading ? 'Analyzing Evidence...' : 'Submit Evidence'}
        </button>
      </form>
    </div>
  );
}
