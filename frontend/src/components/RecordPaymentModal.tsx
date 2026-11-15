import React, { useState } from 'react';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Property, Tenant, RentSchedule } from '../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  tenants: Tenant[];
  schedules: RentSchedule[];
  onSuccess: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  properties,
  tenants,
  schedules,
  onSuccess
}) => {
  const [tenantId, setTenantId] = useState(tenants[0]?.id || '');
  const [unitId, setUnitId] = useState('');
  const [amount, setAmount] = useState<number>(450000);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'cash' | 'pos' | 'card'>('bank_transfer');
  const [bankRef, setBankRef] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Find units for selected tenant or properties
  const allUnits: { id: string; name: string }[] = [];
  properties.forEach(p => {
    p.units.forEach(u => {
      allUnits.push({ id: u.id, name: `${p.name} - ${u.unit_number}` });
    });
  });

  const selectedUnitId = unitId || allUnits[0]?.id || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.recordPayment({
        tenant_id: tenantId || tenants[0]?.id,
        unit_id: selectedUnitId,
        amount: Number(amount),
        payment_method: paymentMethod,
        bank_reference: bankRef || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        payment_date: new Date().toISOString().split('T')[0]
      });

      alert('Payment recorded and reconciled successfully!');
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Error saving payment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-surface-900 dark:text-white">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black font-headline">Record Rent Payment</h3>
            <p className="text-xs text-surface-500">Log verified tenant payment to the central ledger.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
              Select Unit / Property
            </label>
            <select
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
            >
              {allUnits.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
              Select Tenant
            </label>
            <select
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.full_name} ({t.phone})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
              Amount Paid (₦)
            </label>
            <input
              type="number"
              required
              min={1000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
                Payment Channel
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Direct Cash</option>
                <option value="pos">POS Terminal</option>
                <option value="card">Card Payment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
                Bank Ref / Session ID
              </label>
              <input
                type="text"
                placeholder="Optional Ref"
                value={bankRef}
                onChange={(e) => setBankRef(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Recording...' : 'Save & Reconcile Payment'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
