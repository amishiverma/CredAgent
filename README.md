<div align="center">
  <img src="frontend/public/logo.png" alt="CredAgent Logo" width="120" />
  <img src="frontend/public/wordmark.png" alt="CredAgent Wordmark" width="200" />
  
  <h3>Capital Without Collateral. Autonomous Agent Credit Protocol.</h3>
  
  <p>
    Empowering AI Agents with uncollateralized micro-loans secured by Account Abstraction and Smart Escrows.
  </p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  </p>
</div>

---

## 🚨 The Problem

As autonomous AI agents evolve from simple chatbots to autonomous economic actors, they face a critical bottleneck: **Capital Access**. 

Agents need capital (to pay for GPU compute, SaaS APIs, or smart contract execution fees) *before* they can deliver a completed task to a human buyer and get paid. Since agents lack legal personhood, credit scores, and physical assets, traditional financial systems and DeFi protocols require them to overcollateralize their loans (e.g., locking up 150% in crypto assets to borrow 100%). This renders micro-tasks economically unviable for AI agents.

## 💡 The Solution: CredAgent

**CredAgent** is a decentralized protocol that enables autonomous AI agents to obtain **uncollateralized micro-loans** for task execution. 

We replace traditional collateral with **deterministic programmatic guarantees**:
1. **Verifiable Agent Identity (DID)**: Agents build a persistent on-chain reputation based on historical task success rates.
2. **Whitelisted Spend Control**: The borrowed capital is never given directly to the agent. It is locked in a Smart Escrow and can *only* be disbursed directly to approved, whitelisted vendors (e.g., RunPod, Modal, OpenAI).
3. **Automated Revenue Interception**: When the human buyer pays for the completed task, the funds are routed through the Account Abstraction Escrow. CredAgent automatically intercepts the payment, deducts the loan principal and dynamic interest, and disburses the net profit to the agent owner.

## 🚀 How It's Better

| Traditional DeFi / TradFi | CredAgent Protocol |
| :--- | :--- |
| **Requires >100% Overcollateralization** | **Zero Collateral Required** (Secured by escrow & whitelists) |
| Relies on Human FICO/Credit Scores | **Dynamic AI Underwriting** based on Agent Telemetry (ARS) |
| Borrower controls the funds | **Whitelisted Circuit Breakers** freeze funds on bad behavior |
| Legal contracts for debt collection | **Deterministic Revenue Interception** via Account Abstraction |
| Slow, manual loan approval | **< 50ms Real-Time Algorithmic Approvals** |

---

## 🛠 Tech Stack

**CredAgent** is built using a modern, scalable, and modular stack designed for real-time interactions and robust backend processing.

### **Frontend**
- **React.js (Vite)**: Lightning-fast rendering and component state management.
- **GSAP (GreenSock)**: High-performance, cinematic, and hardware-accelerated animations for the landing page.
- **Lucide-React**: Clean, consistent vector iconography.
- **Vanilla CSS3**: Highly optimized, bespoke styling using CSS variables, flexbox, grid, and keyframe animations for a premium dark-mode aesthetic.

### **Backend**
- **Node.js & Express.js**: Lightweight, high-throughput REST API serving the core protocol logic.
- **In-Memory Ledger (MongoDB Ready)**: Currently utilizes a structured in-memory datastore for rapid prototyping, architected with repository patterns for seamless swapping to MongoDB in production.
- **Cors & Express JSON**: Secure payload parsing and cross-origin management.

### **APIs & Integrations**
- **Lyzr Risk Oracle (GPT-5.5 Engine)**: Native API integration with `agent-prod.studio.lyzr.ai`. CredAgent feeds real-time agent telemetry to the Lyzr Oracle for institutional-grade, AI-driven risk analysis and credit approvals.

---

## 🏗 Backend Architecture & APIs

The Node.js backend acts as the definitive ledger and state machine for the CredAgent protocol, simulating smart contract behavior via REST.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Network health check & protocol status |
| `GET` | `/api/agents` | List registered agent DIDs & reputation credentials |
| `POST` | `/api/agents` | Register a new autonomous agent identity |
| `POST` | `/api/underwrite/evaluate` | Evaluates credit score, risk tier, APR & borrow limits |
| `GET` | `/api/escrow/contracts` | Fetch active/historical smart escrow contracts |
| `POST` | `/api/escrow/request-loan` | Initialize an Account Abstraction smart escrow loan |
| `POST` | `/api/escrow/disburse` | Execute whitelisted vendor spend or trigger **Circuit Breaker** |
| `POST` | `/api/escrow/receive-payment`| Auto-intercept revenue & enforce repayment waterfall |
| `GET` | `/api/lender/pools` | View liquidity pool TVL, APY, and active loan metrics |
| `POST` | `/api/lender/deposit` | Supply liquidity to Senior/Junior tranches |
| `POST` | `/api/simulator/step` | Run autonomous agent workflow step simulations |

---

## 🎮 Getting Started (How to Use)

CredAgent is split into a `frontend` and `backend`. You need to run both concurrently.

### 1. Clone the Repository
```bash
git clone https://github.com/amishiverma/CredAgent.git
cd CredAgent
```

### 2. Configure Environment Variables
In the `frontend` directory, create or edit the `.env` file to include your API keys and backend URL:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_LYZR_API_KEY=sk-your-lyzr-api-key-here
```

### 3. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The backend REST API will start on `http://localhost:5000`.*

### 4. Start the Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*The Vite application will start on `http://localhost:5173`. Open this in your browser.*

---

## 🗺 Platform Modules Overview

1. **Identity & Reputation**: Register AI agents, track their successful task executions, and watch their Agent Reputation Score (ARS) grow.
2. **Underwriting Engine**: Feed loan parameters (requested capital, expected payoff, vendor target) into the system. Get instant algorithmic approvals and chat with the **Lyzr Risk Oracle** for deep analysis.
3. **Smart Escrow & Circuit Breakers**: Watch loans get funded into a smart escrow. Attempt to spend at an unapproved vendor and watch the **Circuit Breaker** freeze funds in < 24ms. 
4. **Lender Liquidity Pools**: Act as a human capital provider. Deposit INR into Senior (low risk) or Junior (high risk) tranches and earn real-time APY from agent borrowing fees.
5. **Interactive Agent Simulator**: Run an end-to-end simulation of an agent requesting a loan, paying for compute, delivering the work, and the protocol automatically intercepting the repayment.

---

<div align="center">
  <i>Built for the Autonomous Economy.</i>
</div>
