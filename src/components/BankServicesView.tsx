import React, { useState } from 'react';
import {
  Building2,
  Shield,
  CreditCard,
  Globe,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Search,
  Zap,
  KeyRound,
  ShieldCheck,
  Send,
  RefreshCw
} from 'lucide-react';

export const BankServicesView: React.FC = () => {
  // Apex Premier Card Controls State
  const [contactlessEnabled, setContactlessEnabled] = useState(true);
  const [contactlessLimit, setContactlessLimit] = useState(5000);
  const [intlEcomEnabled, setIntlEcomEnabled] = useState(false);
  const [atmDailyLimit, setAtmDailyLimit] = useState(50000);
  const [burgundyShieldActive, setBurgundyShieldActive] = useState(true);

  // Virtual Token State
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  // International FX Converter State
  const [fxFromCurrency, setFxFromCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'>('USD');
  const [fxToCurrency, setFxToCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP' | 'AED'>('INR');
  const [fxAmount, setFxAmount] = useState('2500');

  // SWIFT Anomaly & Sanctions Screener State
  const [swiftCode, setSwiftCode] = useState('BARCGB22XXX');
  const [beneficiaryIban, setBeneficiaryIban] = useState('GB29 BARC 2000 0055 9921 44');
  const [destCountry, setDestCountry] = useState('United Kingdom');
  const [screeningResult, setScreeningResult] = useState<{
    sanctionsClear: boolean;
    fatfStatus: 'Low Risk' | 'Monitored' | 'High Risk';
    riskScore: number;
    recommendedAction: string;
  } | null>(null);
  const [isScreening, setIsScreening] = useState(false);

  // Exchange Rates against 1 USD
  const fxRates: Record<string, number> = {
    USD: 1.0,
    INR: 86.42,
    EUR: 0.92,
    GBP: 0.79,
    AED: 3.67
  };

  const calculateConvertedFx = () => {
    const amt = parseFloat(fxAmount) || 0;
    const inUsd = amt / fxRates[fxFromCurrency];
    const converted = inUsd * fxRates[fxToCurrency];
    return converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleGenerateVirtualToken = () => {
    setIsGeneratingToken(true);
    setTimeout(() => {
      const token = `4921-TOKEN-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedToken(token);
      setIsGeneratingToken(false);
    }, 700);
  };

  const handleRunSwiftScreening = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScreening(true);

    setTimeout(() => {
      const isHighRiskCountry = ['North Korea', 'Iran', 'Syria', 'Russia'].includes(destCountry);
      const isOffshoreJurisdiction = ['Panama', 'Cayman Islands', 'Cyprus'].includes(destCountry);

      if (isHighRiskCountry) {
        setScreeningResult({
          sanctionsClear: false,
          fatfStatus: 'High Risk',
          riskScore: 98,
          recommendedAction: 'BLOCK WIRE IMMEDIATELY: OFAC/FATF High-Risk Jurisdiction Match.'
        });
      } else if (isOffshoreJurisdiction) {
        setScreeningResult({
          sanctionsClear: true,
          fatfStatus: 'Monitored',
          riskScore: 62,
          recommendedAction: 'STEP-UP DUE DILIGENCE: Require invoice validation & Ultimate Beneficial Owner (UBO) declaration.'
        });
      } else {
        setScreeningResult({
          sanctionsClear: true,
          fatfStatus: 'Low Risk',
          riskScore: 4,
          recommendedAction: 'APPROVED FOR SWIFT gpi FAST-TRACK: Compliant with AML/CFT norms.'
        });
      }
      setIsScreening(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#091b40]/80 border border-blue-500/25 shadow-xl shadow-blue-950/60 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-600/20 border border-pink-500/30 text-pink-400">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Apex Premier & International Banking Grid
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-2xl">
            Specialized controls engineered for Apex Reserve accounts, contactless NFC limit governance, one-time virtual tokens, cross-border SWIFT sanctions screening, and global multi-currency settlements.
          </p>
        </div>

        {/* Apex Reserve Status Chip */}
        <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-950/50 to-blue-950/50 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Apex Reserve AI Shield: ACTIVE</span>
        </div>
      </div>

      {/* Grid: Apex Bank Controls + International Banking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MODULE 1: Apex Reserve Card Safety Controls */}
        <div className="p-6 rounded-2xl bg-[#08183a]/90 border border-cyan-500/30 space-y-6 shadow-xl shadow-blue-950/50">
          <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Apex Premier Card Security Suite</h2>
                <p className="text-xs text-blue-300 font-mono">Apex Reserve Debit & Forex World Card</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700 font-mono">
              RBI Mandate 2026
            </span>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-4 text-xs">
            {/* Contactless NFC Switch */}
            <div className="p-3.5 rounded-xl bg-[#051330] border border-blue-800/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Contactless NFC Tap & Pay</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${contactlessEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {contactlessEnabled ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Allows POS payments without PIN entry up to statutory limits
                </div>
              </div>
              <button
                onClick={() => setContactlessEnabled(!contactlessEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  contactlessEnabled ? 'bg-pink-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Contactless Limit Slider */}
            {contactlessEnabled && (
              <div className="p-3.5 rounded-xl bg-[#051330] border border-blue-800/60 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-blue-200">Per-Tap Contactless Max Limit:</span>
                  <span className="font-mono text-pink-400 font-bold">₹{contactlessLimit.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={contactlessLimit}
                  onChange={(e) => setContactlessLimit(Number(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>₹1,000 (Conservative)</span>
                  <span>₹5,000 (RBI Standard)</span>
                  <span>₹15,000 (Burgundy)</span>
                </div>
              </div>
            )}

            {/* International E-Commerce Kill-Switch */}
            <div className="p-3.5 rounded-xl bg-[#051330] border border-blue-800/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>International E-Commerce & POS</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${intlEcomEnabled ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {intlEcomEnabled ? 'UNLOCKED' : 'LOCKED (Safe)'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Instantly shields card against overseas cross-border skimming attacks
                </div>
              </div>
              <button
                onClick={() => setIntlEcomEnabled(!intlEcomEnabled)}
                className={`w-12 h-6 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                  intlEcomEnabled ? 'bg-amber-600 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Virtual Token Generator */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#06183a] to-[#0a2350] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Dynamic Virtual Token (Single-Use)</div>
                  <div className="text-[11px] text-cyan-200/80">Zero-risk disposable card token for online checkouts</div>
                </div>
                <button
                  onClick={handleGenerateVirtualToken}
                  disabled={isGeneratingToken}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-cyan-950/60 flex items-center gap-1.5"
                >
                  {isGeneratingToken ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <KeyRound className="w-3.5 h-3.5" />}
                  <span>Generate Token</span>
                </button>
              </div>

              {generatedToken && (
                <div className="p-2.5 rounded-lg bg-[#030d22] border border-cyan-400/50 flex items-center justify-between font-mono text-cyan-300 font-bold text-xs mt-2 animate-fadeIn">
                  <span>{generatedToken}</span>
                  <span className="text-[10px] text-emerald-400 font-sans">Active for 15 mins</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODULE 2: International Banking, SWIFT Sanctions & Multi-Currency */}
        <div className="p-6 rounded-2xl bg-[#08183a]/90 border border-blue-500/30 space-y-6 shadow-xl shadow-blue-950/50">
          <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">International Multi-Currency & SWIFT</h2>
                <p className="text-xs text-blue-300 font-mono">JPMorgan, Barclays & Global Banking Bridge</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-cyan-300 border border-cyan-700 font-mono">
              SWIFT gpi 2026
            </span>
          </div>

          {/* Live FX Converter */}
          <div className="p-4 rounded-xl bg-[#051330] border border-blue-800/60 space-y-3 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Institutional FX Calculator</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Transfer Amount</label>
                <input
                  type="number"
                  value={fxAmount}
                  onChange={(e) => setFxAmount(e.target.value)}
                  className="w-full bg-[#08183a] border border-blue-700/60 text-white font-mono rounded-lg p-2 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-slate-400 mb-1">From</label>
                  <select
                    value={fxFromCurrency}
                    onChange={(e) => setFxFromCurrency(e.target.value as any)}
                    className="w-full bg-[#08183a] border border-blue-700/60 text-white font-mono rounded-lg p-2 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">To</label>
                  <select
                    value={fxToCurrency}
                    onChange={(e) => setFxToCurrency(e.target.value as any)}
                    className="w-full bg-[#08183a] border border-blue-700/60 text-white font-mono rounded-lg p-2 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Converted Output Banner */}
            <div className="p-3 rounded-lg bg-blue-950/70 border border-blue-800/80 flex items-center justify-between">
              <span className="text-slate-300">Target Settlement Value:</span>
              <span className="font-mono text-base font-extrabold text-cyan-300">
                {fxToCurrency === 'USD' ? '$' : fxToCurrency === 'GBP' ? '£' : fxToCurrency === 'EUR' ? '€' : '₹'}
                {calculateConvertedFx()}
              </span>
            </div>
          </div>

          {/* SWIFT Sanctions & OFAC Watchlist Radar */}
          <form onSubmit={handleRunSwiftScreening} className="p-4 rounded-xl bg-[#051330] border border-blue-800/60 space-y-3 text-xs">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>SWIFT Sanctions & OFAC Radar Screener</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">SWIFT BIC Code</label>
                <input
                  type="text"
                  value={swiftCode}
                  onChange={(e) => setSwiftCode(e.target.value)}
                  className="w-full bg-[#08183a] border border-blue-700/60 text-white font-mono rounded-lg p-2 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Destination Jurisdiction</label>
                <select
                  value={destCountry}
                  onChange={(e) => setDestCountry(e.target.value)}
                  className="w-full bg-[#08183a] border border-blue-700/60 text-white rounded-lg p-2 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="United Kingdom">United Kingdom (Barclays/HSBC)</option>
                  <option value="United States">United States (JPMorgan Chase)</option>
                  <option value="Singapore">Singapore (DBS Bank)</option>
                  <option value="United Arab Emirates">United Arab Emirates (Dubai)</option>
                  <option value="Panama">Panama (Offshore Jurisdiction)</option>
                  <option value="Russia">Russia (Sanctioned Corridor)</option>
                  <option value="Iran">Iran (OFAC Embargo Corridor)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isScreening}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-900/60 transition-colors flex items-center justify-center gap-1.5"
            >
              {isScreening ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              <span>Screen Foreign Wire via AML/OFAC Grid</span>
            </button>

            {/* Screening Output */}
            {screeningResult && (
              <div className={`p-3 rounded-xl border mt-2 space-y-1.5 animate-fadeIn ${
                screeningResult.sanctionsClear
                  ? screeningResult.fatfStatus === 'Monitored'
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span>Sanctions Screening: {screeningResult.sanctionsClear ? 'PASSED' : 'FLAGGED VIOLATION'}</span>
                  <span className="font-mono text-xs">Risk Index: {screeningResult.riskScore}/100</span>
                </div>
                <div className="text-[11px] leading-relaxed">
                  {screeningResult.recommendedAction}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
