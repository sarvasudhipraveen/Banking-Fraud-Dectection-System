import React, { useState } from 'react';
import {
  Layers,
  Database,
  Terminal,
  FileCode,
  FolderTree,
  Send,
  Play,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Server,
  Code2,
  FileText
} from 'lucide-react';
import { BankingTransaction } from '../types';

interface ArchitectureViewProps {
  transactions: BankingTransaction[];
}

export const ArchitectureView: React.FC<ArchitectureViewProps> = ({ transactions }) => {
  const [activeSubTab, setActiveSubTab] = useState<'fastapi' | 'mysql' | 'structure' | 'resume'>('fastapi');
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('predict');
  const [requestPayload, setRequestPayload] = useState<string>(
    JSON.stringify(
      {
        amount: 85000,
        transaction_type: 'online',
        merchant_category: 'gaming_crypto',
        hour: 2,
        is_international: false,
        is_new_device: true,
        failed_attempts: 2
      },
      null,
      2
    )
  );
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isExecutingApi, setIsExecutingApi] = useState(false);

  // SQL Console State
  const [sqlQuery, setSqlQuery] = useState<string>(
    "SELECT transaction_id, customer_id, amount, location, risk_level, status FROM transactions WHERE risk_level = 'HIGH' ORDER BY amount DESC LIMIT 5;"
  );
  const [sqlResults, setSqlResults] = useState<{ columns: string[]; rows: any[][]; timeMs: number }>({
    columns: ['transaction_id', 'customer_id', 'amount', 'location', 'risk_level', 'status'],
    rows: [
      ['TXN98372', 'CUST-8821', '₹92,000', 'Dubai, UAE', 'HIGH', 'Fraud'],
      ['TXN002', 'CUST-3942', '₹85,000', 'Mumbai', 'HIGH', 'Fraud'],
      ['TXN004', 'CUST-7741', '₹64,000', 'Delhi NCR', 'HIGH', 'Fraud'],
      ['TXN008', 'CUST-4419', '₹1,10,000', 'Singapore', 'HIGH', 'Fraud']
    ],
    timeMs: 4.2
  });

  const [copiedResume, setCopiedResume] = useState(false);

  const handleRunApiEndpoint = () => {
    setIsExecutingApi(true);

    setTimeout(() => {
      setIsExecutingApi(false);
      if (selectedEndpoint === 'predict') {
        try {
          const parsed = JSON.parse(requestPayload);
          setApiResponse({
            status_code: 200,
            headers: { 'content-type': 'application/json', 'x-process-time-ms': '22.4' },
            body: {
              transaction_id: 'TXN-884219',
              prediction: 'FRAUD',
              fraud_probability: 0.917,
              risk_level: 'HIGH',
              risk_score: 92,
              recommendation:
                'Transaction requires additional verification. 3D-Secure biometric step-up initiated.',
              model_metadata: {
                model_name: 'XGBoostClassifier',
                version: 'v2.4-prod',
                pr_auc: 0.9385
              },
              shap_contributions: [
                { feature: 'amount_anomaly', contribution_pts: '+32' },
                { feature: 'new_device_signature', contribution_pts: '+21' },
                { feature: 'failed_attempts', contribution_pts: '+18' },
                { feature: 'unusual_transaction_hour', contribution_pts: '+12' }
              ]
            }
          });
        } catch {
          setApiResponse({ error: 'Invalid JSON payload' });
        }
      } else if (selectedEndpoint === 'transactions') {
        setApiResponse({
          status_code: 200,
          total_records: transactions.length,
          items: transactions.slice(0, 3)
        });
      } else if (selectedEndpoint === 'stats') {
        setApiResponse({
          status_code: 200,
          total_transactions: 25430,
          fraud_detected: 324,
          legitimate_cleared: 25106,
          fraud_rate_pct: 1.27,
          capital_protected_inr: '₹1.48 Cr',
          p95_latency_ms: 22.1
        });
      }
    }, 250);
  };

  const handleExecuteSql = () => {
    // Quick simulator for SQL query
    let rows: any[][] = [];
    if (sqlQuery.toLowerCase().includes('high')) {
      rows = [
        ['TXN98372', 'CUST-8821', '₹92,000', 'Dubai, UAE', 'HIGH', 'Fraud'],
        ['TXN002', 'CUST-3942', '₹85,000', 'Mumbai', 'HIGH', 'Fraud'],
        ['TXN004', 'CUST-7741', '₹64,000', 'Delhi NCR', 'HIGH', 'Fraud'],
        ['TXN008', 'CUST-4419', '₹1,10,000', 'Singapore', 'HIGH', 'Fraud']
      ];
    } else {
      rows = [
        ['TXN001', 'CUST-1049', '₹2,500', 'Vijayawada', 'LOW', 'Legitimate'],
        ['TXN003', 'CUST-5512', '₹1,200', 'Hyderabad', 'LOW', 'Legitimate'],
        ['TXN005', 'CUST-2190', '₹12,500', 'Bengaluru', 'LOW', 'Legitimate'],
        ['TXN006', 'CUST-9031', '₹45,000', 'London, UK', 'MEDIUM', 'Under Review']
      ];
    }

    setSqlResults({
      columns: ['transaction_id', 'customer_id', 'amount', 'location', 'risk_level', 'status'],
      rows,
      timeMs: Math.round(Math.random() * 5 + 2)
    });
  };

  return (
    <div id="architecture-container" className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Layers className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono">
                Enterprise Architecture • Security Services & Data Vault
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              System Infrastructure, Security Vault & Service Topology
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              High-availability banking security architecture: Real-time authorization API, encrypted transaction ledger, and microservices deployment layout.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-semibold self-start md:self-center">
            <button
              onClick={() => setActiveSubTab('fastapi')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'fastapi'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Payment Gateway API
            </button>
            <button
              onClick={() => setActiveSubTab('mysql')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'mysql'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Transaction Data Vault
            </button>
            <button
              onClick={() => setActiveSubTab('structure')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'structure'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Topology
            </button>
            <button
              onClick={() => setActiveSubTab('resume')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeSubTab === 'resume'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Solution Brief
            </button>
          </div>
        </div>
      </div>

      {/* SubTab 1: FastAPI Swagger Interactive Playground */}
      {activeSubTab === 'fastapi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Endpoints List & Request Editor (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  Payment Gateway API Explorer
                </h3>
                <span className="text-[10px] font-mono text-emerald-400">docs: /docs /redoc</span>
              </div>

              {/* Endpoint selection pills */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedEndpoint('predict');
                    setRequestPayload(
                      JSON.stringify(
                        {
                          amount: 85000,
                          transaction_type: 'online',
                          merchant_category: 'gaming_crypto',
                          hour: 2,
                          is_international: false,
                          is_new_device: true,
                          failed_attempts: 2
                        },
                        null,
                        2
                      )
                    );
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedEndpoint === 'predict'
                      ? 'bg-slate-950 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono text-xs font-bold">
                      POST
                    </span>
                    <span className="font-mono text-xs text-white">/api/v1/predict</span>
                  </div>
                  <span className="text-xs text-slate-400">ML Scoring</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEndpoint('transactions');
                    setRequestPayload('{}');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedEndpoint === 'transactions'
                      ? 'bg-slate-950 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold">
                      GET
                    </span>
                    <span className="font-mono text-xs text-white">/api/v1/transactions</span>
                  </div>
                  <span className="text-xs text-slate-400">Fetch Ledger</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedEndpoint('stats');
                    setRequestPayload('{}');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                    selectedEndpoint === 'stats'
                      ? 'bg-slate-950 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 font-mono text-xs font-bold">
                      GET
                    </span>
                    <span className="font-mono text-xs text-white">/api/v1/dashboard/stats</span>
                  </div>
                  <span className="text-xs text-slate-400">KPI Aggregates</span>
                </button>
              </div>

              {/* JSON Payload Editor */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Request JSON Body (Pydantic Schema):
                </label>
                <textarea
                  value={requestPayload}
                  onChange={(e) => setRequestPayload(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-rose-300 font-mono text-xs p-3 rounded-xl"
                />
              </div>

              <button
                type="button"
                onClick={handleRunApiEndpoint}
                disabled={isExecutingApi}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isExecutingApi ? 'animate-spin' : ''}`} />
                <span>{isExecutingApi ? 'Processing Request...' : 'Send Verification Request'}</span>
              </button>
            </div>

            {/* Response Viewer (6 cols) */}
            <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-rose-400" />
                    Response (HTTP Status 200 OK)
                  </h3>
                  <span className="text-xs font-mono text-emerald-400 font-bold">200 OK</span>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto h-96 leading-relaxed">
                  {apiResponse
                    ? JSON.stringify(apiResponse, null, 2)
                    : JSON.stringify(
                        {
                          message: 'Click "Send Verification Request" above to test the live payment gateway.'
                        },
                        null,
                        2
                      )}
                </pre>
              </div>

              <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Ultra-low latency banking gateway service</span>
                <span className="font-mono text-slate-500">Latency: 22ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: MySQL Database Schema & SQL Console */}
      {activeSubTab === 'mysql' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* MySQL Tables DDL (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  MySQL Relational Tables DDL
                </h3>
                <span className="text-[10px] font-mono text-slate-400">InnoDB UTF8MB4</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Users Table */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-rose-400 mb-1">TABLE users</div>
                  <div className="text-slate-400 space-y-0.5 text-[11px]">
                    <div>id INT PRIMARY KEY AUTO_INCREMENT</div>
                    <div>name VARCHAR(100) NOT NULL</div>
                    <div>email VARCHAR(150) UNIQUE NOT NULL</div>
                    <div>password_hash VARCHAR(255) NOT NULL</div>
                    <div>created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1">TABLE transactions</div>
                  <div className="text-slate-400 space-y-0.5 text-[11px]">
                    <div>id BIGINT PRIMARY KEY AUTO_INCREMENT</div>
                    <div>transaction_id VARCHAR(50) UNIQUE INDEX</div>
                    <div>user_id INT FOREIGN KEY REFERENCES users(id)</div>
                    <div>amount DECIMAL(12, 2) NOT NULL</div>
                    <div>transaction_type ENUM('online','pos','atm','wire','upi')</div>
                    <div>merchant_category VARCHAR(60)</div>
                    <div>location VARCHAR(100)</div>
                    <div>status ENUM('Legitimate','Fraud','Under Review')</div>
                    <div>timestamp DATETIME INDEX</div>
                  </div>
                </div>

                {/* Predictions Table */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="font-bold text-indigo-400 mb-1">TABLE predictions</div>
                  <div className="text-slate-400 space-y-0.5 text-[11px]">
                    <div>id BIGINT PRIMARY KEY AUTO_INCREMENT</div>
                    <div>transaction_id VARCHAR(50) REFERENCES transactions</div>
                    <div>prediction ENUM('FRAUD','LEGITIMATE')</div>
                    <div>fraud_probability DECIMAL(5,4) NOT NULL</div>
                    <div>risk_level ENUM('LOW','MEDIUM','HIGH')</div>
                    <div>risk_score TINYINT NOT NULL</div>
                    <div>created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive SQL Console (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-amber-400" />
                  Interactive MySQL SQL Query Runner
                </h3>
                <span className="text-xs text-slate-400">Database: apex_fraud_db</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  SQL Statement:
                </label>
                <textarea
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-amber-300 font-mono text-xs p-3 rounded-xl"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setSqlQuery(
                        "SELECT transaction_id, customer_id, amount, location, risk_level, status FROM transactions WHERE risk_level = 'HIGH' ORDER BY amount DESC LIMIT 5;"
                      )
                    }
                    className="text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    High Risk Fraud Query
                  </button>
                  <button
                    onClick={() =>
                      setSqlQuery(
                        'SELECT transaction_id, customer_id, amount, location, risk_level, status FROM transactions WHERE status = "Legitimate" LIMIT 5;'
                      )
                    }
                    className="text-[11px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                  >
                    Legitimate Query
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExecuteSql}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute SQL</span>
                </button>
              </div>

              {/* SQL Query Result Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden mt-4">
                <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-[11px] text-slate-400 flex justify-between">
                  <span>Query returned {sqlResults.rows.length} rows</span>
                  <span className="font-mono text-emerald-400">Time: {sqlResults.timeMs}ms</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                        {sqlResults.columns.map((c, i) => (
                          <th key={i} className="px-3 py-2">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {sqlResults.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-800/40">
                          {row.map((val, cIdx) => (
                            <td key={cIdx} className="px-3 py-2 text-slate-200">
                              {val}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 3: Project Structure (Prompt Section 7) */}
      {activeSubTab === 'structure' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-rose-400" />
                2026 Recommended Project Directory Tree
              </h3>
              <p className="text-xs text-slate-400">
                Architectural layout from raw notebooks to production Docker containerization
              </p>
            </div>
            <span className="text-xs font-mono text-rose-400">Clean Monorepo</span>
          </div>

          <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`banking-fraud-detection/
├── data/
│   ├── raw/
│   │   └── creditcard_raw.csv
│   └── processed/
│       ├── x_train_smote.parquet
│       └── y_train.parquet
│
├── notebooks/
│   ├── 01_data_analysis.ipynb          # Pandas, Matplotlib, Seaborn EDA
│   ├── 02_preprocessing.ipynb          # Missing values, Scaler, Imbalanced ratio
│   ├── 03_feature_engineering.ipynb    # Velocity, Hour, Deviation, MCC Ratios
│   └── 04_model_training.ipynb         # Logistic vs Tree vs RF vs XGBoost
│
├── models/
│   ├── fraud_model.pkl                 # Champion XGBoost artifact (scale_pos_weight=99.0)
│   ├── scaler.pkl                      # RobustScaler artifact
│   └── feature_columns.pkl             # Serialized engineered feature list
│
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI application entry point
│   │   ├── models.py                   # SQLAlchemy ORM definitions (Users, Txns, Predictions)
│   │   ├── schemas.py                  # Pydantic v2 validation models
│   │   ├── database.py                 # MySQL connection pool
│   │   ├── prediction.py               # XGBoost inference & SHAP engine
│   │   └── auth.py                     # JWT token generation & bcrypt hashing
│   └── requirements.txt                # fastapi, uvicorn, xgboost, scikit-learn, shap, evidently
│
├── frontend/
│   ├── src/                            # Modern React 19 + Tailwind CSS + Recharts UI
│   ├── index.html
│   └── package.json
│
├── monitoring/
│   ├── prometheus.yml                  # Scrape config for /metrics endpoint
│   └── metrics.py                      # Prometheus Client counters & latency summary
│
├── tests/
│   ├── test_api.py                     # Pytest API validation
│   └── test_model.py                   # ML inference consistency test
│
├── Dockerfile                          # Multi-stage production container
├── docker-compose.yml                  # Orchestrating FastAPI + MySQL + Prometheus + Grafana
└── README.md`}
          </pre>
        </div>
      )}

      {/* SubTab 4: Resume Spec & Portfolio Description */}
      {activeSubTab === 'resume' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Executive Solution Summary & Specification
              </h3>
              <p className="text-xs text-slate-400">
                High-level business and technical overview designed for leadership and security audit reviews
              </p>
            </div>

            <button
              onClick={() => {
                const text = `Enterprise Banking Fraud Prevention and Real-Time Risk Monitoring Platform\nEngineered a real-time banking protection platform that evaluates transactions in under 30 milliseconds. Incorporates automated behavioral pattern analysis, multi-channel fraud intercept shields, an encrypted transaction ledger, and 24/7 uptime telemetry with automated drift protection.`;
                navigator.clipboard.writeText(text);
                setCopiedResume(true);
                setTimeout(() => setCopiedResume(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              {copiedResume ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Solution Summary</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Platform Title:
              </span>
              <div className="text-lg font-bold text-white">
                Enterprise Banking Fraud Prevention & Real-Time Risk Monitoring Platform
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Executive Overview:
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                "Engineered a real-time banking protection platform that evaluates transactions in under 30 milliseconds. Incorporates automated behavioral pattern analysis, multi-channel fraud intercept shields, an encrypted transaction ledger, and 24/7 uptime telemetry with automated drift protection."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-rose-400 mb-1">Security & AI Engine</div>
                <div className="text-slate-400">Real-Time Risk Scoring, Anomaly Detection, Multi-Factor Threat Attribution</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-emerald-400 mb-1">Backend & Data Vault</div>
                <div className="text-slate-400">Sub-30ms Payment Gateway, Encrypted Ledger, Resilient Connection Pooling</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="font-bold text-indigo-400 mb-1">Operations & Health</div>
                <div className="text-slate-400">24/7 Uptime Telemetry, Live Threat Shift Detection, High-Availability Clusters</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
