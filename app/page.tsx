'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Lead } from '@/lib/types';
import { LeadCard } from '@/components/LeadCard';
import { LeadModal } from '@/components/LeadModal';
import { AddLeadModal } from '@/components/AddLeadModal';
import { orchestrator } from '@/lib/orchestrator';
import { Plus, Filter, TrendingUp, Phone, CheckCircle, XCircle } from 'lucide-react';

export default function Home() {
  const { leads, addLead, updateLead } = useStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Lead['status'] | 'ALL'>('ALL');

  const filteredLeads = filterStatus === 'ALL'
    ? leads
    : leads.filter(lead => lead.status === filterStatus);

  const stats = {
    total: leads.length,
    active: leads.filter(l => ['NEW', 'QUALIFYING', 'ANALYZING', 'NEGOTIATING'].includes(l.status)).length,
    locked: leads.filter(l => l.status === 'LOCKED').length,
    closed: leads.filter(l => l.status === 'CLOSED').length,
    dead: leads.filter(l => l.status === 'DEAD').length,
  };

  const handleAddLead = (lead: Lead) => {
    addLead(lead);
    // Auto-process the lead
    setTimeout(() => {
      orchestrator.processLead(lead, updateLead);
    }, 100);
  };

  const handleUpdateLead = (id: string, updates: Partial<Lead>) => {
    updateLead(id, updates);
    // Re-process after updates
    const updatedLead = leads.find(l => l.id === id);
    if (updatedLead) {
      setTimeout(() => {
        orchestrator.processLead({ ...updatedLead, ...updates }, updateLead);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Real Estate Wholesaling System
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Advanced Multi-Agent Deal Acquisition Platform
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus className="w-5 h-5" />
              Add Lead
            </button>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Active</p>
                <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
              </div>
              <Phone className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Locked</p>
                <p className="text-3xl font-bold text-green-600">{stats.locked}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Closed</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.closed}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 uppercase">Dead</p>
                <p className="text-3xl font-bold text-gray-600">{stats.dead}</p>
              </div>
              <XCircle className="w-10 h-10 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            {['ALL', 'NEW', 'QUALIFYING', 'ANALYZING', 'NEGOTIATING', 'LOCKED', 'FOLLOW_UP', 'DEAD', 'CLOSED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Leads Grid */}
        {filteredLeads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No leads found. Add your first lead to get started!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Lead
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelectedLead(lead)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedLead && (
        <LeadModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
        />
      )}

      {showAddModal && (
        <AddLeadModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddLead}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p className="font-semibold mb-2">Multi-Agent Wholesaling System</p>
            <p className="text-xs">
              Autonomous lead qualification • Deal analysis • Negotiation • Follow-up management • Buyer matching
            </p>
            <p className="text-xs mt-2 text-gray-500">
              All automated communication begins with: "This is an automated assistant calling on behalf of a real estate investment group."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
