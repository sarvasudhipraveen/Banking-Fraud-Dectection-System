import React, { useState } from 'react';
import { BankingTransaction } from '../types';
import { X, AlertOctagon, ShieldAlert, CheckCircle2, FileText, PhoneCall } from 'lucide-react';

interface PaymentDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BankingTransaction | null;
  onSubmitDispute: (txnId: string, reason: string) => void;
}

export const PaymentDisputeModal: React.FC<PaymentDisputeModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSubmitDispute
}) => {
  const [reasonCategory, setReasonCategory] = useState('Unauthorized / Card-Not-Present Fraud');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullReason = `${reasonCategory}: ${notes || 'Customer reported fraudulent transaction.'}`;
    onSubmitDispute(transaction.id, fullReason);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#071638] border border-rose-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950/80 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-blue-900/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Dispute Payment / Raise Fraud Claim
              </h2>
              <p className="text-xs text-rose-300/80 font-mono">
                Apex Premier & National Cybercrime Reporting Fast-Track
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-blue-900/40 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <div className="text-base font-bold text-white">Dispute Docket Logged Successfully!</div>
            <div className="text-xs text-blue-300 font-mono">
              Investigation Ticket #DISP-{Math.floor(100000 + Math.random() * 900000)} generated.
            </div>
            <p className="text-xs text-slate-400">
              Card has been flagged for surveillance. Our 24x7 Cybercrime Desk will contact you within 2 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Transaction Highlight */}
            <div className="p-3.5 rounded-xl bg-[#05112a] border border-blue-900/80 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Disputed Payment</div>
                <div className="text-sm font-bold text-white font-mono">
                  {transaction.reference_utr || transaction.transaction_id}
                </div>
                <div className="text-[11px] text-cyan-300">
                  {transaction.beneficiary_name || transaction.merchant_category} • {transaction.bank_name || 'Apex Premier Bank'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-base font-bold text-rose-400 font-mono">
                  {transaction.currency === 'USD' ? '$' : '₹'}{transaction.amount.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400">{transaction.timestamp}</div>
              </div>
            </div>

            {/* Dispute Reason Category */}
            <div>
              <label className="block text-blue-200 mb-1 font-semibold">Dispute Classification</label>
              <select
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl px-3 py-2 focus:border-rose-400 focus:outline-none"
              >
                <option value="Unauthorized / Card-Not-Present Fraud">Unauthorized / Card-Not-Present Fraud</option>
                <option value="Stolen Card / Phishing Scam">Stolen Card / Phishing Scam</option>
                <option value="Duplicate Debit / Incorrect Amount">Duplicate Debit / Incorrect Amount</option>
                <option value="Merchant Goods/Services Not Received">Merchant Goods/Services Not Received</option>
                <option value="International Cross-Border Anomaly">International Cross-Border Anomaly</option>
              </select>
            </div>

            {/* Additional Remarks */}
            <div>
              <label className="block text-blue-200 mb-1 font-semibold">Incident Details & Observations</label>
              <textarea
                rows={3}
                placeholder="Describe how the charge occurred (e.g. Received unauthorized OTP SMS, was not present in Dubai, card never left my wallet)..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#051330] border border-blue-700/50 text-white rounded-xl p-3 focus:border-rose-400 focus:outline-none"
                required
              />
            </div>

            {/* Emergency Hotline Notice */}
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 flex items-start gap-2.5 text-[11px] text-rose-200">
              <PhoneCall className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Emergency Zero-Liability Guarantee: </span>
                Reported within 72 hours per RBI circular. You can also dial toll-free{' '}
                <span className="font-mono font-bold text-rose-300">1800 419 8888 (Apex Premier Bank)</span> or{' '}
                <span className="font-mono font-bold text-rose-300">1930 (National Cyber Helpline)</span>.
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-blue-950/80 hover:bg-blue-900/80 border border-blue-800 text-blue-200 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer shadow-lg shadow-rose-950/60 transition-colors"
              >
                Submit Dispute Claim
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
