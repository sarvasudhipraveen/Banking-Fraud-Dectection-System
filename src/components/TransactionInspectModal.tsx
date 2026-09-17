import React from 'react';
import { X, ShieldAlert, ShieldCheck, AlertTriangle, Sparkles, Clock, Globe, Smartphone, Lock, CheckCircle2 } from 'lucide-react';
import { BankingTransaction } from '../types';

interface TransactionInspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: BankingTransaction | null;
  onUpdateStatus?: (txnId: string, newStatus: 'Legitimate' | 'Fraud' | 'Under Review') => void;
}

export const TransactionInspectModal: React.FC<TransactionInspectModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onUpdateStatus
}) => {
  if (!isOpen || !transaction) return null;

  const isHigh = transaction.risk_level === 'HIGH';
  const isMedium = transaction.risk_level === 'MEDIUM';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                isHigh
                  ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                  : isMedium
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
              }`}
            >
              {transaction.risk_score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">{transaction.transaction_id}</h2>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                    isHigh
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : isMedium
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}
                >
                  {transaction.risk_level} RISK ({(transaction.fraud_probability * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Customer: {transaction.customer_id} • Logged at: {transaction.timestamp}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Amount</span>
            <span className="text-base font-extrabold text-white">
              ₹{transaction.amount.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Type</span>
            <span className="text-white capitalize">{transaction.transaction_type}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Location</span>
            <span className="text-white truncate block">{transaction.location}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase block">Category</span>
            <span className="text-white capitalize truncate block">
              {transaction.merchant_category.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Device & Velocity Risk Context */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <div className="font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Security Telemetry & Account Activity Indicators</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 pt-1">
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Device Fingerprint:</span>
              <span className="font-mono text-white">{transaction.device_type.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Transactions in 24h:</span>
              <span className="font-mono text-white">{transaction.transactions_last_24h} txns</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Prior Failed Auth:</span>
              <span className="font-mono text-white">{transaction.failed_attempts} attempts</span>
            </div>
            <div className="flex justify-between border-b border-slate-900 pb-1">
              <span className="text-slate-500">Cross-Border Settlement:</span>
              <span className="font-mono text-white">
                {transaction.is_international ? 'YES (Foreign IP)' : 'NO (Domestic)'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Status / Enforcement */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-400">
            Current Status: <strong className="text-white">{transaction.status}</strong>
          </div>

          {onUpdateStatus && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'Fraud');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold cursor-pointer"
              >
                Mark as Fraud
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'Under Review');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-200 font-bold cursor-pointer"
              >
                Set Under Review
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(transaction.id, 'Legitimate');
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-200 font-bold cursor-pointer"
              >
                Mark as Legitimate
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
