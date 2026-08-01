# CredAgent 🤖💳

> **Autonomous Agent Credit Underwriting & Escrow Protocol**  
> *Underwriting AI agents with Zero Collateral & Guaranteed Revenue Interception.*

CredAgent is a decentralized protocol enabling autonomous AI agents to obtain uncollateralized micro-loans for GPU compute, API access, and workflow execution. Secured by Smart Escrow Account Abstraction, whitelisted vendor spending restrictions, and automated revenue-intercept repayment.

---

## 🌟 Key Features

1. **Agent Decentralized Identity (DID)**: ERC-725 style agent identities with verifiable execution history, task success rate, and reputation scoring (300-850).
2. **Autonomous Underwriting Engine**: Calculates credit scores, max borrow limits, APR interest rates, and risk tiers (Tier A+ to Tier F) in real time.
3. **Smart Escrow & Circuit Breaker**:
   - Programmed spend restricted to whitelisted compute providers (`modal.com`, `runpod.io`, `together.ai`, `uniswap.v3`, `chainlink.oracle`).
   - Instant automated risk circuit breaker freezing escrow on unauthorized spend attempts.
4. **Automated Revenue Interception**: Intercepts buyer payments to automatically deduct principal + interest before releasing net profits to the agent owner.
5. **Lender Liquidity Pools**: Senior (low risk) and Junior (high yield) tranches with real-time TVL, APY, and utilization metrics.
6. **Live Agent Simulator**: Interactive step-by-step simulation of agent loan requests, compute execution, buyer delivery, and automated debt settlement.

---

## 📁 Repository Structure

```
CredAgent/
├── backend/                  # Node.js / Express REST API Protocol Server
│   ├── data/                 # Mock datasets & initial state
│   ├── routes/               # API endpoints (agents, underwriting, escrow, lender, simulator)
│   ├── package.json
│   └── server.js             # Server entry point (Port 5000)
├── frontend/                 # React + Vite Interactive Web Application
│   ├── src/
│   │   ├── components/       # AgentSimulator, LenderPortal, UnderwritingEngine, EscrowTracker, IdentityManager
│   │   ├── engine/           # CreditScoring, SmartEscrowLedger, AgentRunner, ProtocolState
│   │   ├── services/         # API client connection service
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Start

### 1. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
# Server running at http://localhost:5000
```

### 2. Start the Frontend Web Application
```bash
cd frontend
npm install
npm run dev
# Vite app running at http://localhost:5173
```

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & protocol status |
| `GET` | `/api/agents` | List registered agent DIDs & credentials |
| `POST` | `/api/agents` | Register a new agent identity |
| `POST` | `/api/underwrite/evaluate` | Evaluate credit score, risk tier, APR & loan limits |
| `GET` | `/api/escrow/contracts` | Fetch active/past smart escrow contracts |
| `POST` | `/api/escrow/request-loan` | Request & initialize smart escrow loan |
| `POST` | `/api/escrow/disburse` | Execute whitelisted vendor spend or trigger circuit breaker |
| `POST` | `/api/escrow/receive-payment` | Auto-intercept revenue & enforce repayment split |
| `GET` | `/api/lender/pools` | View liquidity pool TVL, APY, and active loan counts |
| `POST` | `/api/lender/deposit` | Supply liquidity to Senior/Junior tranches |
| `POST` | `/api/simulator/step` | Run autonomous agent workflow step simulation |

---

## 🛡️ License

MIT License. Built for Autonomous AI Agent Micro-Lending Hackathon / Round 2.
