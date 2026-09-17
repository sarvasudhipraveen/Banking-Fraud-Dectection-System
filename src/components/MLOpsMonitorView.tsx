import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  Activity,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Cpu,
  Layers,
  Copy,
  Check,
  Zap,
  TrendingDown,
  TrendingUp,
  Server
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import {
  INITIAL_PROMETHEUS_METRICS,
  INITIAL_DRIFT_REPORT,
  generateRawPrometheusExposition,
  PrometheusMetricsState
} from '../services/mlopsEngine';
import { DriftReport } from '../types';

export const MLOpsMonitorView: React.FC = () => {
  const [prometheusMetrics, setPrometheusMetrics] = useState<PrometheusMetricsState>(
    INITIAL_PROMETHEUS_METRICS
  );
  const [driftReport, setDriftReport] = useState<DriftReport>(INITIAL_DRIFT_REPORT);
  const [activeTab, setActiveTab] = useState<'drift' | 'prometheus' | 'grafana'>('drift');
  const [copiedPrometheus, setCopiedPrometheus] = useState(false);

  // Retraining state
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);

  const handleCopyMetrics = () => {
    const raw = generateRawPrometheusExposition(prometheusMetrics);
    navigator.clipboard.writeText(raw);
    setCopiedPrometheus(true);
    setTimeout(() => setCopiedPrometheus(false), 2000);
  };

  const handleTriggerRetrain = () => {
    setIsRetraining(true);
    setRetrainLogs([
      'Initiating automated security shield calibration update...',
      'Step 1/5: Screening latest transaction logs and high-risk pattern deviations...',
      'Step 2/5: Merging verified payment records with historical baseline profile...',
      'Step 3/5: Rebalancing threat detection sensitivity for emerging fraud signatures...',
      'Step 4/5: Fitting calibrated security rules across all transaction channels...',
      'Step 5/5: Validating security rules against 25,000+ benchmark payments: Shield updated!'
    ]);

    setTimeout(() => {
      setIsRetraining(false);
      setDriftReport({
        ...driftReport,
        drift_share_percentage: 0.0,
        dataset_drift_detected: false,
        last_retrained: 'Just now (v2.5-xgboost-retrained)',
        recommendation:
          'All monitored features are within statistical stability thresholds. Production model is optimal.',
        features: driftReport.features.map((f) => ({
          ...f,
          drift_detected: false,
          severity: 'None',
          psi_score: Number((f.psi_score * 0.18).toFixed(3)),
          p_value: 0.72
        }))
      });
      setPrometheusMetrics((prev) => ({
        ...prev,
        prediction_latency_p95: 19.8,
        fraud_predictions_total: prev.fraud_predictions_total + 14
      }));
    }, 2400);
  };

  // Mock live latency stream
  const latencyStreamData = [
    { time: '02:10', p50: 16.2, p95: 23.8, p99: 42.1 },
    { time: '02:15', p50: 17.1, p95: 24.5, p99: 45.3 },
    { time: '02:20', p50: 15.9, p95: 22.1, p99: 41.0 },
    { time: '02:25', p50: 16.5, p95: 24.2, p99: 48.6 },
    { time: '02:30', p50: 16.4, p95: 23.9, p99: 46.2 }
  ];

  return (
    <div id="mlops-monitor-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <LineChartIcon className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                Live System Health • Threat Trends & Accuracy Monitoring
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Real-Time System Health & Threat Pattern Evolution
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Continuous monitoring of payment verification speed, transaction volumes, and automated detection of evolving fraud patterns.
            </p>
          </div>

          {/* Sub-tabs: Drift vs Prometheus vs Grafana */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold self-start md:self-center">
            <button
              onClick={() => setActiveTab('drift')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'drift'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Threat Pattern Shifts
            </button>
            <button
              onClick={() => setActiveTab('grafana')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'grafana'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Performance Analytics
            </button>
            <button
              onClick={() => setActiveTab('prometheus')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'prometheus'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Health Feed
            </button>
          </div>
        </div>
      </div>

      {/* System Telemetry Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">VERIFICATIONS PROCESSED</div>
          <div className="text-xl font-extrabold text-white mt-1">
            {prometheusMetrics.api_requests_total.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">HTTP 200 OK</div>
        </div>

        <div className="bg-slate-900/90 border border-rose-900/40 rounded-xl p-4 font-mono">
          <div className="text-[10px] text-rose-400 uppercase">FRAUD INTERCEPTED</div>
          <div className="text-xl font-extrabold text-rose-400 mt-1">
            {prometheusMetrics.fraud_predictions_total}
          </div>
          <div className="text-[10px] text-rose-300 mt-1">Threats Blocked</div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-xl p-4 font-mono">
          <div className="text-[10px] text-emerald-400 uppercase">LEGITIMATE CLEARED</div>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {prometheusMetrics.legitimate_predictions_total.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-emerald-300 mt-1">Cleared Instantly</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">AVG RESPONSE SPEED</div>
          <div className="text-xl font-extrabold text-white mt-1">
            {prometheusMetrics.prediction_latency_p50} ms
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Median Gateway</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">MAX RESPONSE (P95)</div>
          <div className="text-xl font-extrabold text-amber-300 mt-1">
            {prometheusMetrics.prediction_latency_p95} ms
          </div>
          <div className="text-[10px] text-amber-400/80 mt-1">95th Percentile</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono">
          <div className="text-[10px] text-slate-400 uppercase">SYSTEM HEALTH</div>
          <div className="text-xl font-extrabold text-slate-300 mt-1">
            99.96%
          </div>
          <div className="text-[10px] text-slate-400 mt-1">0.04% error budget</div>
        </div>
      </div>

      {/* Main Tab 1: Evidently AI Data & Model Drift (Prompt Section 13) */}
      {activeTab === 'drift' && (
        <div className="space-y-6">
          {/* Drift Status Banner */}
          <div
            className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl ${
              driftReport.dataset_drift_detected
                ? 'bg-rose-950/20 border-rose-800/80'
                : 'bg-emerald-950/20 border-emerald-800/80'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  driftReport.dataset_drift_detected
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}
              >
                {driftReport.dataset_drift_detected ? (
                  <AlertCircle className="w-6 h-6" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {driftReport.dataset_drift_detected
                      ? '⚠️ Evidently AI: Dataset & Feature Drift Detected!'
                      : '✅ Evidently AI: All Monitored Distributions Stable'}
                  </h2>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    Drift Share: {driftReport.drift_share_percentage}%
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  {driftReport.recommendation}
                </p>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-3">
                  <span>Baseline: {driftReport.baseline_sample_size.toLocaleString()} txns</span>
                  <span>•</span>
                  <span>Production Stream: {driftReport.production_sample_size.toLocaleString()} txns</span>
                  <span>•</span>
                  <span>Last Retrained: {driftReport.last_retrained}</span>
                </div>
              </div>
            </div>

            {/* Retrain Action Button */}
            <div className="shrink-0">
              <button
                id="btn-retrain-model"
                type="button"
                onClick={handleTriggerRetrain}
                disabled={isRetraining || !driftReport.dataset_drift_detected}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                  driftReport.dataset_drift_detected
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60'
                    : 'bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${isRetraining ? 'animate-spin' : ''}`} />
                <span>
                  {isRetraining
                    ? 'Calibrating Security Shield...'
                    : driftReport.dataset_drift_detected
                    ? 'Recalibrate Security Shield'
                    : 'Security Shield is Up-to-Date'}
                </span>
              </button>
            </div>
          </div>

          {/* Retraining Log Stream */}
          {retrainLogs.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-1 shadow-inner">
              <div className="flex items-center gap-2 text-slate-400 pb-2 border-b border-slate-800">
                <Terminal className="w-3.5 h-3.5 text-rose-400" />
                <span>System Security Calibration Log</span>
              </div>
              {retrainLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300">
                  <span className="text-slate-500 font-bold mr-2">&gt;</span>
                  {log}
                </div>
              ))}
            </div>
          )}

          {/* Evidently Drift Metric Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Transaction Factor Stability & Threat Shifts
                </h3>
                <p className="text-xs text-slate-400">
                  Monitors changes in customer spending habits and emerging fraud attack patterns
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Feature Name</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Baseline Mean</th>
                    <th className="px-4 py-3">Production Mean</th>
                    <th className="px-4 py-3">KS Statistic / Chi-Sq</th>
                    <th className="px-4 py-3">P-Value</th>
                    <th className="px-4 py-3">PSI Score</th>
                    <th className="px-4 py-3 text-right">Pattern Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {driftReport.features.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-white font-sans">
                        {f.feature_name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400 uppercase text-[10px]">
                        {f.column_type}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300">{f.baseline_mean}</td>
                      <td className="px-4 py-3.5 text-white font-bold">{f.production_mean}</td>
                      <td className="px-4 py-3.5 text-slate-300">{f.ks_statistic_or_chisq}</td>
                      <td
                        className={`px-4 py-3.5 font-bold ${
                          f.p_value < 0.05 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {f.p_value}
                      </td>
                      <td
                        className={`px-4 py-3.5 font-bold ${
                          f.psi_score > 0.2 ? 'text-rose-400' : 'text-slate-300'
                        }`}
                      >
                        {f.psi_score}
                      </td>
                      <td className="px-4 py-3.5 text-right font-sans">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                            f.drift_detected
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {f.drift_detected ? 'THREAT SHIFT DETECTED' : 'STABLE'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 2: Grafana Dashboards */}
      {activeTab === 'grafana' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Latency Percentiles (P50, P95, P99) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Real-Time Security Verification Speed (ms)
                  </h3>
                  <p className="text-xs text-slate-400">P50 vs P95 vs P99 response times</p>
                </div>
                <span className="text-xs font-mono text-emerald-400">Target &lt; 50ms</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={latencyStreamData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit="ms" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f8fafc'
                      }}
                    />
                    <Area type="monotone" dataKey="p99" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="p95" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                    <Area type="monotone" dataKey="p50" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-center gap-6 mt-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> P50: 16.4ms
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> P95: 24.2ms
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> P99: 48.6ms
                </span>
              </div>
            </div>

            {/* Model Probability Histogram */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-400" />
                    Transaction Risk Distribution Profile
                  </h3>
                  <p className="text-xs text-slate-400">Distribution profile of transaction safety checks</p>
                </div>
                <span className="text-xs font-mono text-slate-400">Bucket Width: 0.1</span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { bucket: '0.0-0.1', count: 23600, fill: '#10b981' },
                      { bucket: '0.1-0.2', count: 1006, fill: '#10b981' },
                      { bucket: '0.2-0.3', count: 320, fill: '#10b981' },
                      { bucket: '0.3-0.4', count: 180, fill: '#f59e0b' },
                      { bucket: '0.4-0.5', count: 140, fill: '#f59e0b' },
                      { bucket: '0.5-0.6', count: 80, fill: '#f59e0b' },
                      { bucket: '0.6-0.7', count: 64, fill: '#f59e0b' },
                      { bucket: '0.7-0.8', count: 92, fill: '#f43f5e' },
                      { bucket: '0.8-0.9', count: 142, fill: '#f43f5e' },
                      { bucket: '0.9-1.0', count: 90, fill: '#f43f5e' }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="bucket" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#f8fafc'
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[11px] text-slate-400 text-center mt-2">
                Clear separation between confident legitimate (98.7%) and high-probability fraud clusters
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Tab 3: Prometheus Raw /metrics Exporter */}
      {activeTab === 'prometheus' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Live System Health Stream
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monitored 24/7 every 15s to ensure instant payment authorization and continuous uptime
              </p>
            </div>

            <button
              id="btn-copy-prometheus"
              onClick={handleCopyMetrics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              {copiedPrometheus ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy /metrics</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
            {generateRawPrometheusExposition(prometheusMetrics)}
          </pre>
        </div>
      )}
    </div>
  );
};
