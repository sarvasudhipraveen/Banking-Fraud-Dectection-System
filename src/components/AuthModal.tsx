import React, { useState } from 'react';
import { User, UserType, UserRole } from '../types';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Shield,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Building2,
  CreditCard,
  Eye,
  EyeOff,
  Sparkles,
  KeyRound,
  Check,
  ShieldCheck
} from 'lucide-react';
import { validateBankingPassword } from '../utils/passwordRules';
import { DEMO_USERS } from '../services/bankData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout
}) => {
  const [userType, setUserType] = useState<UserType>('bank_staff');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedBank, setSelectedBank] = useState('Apex Premier Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('Senior Fraud Analyst');
  const [customerRole, setCustomerRole] = useState<UserRole>('Retail Banking Customer');

  // Password validation analysis
  const passwordCheck = validateBankingPassword(password);

  if (!isOpen) return null;

  const handleSelectDemoUser = (user: User) => {
    onLogin(user);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce password rules during sign up
    if (isSignUp && !passwordCheck.isValid) {
      return;
    }

    if (userType === 'bank_staff') {
      const staffUser: User = {
        id: `STF-${Math.floor(1000 + Math.random() * 9000)}`,
        name: name || (email.split('@')[0].replace('.', ' ') || 'Fraud Analyst'),
        email: email || 'analyst@apexbank.in',
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
        name: name || (email.split('@')[0].replace('.', ' ') || 'Banking Customer'),
        email: email || 'customer@banking.com',
        user_type: 'customer',
        role: customerRole,
        bank_name: selectedBank,
        account_number: accountNumber || `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        balance: selectedBank === 'Apex Premier Bank' ? 650000 : 125000,
        currency: ['JPMorgan Chase & Co.', 'HSBC Holdings', 'Citibank N.A.'].includes(selectedBank) ? 'USD' : 'INR',
        phone: '+91 98765 43210',
        createdAt: new Date().toISOString().split('T')[0]
      };
      onLogin(customerUser);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#071738] border border-blue-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-blue-950/80 space-y-4 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {currentUser ? 'Active Banking Session' : 'Secure Banking Authentication'}
              </h2>
              <p className="text-xs text-blue-300/80 font-mono">
                PCI-DSS & RBI Cyber Security Framework Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-blue-900/40 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {currentUser ? (
          /* Profile Details Card */
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0b204c]/80 border border-blue-500/30 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white text-lg font-bold shadow-lg shadow-blue-900/60 ring-2 ring-blue-400/40">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white truncate">{currentUser.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    currentUser.user_type === 'bank_staff' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentUser.user_type === 'bank_staff' ? 'Bank Staff' : 'Verified Customer'}
                  </span>
                </div>
                <div className="text-blue-200/80 font-mono truncate">{currentUser.email}</div>
                <div className="text-[11px] text-cyan-300 font-semibold mt-0.5">
                  {currentUser.bank_name || 'Apex Banking Partner Network'}
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3.5 rounded-xl bg-[#091b40]/90 border border-blue-900/60 text-slate-300">
              <div className="flex justify-between py-1 border-b border-blue-900/40">
                <span className="text-blue-300/70">Designated Role:</span>
                <span className="text-white font-semibold">{currentUser.role}</span>
              </div>
              {currentUser.user_type === 'bank_staff' ? (
                <>
                  <div className="flex justify-between py-1 border-b border-blue-900/40">
                    <span className="text-blue-300/70">Department:</span>
                    <span className="text-slate-200">{currentUser.department || 'Fraud Intelligence'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-blue-300/70">Security Clearance:</span>
                    <span className="text-emerald-400 font-mono font-bold">Tier-3 (Live ML & Card Freeze Authorized)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between py-1 border-b border-blue-900/40">
                    <span className="text-blue-300/70">Linked Account:</span>
                    <span className="text-cyan-300 font-mono font-bold">{currentUser.account_number || '9180 2004 8831 4920'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-blue-300/70">Available Ledger Balance:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {currentUser.currency === 'USD' ? '$' : '₹'}
                      {(currentUser.balance || 75000).toLocaleString('en-IN')}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 border border-blue-800 text-blue-200 font-semibold cursor-pointer transition-colors"
              >
                Close Session
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Form */
          <div className="space-y-4">
            {/* Quick Demo Accounts Switcher */}
            <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Demo Profiles (1-Click Switch):</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleSelectDemoUser(demo)}
                    className="p-2 rounded-lg bg-[#0b214a] hover:bg-blue-800/60 border border-blue-700/40 text-left transition-all cursor-pointer group"
                  >
                    <div className="font-bold text-white group-hover:text-cyan-300 truncate">
                      {demo.name}
                    </div>
                    <div className="text-[10px] text-blue-300/80 truncate">
                      {demo.user_type === 'bank_staff' ? '🛡️ ' : '💳 '}
                      {demo.role.split(' ')[0]} ({demo.bank_name?.split(' ')[0]})
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Portal Tab Switcher: Bank Staff vs Customer */}
            <div className="flex rounded-xl bg-blue-950/80 p-1 border border-blue-800/80">
              <button
                type="button"
                onClick={() => setUserType('bank_staff')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  userType === 'bank_staff'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/60'
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Bank Staff / Analyst</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('customer')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  userType === 'customer'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/60'
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Customer / User</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              {/* Name (if sign up) */}
              {isSignUp && (
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">Full Legal Name</label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={userType === 'bank_staff' ? 'e.g. Ramesh Kulkarni' : 'e.g. Vikramaditya Rao'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 focus:border-cyan-400 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email / Bank ID */}
              <div>
                <label className="block text-blue-200 mb-1 font-semibold">
                  {userType === 'bank_staff' ? 'Official Bank Staff Email' : 'Registered Customer Email'}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    placeholder={userType === 'bank_staff' ? 'analyst@apexbank.in' : 'user@domain.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Bank Selection */}
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

              {/* Customer Account Number (if customer) */}
              {userType === 'customer' && isSignUp && (
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">Bank Account Number / Card ID</label>
                  <div className="relative">
                    <CreditCard className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="e.g. 9180 2004 8831 4920"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Password with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-blue-200 font-semibold">Password</label>
                  <span className="text-[10px] text-cyan-300 font-mono">
                    Strength: <span className="font-bold text-white">{passwordCheck.strengthLabel}</span>
                  </span>
                </div>
                <div className="relative">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter security password"
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
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Password Strength Meter Bar */}
                <div className="mt-1.5 flex gap-1 h-1.5 w-full bg-blue-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      passwordCheck.score === 0
                        ? 'w-1/5 bg-rose-500'
                        : passwordCheck.score === 1
                        ? 'w-2/5 bg-amber-500'
                        : passwordCheck.score === 2
                        ? 'w-3/5 bg-yellow-400'
                        : passwordCheck.score === 3
                        ? 'w-4/5 bg-blue-400'
                        : 'w-full bg-emerald-400'
                    }`}
                  />
                </div>
              </div>

              {/* Real-time Password Rules Checklist (Requirement: "password should contain rules") */}
              <div className="p-3 rounded-xl bg-[#040e26] border border-blue-900/60 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-200">
                  <span>Mandatory Security Rules:</span>
                  <span className={`text-[10px] font-mono ${passwordCheck.isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {passwordCheck.rules.filter(r => r.satisfied).length} of 5 satisfied
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-[11px]">
                  {passwordCheck.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                        rule.satisfied
                          ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-950/40 text-slate-400 border border-blue-900/40'
                      }`}
                    >
                      {rule.satisfied ? (
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
                      )}
                      <span className="truncate">{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Role Select (if sign up) */}
              {isSignUp && (
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">Account Tier / Role</label>
                  {userType === 'bank_staff' ? (
                    <select
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value as UserRole)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Senior Fraud Analyst">Senior Fraud Analyst</option>
                      <option value="ML Risk Officer">ML Risk Officer</option>
                      <option value="Compliance Auditor">Compliance Auditor</option>
                    </select>
                  ) : (
                    <select
                      value={customerRole}
                      onChange={(e) => setCustomerRole(e.target.value as UserRole)}
                      className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Retail Banking Customer">Retail Banking Customer</option>
                      <option value="Apex Reserve Private Client">Apex Reserve Private Client</option>
                      <option value="International Corporate Client">International Corporate Client</option>
                    </select>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSignUp && !passwordCheck.isValid}
                  className={`w-full py-2.5 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    isSignUp && !passwordCheck.isValid
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : userType === 'bank_staff'
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/60'
                      : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/60'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isSignUp
                      ? userType === 'bank_staff'
                        ? 'Register Staff Credentials'
                        : 'Create Customer Account'
                      : userType === 'bank_staff'
                      ? 'Sign In as Bank Staff'
                      : 'Sign In as Customer'}
                  </span>
                </button>
              </div>

              {/* Toggle Sign Up / Sign In */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[11px] text-blue-300 hover:text-cyan-300 cursor-pointer transition-colors"
                >
                  {isSignUp
                    ? 'Already have verified credentials? Sign In here'
                    : "Need new banking portal credentials? Register with security rules"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
