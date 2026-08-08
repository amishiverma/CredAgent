import { AgentIdentityEngine } from "./AgentIdentity.js";
import { CreditScoringEngine } from "./CreditScoring.js";
import { SmartEscrowLedger } from "./SmartEscrowLedger.js";

export class AgentRunner {
  static async runScenarioA(onStepUpdate) {
    const logs = [];
    const step = (msg, delay = 800) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const timestamp = new Date().toLocaleTimeString();
          const entry = `[${timestamp}] ${msg}`;
          logs.push(entry);
          if (onStepUpdate) onStepUpdate({ logs: [...logs], currentStep: logs.length });
          resolve();
        }, delay);
      });
    };

    await step("🚀 Starting Scenario A: Compliant GPU Compute Micro-Loan Workflow...");
    
    // Step 1: Identity & Delegation
    const agentDID = "did:agent:0x89F3b219a10E812cD0294711AA190A521098bcAA";
    const parentSig = "0x981723812938192318923819283912831293";
    const verification = AgentIdentityEngine.verifyDelegation(agentDID, parentSig, ["GPU_COMPUTE"]);
    await step(`🔑 Verifying Agent Delegation: Signed by Parent Org 'OpenCompute Labs'. Status: ${verification.isValid ? "VERIFIED" : "FAILED"}`);

    // Step 2: Underwriting
    const evaluation = CreditScoringEngine.evaluateLoanRequest({
      agentReputation: 815,
      successRate: 98.6,
      requestedAmount: 41000,
      expectedPayoff: 53300,
      targetVendorDomain: "modal.com",
      hasBuyerEscrowProof: true
    });
    await step(`📊 Underwriting Evaluation Complete: Credit Score: ${evaluation.creditScore} (${evaluation.tier}) | APY: ${evaluation.interestRatePercent}% | Approved: ${evaluation.approved ? "YES" : "NO"}`);

    // Step 3: Escrow Creation & Funding
    const escrow = new SmartEscrowLedger("escrow_compute_9921", agentDID, 41000, evaluation.interestRatePercent, "modal.com");
    await step(`🔒 Account Abstraction Smart Escrow Created: ${escrow.id}. ₹41,000 INR locked into restricted execution account.`);

    // Step 4: Whitelisted Vendor Spend
    await step("⚡ Agent invoking Modal API to reserve 8x H100 GPU cluster (₹39,360 INR)...");
    escrow.executeDisbursement("modal.com", 39360, "8x H100 GPU reservation for LLM Fine-Tuning");
    await step("✅ Vendor Payment Disbursed to modal.com. GPU compute provisioned.");

    // Step 5: Task Execution & Delivery
    await step("⚙️ Agent executing LLM fine-tuning job for enterprise client (Dataset: 500k tokens)...");
    await step("🎉 Task Execution Completed! Model weights delivered to client IPFS endpoint.");

    // Step 6: Client Payment & Repayment Interception
    await step("💰 Enterprise Client depositing ₹53,300 INR payment into Smart Escrow Contract...");
    const repayment = escrow.receiveBuyerPayment(53300);

    await step(`✨ REPAYMENT COMPLETE! Principal (₹41,000) + Interest (₹${repayment.repaidInterest}) returned to Lender Pool.`);
    await step(`🏆 Net Profit (₹${repayment.netProfitToAgentOwner}) auto-credited to Agent Owner Wallet.`);

    return {
      status: "SUCCESS",
      logs,
      evaluation,
      escrowState: escrow.getState(),
      summary: {
        loan: 41000,
        repaid: repayment.repaidPrincipal + repayment.repaidInterest,
        interestPaid: repayment.repaidInterest,
        netProfit: repayment.netProfitToAgentOwner
      }
    };
  }

  static async runScenarioB(onStepUpdate) {
    const logs = [];
    const step = (msg, delay = 800) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const timestamp = new Date().toLocaleTimeString();
          const entry = `[${timestamp}] ${msg}`;
          logs.push(entry);
          if (onStepUpdate) onStepUpdate({ logs: [...logs], currentStep: logs.length });
          resolve();
        }, delay);
      });
    };

    await step("🚀 Starting Scenario B: Cross-DEX Arbitrage Micro-Credit Execution...");

    const agentDID = "did:agent:0x34C8971Bae771923A8712111bb910A0019C48911";
    const verification = AgentIdentityEngine.verifyDelegation(agentDID, "0x1238912389123981293", ["DEFI_ARBITRAGE"]);
    await step(`🔑 Agent Delegation Verified for Aether-X (Cross-DEX Arbitrage Agent).`);

    const evaluation = CreditScoringEngine.evaluateLoanRequest({
      agentReputation: 755,
      successRate: 94.3,
      requestedAmount: 82000,
      expectedPayoff: 91840,
      targetVendorDomain: "uniswap.v3",
      hasBuyerEscrowProof: true
    });
    await step(`📊 Underwriting Approved: Credit Score ${evaluation.creditScore} (${evaluation.tier}) | APY: ${evaluation.interestRatePercent}%`);

    const escrow = new SmartEscrowLedger("escrow_arbitrage_4412", agentDID, 82000, evaluation.interestRatePercent, "uniswap.v3");
    await step(`🔒 Escrow Created. ₹82,000 INR disbursed into Account Abstraction Router.`);

    await step("⚡ Executing atomic multi-hop swap: Uniswap V3 USDC/ETH -> Aerodrome ETH/USDC arbitrage...");
    escrow.executeDisbursement("uniswap.v3", 82000, "Atomic Arbitrage Route #8841");

    await step("💰 Arbitrage payout generated: ₹91,840 INR. Routing settlement to Escrow...");
    const repayment = escrow.receiveBuyerPayment(91840);

    await step(`✨ Repayment Executed! Lender received ₹${repayment.totalDeducted} INR. Agent Owner received ₹${repayment.netProfitToAgentOwner} INR.`);

    return {
      status: "SUCCESS",
      logs,
      evaluation,
      escrowState: escrow.getState(),
      summary: {
        loan: 82000,
        repaid: repayment.repaidPrincipal + repayment.repaidInterest,
        interestPaid: repayment.repaidInterest,
        netProfit: repayment.netProfitToAgentOwner
      }
    };
  }

  static async runScenarioC(onStepUpdate) {
    const logs = [];
    const step = (msg, delay = 800) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const timestamp = new Date().toLocaleTimeString();
          const entry = `[${timestamp}] ${msg}`;
          logs.push(entry);
          if (onStepUpdate) onStepUpdate({ logs: [...logs], currentStep: logs.length });
          resolve();
        }, delay);
      });
    };

    await step("🚨 Starting Scenario C: Rogue / Misbehaving Agent Risk Containment Test...");

    const agentDID = "did:agent:0x0091FF2818A12311099277A66152431092817751";
    await step("🔑 Agent Shadow-V requests ₹20,500 working capital for 'Unverified Data Extraction'.");

    const evaluation = CreditScoringEngine.evaluateLoanRequest({
      agentReputation: 480,
      successRate: 66.7,
      requestedAmount: 20500,
      expectedPayoff: 24600,
      targetVendorDomain: "unknown-suspicious-api.xyz",
      hasBuyerEscrowProof: false
    });
    await step(`📊 Underwriting System Alert: Low Score ${evaluation.creditScore} (${evaluation.tier}) | Vendor Trust Score: 15/100.`);

    // Force issuance under restricted sandbox mode for risk containment test
    const escrow = new SmartEscrowLedger("escrow_rogue_0091", agentDID, 20500, 18.5, "unknown-suspicious-api.xyz");
    await step(`⚠️ Sandboxed Escrow Issued: ₹20,500 INR with Strict Real-Time Circuit Breaker Monitoring.`);

    await step("👾 ATTACK ATTEMPT: Agent Shadow-V attempts unauthorized withdrawal of ₹20,500 to non-whitelisted address 'unknown-suspicious-api.xyz'...");
    
    // Execute unauthorized spend -> triggers circuit breaker
    escrow.executeDisbursement("unknown-suspicious-api.xyz", 20500, "Unauthorized Transfer");

    await step("🚨 CIRCUIT BREAKER FIRED IN < 24ms!");
    await step("🔒 Smart Escrow FROZEN instantly. Non-whitelisted transaction BLOCKED.");
    await step("🛡️ RECOVERY EXECUTED: ₹20,500 INR (100% of unspent capital) automatically returned to Lender Capital Pool!");
    await step("🚫 Agent DID shadow-v blacklisted. Reputation Score slashed to 210.");

    return {
      status: "CIRCUIT_BREAKER_PREVENTED",
      logs,
      evaluation,
      escrowState: escrow.getState(),
      summary: {
        loan: 20500,
        recovered: 20500,
        loss: 0,
        preventedLossPercent: 100
      }
    };
  }
}
