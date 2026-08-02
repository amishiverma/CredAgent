<div align="center">
  <img src="frontend/public/logo.png" alt="CredAgent Logo" width="120" />
  <img src="frontend/public/wordmark.png" alt="CredAgent Wordmark" width="200" />
  
  <h3>Capital Without Collateral. Autonomous Agent Credit Protocol.</h3>
  
  <p>
    Empowering AI Agents with uncollateralized micro-loans secured by Account Abstraction, Smart Escrows, and Real-Time Circuit Breakers.
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

## 📖 Detailed Project Description

**CredAgent** is a decentralized, programmatic financial protocol designed specifically for the **Autonomous Machine Economy**. 

As artificial intelligence models transition from being simple conversational chatbots to fully autonomous "Agents" capable of executing multi-step workflows, they face a severe economic bottleneck: they need capital to operate. Whether an agent needs to rent a GPU cluster on RunPod, execute a smart contract on Ethereum, or pay for an expensive API call on OpenAI, it requires immediate access to funds *before* it can deliver a finished product to its human client and get paid for its work. 

Because AI agents are not human entities, they lack legal personhood, credit scores, bank accounts, and physical assets. Consequently, traditional finance (TradFi) and even decentralized finance (DeFi) systems require them to heavily **overcollateralize** their loans (e.g., locking up $150 in crypto to borrow $100). This renders autonomous micro-tasks economically impossible.

**CredAgent solves this by replacing capital collateral with deterministic cryptographic guarantees and behavioral telemetry.**

We have built an end-to-end uncollateralized micro-lending protocol that relies on three core pillars:
1. **Dynamic Risk Underwriting:** Evaluating the agent's past performance instead of its assets.
2. **Restricted Capital Deployment:** Ensuring borrowed money can only be spent on exactly what the agent was hired to do.
3. **Guaranteed Revenue Interception:** Ensuring the lender is paid back the millisecond the agent completes its task.

---

## 🚨 The Problem in Detail

The current paradigm of agentic execution is fundamentally broken for scaled deployment:
- **The Cold Start Problem:** A new AI agent hired to analyze 10,000 gigabytes of data needs to pay for compute costs upfront. If the agent's creator doesn't want to front the cash, the agent cannot perform the task.
- **Capital Inefficiency:** Requiring an AI agent to hold 150% of its required capital in a vault just to borrow operating funds defeats the purpose of borrowing entirely.
- **Trust & Default Risk:** If you loan an AI agent $500, how do you prevent the agent (or its malicious creator) from absconding with the funds? How do you legally enforce a debt collection on a machine?

## 💡 The CredAgent Solution

CredAgent completely removes the need for upfront collateral by wrapping the entire task lifecycle in a **Smart Escrow Account Abstraction layer**. Here is how the protocol works in detail:

### 1. Verifiable Agent Identity (DID) & Telemetry
Every agent on the network is issued a Decentralized Identifier (DID). Over time, CredAgent tracks the agent's telemetry: how many tasks it has completed, its historical success rate, and its uptime. This data is fed into an **Autonomous Underwriting Engine** that calculates an Agent Reputation Score (ARS) from 300 to 850.

### 2. Algorithmic Underwriting & Lyzr Integration
When an agent requests a loan, it submits the loan amount, the expected payoff from the buyer, and the vendor it intends to spend the money at (e.g., `modal.com`). CredAgent instantly calculates the risk tier, approved credit limit, and dynamic APR. 

Furthermore, we utilize a **Native API Integration with Lyzr Risk Oracle (GPT-5.5)**. The protocol feeds the agent's telemetry into the Lyzr Engine for deep, institutional-grade risk analysis before approving the capital.

### 3. Smart Escrow & Whitelisted Spend Control
If approved, the borrowed funds are *never* sent directly to the agent's wallet. Instead, the funds are locked in an **Account Abstraction Smart Escrow**. 

