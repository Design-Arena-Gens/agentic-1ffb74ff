'use client';

import { Lead } from '@/lib/types';
import { Phone, Mail, Home, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'QUALIFYING': return 'bg-yellow-100 text-yellow-800';
      case 'ANALYZING': return 'bg-purple-100 text-purple-800';
      case 'NEGOTIATING': return 'bg-orange-100 text-orange-800';
      case 'LOCKED': return 'bg-green-100 text-green-800';
      case 'FOLLOW_UP': return 'bg-cyan-100 text-cyan-800';
      case 'DEAD': return 'bg-gray-100 text-gray-800';
      case 'CLOSED': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMotivationColor = (motivation?: Lead['motivationLevel']) => {
    switch (motivation) {
      case 'High': return 'text-red-600 font-bold';
      case 'Medium': return 'text-orange-600 font-semibold';
      case 'Low': return 'text-gray-600';
      default: return 'text-gray-400';
    }
  };

  const getDealQualityColor = (quality?: Lead['dealQuality']) => {
    switch (quality) {
      case 'EXCELLENT': return 'text-green-600 font-bold';
      case 'WORKABLE': return 'text-yellow-600 font-semibold';
      case 'DEAD': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{lead.address}</h3>
          <p className="text-sm text-gray-600">{lead.ownerName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
          {lead.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700">{lead.ownerPhone}</span>
        </div>
        {lead.ownerEmail && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{lead.ownerEmail}</span>
          </div>
        )}
      </div>

      {lead.motivationLevel && (
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase">Motivation: </span>
          <span className={`text-sm ${getMotivationColor(lead.motivationLevel)}`}>
            {lead.motivationLevel}
          </span>
        </div>
      )}

      {lead.dealQuality && (
        <div className="mb-3">
          <span className="text-xs text-gray-500 uppercase">Deal Quality: </span>
          <span className={`text-sm ${getDealQualityColor(lead.dealQuality)}`}>
            {lead.dealQuality}
          </span>
        </div>
      )}

      {lead.sellerPrice && lead.mao && (
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Seller Price</p>
            <p className="text-lg font-bold text-gray-900">
              ${lead.sellerPrice.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">MAO</p>
            <p className="text-lg font-bold text-blue-600">
              ${lead.mao.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {lead.arv && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">ARV</p>
              <p className="text-sm font-semibold">${lead.arv.toLocaleString()}</p>
            </div>
          </div>
          {lead.repairCost && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Repairs</p>
                <p className="text-sm font-semibold">${lead.repairCost.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {lead.nextAction && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Next Action</p>
              <p className="text-sm text-gray-700">{lead.nextAction}</p>
            </div>
          </div>
        </div>
      )}

      {lead.confidenceLevel !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Confidence</span>
            <span>{lead.confidenceLevel}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${lead.confidenceLevel}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
