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
  ArrowLeft,
  X
} from 'lucide-react';
import { LocariLogo } from './LocariLogo';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  arrearsCount?: number;
  pendingMaintCount?: number;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
  onExitToWebsite?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab,
  arrearsCount = 1,
  pendingMaintCount = 1,
  isMobileOpen = false,
  setIsMobileOpen,
  onExitToWebsite
}) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties & Units', icon: Building2 },
    { id: 'landlords', label: 'Landlords', icon: Crown },
    { id: 'tenants', label: 'Tenants', icon: Users2 },
    { id: 'rent', label: 'Rent & Payments', icon: CreditCard, badge: arrearsCount > 0 ? `${arrearsCount} Overdue` : undefined, badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: pendingMaintCount > 0 ? `${pendingMaintCount} Approval` : undefined, badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    { id: 'tasks', label: 'Tasks & Ops', icon: CheckSquare },
    { id: 'simulator', label: 'WhatsApp Assistant', icon: Smartphone, highlight: true },
    { id: 'settings', label: 'Settings & Integrations', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full py-6 px-3">
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
              onClick={() => handleSelect(item.id)}
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
                <span className="whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge && !isActive && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${item.badgeColor} whitespace-nowrap`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Return to Landing Page Button */}
      {onExitToWebsite && (
        <div className="pt-4 border-t border-surface-200 dark:border-surface-850">
          <button
            onClick={onExitToWebsite}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-surface-500 hover:text-surface-900 dark:hover:text-surface-100 hover:bg-surface-100 dark:hover:bg-surface-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* 1. Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-surface-200 dark:border-surface-850 bg-white dark:bg-surface-950 shrink-0">
        {navContent}
      </aside>

      {/* 2. Mobile Flyout Drawer Modal */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-surface-950 shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-800">
              <LocariLogo className="h-6 w-auto" badge="PM OS" />
              <button
                onClick={() => setIsMobileOpen && setIsMobileOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-100 dark:bg-surface-850 flex items-center justify-center text-surface-500 hover:text-surface-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {navContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
