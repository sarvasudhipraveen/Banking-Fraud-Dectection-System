import React from 'react';
import { BankingTransaction } from '../types';
import { X, Printer, ShieldCheck, CheckCircle2, AlertTriangle, Building2, CreditCard, Download, Share2 } from 'lucide-react';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BankingTransaction | null;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  if (!isOpen || !transaction) return null;

  const isINR = transaction.currency !== 'USD' && transaction.currency !== 'EUR' && transaction.currency !== 'GBP';
  const currencySymbol = transaction.currency === 'USD' ? '$' : transaction.currency === 'GBP' ? '£' : transaction.currency === 'EUR' ? '€' : '₹';
  const bankName = transaction.bank_name || 'Apex Premier Bank';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#08183a] border border-blue-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl shadow-blue-950 space-y-6 my-8 text-slate-100 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/60 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Official Payment Advice & Receipt</div>
              <div className="text-[11px] text-blue-300 font-mono">UTR: {transaction.reference_utr || transaction.transaction_id}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-blue-900/50 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-blue-900/50 hover:bg-blue-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-6 rounded-2xl bg-[#051330] border border-blue-900/80 space-y-6 print:border-gray-300 print:bg-white">
          {/* Bank Header */}
          <div className="flex items-center justify-between border-b border-blue-900/60 pb-4">
            <div>
              <div className="text-lg font-black tracking-tight text-white print:text-black">
                {bankName.toUpperCase()}
              </div>
              <div className="text-xs text-blue-300/80 print:text-gray-600">
                Core Electronic Clearing & Settlement Service
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                SWIFT: {bankName.includes('Apex') ? 'APEXINBBXXX' : bankName.includes('Chase') ? 'CHASUS33XXX' : 'HDFCINBBXXX'} • RBI/Fed Licensed
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                transaction.status === 'Legitimate'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : transaction.status === 'Fraud'
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-500/40'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
              }`}>
                {transaction.status === 'Legitimate' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{transaction.status === 'Legitimate' ? 'PAYMENT SETTLED' : transaction.status.toUpperCase()}</span>
              </span>
              <div className="text-[10px] text-slate-400 font-mono mt-1">
                {transaction.timestamp}
              </div>
            </div>
          </div>

          {/* Amount Display */}
          <div className="text-center py-4 bg-blue-950/40 rounded-xl border border-blue-800/40 print:bg-gray-50 print:border-gray-200">
            <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
              Settlement Amount Transferred
            </div>
            <div className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight print:text-black">
              {currencySymbol}{transaction.amount.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-cyan-300 mt-1 font-mono">
              Mode: {transaction.payment_mode || transaction.transaction_type.toUpperCase()} • Clearance: INSTANT
            </div>
          </div>

          {/* Transaction Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-[#091b40]/80 border border-blue-900/60 space-y-1">
              <div className="text-blue-400 font-semibold">Originator / Debited</div>
              <div className="font-bold text-white font-mono">{transaction.customer_id}</div>
              <div className="text-slate-400 text-[11px]">{transaction.location}</div>
              <div className="text-cyan-300 text-[10px] font-mono">Device: {transaction.device_type}</div>
            </div>

            <div className="p-3 rounded-xl bg-[#091b40]/80 border border-blue-900/60 space-y-1">
              <div className="text-blue-400 font-semibold">Beneficiary / Credited</div>
              <div className="font-bold text-white font-mono">{transaction.beneficiary_name || transaction.merchant_category}</div>
              <div className="text-slate-400 text-[11px] font-mono">
                {transaction.beneficiary_account || 'XXXX-XXXX-8921'}
              </div>
              <div className="text-cyan-300 text-[10px] font-mono">Category: {transaction.merchant_category}</div>
            </div>
          </div>

          {/* Reference Numbers Table */}
          <div className="space-y-2 text-xs border-t border-blue-900/60 pt-4">
            <div className="flex justify-between py-1 border-b border-blue-900/30">
              <span className="text-slate-400">System Transaction ID:</span>
              <span className="font-mono text-white font-bold">{transaction.transaction_id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-900/30">
              <span className="text-slate-400">Unique Transaction Reference (UTR):</span>
              <span className="font-mono text-cyan-300 font-bold">{transaction.reference_utr || `UTR${Date.now()}`}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-900/30">
              <span className="text-slate-400">Cross-Border / International:</span>
              <span className="font-semibold text-white">{transaction.is_international ? 'YES (Cross-Border SWIFT)' : 'NO (Domestic RTGS/UPI)'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">AI Fraud Screening Probability:</span>
              <span className={`font-mono font-bold ${transaction.fraud_probability > 0.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {(transaction.fraud_probability * 100).toFixed(1)}% (Risk Score: {transaction.risk_score}/100)
              </span>
            </div>
          </div>

          {/* Anti-Fraud Security Guarantee Watermark */}
          <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
            <div className="text-[11px] text-blue-200">
              <span className="font-bold text-white">Cryptographically Verified by ML Fraud Engine. </span>
              This electronic advice is digitally attested and legally recognized under Indian IT Act 2000 & Basel III Framework.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 border border-blue-800 text-blue-200 font-semibold cursor-pointer text-xs"
          >
            Close Receipt
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 cursor-pointer text-xs shadow-lg shadow-blue-900/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
