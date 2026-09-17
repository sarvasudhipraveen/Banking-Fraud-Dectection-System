import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Zap,
  Filter,
  DollarSign,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { BankingTransaction } from '../types';
import { HOURLY_FRAUD_DISTRIBUTION, CATEGORY_RISK_DISTRIBUTION } from '../services/mockData';

interface DashboardViewProps {
  transactions: BankingTransaction[];
  onNavigateToPredictor: () => void;
  onInspectTransaction: (txn: BankingTransaction) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  onNavigateToPredictor,
  onInspectTransaction
}) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Aggregated Metrics
  const totalCount = 25430 + (transactions.length - 11);
  const fraudCount = 324 + transactions.filter((t) => t.status === 'Fraud' && !t.transaction_id.startsWith('TXN00')).length;
  const legitimateCount = totalCount - fraudCount;
  const fraudRate = ((fraudCount / totalCount) * 100).toFixed(2);
  const totalProtectedAmount = 14820000; // ₹1.48 Cr

  // Risk Distribution Data for Donut Chart
  const riskDonutData = [
    { name: 'Low Risk (0-30)', value: 24050, color: '#10b981' },
    { name: 'Medium Risk (31-70)', value: 1056, color: '#f59e0b' },
    { name: 'High Risk (71-100)', value: 324, color: '#f43f5e' }
  ];

  // Recent transactions sorted by risk
  const recentSuspicious = [...transactions]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 6);

  return (
    <div id="dashboard-container" className="space-y-6 pb-12">
      {/* Top Banner & Quick Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#091b40]/90 via-[#0a2352]/90 to-[#071838]/90 p-6 rounded-2xl border border-blue-500/30 shadow-xl shadow-blue-950/60 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider font-mono">
              Live Protection Shield • Apex & Global Grid Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Banking Fraud Detection Analytics
          </h1>
          <p className="text-sm text-blue-200/80 mt-1 max-w-2xl">
            Real-time security defense monitoring high-velocity transactions, detecting suspicious patterns, and preventing financial loss across Apex Premier Bank and international payment rails.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex bg-[#051330] p-1 rounded-xl border border-blue-800/60 text-xs">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                id={`time-range-${r}`}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeRange === r
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/60'
                    : 'text-blue-300 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            id="btn-live-prediction-banner"
            onClick={onNavigateToPredictor}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-blue-950/60 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-current text-white" />
            <span>Check Transaction</span>
          </button>
        </div>
      </div>

      {/* Core KPI Metric Cards (Matching prompt: Total 25,430 | Fraud 324 | Legitimate 25,106) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Transactions Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>TOTAL TRANSACTIONS</span>
            <span className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tracking-tight">
            {totalCount.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% volume vs yesterday</span>
          </div>
        </div>

        {/* Fraud Detected Card */}
        <div className="bg-slate-900/90 border border-rose-900/40 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-rose-300 text-xs font-medium mb-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              FRAUD DETECTED
            </span>
            <span className="p-1.5 rounded-lg bg-rose-950/80 border border-rose-800/60 text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono tracking-tight">
            {fraudCount.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Fraud Rate</span>
            <span className="font-bold text-rose-400 font-mono">{fraudRate}%</span>
          </div>
        </div>

        {/* Legitimate Processed Card */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium mb-2">
            <span>LEGITIMATE CLEARED</span>
            <span className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            {legitimateCount.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Approval Rate</span>
            <span className="font-bold text-emerald-400 font-mono">98.73%</span>
          </div>
        </div>

        {/* Amount Protected Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-2">
            <span>CAPITAL PROTECTED</span>
            <span className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono tracking-tight">
            ₹{(totalProtectedAmount / 10000000).toFixed(2)} Cr
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400">Response Speed (P95)</span>
            <span className="font-bold text-slate-300 font-mono">22 ms</span>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume & Fraud Spike Area Chart (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                Hourly Transaction Volume vs. Night Fraud Spike
              </h2>
              <p className="text-xs text-slate-400">
                Notice distinct peak in fraud frequency between 01:00 AM and 04:00 AM off-peak hours
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                Fraud
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                Legitimate (Scaled /10)
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_FRAUD_DISTRIBUTION}>
                <defs>
                  <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="legitGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                  formatter={(val: any, name: string) => [
                    name === 'fraud' ? `${val} cases` : `${Number(val) * 10} txns`,
                    name === 'fraud' ? 'Fraud Spike' : 'Legitimate Volume'
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="fraud"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#fraudGrad)"
                />
                <Area
                  type="monotone"
                  dataKey={(d) => Math.round(d.legitimate / 10)}
                  stroke="#6366f1"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#legitGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut (1 col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white mb-1">
              Risk Tier Distribution
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Calibrated risk score classification across 25k+ transactions
            </p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#f8fafc'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Low Risk (0 - 30)
              </span>
              <span className="font-mono text-emerald-400 font-bold">94.6%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Medium Risk (31 - 70)
              </span>
              <span className="font-mono text-amber-400 font-bold">4.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                High Risk (71 - 100)
              </span>
              <span className="font-mono text-rose-400 font-bold">1.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Row: Merchant Category Risk + Recent Suspicious Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Risk Bar Chart (1 col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h2 className="text-base font-bold text-white mb-1">
            Fraud Concentration by Merchant
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Percentage of transactions flagged as fraudulent per merchant category code
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={CATEGORY_RISK_DISTRIBUTION}
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} unit="%" />
                <YAxis
                  dataKey="category"
                  type="category"
                  stroke="#94a3b8"
                  tick={{ fontSize: 10 }}
                  width={110}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#f8fafc'
                  }}
                  formatter={(v: any) => [`${v}% Fraud Rate`, 'Exposure']}
                />
                <Bar dataKey="fraudPct" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Suspicious Transactions (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  Recent Suspicious Transactions
                </h2>
                <p className="text-xs text-slate-400">
                  Live feed of transactions flagged by automated real-time fraud defense
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold text-rose-400 px-2.5 py-1 bg-rose-950/60 border border-rose-800/60 rounded-lg">
                Auto-Quarantine Active
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {recentSuspicious.map((txn) => {
                const isHigh = txn.risk_level === 'HIGH';
                const isMedium = txn.risk_level === 'MEDIUM';

                return (
                  <div
                    key={txn.id}
                    id={`recent-txn-${txn.transaction_id}`}
                    onClick={() => onInspectTransaction(txn)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${
                          isHigh
                            ? 'bg-rose-950/80 text-rose-400 border border-rose-800/50'
                            : isMedium
                            ? 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                        }`}
                      >
                        {txn.risk_score}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                            {txn.transaction_id}
                          </span>
                          <span className="text-xs text-slate-400">
                            • {txn.customer_id}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {txn.location}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{txn.transaction_type.toUpperCase()}</span>
                          <span>•</span>
                          <span>{txn.merchant_category.replace('_', ' ')}</span>
                          {txn.is_international && (
                            <span className="px-1.5 py-0.2 text-[10px] rounded bg-purple-950/70 text-purple-300 border border-purple-800/40">
                              INTL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0">
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-white">
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </div>
                        <div
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isHigh
                              ? 'text-rose-400'
                              : isMedium
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {txn.risk_level} RISK ({(txn.fraud_probability * 100).toFixed(1)}%)
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Showing top recent flagged items</span>
            <button
              onClick={onNavigateToPredictor}
              className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Test New Transaction Anomaly &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
