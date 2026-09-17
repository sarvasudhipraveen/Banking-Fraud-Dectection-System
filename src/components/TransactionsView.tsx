import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  Plus,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowUpDown,
  ExternalLink,
  Trash2,
  Calendar,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  BankingTransaction,
  TransactionType,
  MerchantCategory,
  DeviceType,
  RiskLevel
} from '../types';

interface TransactionsViewProps {
  transactions: BankingTransaction[];
  onAddTransaction: (txn: BankingTransaction) => void;
  onInspectTransaction: (txn: BankingTransaction) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onAddTransaction,
  onInspectTransaction
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'amount' | 'timestamp' | 'risk_score'>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);

  // Add Transaction Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTxnData, setNewTxnData] = useState({
    customer_id: 'CUST-6621',
    amount: 15000,
    transaction_type: 'online' as TransactionType,
    merchant_category: 'electronics' as MerchantCategory,
    location: 'Bengaluru',
    device_type: 'trusted_mobile' as DeviceType,
    is_international: false,
    hour: 14,
    status: 'Legitimate' as 'Legitimate' | 'Fraud' | 'Under Review'
  });

  // Filter & Search Logic
  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.merchant_category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesType = typeFilter === 'all' || t.transaction_type === typeFilter;
    const matchesRisk = riskFilter === 'all' || t.risk_level === riskFilter;

    return matchesSearch && matchesStatus && matchesType && matchesRisk;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    let diff = 0;
    if (sortField === 'amount') {
      diff = a.amount - b.amount;
    } else if (sortField === 'risk_score') {
      diff = a.risk_score - b.risk_score;
    } else {
      diff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return sortAsc ? diff : -diff;
  });

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = [
      'Transaction ID',
      'Customer ID',
      'Amount (INR)',
      'Type',
      'Category',
      'Location',
      'Device',
      'International',
      'Hour',
      'Status',
      'Risk Level',
      'Risk Score',
      'Fraud Probability',
      'Timestamp'
    ];

    const rows = sorted.map((t) => [
      t.transaction_id,
      t.customer_id,
      t.amount,
      t.transaction_type,
      t.merchant_category,
      `"${t.location}"`,
      t.device_type,
      t.is_international ? 'TRUE' : 'FALSE',
      t.hour,
      t.status,
      t.risk_level,
      t.risk_score,
      t.fraud_probability,
      t.timestamp
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `banking_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isFraud = newTxnData.status === 'Fraud';
    const riskLevel: RiskLevel = isFraud ? 'HIGH' : newTxnData.status === 'Under Review' ? 'MEDIUM' : 'LOW';
    const riskScore = isFraud ? 92 : newTxnData.status === 'Under Review' ? 55 : 4;
    const fraudProb = isFraud ? 0.917 : newTxnData.status === 'Under Review' ? 0.55 : 0.04;

    const created: BankingTransaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      transaction_id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: newTxnData.customer_id,
      amount: newTxnData.amount,
      transaction_type: newTxnData.transaction_type,
      merchant_category: newTxnData.merchant_category,
      location: newTxnData.location,
      device_type: newTxnData.device_type,
      is_international: newTxnData.is_international,
      hour: newTxnData.hour,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: newTxnData.status,
      risk_level: riskLevel,
      fraud_probability: fraudProb,
      risk_score: riskScore,
      failed_attempts: 0,
      previous_transaction_amount: 3000,
      transactions_last_24h: 2,
      transactions_last_1h: 0,
      is_new_device: false,
      is_new_location: false,
      action_taken: isFraud ? 'Blocked' : 'Approved'
    };

    onAddTransaction(created);
    setIsAddModalOpen(false);
  };

  return (
    <div id="transactions-ledger-container" className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
              Module 2 • Banking Transactions
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Transaction Ledger & Fraud Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Query, filter, and inspect transaction verification statuses, locations, and calculated risk scores.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            id="btn-add-transaction-modal"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-950/60 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              id="search-transactions-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by TXN ID, Customer ID, Location, Merchant..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-rose-500 text-white rounded-xl pl-9 pr-3 py-2 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Legitimate">Legitimate</option>
              <option value="Fraud">Fraud</option>
              <option value="Under Review">Under Review</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              id="filter-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="online">Online Payment</option>
              <option value="pos">POS Terminal</option>
              <option value="atm">ATM Withdrawal</option>
              <option value="wire">Wire Transfer</option>
              <option value="upi">UPI Transfer</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div>
            <select
              id="filter-risk"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs cursor-pointer"
            >
              <option value="all">All Risk Tiers</option>
              <option value="LOW">Low (0-30)</option>
              <option value="MEDIUM">Medium (31-70)</option>
              <option value="HIGH">High (71-100)</option>
            </select>
          </div>
        </div>

        {/* Quick Active Filters & Count */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>
            Showing <strong className="text-white font-mono">{sorted.length}</strong> of{' '}
            <strong className="text-white font-mono">{transactions.length}</strong> transactions
          </span>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">Sort by:</span>
            <button
              onClick={() => {
                if (sortField === 'timestamp') setSortAsc(!sortAsc);
                else {
                  setSortField('timestamp');
                  setSortAsc(false);
                }
              }}
              className={`flex items-center gap-1 font-semibold ${
                sortField === 'timestamp' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Date</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                if (sortField === 'amount') setSortAsc(!sortAsc);
                else {
                  setSortField('amount');
                  setSortAsc(false);
                }
              }}
              className={`flex items-center gap-1 font-semibold ${
                sortField === 'amount' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Amount</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
            <button
              onClick={() => {
                if (sortField === 'risk_score') setSortAsc(!sortAsc);
                else {
                  setSortField('risk_score');
                  setSortAsc(false);
                }
              }}
              className={`flex items-center gap-1 font-semibold ${
                sortField === 'risk_score' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Risk</span>
              <ArrowUpDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table (Matching Prompt Module 2 Format) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Transaction</th>
                <th className="px-4 py-3.5">Customer</th>
                <th className="px-4 py-3.5 text-right">Amount (₹)</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Type & Merchant</th>
                <th className="px-4 py-3.5 text-center">Risk Score</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {sorted.length > 0 ? (
                sorted.map((txn) => {
                  const isFraud = txn.status === 'Fraud';
                  const isReview = txn.status === 'Under Review';

                  return (
                    <tr
                      key={txn.id}
                      className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      onClick={() => onInspectTransaction(txn)}
                    >
                      {/* Transaction ID */}
                      <td className="px-4 py-3.5 font-mono font-bold text-white group-hover:text-rose-400 transition-colors">
                        <div className="flex items-center gap-1.5">
                          <span>{txn.transaction_id}</span>
                          {txn.is_international && (
                            <span className="px-1 text-[9px] rounded bg-purple-950 text-purple-300 border border-purple-800">
                              INTL
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans font-normal">
                          {txn.timestamp}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5 font-mono text-slate-300">
                        {txn.customer_id}
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3.5 text-right font-mono font-extrabold text-white">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="font-medium">{txn.location}</div>
                        <div className="text-[10px] text-slate-500">
                          {txn.device_type.replace('_', ' ')}
                        </div>
                      </td>

                      {/* Type & Merchant */}
                      <td className="px-4 py-3.5 text-slate-300">
                        <div className="font-semibold capitalize">{txn.transaction_type}</div>
                        <div className="text-[10px] text-slate-500 capitalize">
                          {txn.merchant_category.replace('_', ' ')}
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              txn.risk_level === 'HIGH'
                                ? 'bg-rose-500 animate-pulse'
                                : txn.risk_level === 'MEDIUM'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                          <span
                            className={
                              txn.risk_level === 'HIGH'
                                ? 'text-rose-400'
                                : txn.risk_level === 'MEDIUM'
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }
                          >
                            {txn.risk_score} / 100
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            isFraud
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                              : isReview
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          }`}
                        >
                          {isFraud ? (
                            <ShieldAlert className="w-3 h-3" />
                          ) : isReview ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <ShieldCheck className="w-3 h-3" />
                          )}
                          <span>{txn.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectTransaction(txn);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Inspect Risk Factors
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No transactions match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-rose-500" />
                Add New Banking Transaction
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Customer ID</label>
                  <input
                    type="text"
                    value={newTxnData.customer_id}
                    onChange={(e) => setNewTxnData({ ...newTxnData, customer_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Amount (₹)</label>
                  <input
                    type="number"
                    value={newTxnData.amount}
                    onChange={(e) => setNewTxnData({ ...newTxnData, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Transaction Type</label>
                  <select
                    value={newTxnData.transaction_type}
                    onChange={(e) => setNewTxnData({ ...newTxnData, transaction_type: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2"
                  >
                    <option value="online">Online Payment</option>
                    <option value="pos">POS Terminal</option>
                    <option value="atm">ATM Cash</option>
                    <option value="wire">Wire Transfer</option>
                    <option value="upi">UPI Payment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Merchant Category</label>
                  <select
                    value={newTxnData.merchant_category}
                    onChange={(e) => setNewTxnData({ ...newTxnData, merchant_category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2"
                  >
                    <option value="shopping">Shopping</option>
                    <option value="electronics">Electronics</option>
                    <option value="luxury_jewelry">Luxury Jewelry</option>
                    <option value="gaming_crypto">Gaming & Crypto</option>
                    <option value="grocery">Grocery</option>
                    <option value="travel">Travel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Location</label>
                  <input
                    type="text"
                    value={newTxnData.location}
                    onChange={(e) => setNewTxnData({ ...newTxnData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Verification Status</label>
                  <select
                    value={newTxnData.status}
                    onChange={(e) => setNewTxnData({ ...newTxnData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2"
                  >
                    <option value="Legitimate">Legitimate</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save to MySQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
