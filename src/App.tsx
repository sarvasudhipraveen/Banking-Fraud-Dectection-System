import React, { useState, useEffect } from 'react';
import { Navbar, TabType } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { PredictorView } from './components/PredictorView';
import { TransactionsView } from './components/TransactionsView';
import { PaymentHistoryView } from './components/PaymentHistoryView';
import { BankDirectoryView } from './components/BankDirectoryView';
import { BankServicesView } from './components/BankServicesView';
import { ModelLabView } from './components/ModelLabView';
import { MLOpsMonitorView } from './components/MLOpsMonitorView';
import { ArchitectureView } from './components/ArchitectureView';
import { AuthModal } from './components/AuthModal';
import { LoginGateView } from './components/LoginGateView';
import { HighRiskAlertModal } from './components/HighRiskAlertModal';
import { TransactionInspectModal } from './components/TransactionInspectModal';
import { Cinematic3DBackground } from './components/3d/Cinematic3DBackground';
import { BankingTransaction, User, PredictionResult, PredictionInput } from './types';
import { INITIAL_PAYMENT_RECORDS, DEMO_USERS } from './services/bankData';
import { PhoneCall, ShieldCheck, Building2, Lock } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Transactions & Payments State (seeded with rich bank transactions)
  const [transactions, setTransactions] = useState<BankingTransaction[]>(() => {
    const saved = localStorage.getItem('apex_banking_transactions_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_PAYMENT_RECORDS;
      }
    }
    return INITIAL_PAYMENT_RECORDS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('apex_banking_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  // Auth User State - Gated: must log in to view the website
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('apex_auth_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      sessionStorage.setItem('apex_auth_user', JSON.stringify(user));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('apex_auth_user');
    } catch {
      // ignore
    }
  };

  // High-Risk Alert State (Risk > 80%)
  const [alertModalData, setAlertModalData] = useState<{
    result: PredictionResult;
    input: PredictionInput;
  } | null>(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Transaction Inspection Modal State
  const [inspectedTransaction, setInspectedTransaction] = useState<BankingTransaction | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // Handlers
  const handleAddTransaction = (newTxn: BankingTransaction) => {
    setTransactions((prev) => [newTxn, ...prev]);
  };

  const handleUpdateTransaction = (txnId: string, updates: Partial<BankingTransaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, ...updates } : t))
    );
  };

  const handleTriggerHighRiskAlert = (result: PredictionResult, input: PredictionInput) => {
    setAlertModalData({ result, input });
    setIsAlertModalOpen(true);
  };

  const handleInspectTransaction = (txn: BankingTransaction) => {
    setInspectedTransaction(txn);
    setIsInspectModalOpen(true);
  };

  const handleUpdateTransactionStatus = (
    txnId: string,
    newStatus: 'Legitimate' | 'Fraud' | 'Under Review'
  ) => {
    handleUpdateTransaction(txnId, { status: newStatus });
  };

  // High-risk alerts count for unread badge
  const unreadAlertCount = transactions.filter(
    (t) => t.status === 'Fraud' && t.risk_score >= 85
  ).length;

  // Gate the entire website: if not logged in, show 3D Authentication Gateway
  if (!currentUser) {
    return <LoginGateView onLogin={handleLogin} />;
  }

  return (
    <div id="banking-fraud-app" className="relative min-h-screen cinematic-blue-glow text-slate-100 flex flex-col font-sans">
      {/* Cinematic 3D Ambient Visual Layer */}
      <Cinematic3DBackground />

      {/* Top Navbar with Cinematic Blue Lighting */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        unreadAlertCount={unreadAlertCount}
        onOpenAlerts={() => {
          const firstHighRisk = transactions.find((t) => t.risk_level === 'HIGH');
          if (firstHighRisk) {
            handleInspectTransaction(firstHighRisk);
          } else {
            setActiveTab('dashboard');
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            transactions={transactions}
            onNavigateToPredictor={() => setActiveTab('predictor')}
            onInspectTransaction={handleInspectTransaction}
          />
        )}

        {activeTab === 'predictor' && (
          <PredictorView
            onTransactionLogged={handleAddTransaction}
            onTriggerHighRiskAlert={handleTriggerHighRiskAlert}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentHistoryView
            transactions={transactions}
            currentUser={currentUser}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onInspectTransaction={handleInspectTransaction}
          />
        )}

        {activeTab === 'bank_directory' && <BankDirectoryView />}

        {activeTab === 'bank_services' && <BankServicesView />}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onInspectTransaction={handleInspectTransaction}
          />
        )}

        {activeTab === 'model_lab' && <ModelLabView />}

        {activeTab === 'mlops' && <MLOpsMonitorView />}

        {activeTab === 'architecture' && <ArchitectureView transactions={transactions} />}
      </main>

      {/* Institutional Cinematic Blue Footer */}
      <footer className="border-t border-blue-900/60 bg-[#020a1c]/90 py-6 text-xs text-blue-300/80 font-mono mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-bold">
              Apex Banking Fraud & Risk Intelligence Platform
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setActiveTab('bank_directory')}
              className="text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Apex Bank & Global Toll-Free Hotlines</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('bank_services')}
              className="text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Building2 className="w-3 h-3" />
              <span>Apex Reserve Controls</span>
            </button>
            <span>•</span>
            <span className="text-emerald-400">Response Speed: 22ms</span>
          </div>
        </div>
      </footer>

      {/* Authentication & Profile Modal with Password Rules & Dual Staff/User Login */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* High-Risk Anomaly Real-Time Alert Modal (Risk > 80%) */}
      <HighRiskAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        alertData={alertModalData}
        onAction={(action) => {
          if (alertModalData) {
            handleAddTransaction({
              id: alertModalData.result.transaction_id,
              transaction_id: alertModalData.result.transaction_id,
              customer_id: alertModalData.input.customer_id,
              amount: alertModalData.input.amount,
              currency: alertModalData.input.is_international ? 'USD' : 'INR',
              bank_name: 'Apex Premier Bank',
              payment_mode: alertModalData.input.transaction_type === 'wire' ? 'SWIFT Wire' : 'UPI',
              beneficiary_name: alertModalData.input.merchant_category,
              reference_utr: `APEX${Date.now().toString().slice(-8)}`,
              transaction_type: alertModalData.input.transaction_type,
              merchant_category: alertModalData.input.merchant_category,
              location: alertModalData.input.location,
              device_type: alertModalData.input.device_type,
              is_international: alertModalData.input.is_international,
              hour: alertModalData.input.hour,
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              status: action.includes('Cleared') ? 'Legitimate' : 'Fraud',
              risk_level: alertModalData.result.risk_level,
              fraud_probability: alertModalData.result.fraud_probability,
              risk_score: alertModalData.result.risk_score,
              failed_attempts: alertModalData.input.failed_attempts,
              previous_transaction_amount: alertModalData.input.average_transaction_amount,
              transactions_last_24h: alertModalData.input.transactions_last_24h,
              action_taken: action as any
            });
          }
        }}
      />

      {/* Transaction & SHAP Inspector Modal */}
      <TransactionInspectModal
        isOpen={isInspectModalOpen}
        onClose={() => setIsInspectModalOpen(false)}
        transaction={inspectedTransaction}
        onUpdateStatus={handleUpdateTransactionStatus}
      />
    </div>
  );
}
