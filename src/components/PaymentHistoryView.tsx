import React, { useState, useMemo } from 'react';
import { BankingTransaction, User } from '../types';
import {
  CreditCard,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Send,
  Building2,
  RefreshCw,
  Download,
  AlertOctagon,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { PaymentReceiptModal } from './PaymentReceiptModal';
import { PaymentDisputeModal } from './PaymentDisputeModal';
import { BANK_DIRECTORY } from '../services/bankData';
import { runFraudInference } from '../services/mlEngine';

interface PaymentHistoryViewProps {
  transactions: BankingTransaction[];
  currentUser: User | null;
  onAddTransaction: (txn: BankingTransaction) => void;
  onUpdateTransaction: (txnId: string, updates: Partial<BankingTransaction>) => void;
  onInspectTransaction: (txn: BankingTransaction) => void;
}

export const PaymentHistoryView: React.FC<PaymentHistoryViewProps> = ({
  transactions,
  currentUser,
  onAddTransaction,
  onUpdateTransaction,
  onInspectTransaction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bankFilter, setBankFilter] = useState('ALL');
  const [modeFilter, setModeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal states
  const [selectedReceiptTxn, setSelectedReceiptTxn] = useState<BankingTransaction | null>(null);
  const [selectedDisputeTxn, setSelectedDisputeTxn] = useState<BankingTransaction | null>(null);

  // Quick Transfer Simulation Form
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferBank, setTransferBank] = useState('Apex Premier Bank');
  const [transferBeneficiary, setTransferBeneficiary] = useState('Swiggy Instamart Direct');
  const [transferAccount, setTransferAccount] = useState('swiggy@apexbank');
  const [transferAmount, setTransferAmount] = useState('1450');
  const [transferMode, setTransferMode] = useState<'UPI' | 'NetBanking' | 'Credit Card' | 'SWIFT Wire'>('UPI');
  const [isInternationalWire, setIsInternationalWire] = useState(false);
  const [isSubmittingTransfer, setIsSubmittingTransfer] = useState(false);

  // Filtered transactions
  const filteredPayments = useMemo(() => {
    return transactions.filter((t) => {
      const bankName = t.bank_name || 'Apex Premier Bank';
      const mode = t.payment_mode || (t.transaction_type === 'wire' ? 'SWIFT Wire' : t.transaction_type === 'upi' ? 'UPI' : 'Credit Card');
      const utr = t.reference_utr || t.transaction_id;
      const beneficiary = t.beneficiary_name || t.merchant_category;

      if (bankFilter !== 'ALL' && !bankName.toLowerCase().includes(bankFilter.toLowerCase())) {
        return false;
      }
      if (modeFilter !== 'ALL' && mode !== modeFilter) {
        return false;
      }
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'Legitimate' && t.status !== 'Legitimate') return false;
        if (statusFilter === 'Fraud' && t.status !== 'Fraud') return false;
        if (statusFilter === 'Under Review' && t.status !== 'Under Review') return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          t.transaction_id.toLowerCase().includes(q) ||
          utr.toLowerCase().includes(q) ||
          beneficiary.toLowerCase().includes(q) ||
          t.customer_id.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          bankName.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [transactions, bankFilter, modeFilter, statusFilter, searchQuery]);

  // Aggregate Stats
  const totalSettledAmount = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'Legitimate')
      .reduce((sum, t) => sum + (t.currency === 'USD' ? t.amount * 86 : t.amount), 0);
  }, [transactions]);

  const flaggedFraudCount = useMemo(() => {
    return transactions.filter((t) => t.status === 'Fraud').length;
  }, [transactions]);

  const underReviewCount = useMemo(() => {
    return transactions.filter((t) => t.status === 'Under Review').length;
  }, [transactions]);

  // Handle Quick Transfer with Live ML Evaluation
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTransfer(true);

    const amt = parseFloat(transferAmount) || 1000;
    const isIntl = isInternationalWire || transferMode === 'SWIFT Wire';

    // ML feature engineering input
    const mlInput = {
      customer_id: currentUser?.customer_id || currentUser?.id || 'CUST-8821',
      amount: amt,
      transaction_type: (transferMode === 'UPI' ? 'upi' : transferMode === 'SWIFT Wire' ? 'wire' : 'online') as any,
      merchant_category: 'shopping' as any,
      location: isIntl ? 'Zurich, Switzerland' : 'Mumbai, India',
      device_type: 'trusted_mobile' as any,
      is_international: isIntl,
      hour: new Date().getHours(),
      previous_transactions: 12,
      failed_attempts: 0,
      average_transaction_amount: 3500,
      is_new_device: false,
      is_new_location: false,
      transactions_last_1h: 1,
      transactions_last_24h: 3
    };

    // Run real-time inference through the ML engine
    const mlResult = runFraudInference(mlInput, 'xgboost');

    const newTxn: BankingTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      transaction_id: `${transferBank.slice(0, 4).toUpperCase()}-UTR-${Math.floor(10000 + Math.random() * 90000)}`,
      customer_id: mlInput.customer_id,
      amount: amt,
      currency: isIntl && transferBank.includes('Chase') ? 'USD' : 'INR',
      bank_name: transferBank,
      payment_mode: transferMode,
      beneficiary_name: transferBeneficiary,
      beneficiary_account: transferAccount,
      reference_utr: `${transferBank.slice(0, 4).toUpperCase()}${Date.now().toString().slice(-8)}`,
      transaction_type: mlInput.transaction_type,
      merchant_category: mlInput.merchant_category,
      location: mlInput.location,
      device_type: mlInput.device_type,
      is_international: mlInput.is_international,
      hour: mlInput.hour,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: mlResult.prediction === 'FRAUD' ? 'Fraud' : 'Legitimate',
      risk_level: mlResult.risk_level,
      fraud_probability: mlResult.fraud_probability,
      risk_score: mlResult.risk_score,
      failed_attempts: 0,
      previous_transaction_amount: 3500,
      transactions_last_24h: 4,
      action_taken: mlResult.prediction === 'FRAUD' ? 'Blocked' : 'Approved'
    };

    setTimeout(() => {
      onAddTransaction(newTxn);
      setIsSubmittingTransfer(false);
      setShowTransferModal(false);
      // Auto open receipt if approved
      setSelectedReceiptTxn(newTxn);
    }, 600);
  };

  const handleDisputeSubmit = (txnId: string, reason: string) => {
    onUpdateTransaction(txnId, {
      dispute_status: 'Under Investigation',
      dispute_reason: reason
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#091b40]/80 border border-blue-500/25 shadow-xl shadow-blue-950/60 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-cyan-400">
              <CreditCard className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Payment History & Clearance Ledger
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-blue-200/80 mt-1 max-w-2xl">
            Real-time settlement records, multi-bank clearance audit trails, official downloadable E-Receipts, and instant customer fraud dispute dockets.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTransferModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-900/60 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Initiate Fast Transfer</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Settled */}
        <div className="p-4 rounded-xl bg-[#08183a]/80 border border-blue-500/20 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
            Total Settled Payments
          </div>
          <div className="text-xl sm:text-2xl font-black text-white font-mono mt-1">
            ₹{(totalSettledAmount / 100000).toFixed(2)} Lakhs
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cleared via Apex & Global Grid</span>
          </div>
        </div>

        {/* Success Clearance Rate */}
        <div className="p-4 rounded-xl bg-[#08183a]/80 border border-blue-500/20 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider">
            Clearance Success Rate
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono mt-1">
            {((transactions.filter(t => t.status === 'Legitimate').length / (transactions.length || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-blue-300/80 mt-1">
            Average UTR Latency: <span className="font-mono text-white">1.2s</span>
          </div>
        </div>

        {/* Flagged Fraud Blocked */}
        <div className="p-4 rounded-xl bg-[#08183a]/80 border border-rose-500/20 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
            Fraud Attacks Intercepted
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 font-mono mt-1">
            {flaggedFraudCount} Transactions
          </div>
          <div className="flex items-center gap-1 text-[11px] text-rose-400/90 mt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Zero Customer Liability</span>
          </div>
        </div>

        {/* Under Review */}
        <div className="p-4 rounded-xl bg-[#08183a]/80 border border-amber-500/20 backdrop-blur-md">
          <div className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">
            Under Review / Step-Up OTP
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono mt-1">
            {underReviewCount} Flagged
          </div>
          <div className="text-[11px] text-amber-300/80 mt-1">
            Requires 2-Factor Biometric Verification
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#08183a]/90 border border-blue-500/25 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-blue-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by UTR, Beneficiary, Customer ID, Location, or Bank..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl pl-9 pr-3 py-2 placeholder-blue-300/50 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bank Filter */}
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="bg-[#051330] border border-blue-700/50 text-blue-200 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none font-semibold"
          >
            <option value="ALL">All Banking Institutions</option>
            <option value="Apex">Apex Premier Bank</option>
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="SBI">State Bank of India</option>
            <option value="Chase">JPMorgan Chase</option>
            <option value="Barclays">Barclays Bank</option>
            <option value="HSBC">HSBC Holdings</option>
            <option value="Citi">Citibank</option>
          </select>

          {/* Mode Filter */}
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="bg-[#051330] border border-blue-700/50 text-blue-200 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none font-semibold"
          >
            <option value="ALL">All Payment Rails</option>
            <option value="UPI">UPI 2.0</option>
            <option value="NetBanking">NetBanking</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="SWIFT Wire">SWIFT Wire (International)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#051330] border border-blue-700/50 text-blue-200 rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none font-semibold"
          >
            <option value="ALL">All Statuses</option>
            <option value="Legitimate">Settled / Legitimate</option>
            <option value="Under Review">Under Review</option>
            <option value="Fraud">Fraud Blocked</option>
          </select>
        </div>
      </div>

      {/* Payment Ledger Table */}
      <div className="rounded-2xl bg-[#08183a]/90 border border-blue-500/25 overflow-hidden shadow-xl shadow-blue-950/70">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#051330] text-blue-300 font-semibold border-b border-blue-900/80">
              <tr>
                <th className="py-3.5 px-4">Timestamp & UTR</th>
                <th className="py-3.5 px-4">Institution</th>
                <th className="py-3.5 px-4">Beneficiary / Merchant</th>
                <th className="py-3.5 px-4">Payment Rails</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">AI Risk & Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/40">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <CreditCard className="w-10 h-10 text-blue-500/40 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-slate-300">No payment records found</div>
                    <div className="text-xs text-slate-500">Try adjusting your filters or initiate a new transfer.</div>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((t) => {
                  const bankName = t.bank_name || 'Apex Premier Bank';
                  const currencySymbol = t.currency === 'USD' ? '$' : t.currency === 'GBP' ? '£' : '₹';
                  const isFraud = t.status === 'Fraud';
                  const isReview = t.status === 'Under Review';

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-blue-900/25 transition-colors cursor-pointer"
                      onClick={() => onInspectTransaction(t)}
                    >
                      {/* Timestamp & UTR */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-white font-bold">{t.reference_utr || t.transaction_id}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{t.timestamp}</span>
                        </div>
                      </td>

                      {/* Institution Badge */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="font-semibold text-white truncate max-w-[120px]">{bankName}</span>
                        </div>
                        <div className="text-[10px] text-blue-300/80 font-mono">{t.location}</div>
                      </td>

                      {/* Beneficiary */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{t.beneficiary_name || t.merchant_category}</div>
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                          {t.beneficiary_account || t.customer_id}
                        </div>
                      </td>

                      {/* Payment Rails */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono font-semibold">
                          {t.payment_mode || (t.transaction_type === 'wire' ? 'SWIFT Wire' : t.transaction_type === 'upi' ? 'UPI' : 'Card')}
                        </span>
                        {t.is_international && (
                          <div className="text-[9px] text-cyan-300 font-semibold flex items-center gap-1 mt-0.5">
                            <Globe className="w-2.5 h-2.5" />
                            <span>Cross-Border</span>
                          </div>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4">
                        <div className={`font-mono text-sm font-extrabold ${isFraud ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {currencySymbol}{t.amount.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {t.currency === 'USD' ? `≈ ₹${(t.amount * 86).toLocaleString('en-IN')}` : 'Direct INR'}
                        </div>
                      </td>

                      {/* AI Risk & Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isFraud
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-600/50'
                              : isReview
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                          }`}>
                            {isFraud ? <AlertTriangle className="w-3 h-3" /> : isReview ? <Clock className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                            <span>{t.status}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {t.risk_score}/100
                          </span>
                        </div>
                        {t.dispute_status && t.dispute_status !== 'None' && (
                          <div className="text-[10px] text-amber-400 font-semibold mt-1">
                            Dispute: {t.dispute_status}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedReceiptTxn(t)}
                            className="p-1.5 rounded-lg bg-blue-950 hover:bg-blue-800 text-blue-300 hover:text-white border border-blue-800 transition-colors cursor-pointer"
                            title="View / Print Official E-Receipt"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedDisputeTxn(t)}
                            className="p-1.5 rounded-lg bg-blue-950 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 border border-blue-800 transition-colors cursor-pointer"
                            title="Report Fraud / Dispute Payment"
                          >
                            <AlertOctagon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transfer Simulation Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#08183a] border border-blue-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-blue-950 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Execute Fast Payment & Transfer</h3>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-blue-900/40 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3 text-xs">
              {/* Institution */}
              <div>
                <label className="block text-blue-200 mb-1 font-semibold">Debit Source Bank</label>
                <select
                  value={transferBank}
                  onChange={(e) => setTransferBank(e.target.value)}
                  className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Apex Premier Bank">Apex Premier Bank (Reserve & Retail Direct)</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                  <option value="JPMorgan Chase & Co.">JPMorgan Chase & Co. (International)</option>
                  <option value="Barclays Bank PLC">Barclays Bank PLC (UK)</option>
                </select>
              </div>

              {/* Beneficiary */}
              <div>
                <label className="block text-blue-200 mb-1 font-semibold">Beneficiary / Merchant Name</label>
                <input
                  type="text"
                  value={transferBeneficiary}
                  onChange={(e) => setTransferBeneficiary(e.target.value)}
                  className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              {/* Account / VPA */}
              <div>
                <label className="block text-blue-200 mb-1 font-semibold">Beneficiary UPI ID / Account / IBAN</label>
                <input
                  type="text"
                  value={transferAccount}
                  onChange={(e) => setTransferAccount(e.target.value)}
                  className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              {/* Amount & Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">Amount</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 font-mono focus:border-cyan-400 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-blue-200 mb-1 font-semibold">Payment Mode</label>
                  <select
                    value={transferMode}
                    onChange={(e) => setTransferMode(e.target.value as any)}
                    className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="UPI">UPI 2.0</option>
                    <option value="NetBanking">NetBanking</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="SWIFT Wire">SWIFT Wire</option>
                  </select>
                </div>
              </div>

              {/* International Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="intl-check"
                  checked={isInternationalWire}
                  onChange={(e) => setIsInternationalWire(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 bg-[#051330] border-blue-700 cursor-pointer"
                />
                <label htmlFor="intl-check" className="text-blue-200 font-semibold cursor-pointer">
                  Cross-Border International Wire (SWIFT Transfer)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 border border-blue-800 text-blue-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTransfer}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer shadow-lg shadow-blue-900/60 transition-colors flex items-center gap-1.5"
                >
                  {isSubmittingTransfer ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning via ML...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Send Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <PaymentReceiptModal
        isOpen={!!selectedReceiptTxn}
        onClose={() => setSelectedReceiptTxn(null)}
        transaction={selectedReceiptTxn}
      />

      {/* Customer Dispute Modal */}
      <PaymentDisputeModal
        isOpen={!!selectedDisputeTxn}
        onClose={() => setSelectedDisputeTxn(null)}
        transaction={selectedDisputeTxn}
        onSubmitDispute={handleDisputeSubmit}
      />
    </div>
  );
};
