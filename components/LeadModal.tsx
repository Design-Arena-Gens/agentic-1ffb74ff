'use client';

import { useState } from 'react';
import { Lead } from '@/lib/types';
import { X, Phone, MessageSquare, FileText } from 'lucide-react';
import { QualificationAgent } from '@/lib/agents/qualificationAgent';
import { NegotiationAgent } from '@/lib/agents/negotiationAgent';
import { FollowUpAgent } from '@/lib/agents/followUpAgent';
import { orchestrator } from '@/lib/orchestrator';

interface LeadModalProps {
  lead: Lead;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Lead>) => void;
}

export function LeadModal({ lead, onClose, onUpdate }: LeadModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'qualification' | 'negotiation' | 'followup'>('details');
  const [responses, setResponses] = useState<string[]>(['', '', '', '', '', '', '']);
  const [counterOffer, setCounterOffer] = useState('');

  const qualAgent = new QualificationAgent(lead);
  const negAgent = new NegotiationAgent(lead);
  const followUpAgent = new FollowUpAgent(lead);

  const handleQualificationSubmit = async () => {
    const updates = await orchestrator.automateQualificationCall(lead, responses);
    onUpdate(lead.id, { ...updates, status: 'ANALYZING' });
  };

  const handleNegotiationSubmit = async () => {
    const offer = counterOffer ? parseInt(counterOffer) : undefined;
    const result = await orchestrator.automateNegotiation(lead, offer);
    onUpdate(lead.id, result.updates);
    setCounterOffer('');
  };

  const handleGenerateFollowUp = () => {
    const messages = followUpAgent.generateFollowUpMessage(1);
    alert(`SMS: ${messages.sms}\n\nEmail: ${messages.email}\n\nCall Script: ${messages.call}`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{lead.address}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 font-semibold ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('qualification')}
            className={`px-6 py-3 font-semibold ${activeTab === 'qualification' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Qualification
          </button>
          <button
            onClick={() => setActiveTab('negotiation')}
            className={`px-6 py-3 font-semibold ${activeTab === 'negotiation' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Negotiation
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-6 py-3 font-semibold ${activeTab === 'followup' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
          >
            Follow-Up
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <p className="text-gray-900">{lead.ownerName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{lead.ownerPhone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <p className="text-gray-900">{lead.status}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Motivation</label>
                  <p className="text-gray-900">{lead.motivationLevel || 'Unknown'}</p>
                </div>
              </div>

              {lead.sellingReason && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Reason</label>
                  <p className="text-gray-900">{lead.sellingReason}</p>
                </div>
              )}

              {lead.propertyCondition && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Condition</label>
                  <p className="text-gray-900">{lead.propertyCondition}</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Financial Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Seller Price</p>
                    <p className="text-xl font-bold">${lead.sellerPrice?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ARV</p>
                    <p className="text-xl font-bold">${lead.arv?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Repairs</p>
                    <p className="text-xl font-bold">${lead.repairCost?.toLocaleString() || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">MAO</p>
                    <p className="text-xl font-bold text-blue-600">${lead.mao?.toLocaleString() || 'N/A'}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Deal Quality</p>
                  <p className={`text-lg font-bold ${
                    lead.dealQuality === 'EXCELLENT' ? 'text-green-600' :
                    lead.dealQuality === 'WORKABLE' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {lead.dealQuality || 'Not Analyzed'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'qualification' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Qualification Call Script</h3>
              {[
                "Confirm ownership",
                "Property for sale?",
                "Selling reason",
                "Timeline",
                "Expected price",
                "Property condition"
              ].map((question, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {index + 1}. {question}
                  </label>
                  <input
                    type="text"
                    value={responses[index + 1] || ''}
                    onChange={(e) => {
                      const newResponses = [...responses];
                      newResponses[index + 1] = e.target.value;
                      setResponses(newResponses);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter response..."
                  />
                </div>
              ))}
              <button
                onClick={handleQualificationSubmit}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Process Qualification
              </button>
            </div>
          )}

          {activeTab === 'negotiation' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Negotiation</h3>

              {lead.mao && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 mb-2">Initial Offer Recommendation</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${negAgent.generateOpeningOffer().toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Based on MAO of ${lead.mao.toLocaleString()}
                  </p>
                </div>
              )}

              {lead.negotiationHistory && lead.negotiationHistory.length > 0 && (
                <div className="space-y-3 mb-4">
                  <h4 className="font-semibold">Negotiation History</h4>
                  {lead.negotiationHistory.map((entry, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                      <p className="text-sm mt-1">{entry.message}</p>
                      {entry.offer && (
                        <p className="text-sm font-semibold mt-1 text-blue-600">
                          Offer: ${entry.offer.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Counter Offer
                </label>
                <input
                  type="number"
                  value={counterOffer}
                  onChange={(e) => setCounterOffer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter counter offer amount..."
                />
              </div>

              <button
                onClick={handleNegotiationSubmit}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Process Negotiation
              </button>
            </div>
          )}

          {activeTab === 'followup' && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg mb-4">Follow-Up Management</h3>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Next Follow-Up Scheduled</p>
                <p className="text-xl font-bold">
                  {lead.followUpScheduled
                    ? new Date(lead.followUpScheduled).toLocaleString()
                    : followUpAgent.scheduleFollowUp().toLocaleString()}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Follow-Up Priority</p>
                <p className="text-xl font-bold">{followUpAgent.getFollowUpPriority()} / 15</p>
              </div>

              <button
                onClick={handleGenerateFollowUp}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                Generate Follow-Up Messages
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
