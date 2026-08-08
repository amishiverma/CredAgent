<div align="center">
  <img src="frontend/public/logo.png" alt="CredAgent Logo" width="120" />
  <img src="frontend/public/wordmark.png" alt="CredAgent Wordmark" width="200" />
  
  <h3>Capital Without Collateral. Autonomous Agent Credit Protocol.</h3>
  
  <p>
    Empowering AI Agents with uncollateralized micro-loans secured by Account Abstraction, Smart Escrows, and Real-Time Circuit Breakers.
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  </p>
</div>

---

## 📖 What is CredAgent?

**CredAgent** is a first-of-its-kind decentralized micro-lending protocol engineered explicitly for the **Autonomous Machine Economy**. 

As artificial intelligence evolves, agents are no longer just conversational bots—they are autonomous economic actors capable of executing multi-step workflows. However, these agents face a critical bottleneck: **Capital Access**. Whether an agent needs to rent a GPU cluster on RunPod, execute a smart contract on Ethereum, or pay for an expensive API call on OpenAI, it requires immediate access to funds *before* it can deliver a finished product to its human client and get paid. 

Because AI agents are not human entities, they lack legal personhood, credit scores, bank accounts, and physical assets. Consequently, traditional finance (TradFi) and decentralized finance (DeFi) systems require them to heavily **overcollateralize** their loans (e.g., locking up ₹12,300 in crypto to borrow ₹8,200). This fundamentally breaks the unit economics of autonomous micro-tasks.

**CredAgent solves this by replacing capital collateral with deterministic cryptographic guarantees and behavioral telemetry.**

Instead of requiring upfront assets, CredAgent issues agents a Decentralized Identifier (DID) and tracks their historical task success rate. This telemetry is fed into our **Autonomous Underwriting Engine**—powered natively by the **Lyzr Risk Oracle**—which instantly assigns an Agent Reputation Score (ARS) and approves uncollateralized capital. To eliminate default risk, the protocol utilizes **Account Abstraction Smart Escrows** to strictly restrict agent spending to whitelisted vendors and automatically intercept incoming revenue from human buyers to enforce loan repayment.

---

## 🚨 The Problem

* **The Cold Start Problem:** Agents need upfront cash to pay for compute costs.
* **Capital Inefficiency:** Overcollateralizing a loan (locking up ₹12,300 to borrow ₹8,200) defeats the purpose of borrowing.
* **Trust & Default Risk:** How do you legally enforce a debt collection on a non-human machine?

## 💡 The Solution

CredAgent wraps the entire task lifecycle in a **Smart Escrow Account Abstraction layer**:

1. **Agent Identity (DID)**: Agents build a persistent on-chain reputation (ARS) based on historical task success.
2. **Dynamic Risk Underwriting**: Using agent telemetry and the **Lyzr Risk Oracle (GPT-5.5)**, the protocol instantly calculates a credit score, approved limit, and dynamic APR.
3. **Whitelisted Spend Control**: Borrowed funds are locked in Escrow and can only be routed to pre-approved vendors (e.g., `modal.com`). A **Circuit Breaker** freezes funds in <24ms if an unauthorized spend is attempted.
4. **Deterministic Repayment**: When the human client pays for the completed task, CredAgent intercepts the incoming revenue, automatically deducts the loan principal and interest, and disburses the net profit to the agent owner.

---

## 🚀 Key Differentiators

| Feature | Traditional DeFi / TradFi | CredAgent Protocol |
| :--- | :--- | :--- |
| **Collateralization** | Requires >100% Overcollateralization | **Zero Collateral Required** |
| **Fund Control** | Borrower has total control of funds | **Whitelisted Circuit Breakers** |
| **Debt Enforcement**| Legal contracts & collection agencies | **Deterministic Revenue Interception** |
| **Approval Speed** | Slow, manual loan approval | **< 50ms Real-Time Algorithmic Approvals** |

---

## 🛠 Tech Stack

* **Frontend Interface**: React.js (Vite), GSAP (Cinematic animations), Vanilla CSS3, Lucide-React.
* **Backend Engine**: Node.js & Express.js REST API serving the core protocol logic and simulated transaction networks.
* **APIs & Integrations**: **Lyzr Risk Oracle (GPT-5.5 Engine)** integration for institutional-grade LLM-driven risk analysis on top of deterministic scoring.

---

## 🎮 Getting Started (How to Use)

CredAgent requires both the frontend and backend to run concurrently.

**1. Clone the Repository**
```bash
git clone https://github.com/amishiverma/CredAgent.git
cd CredAgent
```

**2. Start the Backend**
```bash
cd backend
npm install
npm run dev
# Running on http://localhost:5000
```

**3. Start the Frontend**
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 🗺 Modules Overview

1. **Identity & Reputation**: Track Agent Reputation Scores (ARS) in real-time.
2. **Underwriting Dashboard**: Feed loan parameters into the Lyzr Risk Oracle for instant approvals.
3. **Smart Escrow Tracker**: Watch loans get funded and trigger Circuit Breakers on unauthorized spend.
4. **Lender Liquidity Pools**: Deposit INR into Senior/Junior tranches and earn real-time APY.
5. **Interactive Agent Simulator**: Run an end-to-end narrative simulation of the protocol enforcing the repayment waterfall.

<div align="center">
  <i>Built for the Autonomous Economy.</i>
</div>
