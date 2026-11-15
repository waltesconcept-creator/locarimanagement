import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Crown, 
  CreditCard, 
  Smartphone,
  Menu
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openMobileMenu: () => void;
  arrearsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  setCurrentTab,
  openSimulator,
  openMobileMenu,
  arrearsCount = 0
}) => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-surface-950/95 backdrop-blur-md border-t border-surface-200 dark:border-surface-850 px-2 py-1.5 shadow-lg safe-area-bottom">
      <div className="flex items-center justify-around">
        {/* Overview */}
        <button
          onClick={() => setCurrentTab('overview')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'overview'
              ? 'text-brand-500 font-black'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Overview</span>
        </button>

        {/* Properties */}
        <button
          onClick={() => setCurrentTab('properties')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'properties'
              ? 'text-brand-500 font-black'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900'
          }`}
        >
          <Building2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Properties</span>
        </button>

        {/* WhatsApp Floating Center Button */}
        <button
          onClick={openSimulator}
          className="flex flex-col items-center justify-center -mt-4 py-2 px-3 rounded-2xl bg-brand-500 text-surface-950 shadow-md transition-transform active:scale-95"
        >
          <Smartphone className="w-5 h-5" />
          <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">WhatsApp</span>
        </button>

        {/* Landlords / Diaspora */}
        <button
          onClick={() => setCurrentTab('landlords')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab === 'landlords'
              ? 'text-brand-500 font-black'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900'
          }`}
        >
          <Crown className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Landlords</span>
        </button>

        {/* More / Full Menu Drawer */}
        <button
          onClick={openMobileMenu}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
            currentTab !== 'overview' && currentTab !== 'properties' && currentTab !== 'landlords'
              ? 'text-brand-500 font-black'
              : 'text-surface-500 dark:text-surface-400 hover:text-surface-900'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
          {arrearsCount > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
