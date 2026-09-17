import { DriftReport } from '../types';

export interface PrometheusMetricsState {
  fraud_predictions_total: number;
  legitimate_predictions_total: number;
  api_requests_total: number;
  api_errors_total: number;
  prediction_latency_p50: number;
  prediction_latency_p95: number;
  prediction_latency_p99: number;
  active_evaluations_in_flight: number;
  uptime_seconds: number;
}

export const INITIAL_PROMETHEUS_METRICS: PrometheusMetricsState = {
  fraud_predictions_total: 324,
  legitimate_predictions_total: 25106,
  api_requests_total: 25430,
  api_errors_total: 12,
  prediction_latency_p50: 16.4,
  prediction_latency_p95: 24.2,
  prediction_latency_p99: 48.6,
  active_evaluations_in_flight: 3,
  uptime_seconds: 842100
};

export const INITIAL_DRIFT_REPORT: DriftReport = {
  timestamp: '2026-09-17 02:25:00 UTC',
  baseline_sample_size: 25000,
  production_sample_size: 2500,
  drift_share_percentage: 40.0,
  dataset_drift_detected: true,
  last_retrained: '3 days ago (v2.4-xgboost)',
  recommendation:
    'Dataset Drift Detected in 2 of 5 monitored features (transaction_amount & international_ratio). Model retraining recommended.',
  features: [
    {
      feature_name: 'transaction_amount',
      column_type: 'numerical',
      baseline_mean: '₹4,820',
      production_mean: '₹8,940',
      ks_statistic_or_chisq: 0.284,
      p_value: 0.0004,
      psi_score: 0.245,
      drift_detected: true,
      severity: 'High'
    },
    {
      feature_name: 'is_international_ratio',
      column_type: 'categorical',
      baseline_mean: '3.4%',
      production_mean: '12.8%',
      ks_statistic_or_chisq: 0.198,
      p_value: 0.0021,
      psi_score: 0.218,
      drift_detected: true,
      severity: 'High'
    },
    {
      feature_name: 'transaction_hour',
      column_type: 'numerical',
      baseline_mean: '14.2 hrs',
      production_mean: '14.6 hrs',
      ks_statistic_or_chisq: 0.042,
      p_value: 0.4812,
      psi_score: 0.038,
      drift_detected: false,
      severity: 'None'
    },
    {
      feature_name: 'failed_attempts',
      column_type: 'numerical',
      baseline_mean: '0.24 retries',
      production_mean: '0.28 retries',
      ks_statistic_or_chisq: 0.051,
      p_value: 0.3204,
      psi_score: 0.045,
      drift_detected: false,
      severity: 'None'
    },
    {
      feature_name: 'device_type_distribution',
      column_type: 'categorical',
      baseline_mean: '88% Mobile',
      production_mean: '86% Mobile',
      ks_statistic_or_chisq: 0.068,
      p_value: 0.2109,
      psi_score: 0.052,
      drift_detected: false,
      severity: 'None'
    }
  ]
};

export function generateRawPrometheusExposition(metrics: PrometheusMetricsState): string {
  return `# HELP fraud_predictions_total Total count of detected fraudulent transactions classified by model
# TYPE fraud_predictions_total counter
fraud_predictions_total{model="xgboost",version="v2.4",env="production"} ${metrics.fraud_predictions_total}

# HELP legitimate_predictions_total Total count of approved legitimate banking transactions
# TYPE legitimate_predictions_total counter
legitimate_predictions_total{model="xgboost",version="v2.4",env="production"} ${metrics.legitimate_predictions_total}

# HELP api_requests_total Total HTTP requests received by FastAPI prediction gateway
# TYPE api_requests_total counter
api_requests_total{endpoint="/api/v1/predict",method="POST",status="200"} ${metrics.api_requests_total}

# HELP api_errors_total Total unhandled API exceptions or timeout errors
# TYPE api_errors_total counter
api_errors_total{endpoint="/api/v1/predict",code="500"} ${metrics.api_errors_total}

# HELP prediction_latency_ms Model inference latency summary in milliseconds
# TYPE prediction_latency_ms summary
prediction_latency_ms{quantile="0.5"} ${metrics.prediction_latency_p50}
prediction_latency_ms{quantile="0.95"} ${metrics.prediction_latency_p95}
prediction_latency_ms{quantile="0.99"} ${metrics.prediction_latency_p99}
prediction_latency_ms_sum ${Math.round(metrics.api_requests_total * metrics.prediction_latency_p50)}
prediction_latency_ms_count ${metrics.api_requests_total}

# HELP model_prediction_probability_bucket Histogram distribution of predicted fraud probabilities
# TYPE model_prediction_probability_bucket histogram
model_prediction_probability_bucket{le="0.1"} ${Math.round(metrics.legitimate_predictions_total * 0.94)}
model_prediction_probability_bucket{le="0.3"} ${Math.round(metrics.legitimate_predictions_total * 0.98)}
model_prediction_probability_bucket{le="0.7"} ${Math.round(metrics.legitimate_predictions_total + metrics.fraud_predictions_total * 0.2)}
model_prediction_probability_bucket{le="1.0"} ${metrics.api_requests_total}
model_prediction_probability_bucket{le="+Inf"} ${metrics.api_requests_total}
`;
}
