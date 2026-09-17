import React from 'react';
import {
  ShieldAlert,
  Activity,
  Zap,
  ListOrdered,
  Cpu,
  LineChart,
  Layers,
  UserCheck,
  BellRing,
  PhoneCall,
  CreditCard,
  Building2,
  Lock,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { User } from '../types';

export type TabType =
  | 'dashboard'
  | 'predictor'
  | 'payments'
  | 'transactions'
  | 'bank_directory'
  | 'bank_services'
  | 'model_lab'
  | 'mlops'
  | 'architecture';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout?: () => void;
  unreadAlertCount: number;
  onOpenAlerts: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onLogout,
  unreadAlertCount,
  onOpenAlerts
}) => {
  const primaryNavItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'predictor', label: 'Risk Scanner & Factors', icon: Zap },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
    { id: 'bank_directory', label: 'Toll-Free & Helplines', icon: PhoneCall },
    { id: 'bank_services', label: 'Apex & Global Bank', icon: Building2 },
    { id: 'transactions', label: 'Audit Trail', icon: ListOrdered },
    { id: 'model_lab', label: 'Security Shields', icon: Cpu },
    { id: 'mlops', label: 'Live Shield Health', icon: LineChart },
    { id: 'architecture', label: 'Security Architecture', icon: Layers }
  ];

  return (
    <header id="main-header" className="sticky top-0 z-40 bg-[#040e24]/90 backdrop-blur-md border-b border-blue-500/20 shadow-lg shadow-[#020817]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title with Cinematic Blue Glow */}
          <div
            className="flex items-center gap-3 cursor-pointer shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/60 ring-1 ring-cyan-300/40">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-white text-sm sm:text-base tracking-tight">
                  APEX BANKING
                </span>
                <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  AI GRID 2026
                </span>
              </div>
              <p className="text-[11px] text-blue-300/80 hidden sm:block truncate max-w-[240px]">
                Apex Premier & Global Fraud Defense System
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#071738]/80 p-1 rounded-xl border border-blue-900/70 overflow-x-auto">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50 font-bold'
                      : 'text-blue-200/80 hover:text-white hover:bg-blue-900/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action & User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* National 1930 Cyber Fraud Quick Dial Button */}
            <button
              onClick={() => setActiveTab('bank_directory')}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold hover:bg-emerald-900/40 transition-colors cursor-pointer"
              title="National 1930 Cybercrime Helpline"
            >
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>1930 Helpline</span>
            </button>

            {/* Alert Bell */}
            <button
              id="header-alert-btn"
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl bg-[#091e45] hover:bg-blue-900 border border-blue-700/50 text-blue-200 hover:text-white transition-colors cursor-pointer"
              title="Recent Fraud Alerts"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              {unreadAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {unreadAlertCount}
                </span>
              )}
            </button>

            {/* User Profile / Login */}
            <button
              id="header-auth-btn"
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#091e45] hover:bg-blue-900 border border-blue-700/50 text-xs text-blue-100 transition-colors cursor-pointer shadow-md"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold ring-1 ring-cyan-300/40">
                {currentUser ? currentUser.name.charAt(0) : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold leading-tight text-white max-w-[110px] truncate">
                  {currentUser ? currentUser.name : 'Sign In'}
                </div>
                <div className="text-[10px] text-cyan-300 font-mono">
                  {currentUser ? (currentUser.user_type === 'bank_staff' ? 'Staff' : 'Customer') : 'Portal'}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-blue-300 hidden sm:block" />
            </button>

            {/* Lock Portal / Sign Out Button */}
            {currentUser && onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-600/40 text-rose-300 hover:text-white transition-all cursor-pointer shadow-md flex items-center gap-1 text-xs"
                title="Lock Portal & Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline font-mono text-[11px]">Lock Portal</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Sub-Navigation Bar for Small & Medium Screens */}
        <div className="flex xl:hidden overflow-x-auto py-2 gap-1 border-t border-blue-900/60 no-scrollbar">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-blue-200/80 hover:bg-[#071a3d] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
