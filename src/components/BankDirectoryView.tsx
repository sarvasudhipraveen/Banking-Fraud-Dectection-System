import React, { useState } from 'react';
import {
  PhoneCall,
  Shield,
  Building2,
  Copy,
  Check,
  Search,
  Lock,
  ExternalLink,
  AlertTriangle,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  ShieldAlert,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { BANK_DIRECTORY } from '../services/bankData';
import { BankDirectoryItem } from '../types';

export const BankDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'Indian' | 'Global' | 'Govt'>('ALL');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Calling simulation modal
  const [activeCallBank, setActiveCallBank] = useState<{ name: string; number: string } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Emergency Card Freeze Simulator
  const [frozenBank, setFrozenBank] = useState<string | null>(null);
  const [cardLast4, setCardLast4] = useState('4920');

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const handleTriggerCall = (name: string, num: string) => {
    setActiveCallBank({ name, number: num });
    setCallDuration(0);
  };

  const handleEmergencyFreeze = (bankName: string) => {
    setFrozenBank(bankName);
    setTimeout(() => {
      // Keep freeze confirmation
    }, 500);
  };

  const filteredBanks = BANK_DIRECTORY.filter((bank) => {
    if (categoryFilter === 'Indian' && bank.type !== 'Indian Retail & Commercial') return false;
    if (categoryFilter === 'Global' && bank.type !== 'Global Multinational') return false;
    if (categoryFilter === 'Govt' && bank.type !== 'Government & Regulatory') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        bank.name.toLowerCase().includes(q) ||
        bank.country.toLowerCase().includes(q) ||
        bank.swiftCode.toLowerCase().includes(q) ||
        bank.tollFree.some((n) => n.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#091b40]/80 border border-blue-500/25 shadow-xl shadow-blue-950/60 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
              <PhoneCall className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Bank Directory & 24x7 Toll-Free Hotlines
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-2xl">
            Verified official hotlines, emergency card freezing SMS gateways, SWIFT BIC codes, and cybercrime reporting channels for Apex Premier Bank, domestic leaders, and premier international institutions.
          </p>
        </div>

        {/* Emergency Card Freeze Widget */}
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/40 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-600/30 text-rose-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Emergency Card Freeze</div>
            <div className="text-[11px] text-rose-300/80">Immediate lock across payment networks</div>
          </div>
          <button
            onClick={() => handleEmergencyFreeze('Apex Premier Bank')}
            className="ml-2 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-rose-950/60 transition-colors"
          >
            Freeze Now
          </button>
        </div>
      </div>

      {/* Freeze Confirmation Alert */}
      {frozenBank && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold text-white">CARD SUSPENSION ENFORCED: </span>
              Your card ending in <span className="font-mono font-bold text-rose-200">*{cardLast4}</span> linked to{' '}
              <span className="font-bold text-white">{frozenBank}</span> has been immediately blocked for all international, ATM, and online transactions.
            </div>
          </div>
          <button
            onClick={() => setFrozenBank(null)}
            className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 font-semibold cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* National Cybercrime 1930 Notice Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#0b2447] via-[#09355c] to-[#072440] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-mono font-extrabold text-sm">
            1930
          </div>
          <div>
            <div className="font-bold text-white">
              National Cybercrime Financial Fraud Reporting Helpline (Golden Hour Protocol)
            </div>
            <div className="text-cyan-200/80 text-[11px]">
              Dial 1930 immediately if defrauded. Direct API interconnect freezes unauthorized funds across 250+ banks within minutes.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTriggerCall('National Cybercrime Helpline', '1930')}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-950/60"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Dial 1930</span>
          </button>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-200 border border-blue-800 font-semibold text-xs flex items-center gap-1"
          >
            <span>Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#08183a]/90 border border-blue-500/25 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-blue-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bank name, toll-free number, country, or SWIFT code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 placeholder-blue-300/50 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              categoryFilter === 'ALL'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/60'
                : 'text-blue-300 hover:text-white bg-blue-950/60'
            }`}
          >
            All Institutions ({BANK_DIRECTORY.length})
          </button>
          <button
            onClick={() => setCategoryFilter('Indian')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              categoryFilter === 'Indian'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/60'
                : 'text-blue-300 hover:text-white bg-blue-950/60'
            }`}
          >
            🇮🇳 Indian Banks
          </button>
          <button
            onClick={() => setCategoryFilter('Global')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              categoryFilter === 'Global'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/60'
                : 'text-blue-300 hover:text-white bg-blue-950/60'
            }`}
          >
            🌐 International
          </button>
        </div>
      </div>

      {/* Bank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBanks.map((bank) => {
          const isFeatured = bank.isFeaturedPartner;

          return (
            <div
              key={bank.id}
              className={`p-5 rounded-2xl bg-[#08183a]/90 border transition-all duration-200 flex flex-col justify-between space-y-4 ${
                isFeatured
                  ? 'border-cyan-500/50 shadow-xl shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                  : 'border-blue-500/25 hover:border-blue-400/50 shadow-lg shadow-blue-950/40'
              }`}
            >
              {/* Card Top */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{bank.flag}</span>
                    <div>
                      <h3 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                        <span>{bank.name}</span>
                        {isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono">
                            FEATURED
                          </span>
                        )}
                      </h3>
                      <div className="text-[11px] text-blue-300/80 font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span>{bank.headquarters}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${bank.badgeColor}`}>
                    {bank.shortCode}
                  </span>
                </div>

                {/* Special Feature Highlight */}
                {bank.specialFeatures && (
                  <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-900/60 text-[11px] text-cyan-300 flex items-start gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{bank.specialFeatures}</span>
                  </div>
                )}

                {/* Toll-Free Numbers List */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] uppercase font-bold text-blue-300 tracking-wider">
                    24x7 Customer Care Toll-Free:
                  </div>
                  {bank.tollFree.map((number, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-[#051330] border border-blue-800/60 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 font-mono text-white font-bold">
                        <PhoneCall className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{number}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(number)}
                          className="p-1.5 rounded-lg hover:bg-blue-900/60 text-blue-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Number"
                        >
                          {copiedNumber === number ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleTriggerCall(bank.name, number)}
                          className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Hotlisting & Fraud Email */}
                <div className="p-2.5 rounded-xl bg-[#061536] border border-blue-900/70 space-y-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-400">Emergency Card Block: </span>
                    <span className="text-rose-300 font-mono font-bold">{bank.emergencyCardBlock}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">SWIFT BIC:</span>
                    <span className="text-cyan-300 font-mono font-bold">{bank.swiftCode}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Fraud Desk:</span>
                    <span className="text-blue-200 font-mono truncate max-w-[170px]">{bank.fraudEmail}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2 border-t border-blue-900/60">
                <button
                  onClick={() => handleEmergencyFreeze(bank.name)}
                  className="flex-1 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-700/50 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Lock Cards</span>
                </button>
                <button
                  onClick={() => handleTriggerCall(bank.name, bank.tollFree[0])}
                  className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Hotline</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call Simulator Dialog */}
      {activeCallBank && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#08183a] border border-blue-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl shadow-blue-950 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-cyan-400 flex items-center justify-center mx-auto text-cyan-400 animate-pulse">
              <PhoneCall className="w-8 h-8" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">{activeCallBank.name}</div>
              <div className="text-sm font-mono text-cyan-300 mt-1">{activeCallBank.number}</div>
              <div className="text-xs text-emerald-400 font-mono mt-2 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Connected • End-to-End Encrypted Bank Line</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Welcome to 24x7 Priority Customer Support. For Emergency Card Hotlisting press 1. For Fraud Reporting press 2.
            </p>

            <button
              onClick={() => setActiveCallBank(null)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-rose-950/60 transition-colors"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
