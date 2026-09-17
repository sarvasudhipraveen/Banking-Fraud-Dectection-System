import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Mail,
  Building2,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Check,
  Zap,
  ArrowRight,
  Shield,
  Activity,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { User, UserType, UserRole } from '../types';
import { validateBankingPassword } from '../utils/passwordRules';
import { DEMO_USERS } from '../services/bankData';
import { RotatingDebitCard } from './3d/RotatingDebitCard';
import { MagicCard } from './3d/MagicCard';
import { GsapCyberGrid } from './3d/GsapCyberGrid';

interface LoginGateViewProps {
  onLogin: (user: User) => void;
}

export const LoginGateView: React.FC<LoginGateViewProps> = ({ onLogin }) => {
  const [userType, setUserType] = useState<UserType>('bank_staff');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBank, setSelectedBank] = useState('Apex Premier Bank');
  const [staffRole, setStaffRole] = useState<UserRole>('Senior Fraud Analyst');
  const [customerRole, setCustomerRole] = useState<UserRole>('Apex Reserve Private Client');

  const passwordCheck = validateBankingPassword(password);

  const handleSelectDemoUser = (user: User) => {
    onLogin(user);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSignUp && !passwordCheck.isValid) {
      return;
    }

    if (userType === 'bank_staff') {
      const staffUser: User = {
        id: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name || (email ? email.split('@')[0].replace('.', ' ') : 'Senior Fraud Analyst'),
        email: email || 'praveen.analyst@apexbank.in',
        user_type: 'bank_staff',
        role: staffRole,
        department: 'Financial Crime & ML Risk Intelligence',
        bank_name: selectedBank,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onLogin(staffUser);
    } else {
      const customerUser: User = {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name || (email ? email.split('@')[0].replace('.', ' ') : 'Vikramaditya Rao'),
        email: email || 'vikram.rao@reserve.apexbank.in',
        user_type: 'customer',
        role: customerRole,
        bank_name: selectedBank,
        account_number: '9180 2004 8831 4920',
        balance: selectedBank === 'Apex Premier Bank' ? 842500 : 125000,
        currency: ['JPMorgan Chase & Co.', 'HSBC Holdings', 'Citibank N.A.'].includes(selectedBank) ? 'USD' : 'INR',
        phone: '+91 98490 12345',
        createdAt: new Date().toISOString().split('T')[0]
      };
      onLogin(customerUser);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#020919] text-slate-100 cinematic-blue-glow">
      {/* GSAP Cyber Particle & Grid Canvas */}
      <GsapCyberGrid />

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-blue-500/20 bg-[#040e24]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/60 ring-1 ring-cyan-300/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight font-sans">
                APEX BANKING AI GRID
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                2026 EDITION
              </span>
            </div>
            <p className="text-[11px] text-blue-300/80 font-mono">
              Secure Gateway • ML Fraud Classification & Risk Intercept System
            </p>
          </div>
        </div>

        {/* Live Security Indicator */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Zero-Trust Shield: LOCKED</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: 3D Showcase, Card, and 1-Click Demo Passkeys (5 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/40 border border-blue-400/30 text-cyan-300 text-xs font-mono mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Protected Enterprise Environment</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                Authentication Required to Access Banking Engine
              </h1>
              <p className="text-sm text-blue-200/80 mt-2">
                Log in using your Bank Staff credentials or Customer Account to access the real-time fraud defense platform, payment ledger, and card controls.
              </p>
            </div>

            {/* Interactive 3D Debit Card Component */}
            <div className="py-2">
              <RotatingDebitCard
                cardHolder={userType === 'bank_staff' ? 'PRAVEEN SRINIVAS' : 'VIKRAMADITYA RAO'}
                accountNumber={userType === 'bank_staff' ? 'STF •••• •••• 8921' : '4892 •••• •••• 8821'}
                bankName={selectedBank.toUpperCase()}
              />
            </div>

            {/* 1-Click Fast Passkeys Demo Section */}
            <div className="p-4 rounded-2xl bg-[#08183a]/80 border border-blue-500/25 space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Instant Demo Passkeys (1-Click)
                </span>
                <span className="text-[10px] text-blue-300 font-mono">No password required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelectDemoUser(u)}
                    className="p-2.5 rounded-xl bg-[#051330] hover:bg-blue-900/50 border border-blue-800/60 hover:border-cyan-400 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs group-hover:text-cyan-300">
                        {u.name}
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        u.user_type === 'bank_staff'
                          ? 'bg-blue-900/80 text-blue-300'
                          : 'bg-cyan-900/80 text-cyan-300'
                      }`}>
                        {u.user_type === 'bank_staff' ? 'STAFF' : 'CLIENT'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate mt-1">
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Security Metrics */}
            <div className="flex items-center justify-between text-[11px] text-blue-300/80 font-mono px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                RBI / Federal Banking Compliant
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Response Speed: 18ms
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                256-Bit HSM
              </span>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: 3D Magic Card Login Form (7 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="lg:col-span-7"
          >
            <MagicCard className="p-6 sm:p-8" gradientColor="rgba(56, 189, 248, 0.35)" gradientSize={320}>
              {/* Dual Portal Switcher Tabs */}
              <div className="flex bg-[#05112a] p-1 rounded-xl border border-blue-900/80 mb-6">
                <button
                  type="button"
                  onClick={() => setUserType('bank_staff')}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    userType === 'bank_staff'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/60 font-black'
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-cyan-300" />
                  <span>Bank Staff Portal</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950/60 text-blue-200">
                    ML / Risk
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('customer')}
                  className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    userType === 'customer'
                      ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/60 font-black'
                      : 'text-blue-300 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-white" />
                  <span>Customer Portal</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-200">
                    Retail & Reserve
                  </span>
                </button>
              </div>

              {/* Form Title & Mode Toggle */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isSignUp
                      ? userType === 'bank_staff' ? 'Register Bank Staff Account' : 'Open / Register Customer Account'
                      : userType === 'bank_staff' ? 'Bank Staff Terminal Login' : 'Customer Account Login'
                    }
                  </h2>
                  <p className="text-xs text-blue-200/70 mt-0.5">
                    {isSignUp
                      ? 'Enter your details and satisfy banking password rules to create access'
                      : 'Authenticate with your registered banking email and password'
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 underline underline-offset-4 cursor-pointer"
                >
                  {isSignUp ? 'Already have access? Log In' : 'New account? Register'}
                </button>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Full Name (if sign up) */}
                {isSignUp && (
                  <div>
                    <label className="block text-blue-200 mb-1 font-semibold">
                      Full Legal Name
                    </label>
                    <div className="relative">
                      <UserCheck className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="e.g. Vikramaditya Rao"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">
                    {userType === 'bank_staff' ? 'Bank Staff Corporate Email' : 'Registered Customer Email'}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      placeholder={userType === 'bank_staff' ? 'analyst@apexbank.in' : 'vikram.rao@reserve.apexbank.in'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Bank Institution Selection */}
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">Primary Banking Institution</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Apex Premier Bank">Apex Premier Bank (India - Retail & Reserve)</option>
                      <option value="HDFC Bank">HDFC Bank (India)</option>
                      <option value="ICICI Bank">ICICI Bank (India)</option>
                      <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                      <option value="JPMorgan Chase & Co.">JPMorgan Chase & Co. (USA / Global)</option>
                      <option value="Barclays Bank PLC">Barclays Bank PLC (UK)</option>
                      <option value="HSBC Holdings">HSBC Holdings (Global)</option>
                      <option value="Citibank N.A.">Citibank N.A. (USA / Global)</option>
                      <option value="DBS Bank Ltd">DBS Bank Ltd (Singapore)</option>
                    </select>
                  </div>
                </div>

                {/* Role Selection */}
                {isSignUp && (
                  <div>
                    <label className="block text-blue-200 mb-1 font-semibold">
                      {userType === 'bank_staff' ? 'Staff Security Clearance / Role' : 'Account Tier'}
                    </label>
                    {userType === 'bank_staff' ? (
                      <select
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value as UserRole)}
                        className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="Senior Fraud Analyst">Senior Fraud Analyst (L2 Real-Time Review)</option>
                        <option value="ML Risk Officer">ML Risk Officer (Model Validation & Governance)</option>
                        <option value="Compliance Auditor">Compliance Auditor (Regulatory & Audit Logs)</option>
                      </select>
                    ) : (
                      <select
                        value={customerRole}
                        onChange={(e) => setCustomerRole(e.target.value as UserRole)}
                        className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="Apex Reserve Private Client">Apex Reserve Private Client (Priority)</option>
                        <option value="Retail Banking Customer">Retail Banking Customer</option>
                        <option value="International Corporate Client">International Corporate Client</option>
                      </select>
                    )}
                  </div>
                )}

                {/* Password with Eye Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-blue-200 font-semibold">Banking Access Password</label>
                    {!isSignUp && (
                      <span className="text-[11px] text-cyan-300 font-mono">
                        Demo: Any valid password
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter banking password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-10 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-blue-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Meter & Banking Rules Visual Checklist */}
                <div className="p-3.5 rounded-xl bg-[#040e24] border border-blue-900/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-cyan-400" />
                      Banking Password Rules & Strength
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      passwordCheck.strengthLabel === 'Strong'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : passwordCheck.strengthLabel === 'Good'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : passwordCheck.strengthLabel === 'Fair'
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}>
                      {passwordCheck.strengthLabel}
                    </span>
                  </div>

                  {/* Visual Strength Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`flex-1 h-full transition-all duration-300 ${
                          passwordCheck.score >= step
                            ? passwordCheck.score === 4
                              ? 'bg-emerald-500'
                              : passwordCheck.score === 3
                              ? 'bg-cyan-500'
                              : passwordCheck.score === 2
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                            : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>

                  {/* 5-Rule Checklist Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                    {passwordCheck.rules.map((rule) => (
                      <div
                        key={rule.id}
                        className={`flex items-center gap-1.5 transition-colors ${
                          rule.satisfied ? 'text-emerald-400 font-semibold' : 'text-slate-400'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          rule.satisfied
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}>
                          {rule.satisfied ? <Check className="w-2.5 h-2.5" /> : '•'}
                        </div>
                        <span className="truncate">{rule.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSignUp && !passwordCheck.isValid}
                    className={`w-full py-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
                      isSignUp && !passwordCheck.isValid
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                        : userType === 'bank_staff'
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/60'
                        : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-900/60'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isSignUp
                        ? 'Create Account & Unlock Dashboard'
                        : userType === 'bank_staff'
                        ? 'Authenticate & Unlock Staff Dashboard'
                        : 'Authenticate & Unlock Banking Portal'
                      }
                    </span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </form>
            </MagicCard>
          </motion.div>

        </div>
      </main>

      {/* Footer System Status */}
      <footer className="relative z-20 border-t border-blue-900/50 bg-[#030a1c]/80 backdrop-blur-md px-4 sm:px-8 py-3 text-center text-xs text-blue-300/70 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Banking Fraud Detection System © 2026 • Real-Time Protection Platform
          </span>
          <div className="flex items-center gap-3">
            <span className="text-emerald-400">● Core Banking API: 100% Online</span>
            <span>•</span>
            <span>AES-256 HSM Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
