import React, { useState } from 'react';
import { RentSchedule, PaymentRecord } from '../types';
import { api } from '../services/api';
import { 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  ShieldCheck, 
  XCircle, 
  FileText, 
  Receipt,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface RentPageProps {
  schedules: RentSchedule[];
  payments: PaymentRecord[];
  onRefresh: () => void;
}

export const RentPage: React.FC<RentPageProps> = ({ schedules, payments, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'schedules' | 'verification'>('verification');
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const pendingVerification = payments.filter(p => p.status === 'reported');
  const verifiedPayments = payments.filter(p => p.status === 'verified');

  const handleVerify = async (paymentId: string) => {
    setVerifyingId(paymentId);
    try {
      const res = await api.verifyPayment(paymentId);
      alert(res.message);
      onRefresh();
    } catch (e: any) {
      alert(`Error verifying: ${e.message}`);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleReject = async (paymentId: string) => {
    const reason = prompt('Please enter the reason for rejection (e.g. Transaction alert not found on bank statement):');
    if (!reason) return;

    try {
      const res = await api.rejectPayment(paymentId, reason);
      alert(res.message);
      onRefresh();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            Rent & Financial Ledger
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Track annual rent schedules, overdue balances, and verify bank transfer receipts before issuing official statements.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-surface-100 dark:bg-surface-850 border border-surface-200 dark:border-surface-800 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'verification'
                ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm font-black'
                : 'text-surface-500 hover:text-surface-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <span>Verification Queue</span>
            {pendingVerification.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-surface-950 font-black">
                {pendingVerification.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'schedules'
                ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 shadow-sm font-black'
                : 'text-surface-500 hover:text-surface-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-surface-400" />
            <span>Rent Schedules & Arrears</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Payment Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Important Notice */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Operational Principle #14:</span> Never trust WhatsApp chat screenshots alone as verified payment evidence. 
              Only verify payments once matching credits appear on your Agency or Landlord bank statement. Verification immediately updates tenant rent balances and generates an official receipt.
            </div>
          </div>

          {/* Pending Review Cards */}
          <div className="space-y-3">
            <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
              Reported Payments Pending Audit ({pendingVerification.length})
            </h3>

            {pendingVerification.length === 0 ? (
              <div className="p-8 text-center text-xs text-surface-400 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-850 rounded-3xl">
                No reported payments currently awaiting verification.
              </div>
            ) : (
              pendingVerification.map(pay => (
                <div 
                  key={pay.id}
                  className="p-5 rounded-3xl border border-amber-500/30 bg-white dark:bg-surface-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 border border-amber-500/30">
                        {pay.status}
                      </span>
                      <span className="font-headline font-bold text-lg text-surface-900 dark:text-surface-100">
                        ₦{pay.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-surface-500">
                        via {pay.payment_method.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-surface-600 dark:text-surface-400">
                      Tenant: <strong className="text-surface-900 dark:text-surface-100">{pay.tenant_name}</strong> ({pay.unit_number}) • Phone: {pay.tenant_phone}
                    </div>

                    <div className="text-[11px] text-surface-500 flex items-center gap-3">
                      <span>Ref: <code className="font-mono bg-surface-100 dark:bg-surface-800 px-1.5 py-0.5 rounded">{pay.bank_reference || 'N/A'}</code></span>
                      <span>Date: {pay.payment_date}</span>
                      {pay.notes && <span className="italic">"{pay.notes}"</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-surface-100 dark:border-surface-800">
                    <button
                      onClick={() => handleReject(pay.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-500/10 transition-colors"
                    >
                      Reject Proof
                    </button>
                    <button
                      onClick={() => handleVerify(pay.id)}
                      disabled={verifyingId === pay.id}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{verifyingId === pay.id ? 'Reconciling...' : 'Confirm Bank Credit'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Verified History Table */}
          <div className="space-y-3 pt-4">
            <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
              Verified Payment Records & Receipts ({verifiedPayments.length})
            </h3>

            <div className="rounded-3xl border border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/75 dark:bg-surface-950/75 text-[11px] font-black uppercase tracking-wider text-surface-400">
                    <th className="py-4 px-6">Receipt #</th>
                    <th className="py-4 px-6">Tenant & Unit</th>
                    <th className="py-4 px-6">Amount Verified</th>
                    <th className="py-4 px-6">Payment Date</th>
                    <th className="py-4 px-6">Audited By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-850">
                  {verifiedPayments.map(p => (
                    <tr key={p.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-850/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-brand-600 dark:text-brand-400">
                        {p.receipt_number || 'REC-LOCARI-2026-0001'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-surface-900 dark:text-surface-100">{p.tenant_name}</div>
                        <div className="text-[11px] text-surface-500">{p.unit_number}</div>
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{p.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-surface-600 dark:text-surface-400">
                        {p.payment_date}
                      </td>
                      <td className="py-4 px-6 text-surface-500">
                        {p.verified_by_name || 'Tunde Balogun (PM)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Rent Schedules & Arrears */}
      {activeTab === 'schedules' && (
        <div className="rounded-3xl border border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/75 dark:bg-surface-950/75 text-[11px] font-black uppercase tracking-wider text-surface-400">
                  <th className="py-4 px-6">Tenant & Unit</th>
                  <th className="py-4 px-6">Period</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Total Due</th>
                  <th className="py-4 px-6">Paid</th>
                  <th className="py-4 px-6">Balance Due</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-850">
                {schedules.map(sched => {
                  const isOverdue = sched.status === 'overdue';

                  return (
                    <tr key={sched.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-850/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-surface-900 dark:text-surface-100">{sched.tenant_name}</div>
                        <div className="text-[11px] text-surface-500">{sched.property_name} ({sched.unit_number})</div>
                      </td>
                      <td className="py-4 px-6 text-surface-600 dark:text-surface-400">
                        {sched.period_title}
                      </td>
                      <td className="py-4 px-6 font-semibold text-surface-700 dark:text-surface-300">
                        {sched.due_date}
                      </td>
                      <td className="py-4 px-6 font-bold text-surface-900 dark:text-surface-100">
                        ₦{sched.total_amount_due.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400">
                        ₦{sched.amount_paid.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-red-600 dark:text-red-400">
                        ₦{sched.balance_remaining.toLocaleString()}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          isOverdue 
                            ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                            : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                        }`}>
                          {sched.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
