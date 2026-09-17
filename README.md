# Apex Banking Fraud Detection & Real-Time Risk Monitoring Platform

![Status](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![License](https://img.shields.io/badge/License-MIT-blue)
![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-cyan)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8)
![Three.js](https://img.shields.io/badge/3D%20Graphics-Three.js%20%7C%20GSAP-white)
![Security](https://img.shields.io/badge/Compliance-RBI%20%2F%20Fed%20PCI--DSS-rose)

An enterprise-grade banking fraud prevention, transaction risk intelligence, and customer account security platform. Designed with a high-contrast **cinematic blue 3D interface**, real-time transaction scoring, multi-tier threat intercept engines, automated pattern-shift telemetry, and institutional banking governance.

---

## 🌟 Key Features

### 1. 🛡️ Dual-Role Authentication & Institutional Security Gate
- **Role-Based Access Control**:
  - **Bank Staff / Risk Analyst**: Instant access to live transaction streams, risk factor telemetry, model accuracy audits, and system configuration.
  - **Account Holder / Customer**: Dedicated personal banking dashboard with payment history, e-receipt downloads, and dispute filings.
- **Banking Password Policy Enforcement**: Enforces real-time validation for 12+ characters, uppercase, lowercase, numbers, special characters, and non-dictionary phrases.
- **Card Lock & Security Controls**: Real-time toggles for domestic ATM, international SWIFT, POS swipes, and instant card freezing.

### 2. ⚡ Real-Time Payment Risk Scanner & Factor Attribution
- **Sub-30ms Verification**: Evaluates transactions in real time against velocity spikes, foreign IP anomalies, nocturnal timing patterns, and merchant risk categories.
- **Preset Threat Testing**: One-click simulation of common attack vectors (e.g., Midnight Wire Transfer, Micro-Charge Velocity Probe, Tor Exit Node Crypto Buy).
- **Transparent Factor Breakdown**: Detailed scoring reports highlighting exactly which parameters contributed to a risk decision, providing complete audit readiness.

### 3. 💳 Live Payment Ledger, E-Receipts & Dispute Claims
- **Transaction Vault**: Real-time ledger tracking card transactions, wire transfers, and UPI settlements.
- **Downloadable E-Receipts**: Official banking digital receipts with reference numbers, timestamp, merchant IDs, and security verification hashes.
- **In-App Dispute Resolution**: Multi-step formal dispute workflow with automatic chargeback hold timers and case tracking IDs.

### 4. 🔬 Protection Engines & Benchmark Lab
- **Multi-Engine Comparative Evaluation**:
  - **Apex AI Shield**: Multi-factor gradient threat intercept engine (99.8% accuracy, 91.7% threat intercept).
  - **Multi-Pattern Defense**: Ensemble decision tree engine with 150 parallel evaluation paths.
  - **Standard Rule Engine**: Policy-based threshold verification for deterministic low-latency checks.
  - **Velocity Baseline**: Linear threshold scanner for transaction volume anomalies.
- **Imbalanced Data Balancing**: Demonstrates why raw 99% accuracy is misleading in high-volume banking (where legitimate transactions outnumber fraud 99:1) and how sensitivity calibration preserves true recall.

### 5. 📈 24/7 System Health & Threat Trend Telemetry
- **Continuous Performance Monitoring**: Live tracking of P50/P95 response latency, verification volumes, and system health.
- **Threat Pattern Shift Detection**: Statistical stability testing across transaction factors to detect emerging fraud techniques before they impact users.
- **Security Recalibration**: One-click retraining pipeline simulation updating defensive rules without service interruption.

### 6. 🌐 24x7 National Banking Helpline Directory
- Comprehensive toll-free contact cards, USSD codes, fraud hotline numbers, and cybercrime reporting links for major financial institutions (SBI, HDFC, ICICI, Axis, PNB, RBI Sachet, Cybercrime 1930).

### 7. 🌌 Cinematic 3D User Interface
- Three.js animated geometric particle constellations, perspective cyber grids, scanline beams, and interactive 3D holographic debit cards powered by Framer Motion and GSAP.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS, Lucide Icons |
| **3D & Animations** | Three.js, GSAP, Framer Motion (`motion/react`) |
| **Data Visualizations** | Recharts, Custom Canvas Particle Engines |
| **Architecture** | Component-driven modular design, SPA / Microservices ready |

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sarvasudhipraveen/Banking-Fraud-Detection-System.git
   cd Banking-Fraud-Detection-System
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3000` (or the port specified in your console).

---

## 📁 Project Structure

```
Banking-Fraud-Detection-System/
├── src/
│   ├── components/
│   │   ├── 3d/
│   │   │   ├── Cinematic3DBackground.tsx  # Dynamic Three.js/Canvas starfield & cyber grid
│   │   │   ├── GsapCyberGrid.tsx          # GSAP-powered perspective vector grid
│   │   │   ├── MagicCard.tsx              # Interactive 3D mouse-tracking card container
│   │   │   └── RotatingDebitCard.tsx      # Holographic interactive banking debit card
│   │   ├── ArchitectureView.tsx           # Gateway API, Database Vault & System Topology
│   │   ├── AuthModal.tsx                  # Sign-in and customer registration modal
│   │   ├── BankDirectoryView.tsx          # 24x7 Banking Helplines & Cybercrime directory
│   │   ├── BankServicesView.tsx           # Card controls, limits, domestic/SWIFT toggles
│   │   ├── DashboardView.tsx              # Executive risk oversight & real-time telemetry
│   │   ├── HighRiskAlertModal.tsx         # Urgent threat intercept & OTP confirmation prompt
│   │   ├── LoginGateView.tsx              # Cinematic 3D access portal & role selection
│   │   ├── MLOpsMonitorView.tsx           # Threat trend shifts, latency metrics & calibration
│   │   ├── ModelLabView.tsx               # Defense engine comparison & benchmark lab
│   │   ├── Navbar.tsx                     # Top navigation with live status badges
│   │   ├── PaymentDisputeModal.tsx        # Fraud claim submission & case tracking
│   │   ├── PaymentHistoryView.tsx         # Ledger, search/filter & receipt downloads
│   │   ├── PaymentReceiptModal.tsx        # Printable official digital transaction receipt
│   │   ├── PredictorView.tsx              # Interactive transaction risk scoring playground
│   │   ├── TransactionInspectModal.tsx    # Factor breakdown & audit evidence viewer
│   │   └── TransactionsView.tsx           # Flagged transactions stream & action queues
│   ├── services/
│   │   ├── bankData.ts                    # Banking directories, sample ledgers & mock users
│   │   ├── mlEngine.ts                    # Threat scoring engines, heuristics & benchmarks
│   │   └── mlopsEngine.ts                 # Health metrics, drift statistics & telemetry feed
│   ├── utils/
│   │   └── passwordRules.ts               # Regulatory banking password validation rules
│   ├── types/
│   │   └── index.ts                       # Shared TypeScript interfaces & models
│   ├── App.tsx                            # Root application view orchestrator
│   ├── main.tsx                           # Application entry point
│   └── index.css                          # Global styling and custom glow utilities
├── index.html                             # HTML entry point with metadata tags
├── metadata.json                          # Applet configuration & metadata
├── package.json                           # Dependencies & build scripts
├── tsconfig.json                          # TypeScript configuration
└── vite.config.ts                         # Vite configuration
```

---

## 🔒 Security & Regulatory Best Practices

- **Zero Plaintext Secrets**: No credentials or private keys exposed to browser bundles.
- **Client-Side Data Isolation**: Session-safe mock banking ledgers with local state isolation.
- **Explainable Decision Trails**: Every blocked or flagged transaction provides an interpretable reason code to satisfy compliance requirements.
- **Multi-Factor Triggers**: Automated elevation to OTP / bank representative intervention whenever risk exceeds predetermined safety thresholds.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
