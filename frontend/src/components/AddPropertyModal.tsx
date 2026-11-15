import React, { useState } from 'react';
import { X, Building2, Plus } from 'lucide-react';
import { api } from '../services/api';

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Bodija');
  const [city, setCity] = useState('Ibadan');
  const [totalUnits, setTotalUnits] = useState(4);
  const [rentPerUnit, setRentPerUnit] = useState(900000);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createProperty({
        name,
        address,
        neighborhood,
        city,
        total_units: totalUnits,
        default_rent_amount: rentPerUnit,
        property_type: 'multi_family_residential'
      });

      alert(`Property "${name}" created successfully with ${totalUnits} units!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(`Error creating property: ${err.message}`);
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
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black font-headline">Add New Property</h3>
            <p className="text-xs text-surface-500">Register a new residential or commercial property.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
              Property Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Adeleke Royal Court"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
              Street Address
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 12 Obafemi Awolowo Way"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
                Area / Neighborhood
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bodija / Lekki"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
                City
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ibadan / Lagos"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
                Number of Units
              </label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={totalUnits}
                onChange={(e) => setTotalUnits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-surface-600 dark:text-surface-300 mb-1">
                Annual Rent / Unit (₦)
              </label>
              <input
                type="number"
                step={50000}
                required
                value={rentPerUnit}
                onChange={(e) => setRentPerUnit(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-800 text-xs focus:outline-none focus:border-brand-500 font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Property...' : 'Save & Initialize Units'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
