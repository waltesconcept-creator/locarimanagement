import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Crown, 
  Users2, 
  CreditCard, 
  Wrench, 
  CheckSquare, 
  Smartphone, 
  Settings,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  arrearsCount?: number;
  pendingMaintCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab,
  arrearsCount = 1,
  pendingMaintCount = 1
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties & Units', icon: Building2 },
    { id: 'landlords', label: 'Landlords & Diaspora', icon: Crown },
    { id: 'tenants', label: 'Tenants', icon: Users2 },
    { id: 'rent', label: 'Rent & Payments', icon: CreditCard, badge: arrearsCount > 0 ? `${arrearsCount} Overdue` : undefined, badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: pendingMaintCount > 0 ? `${pendingMaintCount} Approval` : undefined, badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { id: 'tasks', label: 'Tasks & Ops', icon: CheckSquare },
    { id: 'simulator', label: 'WhatsApp Simulator', icon: Smartphone, highlight: true },
    { id: 'settings', label: 'Settings & BotSailor', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-950 flex flex-col justify-between py-6 px-3 shrink-0">
      <div className="space-y-1">
        <div className="px-3 pb-3 text-[11px] font-black uppercase tracking-wider text-surface-400 dark:text-surface-500">
          Operations Centre
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                isActive
                  ? 'bg-brand-500 text-surface-950 shadow-sm font-black'
                  : item.highlight
                  ? 'bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 font-black'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-900 hover:text-surface-900 dark:hover:text-surface-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-surface-950' : item.highlight ? 'text-brand-500' : 'text-surface-400 dark:text-surface-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && !isActive && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Diaspora Quick Notice Card */}
      <div className="p-3.5 rounded-2xl bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 space-y-2 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-surface-900 dark:text-surface-100">
          <span>🌍</span>
          <span>Diaspora Mode Active</span>
        </div>
        <p className="text-[11px] text-surface-500 leading-relaxed">
          Overseas landlords receive WhatsApp financial summaries & repair video proofs automatically.
        </p>
      </div>
    </aside>
  );
};