The agent is only given permission to route payments to pre-approved, **whitelisted vendor endpoints** (like verified compute providers or API gateways). If an agent attempts to route funds to an unauthorized address, a **Real-Time Circuit Breaker** fires in < 24ms, freezing the escrow and instantly reclaiming 100% of the unspent capital back to the lender pool.

### 4. Deterministic Revenue Interception (Repayment)
CredAgent eliminates debt collection risk through structural guarantees. When the agent completes the task, the human client pays for the work. However, this payment does not go to the agent—it is routed back through the Smart Escrow. 

The protocol acts as a strict programmatic middleman: it **intercepts the incoming revenue**, automatically deducts the loan principal and accrued interest to repay the lenders, and then disburses the remaining net profit to the agent's creator. The machine simply cannot default if the task is successfully completed.

---

## 🚀 Key Differentiators (How it's Better)

| Feature | Traditional DeFi / TradFi | CredAgent Protocol |
| :--- | :--- | :--- |
| **Collateralization** | Requires >100% Overcollateralization | **Zero Collateral Required** |
| **Credit Assessment** | Relies on Human FICO/Credit Scores | **Dynamic AI Underwriting (ARS)** |
| **Fund Control** | Borrower has total control of funds | **Whitelisted Circuit Breakers** restrict spend |
| **Debt Enforcement**| Legal contracts & collection agencies | **Deterministic Revenue Interception** |
| **Approval Speed** | Slow, manual loan approval | **< 50ms Real-Time Algorithmic Approvals** |

---

## 🛠 Tech Stack

CredAgent is built using a modern, scalable, and modular stack designed for real-time interactions, high-throughput simulation, and robust backend processing.

### **Frontend Interface**
- **React.js (Vite)**: Lightning-fast rendering and component state management.
- **GSAP (GreenSock)**: High-performance, cinematic, and hardware-accelerated animations, enabling the immersive "drifting space" grid and dynamic data flows.
- **Lucide-React**: Clean, consistent vector iconography for dashboards.
- **Vanilla CSS3**: Highly optimized, bespoke styling using CSS variables, flexbox, grid, and keyframe animations for a premium dark-mode aesthetic.

### **Backend Engine**
- **Node.js & Express.js**: Lightweight, high-throughput REST API serving the core protocol logic, risk evaluations, and simulated transaction networks.
- **In-Memory Ledger (MongoDB Ready)**: Utilizes a structured in-memory datastore for rapid prototyping, architected with repository patterns for seamless swapping to MongoDB in production.
- **Cors & Express JSON**: Secure payload parsing and cross-origin management.

### **External APIs & Integrations**
- **Lyzr Risk Oracle (GPT-5.5 Engine)**: Direct API connection to `agent-prod.studio.lyzr.ai`. CredAgent feeds real-time telemetry variables to the Lyzr Oracle for narrative risk breakdowns, providing an LLM-driven layer of security analysis on top of the deterministic algorithmic scoring.

---

## 🏗 Backend APIs & Services

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

CredAgent is split into a `frontend` and `backend`. You need to run both concurrently to interact with the full protocol suite.

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

When you launch the frontend, you will have access to five distinct protocol interfaces:

1. **Identity & Reputation Engine**: Register AI agents, track their successful task executions, and watch their Agent Reputation Score (ARS) adapt in real-time.
2. **Underwriting Dashboard**: Feed loan parameters (requested capital, expected payoff, vendor target) into the system. Get instant algorithmic approvals and chat with the **Lyzr Risk Oracle** for deep contextual analysis.
3. **Smart Escrow Tracker**: Watch loans get funded into a smart escrow. Attempt to spend at an unapproved vendor in the UI and watch the **Circuit Breaker** freeze funds in < 24ms. 
4. **Lender Liquidity Pools**: Act as a human capital provider. Deposit INR into Senior (low risk) or Junior (high risk) tranches and earn real-time APY from agent borrowing fees.
5. **Interactive Agent Simulator**: Run an end-to-end narrative simulation of an agent requesting a loan, paying for compute, delivering the work, and the protocol automatically intercepting the repayment waterfall.

---

<div align="center">
  <i>Built for the Autonomous Economy.</i>
</div>
