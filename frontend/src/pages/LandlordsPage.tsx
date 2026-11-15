import React, { useState } from 'react';
import { Landlord } from '../types';
import { api } from '../services/api';
import { 
  Crown, 
  Globe, 
  Building2, 
  DollarSign, 
  FileText, 
  Phone, 
  Send, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface LandlordsPageProps {
  landlords: Landlord[];
  onRefresh: () => void;
}

export const LandlordsPage: React.FC<LandlordsPageProps> = ({ landlords, onRefresh }) => {
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleGenerateStatement = async (landlordId: string) => {
    setGeneratingId(landlordId);
    try {
      const res = await api.generateLandlordStatement(landlordId);
      alert(`${res.message}\n\nSummary:\n${res.report.summary_text}`);
      onRefresh();
    } catch (e: any) {
      alert(`Error generating statement: ${e.message}`);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            Landlords Directory
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Empowering property owners with transparent oversight, automated WhatsApp statements, and repair authorizations.
          </p>
        </div>
      </div>

      {/* Landlord Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {landlords.map(landlord => {
          return (
            <div 
              key={landlord.id}
              className="p-6 sm:p-7 rounded-3xl border border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900 shadow-sm space-y-5 transition-all"
            >
              {/* Landlord Top Bar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm bg-brand-500/10 text-brand-500">
                    {landlord.full_name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
                        {landlord.full_name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-surface-500 mt-0.5">
                      <Globe className="w-3.5 h-3.5 text-surface-400" />
                      <span>{landlord.profile?.residence_city || landlord.country}, {landlord.country}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-wider text-surface-400">Management Fee</span>
                  <div className="text-sm font-black text-brand-600 dark:text-brand-400">
                    {landlord.profile?.management_fee_percentage || 10}%
                  </div>
                </div>
              </div>

              {/* Financial Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white dark:bg-surface-950 border border-surface-200 dark:border-surface-850 text-center">
                <div>
                  <div className="text-[10px] font-bold text-surface-400 uppercase">Units Managed</div>
                  <div className="text-sm font-black text-surface-900 dark:text-surface-100 mt-0.5">
                    {landlord.stats.total_units} ({landlord.stats.occupied_units} Occ)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-surface-400 uppercase">Rent Collected</div>
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ₦{landlord.stats.total_collected.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-surface-400 uppercase">Outstanding</div>
                  <div className="text-sm font-black text-red-600 dark:text-red-400 mt-0.5">
                    ₦{landlord.stats.total_arrears.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Properties Managed & Bank Account */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                  <span className="font-semibold">Properties:</span>
                  <span className="font-bold text-surface-900 dark:text-surface-100">
                    {landlord.properties.map(p => p.name).join(', ') || 'No properties assigned'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                  <span className="font-semibold">Payout Account:</span>
                  <span className="font-mono font-bold text-surface-900 dark:text-surface-100">
                    {landlord.profile?.bank_name} ({landlord.profile?.account_number})
                  </span>
                </div>

                <div className="flex items-center justify-between text-surface-600 dark:text-surface-400">
                  <span className="font-semibold">WhatsApp Reporting:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    Monthly Remittance via WhatsApp
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between gap-3">
                <a
                  href={`https://wa.me/${landlord.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 text-surface-900 dark:text-surface-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  onClick={() => handleGenerateStatement(landlord.id)}
                  disabled={generatingId === landlord.id}
                  className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{generatingId === landlord.id ? 'Generating...' : 'Dispatch Statement'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
