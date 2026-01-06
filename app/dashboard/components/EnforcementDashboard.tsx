/**
 * Enforcement Dashboard Component
 * 
 * Displays all analyzer items with enforcement status,
 * violations, deadlines, and next actions.
 * 
 * This is the command center for compliance enforcement.
 */

'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, CheckCircle, XCircle, FileText, TrendingUp } from 'lucide-react';
import MailEvidenceUpload from './MailEvidenceUpload';

interface AnalyzerItem {
  id: string;
  creditor: string;
  bureau: string;
  disputeReason: string;
  roundNumber: number;
  roundStatus: string;
  proceduralViolation: boolean;
  violationType: string | null;
  violationDetails: string | null;
  disputeFiledAt: string;
  responseDeadline: string;
  nextAction: string | null;
  enforcement: {
    daysFromDispute: number;
    daysUntilDeadline: number;
    isOverdue: boolean;
    urgency: 'critical' | 'high' | 'normal';
  };
  mailEvidence: any[];
}

export default function EnforcementDashboard() {
  
  const [items, setItems] = useState<AnalyzerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'violations' | 'overdue'>('all');
  const [selectedItem, setSelectedItem] = useState<AnalyzerItem | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  
  useEffect(() => {
    loadItems();
  }, [filter]);
  
  const loadItems = async () => {
    setLoading(true);
    try {
      let url = '/api/enforcement/analyzer-items';
      if (filter === 'violations') {
        url += '?violationsOnly=true';
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      let filteredItems = data.items || [];
      if (filter === 'overdue') {
        filteredItems = filteredItems.filter((item: AnalyzerItem) => item.enforcement.isOverdue);
      }
      
      setItems(filteredItems);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIOLATION_DETECTED': return 'bg-red-100 text-red-800 border-red-300';
      case 'STALLED': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'RESOLVED_DELETED': return 'bg-green-100 text-green-800 border-green-300';
      case 'IDENTITY_VERIFICATION': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'INVESTIGATION_PENDING': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const getUrgencyIndicator = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <Clock className="w-4 h-4 text-red-600 animate-pulse" />;
      case 'high': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          3B Enforcement Dashboard
        </h1>
        <p className="text-gray-600">
          Evidence-driven compliance enforcement — by the book, by the clock.
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Violations</p>
              <p className="text-2xl font-bold text-red-600">
                {items.filter(i => i.proceduralViolation).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-orange-600">
                {items.filter(i => i.enforcement.isOverdue).length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {items.filter(i => i.roundStatus.startsWith('RESOLVED_')).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md ${
            filter === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => setFilter('violations')}
          className={`px-4 py-2 rounded-md ${
            filter === 'violations' 
              ? 'bg-red-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Violations Only
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 rounded-md ${
            filter === 'overdue' 
              ? 'bg-orange-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300'
          }`}
        >
          Overdue
        </button>
      </div>
      
      {/* Items List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading enforcement data...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No items found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold">{item.creditor}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(item.roundStatus)}`}>
                      {item.roundStatus.replace(/_/g, ' ')}
                    </span>
                    {item.proceduralViolation && (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.disputeReason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{item.bureau}</p>
                  <p className="text-xs text-gray-500">Round {item.roundNumber}</p>
                </div>
              </div>
              
              {/* Enforcement Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  {getUrgencyIndicator(item.enforcement.urgency)}
                  <div>
                    <p className="text-xs text-gray-600">Days from Dispute</p>
                    <p className="font-semibold">{item.enforcement.daysFromDispute}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Days Until Deadline</p>
                  <p className={`font-semibold ${
                    item.enforcement.daysUntilDeadline < 0 ? 'text-red-600' :
                    item.enforcement.daysUntilDeadline <= 3 ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {item.enforcement.daysUntilDeadline < 0 
                      ? `${Math.abs(item.enforcement.daysUntilDeadline)} days overdue`
                      : `${item.enforcement.daysUntilDeadline} days`
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Evidence Count</p>
                  <p className="font-semibold">{item.mailEvidence?.length || 0}</p>
                </div>
              </div>
              
              {/* Violation Details */}
              {item.proceduralViolation && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm font-semibold text-red-800 mb-1">
                    Procedural Violation: {item.violationType?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-red-700">{item.violationDetails}</p>
                </div>
              )}
              
              {/* Next Action */}
              {item.nextAction && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm font-semibold text-blue-800 mb-1">Next Action:</p>
                  <p className="text-sm text-blue-700">{item.nextAction}</p>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowUpload(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Upload Evidence
                </button>
                <button
                  onClick={() => setSelectedItem(item)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Evidence Upload Modal */}
      {showUpload && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upload Mail Evidence</h2>
                <button
                  onClick={() => {
                    setShowUpload(false);
                    setSelectedItem(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {selectedItem.creditor} • {selectedItem.bureau} • Round {selectedItem.roundNumber}
              </p>
              <MailEvidenceUpload
                analyzerItemId={selectedItem.id}
                bureau={selectedItem.bureau}
                roundNumber={selectedItem.roundNumber}
                onEvidenceUploaded={() => {
                  setShowUpload(false);
                  setSelectedItem(null);
                  loadItems();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
