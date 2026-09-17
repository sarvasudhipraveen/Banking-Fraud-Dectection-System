import React, { useState } from 'react';
import {
  Zap,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  Sliders,
  Send,
  AlertOctagon
} from 'lucide-react';
import {
  PredictionInput,
  PredictionResult,
  TransactionType,
  MerchantCategory,
  DeviceType,
  BankingTransaction
} from '../types';
import { runFraudInference } from '../services/mlEngine';

interface PredictorViewProps {
  onTransactionLogged: (txn: BankingTransaction) => void;
  onTriggerHighRiskAlert: (result: PredictionResult, input: PredictionInput) => void;
}

export const PredictorView: React.FC<PredictorViewProps> = ({
  onTransactionLogged,
  onTriggerHighRiskAlert
}) => {
  // Preset Scenarios
  const PRESET_SCENARIOS = [
    {
      id: 'fraud_night_vpn',
      label: '🚨 ₹85,000 Midnight Crypto (New Device, 02:30 AM)',
      description: 'Matches typical prompt scenario: ₹85k online payment at 02:30 AM from new device with prior failed attempts.',
      data: {
        customer_id: 'CUST-3942',
        amount: 85000,
        transaction_type: 'online' as TransactionType,
        merchant_category: 'gaming_crypto' as MerchantCategory,
        location: 'Mumbai',
        device_type: 'new_mobile' as DeviceType,
        is_international: false,
        hour: 2, // 02:30 AM
        previous_transactions: 15,
        failed_attempts: 2,
        average_transaction_amount: 4100,
        is_new_device: true,
        is_new_location: true,
        transactions_last_1h: 3,
        transactions_last_24h: 7
      }
    },
    {
      id: 'fraud_dubai_wire',
      label: '🚨 ₹92,000 Dubai Luxury Wire (VPN Anonymizer)',
      description: 'High-value cross-border payment originating through commercial VPN proxy with 3 failed credentials.',
      data: {
        customer_id: 'CUST-8821',
        amount: 92000,
        transaction_type: 'wire' as TransactionType,
        merchant_category: 'luxury_jewelry' as MerchantCategory,
        location: 'Dubai, UAE',
        device_type: 'vpn_proxy' as DeviceType,
        is_international: true,
        hour: 3,
        previous_transactions: 8,
        failed_attempts: 3,
        average_transaction_amount: 3500,
        is_new_device: true,
        is_new_location: true,
        transactions_last_1h: 4,
        transactions_last_24h: 9
      }
    },
    {
      id: 'legitimate_shopping',
      label: '✅ ₹2,500 Online Shopping (Vijayawada, Trusted Device)',
      description: 'Typical legitimate domestic e-commerce transaction during daytime with verified device token.',
      data: {
        customer_id: 'CUST-1049',
        amount: 2500,
        transaction_type: 'online' as TransactionType,
        merchant_category: 'shopping' as MerchantCategory,
        location: 'Vijayawada',
        device_type: 'trusted_mobile' as DeviceType,
        is_international: false,
        hour: 14,
        previous_transactions: 42,
        failed_attempts: 0,
        average_transaction_amount: 2800,
        is_new_device: false,
        is_new_location: false,
        transactions_last_1h: 0,
        transactions_last_24h: 2
      }
    },
    {
      id: 'legitimate_grocery_upi',
      label: '✅ ₹1,200 Hyderabad Grocery UPI',
      description: 'Normal micro-payment within habitual spending cluster.',
      data: {
        customer_id: 'CUST-5512',
        amount: 1200,
        transaction_type: 'upi' as TransactionType,
        merchant_category: 'grocery' as MerchantCategory,
        location: 'Hyderabad',
        device_type: 'trusted_mobile' as DeviceType,
        is_international: false,
        hour: 11,
        previous_transactions: 60,
        failed_attempts: 0,
        average_transaction_amount: 1100,
        is_new_device: false,
        is_new_location: false,
        transactions_last_1h: 1,
        transactions_last_24h: 3
      }
    },
    {
      id: 'medium_travel_airline',
      label: '⚠️ ₹45,000 London Flight Booking (International)',
      description: 'Borderline anomaly: International flight ticket slightly above average, requiring step-up SMS OTP.',
      data: {
        customer_id: 'CUST-9031',
        amount: 45000,
        transaction_type: 'online' as TransactionType,
        merchant_category: 'travel' as MerchantCategory,
        location: 'London, UK',
        device_type: 'desktop_browser' as DeviceType,
        is_international: true,
        hour: 23,
        previous_transactions: 18,
        failed_attempts: 1,
        average_transaction_amount: 8500,
        is_new_device: true,
        is_new_location: true,
        transactions_last_1h: 1,
        transactions_last_24h: 4
      }
    }
  ];

  // State
  const [formData, setFormData] = useState<PredictionInput>(PRESET_SCENARIOS[0].data);
  const [selectedModel, setSelectedModel] = useState<
    'xgboost' | 'random_forest' | 'decision_tree' | 'logistic_regression'
  >('xgboost');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(() =>
    runFraudInference(PRESET_SCENARIOS[0].data, 'xgboost')
  );
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setFormData(preset.data);
    const result = runFraudInference(preset.data, selectedModel);
    setPredictionResult(result);
    setSavedSuccessMessage(null);
  };

  const handleRunInference = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluating(true);
    setSavedSuccessMessage(null);

    setTimeout(() => {
      const result = runFraudInference(formData, selectedModel);
      setPredictionResult(result);
      setIsEvaluating(false);

      // Trigger Alert if Risk > 80% (Prompt Section 14)
      if (result.risk_score >= 80) {
        onTriggerHighRiskAlert(result, formData);
      }
    }, 280);
  };

  const handleCommitToLedger = (actionTaken: 'Approved' | 'Blocked' | 'OTP Requested' | 'Analyst Cleared') => {
    if (!predictionResult) return;

    const newTxn: BankingTransaction = {
      id: predictionResult.transaction_id,
      transaction_id: predictionResult.transaction_id,
      customer_id: formData.customer_id,
      amount: formData.amount,
      transaction_type: formData.transaction_type,
      merchant_category: formData.merchant_category,
      location: formData.location,
      device_type: formData.device_type,
      is_international: formData.is_international,
      hour: formData.hour,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status:
        predictionResult.prediction === 'FRAUD'
          ? 'Fraud'
          : predictionResult.risk_level === 'MEDIUM'
          ? 'Under Review'
          : 'Legitimate',
      risk_level: predictionResult.risk_level,
      fraud_probability: predictionResult.fraud_probability,
      risk_score: predictionResult.risk_score,
      failed_attempts: formData.failed_attempts,
      previous_transaction_amount: formData.average_transaction_amount,
      transactions_last_24h: formData.transactions_last_24h,
      transactions_last_1h: formData.transactions_last_1h,
      is_new_device: formData.is_new_device,
      is_new_location: formData.is_new_location,
      action_taken: actionTaken
    };

    onTransactionLogged(newTxn);
    setSavedSuccessMessage(`Logged ${newTxn.transaction_id} to MySQL transactions table with status [${actionTaken}].`);
  };

  return (
    <div id="predictor-page-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono">
                Real-Time Security Scanner
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Payment Risk Scanner & Key Factors
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Input transaction details to assess safety, calculate continuous risk scoring (0-100), and inspect key risk factors indicating why a payment was flagged.
            </p>
          </div>

          {/* Model Selector */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 self-start md:self-center">
            <span className="text-xs text-slate-400 px-2 font-medium">Security Mode:</span>
            <select
              id="model-selector-dropdown"
              value={selectedModel}
              onChange={(e) => {
                const model = e.target.value as any;
                setSelectedModel(model);
                if (predictionResult) {
                  setPredictionResult(runFraudInference(formData, model));
                }
              }}
              className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="xgboost">Apex AI Shield (Highest Protection)</option>
              <option value="random_forest">Multi-Pattern Defense (High Protection)</option>
              <option value="decision_tree">Standard Rule Engine (Medium Protection)</option>
              <option value="logistic_regression">Basic Velocity Checker (Standard Protection)</option>
            </select>
          </div>
        </div>

        {/* Quick Attack / Legitimate Presets */}
        <div className="mt-5 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Quick Simulation Scenarios:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SCENARIOS.map((preset) => (
              <button
                key={preset.id}
                id={`btn-preset-${preset.id}`}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5 cursor-pointer"
              >
                <span>{preset.label.split(' ')[0]}</span>
                <span>{preset.label.substring(preset.label.indexOf(' ') + 1)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form (Left) & Live Analysis Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Container (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <form id="fraud-prediction-form" onSubmit={handleRunInference} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-500" />
                Transaction Parameters
              </h2>
              <span className="text-[10px] text-slate-400 font-mono">POST /api/v1/predict</span>
            </div>

            {/* Customer ID & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Customer ID
                </label>
                <input
                  id="input-customer-id"
                  type="text"
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  placeholder="CUST-3942"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-3 py-2 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    id="input-transaction-amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    placeholder="25000"
                    min="1"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Transaction Type & Merchant Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Transaction Type
                </label>
                <select
                  id="select-transaction-type"
                  value={formData.transaction_type}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as TransactionType })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-3 py-2 text-xs"
                >
                  <option value="online">Online Payment</option>
                  <option value="pos">POS Terminal Swipe</option>
                  <option value="atm">ATM Cash Withdrawal</option>
                  <option value="wire">Wire Transfer / RTGS</option>
                  <option value="upi">UPI Instant Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Merchant Category
                </label>
                <select
                  id="select-merchant-category"
                  value={formData.merchant_category}
                  onChange={(e) => setFormData({ ...formData, merchant_category: e.target.value as MerchantCategory })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-3 py-2 text-xs"
                >
                  <option value="shopping">Shopping & E-Commerce</option>
                  <option value="gaming_crypto">Gaming & Crypto Exchanges</option>
                  <option value="luxury_jewelry">Luxury & High-End Jewelry</option>
                  <option value="electronics">Consumer Electronics</option>
                  <option value="grocery">Supermarket & Grocery</option>
                  <option value="travel">Travel & Flight Tickets</option>
                  <option value="healthcare">Healthcare & Pharmacy</option>
                  <option value="utilities">Utilities & Telecom Bills</option>
                </select>
              </div>
            </div>

            {/* Location & Device Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Location (City / Country)
                </label>
                <input
                  id="input-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Hyderabad"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Device Signature
                </label>
                <select
                  id="select-device-type"
                  value={formData.device_type}
                  onChange={(e) => setFormData({ ...formData, device_type: e.target.value as DeviceType })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-3 py-2 text-xs"
                >
                  <option value="trusted_mobile">Trusted Enrolled Mobile</option>
                  <option value="new_mobile">New Unregistered Mobile</option>
                  <option value="desktop_browser">Desktop Web Browser</option>
                  <option value="jailbroken_device">Rooted / Jailbroken Mobile</option>
                  <option value="emulator">Android / iOS Emulator</option>
                  <option value="vpn_proxy">Datacenter VPN / Proxy Gateway</option>
                </select>
              </div>
            </div>

            {/* Transaction Hour & International Toggle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Transaction Time</span>
                  <span className="font-mono text-rose-400 font-bold">
                    {String(formData.hour).padStart(2, '0')}:30 hrs
                  </span>
                </label>
                <input
                  id="input-transaction-hour"
                  type="range"
                  min="0"
                  max="23"
                  value={formData.hour}
                  onChange={(e) => setFormData({ ...formData, hour: Number(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>00:00 (Night)</span>
                  <span>12:00 (Noon)</span>
                  <span>23:00 (Night)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  International Transaction?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    id="btn-intl-no"
                    onClick={() => setFormData({ ...formData, is_international: false })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      !formData.is_international
                        ? 'bg-slate-800 text-white border-slate-600'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    Domestic (No)
                  </button>
                  <button
                    type="button"
                    id="btn-intl-yes"
                    onClick={() => setFormData({ ...formData, is_international: true })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      formData.is_international
                        ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                    }`}
                  >
                    International (Yes)
                  </button>
                </div>
              </div>
            </div>

            {/* Velocity & Anomaly Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Failed Attempts
                </label>
                <input
                  id="input-failed-attempts"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.failed_attempts}
                  onChange={(e) => setFormData({ ...formData, failed_attempts: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Txns in Last 1h
                </label>
                <input
                  id="input-velocity-1h"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.transactions_last_1h}
                  onChange={(e) => setFormData({ ...formData, transactions_last_1h: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Avg Amount (₹)
                </label>
                <input
                  id="input-avg-amount"
                  type="number"
                  min="100"
                  value={formData.average_transaction_amount}
                  onChange={(e) => setFormData({ ...formData, average_transaction_amount: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
            </div>

            {/* Checkboxes for New Device / New Location */}
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new_device}
                  onChange={(e) => setFormData({ ...formData, is_new_device: e.target.checked })}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 accent-rose-500"
                />
                <span>Is New Device?</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_new_location}
                  onChange={(e) => setFormData({ ...formData, is_new_location: e.target.checked })}
                  className="rounded border-slate-700 text-rose-600 focus:ring-rose-500 accent-rose-500"
                />
                <span>Is New Location?</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              id="btn-check-transaction"
              type="submit"
              disabled={isEvaluating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-500 text-white text-sm font-extrabold shadow-lg shadow-rose-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 fill-current ${isEvaluating ? 'animate-spin' : ''}`} />
              <span>{isEvaluating ? 'EVALUATING RISK...' : '[ CHECK TRANSACTION ]'}</span>
            </button>
          </form>
        </div>

        {/* Inference Results & Explainable AI (SHAP) Container (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          {predictionResult ? (
            <div className="space-y-6">
              {/* ASCII / Monospace Styled Output Card (Matching prompt Section 9 format) */}
              <div
                id="prediction-result-card"
                className={`p-5 rounded-2xl border ${
                  predictionResult.risk_level === 'HIGH'
                    ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                    : predictionResult.risk_level === 'MEDIUM'
                    ? 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    {predictionResult.risk_level === 'HIGH' ? (
                      <ShieldAlert className="w-5 h-5 text-rose-400" />
                    ) : predictionResult.risk_level === 'MEDIUM' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    )}
                    <span className="font-mono text-xs tracking-widest uppercase font-bold">
                      ━━━━━━━━━━━━ FRAUD ANALYSIS ━━━━━━━━━━━━
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Response Time: {predictionResult.inference_time_ms}ms
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-4 font-mono">
                  <div>
                    <div className="text-[11px] text-slate-400 uppercase">Prediction</div>
                    <div
                      className={`text-xl font-extrabold ${
                        predictionResult.prediction === 'FRAUD' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {predictionResult.prediction}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 uppercase">Fraud Probability</div>
                    <div className="text-xl font-extrabold text-white">
                      {(predictionResult.fraud_probability * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] text-slate-400 uppercase">Risk Level</div>
                    <div
                      className={`text-xl font-extrabold ${
                        predictionResult.risk_level === 'HIGH'
                          ? 'text-rose-400'
                          : predictionResult.risk_level === 'MEDIUM'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {predictionResult.risk_level} ({predictionResult.risk_score}/100)
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="pt-3 border-t border-white/10 text-xs sm:text-sm">
                  <span className="font-semibold text-white">Recommendation: </span>
                  <span className="text-slate-300">{predictionResult.recommendation}</span>
                </div>
              </div>

              {/* Risk Contributing Factors Breakdown */}
              <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Why was this transaction flagged? (Key Security Factors)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Key contributing factors showing safety indicators and elevated risk triggers
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Standard Baseline Risk: 2.4%
                  </span>
                </div>

                {/* SHAP contributions list */}
                <div className="space-y-2">
                  {predictionResult.shap_contributions.map((shap, idx) => {
                    const isPositive = shap.risk_contribution_pts > 0;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs gap-2"
                      >
                        <div className="flex items-start gap-2">
                          <span
                            className={`font-mono font-bold mt-0.5 ${
                              isPositive ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {isPositive ? '✓' : '⟲'}
                          </span>
                          <div>
                            <span className="font-semibold text-white">
                              {shap.display_name}
                            </span>
                            <span className="text-slate-400 text-[11px] ml-2 font-mono">
                              ({shap.feature_value})
                            </span>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {shap.rationale}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 shrink-0">
                          {/* Visual mini bar */}
                          <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden hidden sm:block">
                            <div
                              className={`h-full rounded-full ${
                                isPositive ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.abs(shap.risk_contribution_pts) * 2.5)}%` }}
                            ></div>
                          </div>

                          <span
                            className={`font-mono font-bold text-xs px-2 py-0.5 rounded ${
                              isPositive
                                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                            }`}
                          >
                            {isPositive ? `+${shap.risk_contribution_pts}` : `${shap.risk_contribution_pts}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total Risk Contribution summary */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">Total Net Risk Contribution:</span>
                  <span className="font-mono font-extrabold text-white text-sm">
                    {predictionResult.risk_score} pts
                  </span>
                </div>
              </div>

              {/* Action Buttons for Banking Risk Analyst */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCommitToLedger('Blocked')}
                    className="px-3.5 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Freeze & Block</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCommitToLedger('OTP Requested')}
                    className="px-3.5 py-2 rounded-xl bg-amber-900/60 hover:bg-amber-900 border border-amber-700 text-amber-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Challenge with OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCommitToLedger('Approved')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700 text-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Clear</span>
                  </button>
                </div>

                <div className="text-xs text-slate-500 font-mono">
                  Txn Ref: {predictionResult.transaction_id}
                </div>
              </div>

              {/* Success Notification */}
              {savedSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{savedSuccessMessage}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 text-slate-500 text-center">
              <Zap className="w-12 h-12 stroke-1 mb-2 text-slate-600" />
              <p className="text-sm font-semibold text-slate-400">Ready for Transaction Analysis</p>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Fill the form or click any simulation scenario above to analyze fraud risk.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
