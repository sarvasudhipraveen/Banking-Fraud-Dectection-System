export type TransactionType = 'online' | 'pos' | 'atm' | 'wire' | 'upi';

export type MerchantCategory =
  | 'shopping'
  | 'electronics'
  | 'luxury_jewelry'
  | 'gaming_crypto'
  | 'grocery'
  | 'travel'
  | 'healthcare'
  | 'utilities';

export type DeviceType =
  | 'trusted_mobile'
  | 'new_mobile'
  | 'desktop_browser'
  | 'jailbroken_device'
  | 'emulator'
  | 'vpn_proxy';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type TransactionStatus = 'Legitimate' | 'Fraud' | 'Under Review';

export type UserType = 'bank_staff' | 'customer';

export type UserRole =
  | 'Senior Fraud Analyst'
  | 'ML Risk Officer'
  | 'Compliance Auditor'
  | 'Retail Banking Customer'
  | 'Apex Reserve Private Client'
  | 'International Corporate Client';

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: UserType;
  role: UserRole;
  department?: string;
  bank_name?: string;
  account_number?: string;
  customer_id?: string;
  balance?: number;
  currency?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type PaymentMode = 'UPI' | 'Credit Card' | 'Debit Card' | 'NetBanking' | 'SWIFT Wire' | 'NEFT/RTGS';

export type DisputeStatus = 'None' | 'Under Investigation' | 'Resolved Refunded' | 'Dispute Rejected';

export interface BankingTransaction {
  id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  currency?: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';
  bank_name?: string;
  payment_mode?: PaymentMode;
  beneficiary_name?: string;
  beneficiary_account?: string;
  reference_utr?: string;
  transaction_type: TransactionType;
  merchant_category: MerchantCategory;
  location: string;
  device_type: DeviceType;
  is_international: boolean;
  hour: number;
  timestamp: string;
  status: TransactionStatus;
  risk_level: RiskLevel;
  fraud_probability: number;
  risk_score: number;
  failed_attempts: number;
  previous_transaction_amount: number;
  transactions_last_24h: number;
  transactions_last_1h?: number;
  is_new_device?: boolean;
  is_new_location?: boolean;
  action_taken?: 'Approved' | 'Blocked' | 'OTP Requested' | 'Analyst Cleared';
  dispute_status?: DisputeStatus;
  dispute_reason?: string;
}

export interface BankDirectoryItem {
  id: string;
  name: string;
  shortCode: string;
  country: string;
  flag: string;
  type: 'Indian Retail & Commercial' | 'Global Multinational' | 'Government & Regulatory';
  tollFree: string[];
  emergencyCardBlock: string;
  fraudEmail: string;
  swiftCode: string;
  headquarters: string;
  popularServices: string[];
  color: string;
  badgeColor: string;
  specialFeatures?: string;
  isFeaturedPartner?: boolean;
}

export interface PasswordRuleCheck {
  id: string;
  label: string;
  satisfied: boolean;
  hint: string;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0 to 4
  strengthLabel: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  rules: PasswordRuleCheck[];
}

export interface PredictionInput {
  customer_id: string;
  amount: number;
  transaction_type: TransactionType;
  merchant_category: MerchantCategory;
  location: string;
  device_type: DeviceType;
  is_international: boolean;
  hour: number;
  previous_transactions: number;
  failed_attempts: number;
  average_transaction_amount: number;
  is_new_device: boolean;
  is_new_location: boolean;
  transactions_last_1h: number;
  transactions_last_24h: number;
}

export interface SHAPContribution {
  feature: string;
  display_name: string;
  feature_value: string | number;
  shap_value: number; // e.g. +0.32 or -0.15
  risk_contribution_pts: number; // e.g. +32 or -15
  is_risk_increasing: boolean;
  rationale: string;
}

export interface PredictionResult {
  transaction_id: string;
  prediction: 'FRAUD' | 'LEGITIMATE';
  fraud_probability: number; // 0.0 to 1.0 (e.g. 0.917)
  risk_score: number; // 0 to 100 (e.g. 92)
  risk_level: RiskLevel;
  recommendation: string;
  inference_time_ms: number;
  model_name: string;
  model_version: string;
  base_expected_value: number;
  shap_contributions: SHAPContribution[];
  engineered_features: {
    amount_deviation_ratio: number;
    amount_to_avg_ratio: number;
    velocity_z_score: number;
    is_night_transaction: boolean;
    is_weekend: boolean;
    anomaly_index: number;
    combined_risk_penalty: number;
  };
  timestamp: string;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  type: string;
  isChampion: boolean;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
  training_time_sec: number;
  latency_p95_ms: number;
  confusion_matrix: {
    true_positives: number;
    false_positives: number;
    true_negatives: number;
    false_negatives: number;
  };
  feature_importance: { feature: string; importance: number }[];
  description: string;
  strengths: string[];
  limitations: string[];
}

export interface FeatureDriftMetric {
  feature_name: string;
  column_type: 'numerical' | 'categorical';
  baseline_mean: number | string;
  production_mean: number | string;
  ks_statistic_or_chisq: number;
  p_value: number;
  psi_score: number;
  drift_detected: boolean;
  severity: 'None' | 'Low' | 'High';
}

export interface DriftReport {
  timestamp: string;
  baseline_sample_size: number;
  production_sample_size: number;
  drift_share_percentage: number;
  dataset_drift_detected: boolean;
  features: FeatureDriftMetric[];
  recommendation: string;
  last_retrained: string;
}
