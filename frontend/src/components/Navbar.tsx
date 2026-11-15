import React from 'react';
import { LocariLogo } from './LocariLogo';
import { Smartphone, Menu, Globe, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openMobileMenu: () => void;
  onExitToWebsite?: () => void;
  user?: any;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  openSimulator, 
  openMobileMenu,
  onExitToWebsite,
  user
}) => {
  const userName = user?.full_name || 'Tunde Balogun';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const userRole = user?.role === 'landlord' ? 'Landlord / Owner' : 'Property Manager';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-200 dark:border-surface-850 bg-white/95 dark:bg-surface-950/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left: Hamburger (mobile only) & Brand Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={openMobileMenu}
            className="lg:hidden p-2 rounded-xl text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-850"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button 
            onClick={() => setCurrentTab('overview')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <LocariLogo className="h-6 sm:h-7 w-auto" badge="PM OS" />
          </button>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-surface-700 dark:text-surface-300">Locari Property Management Services</span>
          </div>
        </div>

        {/* Right Navigation & Status Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Website link */}
          {onExitToWebsite && (
            <button
              onClick={onExitToWebsite}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-surface-200 dark:border-surface-800 hover:bg-surface-100 dark:hover:bg-surface-900 text-surface-600 dark:text-surface-300 text-xs font-bold transition-colors whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-brand-500" />
              <span>Back to Website</span>
            </button>
          )}

          {/* Quick WhatsApp Assistant Launcher */}
          <button
            onClick={openSimulator}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all whitespace-nowrap"
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">WhatsApp Assistant</span>
            <span className="sm:hidden text-[10px]">Assistant</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 sm:pl-3 sm:border-l border-surface-200 dark:border-surface-800">
            <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center font-bold text-xs text-brand-500 shrink-0">
              {userInitials}
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-surface-900 dark:text-surface-100 leading-tight">{userName}</div>
              <div className="text-[10px] text-surface-500">{userRole}</div>
            </div>
            {onExitToWebsite && (
              <button
                onClick={onExitToWebsite}
                title="Sign Out to Website"
                className="p-1.5 text-surface-400 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
