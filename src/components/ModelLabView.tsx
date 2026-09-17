import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Scale,
  BarChart3,
  Award,
  Zap,
  Info
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { MODEL_BENCHMARKS } from '../services/mlEngine';
import { ModelBenchmark } from '../types';

export const ModelLabView: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('xgboost');
  const [isSmoteEnabled, setIsSmoteEnabled] = useState<boolean>(true);

  const selectedModel =
    MODEL_BENCHMARKS.find((m) => m.id === selectedModelId) || MODEL_BENCHMARKS[0];

  // Adjust metrics dynamically if user toggles SMOTE off to demonstrate the concept in Section 4 of prompt
  const displayMetrics = isSmoteEnabled
    ? selectedModel
    : {
        ...selectedModel,
        recall: Number((selectedModel.recall * 0.62).toFixed(4)),
        f1_score: Number((selectedModel.f1_score * 0.74).toFixed(4)),
        pr_auc: Number((selectedModel.pr_auc * 0.68).toFixed(4)),
        confusion_matrix: {
          true_positives: Math.round(selectedModel.confusion_matrix.true_positives * 0.62),
          false_positives: Math.max(5, Math.round(selectedModel.confusion_matrix.false_positives * 0.5)),
          true_negatives: 24730,
          false_negatives:
            selectedModel.confusion_matrix.false_negatives +
            Math.round(selectedModel.confusion_matrix.true_positives * 0.38)
        }
      };

  // Comparison table data
  const comparisonData = MODEL_BENCHMARKS.map((m) => ({
    name: m.name.split(' ')[0],
    precision: Math.round(m.precision * 100),
    recall: Math.round(m.recall * 100),
    f1: Math.round(m.f1_score * 100),
    prAuc: Math.round(m.pr_auc * 100)
  }));

  return (
    <div id="model-lab-container" className="space-y-6 pb-12">
      {/* Header & Imbalance Alert */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Cpu className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
                Security Protection Engines & Defense Benchmarks
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Fraud Defense Effectiveness & Protection Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Comparative analysis of 4 protection engines on high-volume banking transactions (99:1 Legitimate to Fraud ratio). Evaluating Threat Intercept Rate, False Alarm Prevention, and Defense Accuracy.
            </p>
          </div>

          {/* SMOTE & Class Weight Toggle (Directly addressing Prompt Section 4) */}
          <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 self-start md:self-center">
            <Scale className="w-4 h-4 text-amber-400" />
            <div className="text-xs">
              <div className="font-bold text-white">Threat Sensitivity Calibration</div>
              <div className="text-[10px] text-slate-400">High-Risk Threat Balancing</div>
            </div>
            <button
              id="toggle-smote-btn"
              type="button"
              onClick={() => setIsSmoteEnabled(!isSmoteEnabled)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSmoteEnabled
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isSmoteEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Why Accuracy is Misleading Callout Box (Prompt Section 4 Highlight) */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-300">
              Why Headline Accuracy is a Misleading Security Metric:
            </span>
            <p className="text-slate-300 leading-relaxed">
              In a cohort of <strong>9,900 legitimate transactions and 100 fraudulent attempts</strong>, a system that simply clears <em>every</em> transaction achieves <strong>99.0% raw accuracy</strong>, yet fails to prevent a single stolen rupee. In banking defense, <strong>Threat Intercept Rate (catching actual fraud), Legitimacy Clearance (preventing customer lockouts), and Overall Defense Score</strong> are the gold standards.
            </p>
          </div>
        </div>
      </div>

      {/* Model Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODEL_BENCHMARKS.map((model) => {
          const isSelected = model.id === selectedModelId;

          return (
            <button
              key={model.id}
              id={`model-card-${model.id}`}
              onClick={() => setSelectedModelId(model.id)}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 border-rose-500 shadow-xl shadow-rose-950/30 ring-1 ring-rose-500/40'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {model.isChampion && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-bold uppercase font-mono">
                  <Award className="w-3 h-3" />
                  Primary Shield
                </div>
              )}

              <div className="text-xs text-slate-400 font-mono mb-1">{model.type}</div>
              <div className="text-base font-extrabold text-white">{model.name.split(' (')[0]}</div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80 font-mono text-xs">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Defense Score</div>
                  <div className="text-sm font-bold text-white">{(model.pr_auc * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Threat Intercept</div>
                  <div className="text-sm font-bold text-rose-400">{(model.recall * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Legitimacy Clearance</div>
                  <div className="text-sm font-bold text-emerald-400">{(model.precision * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase">Max Response Time</div>
                  <div className="text-sm font-bold text-slate-300">{model.latency_p95_ms} ms</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Model Deep Dive: Defense Accuracy Breakdown + Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Defense Accuracy Breakdown & Cost (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white">
                  Defense Verification Outcomes ({displayMetrics.name.split(' (')[0]})
                </h2>
                <p className="text-xs text-slate-400">
                  Audit cohort: 25,000 total test transactions (267 true fraud attacks)
                </p>
              </div>
              <span className="text-xs font-mono text-rose-400 font-semibold">
                Reliability: {(displayMetrics.f1_score * 100).toFixed(1)}%
              </span>
            </div>

            {/* 2x2 Outcome Grid */}
            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* True Negatives (TN) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">
                  Safe Payments Cleared
                </div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  {displayMetrics.confusion_matrix.true_negatives.toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Correctly authorized legitimate txns
                </div>
              </div>

              {/* False Positives (FP) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40">
                <div className="text-[10px] text-amber-400 uppercase font-semibold">
                  False Alarms (Flagged)
                </div>
                <div className="text-2xl font-extrabold text-amber-400 mt-1">
                  {displayMetrics.confusion_matrix.false_positives}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Customer friction / Manual OTP review
                </div>
              </div>

              {/* False Negatives (FN) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/60">
                <div className="text-[10px] text-rose-400 uppercase font-semibold">
                  Missed Threats
                </div>
                <div className="text-2xl font-extrabold text-rose-500 mt-1">
                  {displayMetrics.confusion_matrix.false_negatives}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Direct loss / Disputed chargebacks
                </div>
              </div>

              {/* True Positives (TP) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40">
                <div className="text-[10px] text-emerald-400 uppercase font-semibold">
                  Intercepted Frauds
                </div>
                <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                  {displayMetrics.confusion_matrix.true_positives}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Successfully prevented attacks
                </div>
              </div>
            </div>

            {/* Estimated Financial Impact Calculation */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Estimated Direct Fraud Loss (FN × ₹35k):</span>
                <span className="font-mono text-rose-400 font-bold">
                  ₹{(displayMetrics.confusion_matrix.false_negatives * 35000).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Customer Support Inquiries (FP × ₹150):</span>
                <span className="font-mono text-amber-400 font-bold">
                  ₹{(displayMetrics.confusion_matrix.false_positives * 150).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            {displayMetrics.description}
          </div>
        </div>

        {/* Feature Importance & Model Strengths (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h2 className="text-base font-bold text-white mb-1">
              Key Security Indicators & Threat Factor Weights
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Relative risk weights evaluated across transaction channels to detect fraudulent behaviors
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedModel.feature_importance}
                  layout="vertical"
                  margin={{ left: 20, right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="feature"
                    type="category"
                    stroke="#94a3b8"
                    tick={{ fontSize: 11 }}
                    width={150}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                    formatter={(v: any) => [`${(Number(v) * 100).toFixed(0)}% relative gain`, 'Weight']}
                  />
                  <Bar dataKey="importance" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Model Strengths & Limitations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
            <div className="space-y-2">
              <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Model Strengths</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {selectedModel.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-500">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Trade-offs & Considerations</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {selectedModel.limitations.map((l, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-500">•</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* End-to-End Pipeline Visualization (Prompt Section 3) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-2">
          End-to-End Banking Protection & Verification Workflow
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Real-time security steps protecting payments from initial swipe or wire to sub-30ms fraud defense verification
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 font-mono text-[11px] text-center">
          {[
            { step: '1. Ingestion', desc: 'Payment Request Data', color: 'bg-slate-800 text-slate-200' },
            { step: '2. Integrity', desc: 'Identity & Field Check', color: 'bg-slate-800 text-slate-200' },
            { step: '3. Profiling', desc: 'Customer Spending Base', color: 'bg-slate-800 text-slate-200' },
            { step: '4. Behavior', desc: 'Velocity & Location Risk', color: 'bg-indigo-950 text-indigo-300 border border-indigo-800' },
            { step: '5. Screening', desc: 'High-Risk Threat Shield', color: 'bg-amber-950 text-amber-300 border border-amber-800' },
            { step: '6. AI Scoring', desc: 'Apex Defense Engine', color: 'bg-rose-950 text-rose-300 border border-rose-800' },
            { step: '7. Multi-Factor', desc: 'Threat Quality Audit', color: 'bg-emerald-950 text-emerald-300 border border-emerald-800' },
            { step: '8. Response', desc: 'Sub-30ms Clearance / Intercept', color: 'bg-rose-600 text-white font-bold' }
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl ${item.color} flex flex-col justify-between`}>
              <div className="font-bold">{item.step}</div>
              <div className="text-[10px] mt-2 opacity-80">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
