import React, { useState } from 'react';
import { Tenant, Property } from '../types';
import { api } from '../services/api';
import { 
  Users2, 
  Plus, 
  Phone, 
  Mail, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  Building2,
  ArrowUpRight
} from 'lucide-react';

interface TenantsPageProps {
  tenants: Tenant[];
  properties: Property[];
  onRefresh: () => void;
}

export const TenantsPage: React.FC<TenantsPageProps> = ({ tenants, properties, onRefresh }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+234');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [employer, setEmployer] = useState('');
  const [moveInDate, setMoveInDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available units for chosen property
  const selectedProp = properties.find(p => p.id === selectedPropId);
  const vacantUnits = selectedProp ? selectedProp.units.filter(u => u.status === 'vacant') : [];

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropId || !selectedUnitId) {
      alert('Please select both a property and an apartment unit.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createTenant({
        property_id: selectedPropId,
        unit_id: selectedUnitId,
        full_name: fullName,
        phone,
        email,
        occupation,
        employer,
        move_in_date: moveInDate
      });
      setIsAddModalOpen(false);
      setFullName('');
      setPhone('+234');
      onRefresh();
      alert('Tenant successfully registered and unit marked as occupied!');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = tenants.filter(t => 
    t.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.property_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.unit_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            Tenants Directory
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Active resident tenancies, payment statuses, lease dates, and WhatsApp communication logs.
          </p>
        </div>

        <button
          onClick={() => {
            if (properties.length > 0) {
              setSelectedPropId(properties[0].id);
              const firstVacant = properties[0].units.find(u => u.status === 'vacant');
              if (firstVacant) setSelectedUnitId(firstVacant.id);
            }
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Tenant</span>
        </button>
      </div>

      {/* Tenants Table Card */}
      <div className="rounded-3xl border border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/75 dark:bg-surface-950/75 text-[11px] font-black uppercase tracking-wider text-surface-400">
                <th className="py-4 px-6">Tenant Name</th>
                <th className="py-4 px-6">Property & Unit</th>
                <th className="py-4 px-6">Lease Expiry</th>
                <th className="py-4 px-6">Rent Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-850">
              {filtered.map(tenant => {
                const isOverdue = tenant.rent_status === 'overdue';

                return (
                  <tr key={tenant.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-850/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-surface-900 dark:text-surface-100">
                        {tenant.full_name}
                      </div>
                      <div className="text-[11px] text-surface-500 flex items-center gap-2 mt-0.5">
                        <span>{tenant.phone}</span>
                        {tenant.occupation && <span>• {tenant.occupation}</span>}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-surface-900 dark:text-surface-100">
                        {tenant.property_name}
                      </div>
                      <div className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold">
                        {tenant.unit_number} (₦{tenant.rent_amount.toLocaleString()}/yr)
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-semibold text-surface-700 dark:text-surface-300">
                        {tenant.current_lease_end}
                      </div>
                      <div className="text-[11px] text-surface-400">
                        Moved in: {tenant.move_in_date}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isOverdue 
                          ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      }`}>
                        {isOverdue ? `Overdue (₦${tenant.amount_owing.toLocaleString()})` : 'Paid'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <a
                        href={`https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-surface-700 dark:text-surface-300 font-bold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-500" />
                        <span>WhatsApp</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div>
              <h3 className="font-headline font-bold text-xl text-surface-900 dark:text-surface-100">
                Register Tenant & Assign Apartment
              </h3>
              <p className="text-xs text-surface-500 mt-1">
                Assign a resident to an available unit and initialize their rent cycle.
              </p>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Tenant Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Olumide Johnson"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    WhatsApp Phone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+2348011223344"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="tenant@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Property
                  </label>
                  <select
                    value={selectedPropId}
                    onChange={e => {
                      setSelectedPropId(e.target.value);
                      const prop = properties.find(p => p.id === e.target.value);
                      const firstV = prop?.units.find(u => u.status === 'vacant');
                      setSelectedUnitId(firstV?.id || '');
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  >
                    {properties.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Available Unit
                  </label>
                  <select
                    value={selectedUnitId}
                    onChange={e => setSelectedUnitId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  >
                    {vacantUnits.length === 0 ? (
                      <option value="">No vacant units in this building</option>
                    ) : (
                      vacantUnits.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.unit_number} (₦{u.rent_amount.toLocaleString()}/yr)
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-200 dark:border-surface-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedUnitId}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Registering...' : 'Register & Assign Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
