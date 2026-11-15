import React, { useState } from 'react';
import { Property, Unit } from '../types';
import { api } from '../services/api';
import { 
  Building2, 
  Plus, 
  MapPin, 
  DollarSign, 
  Globe2, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  Share2
} from 'lucide-react';

interface PropertiesPageProps {
  properties: Property[];
  onRefresh: () => void;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({ properties, onRefresh }) => {
  const [expandedPropId, setExpandedPropId] = useState<string | null>(properties[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPublishId, setLoadingPublishId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Bodija');
  const [city, setCity] = useState('Ibadan');
  const [totalUnits, setTotalUnits] = useState(4);
  const [rentPerUnit, setRentPerUnit] = useState(900000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTogglePublish = async (unitId: string) => {
    setLoadingPublishId(unitId);
    try {
      const res = await api.togglePublishToDiscovery(unitId);
      alert(res.message);
      onRefresh();
    } catch (e: any) {
      alert(`Error publishing: ${e.message}`);
    } finally {
      setLoadingPublishId(null);
    }
  };

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createProperty({
        name,
        address,
        neighborhood,
        city,
        total_units: totalUnits,
        rent_per_unit: rentPerUnit
      });
      setIsAddModalOpen(false);
      setName('');
      setAddress('');
      onRefresh();
      alert('Property created and units auto-generated successfully!');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = properties.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-headline text-surface-900 dark:text-surface-100">
            Properties & Units
          </h1>
          <p className="text-xs text-surface-500 mt-1">
            Manage your compounds, apartment units, rental pricing, and vacancy publishing.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Property Cards */}
      <div className="space-y-4">
        {filtered.map(property => {
          const isExpanded = expandedPropId === property.id;

          return (
            <div 
              key={property.id}
              className="rounded-3xl border border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-900 overflow-hidden shadow-xs transition-all"
            >
              {/* Property Header Bar */}
              <div 
                onClick={() => setExpandedPropId(isExpanded ? null : property.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-50/50 dark:hover:bg-surface-850/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-headline font-bold text-lg text-surface-900 dark:text-surface-100">
                        {property.name}
                      </h3>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                        {property.units.length} Units
                      </span>
                      {property.landlord?.is_diaspora && (
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">
                          🌍 UK Diaspora Landlord
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-surface-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-surface-400" />
                      <span>{property.address}, {property.neighborhood}, {property.city}</span>
                    </div>
                  </div>
                </div>

                {/* Stats & Chevron */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-surface-100 dark:border-surface-800">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-surface-400">Occupancy</div>
                    <div className="text-sm font-black text-surface-900 dark:text-surface-100">
                      {property.stats.occupied_units} / {property.stats.total_units} ({property.stats.occupancy_rate}%)
                    </div>
                  </div>

                  <div className="text-left md:text-right">
                    <div className="text-xs text-surface-400">Annual Rent Roll</div>
                    <div className="text-sm font-black text-brand-600 dark:text-brand-400">
                      ₦{property.stats.annual_rent_roll.toLocaleString()}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Units Table (Accordion Content) */}
              {isExpanded && (
                <div className="border-t border-surface-200 dark:border-surface-850 p-5 sm:p-6 bg-surface-50/50 dark:bg-surface-950/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-surface-500">
                      Apartment Units ({property.units.length})
                    </h4>
                    <span className="text-[11px] text-surface-500">
                      Vacant units can be published directly to <strong className="text-brand-500">locari.africa</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.units.map(unit => {
                      const isVacant = unit.status === 'vacant';

                      return (
                        <div 
                          key={unit.id}
                          className="p-4 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex flex-col justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-sm text-surface-900 dark:text-surface-100">
                                {unit.unit_number}
                              </div>
                              <div className="text-xs text-surface-500">
                                {unit.unit_type} • {unit.bedrooms} Bed, {unit.bathrooms} Bath
                              </div>
                            </div>

                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                              isVacant 
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' 
                                : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                            }`}>
                              {unit.status}
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-surface-100 dark:border-surface-800">
                            <div>
                              <div className="text-[10px] text-surface-400">Annual Rent</div>
                              <div className="text-sm font-black text-surface-900 dark:text-surface-100">
                                ₦{unit.rent_amount.toLocaleString()}
                              </div>
                            </div>

                            {/* Modular Connector to Locari Rental Discovery */}
                            {isVacant && (
                              <button
                                onClick={() => handleTogglePublish(unit.id)}
                                disabled={loadingPublishId === unit.id}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                  unit.is_published_to_discovery
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20'
                                    : 'bg-brand-500 text-surface-950 hover:bg-brand-400 font-black'
                                }`}
                              >
                                <Globe2 className="w-3.5 h-3.5" />
                                <span>
                                  {unit.is_published_to_discovery ? 'Published to Locari.africa ✓' : 'Publish to Locari.africa'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Property Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp">
            <div>
              <h3 className="font-headline font-bold text-xl text-surface-900 dark:text-surface-100">
                Register New Property
              </h3>
              <p className="text-xs text-surface-500 mt-1">
                Enter building details. Apartment units will be automatically created and synchronized live with WhatsApp.
              </p>
            </div>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Property Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grace Gardens Estate"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 12 Favos Close, New Bodija"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={e => setNeighborhood(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Number of Units
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={totalUnits}
                    onChange={e => setTotalUnits(parseInt(e.target.value, 10))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-surface-700 dark:text-surface-300 mb-1">
                    Annual Rent per Unit (₦)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={rentPerUnit}
                    onChange={e => setRentPerUnit(parseFloat(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 text-surface-900 dark:text-surface-100"
                  />
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {isSubmitting ? 'Creating...' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
