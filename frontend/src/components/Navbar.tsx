import React from 'react';
import { LocariLogo } from './LocariLogo';
import { MessageSquare, ShieldCheck, Bell, Smartphone, UserCircle, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openSimulator }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-surface-200 dark:border-surface-850 bg-white/90 dark:bg-surface-950/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Organization Title */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setCurrentTab('overview')}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <LocariLogo className="h-7 w-auto" badge="PM OS" />
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-surface-700 dark:text-surface-300">Locari Property Management Services</span>
            <span className="text-surface-400 dark:text-surface-600">|</span>
            <span className="text-brand-500 font-bold">Nigeria & Diaspora</span>
          </div>
        </div>

        {/* Right Navigation & Status Indicators */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* WhatsApp BotSailor Integration Status */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>BotSailor: Connected</span>
          </div>

          {/* Quick WhatsApp Assistant Launcher */}
          <button
            onClick={openSimulator}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-surface-950 font-black text-xs uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp Assistant</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-surface-200 dark:border-surface-800">
            <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-800 flex items-center justify-center font-bold text-xs text-brand-500">
              TB
            </div>
            <div className="hidden md:block text-left text-xs">
              <div className="font-bold text-surface-900 dark:text-surface-100">Tunde Balogun</div>
              <div className="text-[10px] text-surface-500">Property Manager</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
