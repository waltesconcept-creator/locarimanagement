import React from 'react';
import { Property, Landlord, RentSchedule, MaintenanceRequest, TaskItem } from '../types';
import { 
  Building2, 
  CreditCard, 
  AlertTriangle, 
  Wrench, 
  Crown, 
  ArrowUpRight, 
  CheckCircle2,
  Clock,
  PlusCircle,
  Smartphone
} from 'lucide-react';

interface OverviewPageProps {
  properties: Property[];
  landlords: Landlord[];
  rentSchedules: RentSchedule[];
  maintenance: MaintenanceRequest[];
  tasks: TaskItem[];
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  properties,
  landlords,
  rentSchedules,
  maintenance,
  tasks,
  setCurrentTab,
  openSimulator
}) => {
  // Compute portfolio stats
  let totalUnits = 0;
  let occupiedUnits = 0;
  let vacantUnits = 0;

  properties.forEach(p => {
    totalUnits += p.units.length;
    occupiedUnits += p.units.filter(u => u.status === 'occupied').length;
    vacantUnits += p.units.filter(u => u.status === 'vacant').length;
  });

  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const totalRentCollected = rentSchedules.reduce((acc, s) => acc + s.amount_paid, 0);
  const totalArrears = rentSchedules
    .filter(s => s.status === 'overdue')
    .reduce((acc, s) => acc + s.balance_remaining, 0);

  const pendingApprovals = maintenance.filter(m => m.status === 'pending_landlord_approval');

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Banner (Full width on mobile, spacious, clean typography) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 sm:p-8 rounded-3xl bg-surface-950 text-white border border-surface-800 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="text-[11px] font-black uppercase tracking-widest text-brand-400">
            Locari Central Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-headline tracking-tight leading-tight">
            Portfolio Control Centre
          </h1>
          <p className="text-xs sm:text-sm text-surface-400 leading-relaxed">
            Complete portfolio oversight, rent tracking, and maintenance operations. Single source of truth synchronized live with your WhatsApp Assistant.
          </p>
        </div>

        {/* Action Buttons: strictly on a straight line, no weird text breaking */}
        <div className="flex items-center gap-3 z-10 flex-wrap sm:flex-nowrap shrink-0">
          <button
            onClick={() => setCurrentTab('properties')}
            className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-surface-850 hover:bg-surface-800 text-white text-xs font-bold border border-surface-700 transition-colors inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="whitespace-nowrap">Add Property</span>
          </button>
          <button
            onClick={openSimulator}
            className="whitespace-nowrap px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 text-xs font-black uppercase tracking-wider transition-transform hover:scale-105 active:scale-95 shadow-md inline-flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">WhatsApp Assistant</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Fully responsive on mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Total Rent Collected */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-surface-500">
            <span>Collected Rent</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100 whitespace-nowrap">
            ₦{totalRentCollected.toLocaleString()}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Reconciled & verified payments</span>
          </div>
        </div>

        {/* KPI 2: Outstanding Arrears */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-surface-500">
            <span>Outstanding Arrears</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-headline text-red-600 dark:text-red-400 whitespace-nowrap">
            ₦{totalArrears.toLocaleString()}
          </div>
          <button 
            onClick={() => setCurrentTab('rent')}
            className="text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            <span>Review overdue tenants</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* KPI 3: Occupancy Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-surface-500">
            <span>Portfolio Occupancy</span>
            <div className="w-8 h-8 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            {occupancyRate}%
          </div>
          <div className="text-[11px] text-surface-500">
            <span className="font-bold text-surface-900 dark:text-surface-100">{occupiedUnits}</span> of {totalUnits} units occupied ({vacantUnits} vacant)
          </div>
        </div>

        {/* KPI 4: Landlord Portfolios & Approvals */}
        <div className="p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-surface-500">
            <span>Landlords</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            {landlords.length} <span className="text-xs font-semibold text-surface-400">Owners</span>
          </div>
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{pendingApprovals.length} pending maintenance approval</span>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Approvals & Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Attention & Approvals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Needed Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
                  Landlord Expense Approvals
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Maintenance workorders above approval thresholds awaiting landlord sign-off.
                </p>
              </div>
              <button 
                onClick={() => setCurrentTab('maintenance')}
                className="text-xs font-bold text-brand-500 hover:underline shrink-0"
              >
                View all
              </button>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center text-xs text-surface-400 bg-surface-50 dark:bg-surface-950 rounded-2xl">
                No maintenance workorders currently pending approval.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map(req => (
                  <div 
                    key={req.id}
                    className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-surface-950">
                          {req.priority}
                        </span>
                        <span className="text-xs font-bold text-surface-900 dark:text-surface-100">
                          {req.title}
                        </span>
                      </div>
                      <p className="text-xs text-surface-500">
                        {req.property_name} ({req.unit_number}) • Landlord: {req.landlord_name} {req.landlord_is_diaspora ? '(UK)' : ''}
                      </p>
                      <div className="text-xs font-black text-amber-600 dark:text-amber-400">
                        Estimated Cost: ₦{req.estimated_cost?.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => setCurrentTab('maintenance')}
                      className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-surface-950 text-xs font-bold transition-colors self-start sm:self-auto"
                    >
                      Review & Approve
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Overdue Rent Quick Call List */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
                  Overdue Rent Follow-Ups
                </h3>
                <p className="text-xs text-surface-500 mt-0.5">
                  Tenants with overdue balances ready for WhatsApp notice delivery.
                </p>
              </div>
              <button 
                onClick={() => setCurrentTab('rent')}
                className="text-xs font-bold text-brand-500 hover:underline shrink-0"
              >
                Go to Ledger
              </button>
            </div>

            <div className="space-y-3">
              {rentSchedules.filter(s => s.status === 'overdue').map(item => (
                <div 
                  key={item.id}
                  className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-black text-surface-900 dark:text-surface-100">
                      {item.tenant_name}
                    </div>
                    <div className="text-[11px] text-surface-500">
                      {item.property_name} • {item.unit_number} (Due: {item.due_date})
                    </div>
                    <div className="text-xs font-bold text-red-600 dark:text-red-400">
                      Arrears: ₦{item.balance_remaining.toLocaleString()}
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${item.tenant_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${item.tenant_name}, this is a gentle reminder regarding your outstanding rent balance of ₦${item.balance_remaining.toLocaleString()} for ${item.unit_number} at ${item.property_name}. Please advise on transfer date. Thank you.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap px-3.5 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 text-surface-900 dark:text-surface-100 text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                  >
                    <span>Send Reminder Notice</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Diaspora Landlord Hub */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 shadow-xs space-y-4">
            <div className="text-xs font-black uppercase tracking-wider text-brand-500">
              Overseas Portfolios
            </div>
            <h3 className="font-headline font-bold text-lg text-surface-900 dark:text-surface-100">
              Diaspora Landlords
            </h3>
            <p className="text-xs text-surface-500 leading-relaxed">
              Property owners residing in the UK, USA, or Canada managing their Nigerian buildings completely hands-off.
            </p>

            <div className="space-y-3 pt-1">
              {landlords.filter(l => l.is_diaspora).map(dl => (
                <div key={dl.id} className="p-4 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-surface-900 dark:text-surface-100">
                      {dl.full_name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                      {dl.country}
                    </span>
                  </div>
                  <div className="text-[11px] text-surface-500">
                    Phone: <span className="font-mono text-surface-700 dark:text-surface-300">{dl.phone}</span>
                  </div>
                  <div className="text-[11px] text-surface-500">
                    Properties: <span className="font-bold text-surface-900 dark:text-surface-100">{dl.properties.map(p => p.name).join(', ')}</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-emerald-600 font-bold">₦{dl.stats.total_collected.toLocaleString()}</span>
                    <button
                      onClick={() => setCurrentTab('landlords')}
                      className="text-[11px] font-bold text-brand-500 hover:underline"
                    >
                      Remittance Statement →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick WhatsApp Sync Status */}
          <div className="p-5 sm:p-6 rounded-3xl bg-brand-500/5 border border-brand-500/20 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-brand-600 dark:text-brand-400">
              WhatsApp Live Engine
            </div>
            <p className="text-xs text-surface-600 dark:text-surface-400 leading-relaxed">
              Any tenant payment recorded or property added on WhatsApp updates this dashboard in real-time.
            </p>
            <button
              onClick={openSimulator}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Open Interactive Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
