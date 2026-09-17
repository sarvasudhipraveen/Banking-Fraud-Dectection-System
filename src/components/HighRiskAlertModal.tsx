import React from 'react';
import { ShieldAlert, X, Lock, CheckCircle2, PhoneCall, AlertOctagon } from 'lucide-react';
import { PredictionResult, PredictionInput } from '../types';

interface HighRiskAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alertData: {
    result: PredictionResult;
    input: PredictionInput;
  } | null;
  onAction: (action: string) => void;
}

export const HighRiskAlertModal: React.FC<HighRiskAlertModalProps> = ({
  isOpen,
  onClose,
  alertData,
  onAction
}) => {
  if (!isOpen || !alertData) return null;

  const { result, input } = alertData;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-rose-600/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl shadow-rose-950/80 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Emergency Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-900/50">
          <div className="flex items-center gap-2 text-rose-500">
            <span className="p-2 rounded-xl bg-rose-950/80 border border-rose-800">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400">
                🚨 REAL-TIME ALERT TRIGGER (RISK &gt; 80%)
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                HIGH-RISK FRAUD TRANSACTION INTERCEPTED
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Banner (Prompt Section 14) */}
        <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 font-mono text-xs space-y-1 text-rose-200">
          <div className="text-sm font-bold text-white flex justify-between">
            <span>Transaction: {result.transaction_id}</span>
            <span className="text-rose-400 font-extrabold">Risk: {(result.fraud_probability * 100).toFixed(1)}%</span>
          </div>
          <div className="text-white text-base font-extrabold">
            Amount: ₹{input.amount.toLocaleString('en-IN')}
          </div>
          <div className="text-slate-400 pt-1 text-[11px] font-sans">
            Location: {input.location} • Device: {input.device_type.replace('_', ' ')} • Hour: {String(input.hour).padStart(2, '0')}:00 hrs
          </div>
        </div>

        {/* Explainable Attributions snippet */}
        <div className="space-y-1.5 text-xs">
          <span className="text-slate-400 font-semibold">Top Risk Drivers Identified:</span>
          {result.shap_contributions.slice(0, 3).map((shap, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-2 rounded-lg bg-slate-950 border border-slate-800"
            >
              <span className="text-slate-200 font-medium">✓ {shap.display_name}</span>
              <span className="font-mono text-rose-400 font-bold">+{shap.risk_contribution_pts} pts</span>
            </div>
          ))}
        </div>

        {/* Immediate Mitigation Actions */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-xs text-slate-400">Select Instant Enforcement Action:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
            <button
              onClick={() => {
                onAction('Card Frozen');
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-950/60"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Freeze Card</span>
            </button>

            <button
              onClick={() => {
                onAction('3DS Biometric Challenge');
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Require OTP</span>
            </button>

            <button
              onClick={() => {
                onAction('Analyst Override Cleared');
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Clear Override</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
