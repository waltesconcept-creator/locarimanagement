import React, { useState } from 'react';
import { MaintenanceRequest, Property } from '../types';
import { api } from '../services/api';
import { 
  Wrench, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  UserCheck, 
  DollarSign, 
  Phone,
  Image as ImageIcon
} from 'lucide-react';

interface MaintenancePageProps {
  maintenance: MaintenanceRequest[];
  properties: Property[];
  onRefresh: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ maintenance, properties, onRefresh }) => {
  const [filter, setFilter] = useState<'all' | 'pending_approval' | 'in_progress' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Form State
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Plumbing & Water');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'emergency'>('high');
  const [estimatedCost, setEstimatedCost] = useState(85000);
  const [contractorName, setContractorName] = useState('Engr. Segun Technician');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await api.approveMaintenance(id);
      alert(res.message);
      onRefresh();
    } catch (e: any) {
      alert(`Error approving: ${e.message}`);
    } finally {
      setApprovingId(null);
    }
  };

  const handleComplete = async (id: string, cost: number) => {
    try {
      const res = await api.completeMaintenance(id, cost);
      alert(res.message);
      onRefresh();
    } catch (e: any) {
      alert(`Error completing: ${e.message}`);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.createMaintenance({
        property_id: selectedPropId,
        title,
        category,
        description,
        priority,
        estimated_cost: estimatedCost,
        contractor_name: contractorName
      });
      alert(res.message);
      setIsAddModalOpen(false);
      setTitle('');
      setDescription('');
      onRefresh();
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = maintenance.filter(m => {
    if (filter === 'pending_approval') return m.status === 'pending_landlord_approval';
    if (filter === 'in_progress') return m.status === 'in_progress' || m.status === 'approved';
    if (filter === 'completed') return m.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            Maintenance & Workorders
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Triage repairs, coordinate field contractors, and manage landlord expense authorizations with photo & video evidence.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Log Maintenance Ticket</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Requests' },
          { id: 'pending_approval', label: 'Pending Landlord Approval' },
          { id: 'in_progress', label: 'Approved & In Progress' },
          { id: 'completed', label: 'Completed Repairs' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === t.id
                ? 'bg-brand-500 text-surface-950 font-black shadow-xs'
                : 'bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-400 hover:bg-surface-100 border border-surface-200 dark:border-surface-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Maintenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(req => {
          const isPending = req.status === 'pending_landlord_approval';
          const isEmergency = req.priority === 'emergency' || req.priority === 'high';

          return (
            <div 
              key={req.id}
              className={`p-6 rounded-3xl border ${
                isPending 
                  ? 'border-amber-500/30 bg-amber-500/5' 
                  : 'border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900'
              } shadow-xs flex flex-col justify-between gap-5 transition-all`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    isEmergency 
                      ? 'bg-red-500/10 text-red-600 border border-red-500/20' 
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                  }`}>
                    {req.priority} Priority • {req.category}
                  </span>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    req.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : req.status === 'approved'
                      ? 'bg-blue-500/10 text-blue-600'
                      : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                  }`}>
                    {req.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="font-headline font-bold text-base text-surface-900 dark:text-surface-100">
                    {req.title}
                  </h3>
                  <p className="text-xs text-surface-600 dark:text-surface-400 mt-1 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">Property / Unit:</span>
                    <span className="font-bold text-surface-900 dark:text-surface-100">
                      {req.property_name} ({req.unit_number})
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-surface-500">Landlord:</span>
                    <span className="font-bold text-surface-900 dark:text-surface-100">
                      {req.landlord_name} {req.landlord_is_diaspora ? '(🌍 Diaspora)' : ''}
                    </span>
                  </div>
                  {req.contractor_name && (
                    <div className="flex items-center justify-between">
                      <span className="text-surface-500">Contractor:</span>
                      <span className="font-bold text-surface-900 dark:text-surface-100">
                        {req.contractor_name}
                      </span>
                    </div>
                  )}
                  {req.estimated_cost && (
                    <div className="flex items-center justify-between pt-1 border-t border-surface-200 dark:border-surface-850">
                      <span className="font-bold text-surface-700 dark:text-surface-300">Quote / Estimate:</span>
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                        ₦{req.estimated_cost.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between gap-3">
                <span className="text-[11px] text-surface-400">
                  Logged: {req.created_at.slice(0, 10)}
                </span>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <button
                      onClick={() => handleApprove(req.id)}
                      disabled={approvingId === req.id}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm"
                    >
                      {approvingId === req.id ? 'Authorizing...' : 'Authorize Expense'}
                    </button>
                  )}

                  {req.status === 'approved' && (
                    <button
                      onClick={() => handleComplete(req.id, req.estimated_cost || 50000)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-all"
                    >
                      Mark Completed
                    </button>
                  )}

                  {req.status === 'completed' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Repair Verified</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Maintenance Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div>
              <h3 className="font-headline font-bold text-xl text-surface-900 dark:text-surface-100">
                Log New Maintenance Request
              </h3>
              <p className="text-xs text-surface-500 mt-1">
                Tickets requiring more than ₦50,000 will automatically ping the landlord on WhatsApp for approval.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Property
                </label>
                <select
                  value={selectedPropId}
                  onChange={e => setSelectedPropId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.neighborhood})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Borehole Pump Repair"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  >
                    <option>Plumbing & Water</option>
                    <option>Electrical</option>
                    <option>Structural / Roof</option>
                    <option>Masonry & Painting</option>
                    <option>Security & Gates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Estimated Cost (₦)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={estimatedCost}
                    onChange={e => setEstimatedCost(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail symptoms, affected flats, and technician diagnostic findings..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-4 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Workorder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
