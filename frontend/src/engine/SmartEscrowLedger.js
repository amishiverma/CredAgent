/**
 * Smart Contract Account Abstraction & Escrow Repayment Engine
 * Manages loan disbursement, restricted spend execution, revenue interception,
 * automatic repayment split, and real-time circuit breaker freeze.
 */

export class SmartEscrowLedger {
  constructor(escrowId, agentDID, loanAmount, interestRatePercent, targetVendor) {
    this.id = escrowId || `escrow_${Math.floor(Math.random() * 900000 + 100000)}`;
    this.agentDID = agentDID;
    this.loanAmount = loanAmount;
    this.interestRatePercent = interestRatePercent;
    this.interestAmount = Math.round(loanAmount * (interestRatePercent / 100) * 100) / 100;
    this.totalDebt = loanAmount + this.interestAmount;
    this.targetVendor = targetVendor;

    this.lockedCapital = loanAmount;
    this.spentCapital = 0;
    this.buyerDeposit = 0;
    this.status = "INITIALIZED"; // INITIALIZED, ACTIVE, TASK_COMPLETED, REPAID, CIRCUIT_BREAKER_FROZEN
    this.logs = [];
    this.transactions = [];

    this.addLog(`Smart Escrow Wallet initialized: ${this.id}`);
    this.addLog(`Capital locked: $${loanAmount} USDC | Debt: $${this.totalDebt} USDC (Interest: ${interestRatePercent}%)`);
  }

  addLog(msg) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(`[${timestamp}] ${msg}`);
  }

  executeDisbursement(vendorDomain, amount, description) {
    if (this.status === "CIRCUIT_BREAKER_FROZEN") {
      throw new Error("Transaction rejected: Smart Escrow is FROZEN by Risk Circuit Breaker.");
    }

    if (amount > (this.lockedCapital - this.spentCapital)) {
      throw new Error("Insufficient escrow funds for disbursement.");
    }

    // Spend check: Is vendor domain whitelisted?
    const isWhitelisted = ["modal.com", "runpod.io", "together.ai", "uniswap.v3", "chainlink.oracle"].includes(vendorDomain);
    
    if (!isWhitelisted) {
      this.triggerCircuitBreaker(`Unauthorized vendor transaction attempt to '${vendorDomain}'`);
      return false;
    }

    this.spentCapital += amount;
    this.transactions.push({
      type: "VENDOR_SPEND",
      vendor: vendorDomain,
      amount,
      description,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      timestamp: new Date().toLocaleTimeString()
    });

    this.addLog(`Disbursed $${amount} to whitelisted vendor '${vendorDomain}' for ${description}`);
    this.status = "ACTIVE";
    return true;
  }

  receiveBuyerPayment(amount) {
    if (this.status === "CIRCUIT_BREAKER_FROZEN") {
      this.addLog(`Received $${amount} from buyer while frozen. Processing automated recovery...`);
    } else {
      this.addLog(`Buyer deposited earnings: $${amount} USDC into Escrow Contract.`);
    }

    this.buyerDeposit += amount;

    // Automatic Repayment Interception Split
    const principalDeduction = Math.min(amount, this.loanAmount);
    const interestDeduction = Math.min(amount - principalDeduction, this.interestAmount);
    const totalDeducted = principalDeduction + interestDeduction;
    const netProfitToAgentOwner = Math.max(0, amount - totalDeducted);

    this.transactions.push({
      type: "REVENUE_INTERCEPTED",
      buyerPayment: amount,
      repaidPrincipal: principalDeduction,
      repaidInterest: interestDeduction,
      netProfitDisbursed: netProfitToAgentOwner,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      timestamp: new Date().toLocaleTimeString()
    });

    this.addLog(`⚡ REPAYMENT ENFORCED: $${principalDeduction} Principal + $${interestDeduction} Interest auto-routed to Lender Pool.`);
    this.addLog(`🎉 NET PROFIT DISBURSED: $${netProfitToAgentOwner} USDC auto-transferred to Agent Owner.`);

    this.status = "REPAID";
    return {
      repaidPrincipal: principalDeduction,
      repaidInterest: interestDeduction,
      totalDeducted,
      netProfitToAgentOwner
    };
  }

  triggerCircuitBreaker(reason) {
    this.status = "CIRCUIT_BREAKER_FROZEN";
    const remainingUnspent = this.lockedCapital - this.spentCapital;
    
    this.addLog(`🚨 CIRCUIT BREAKER TRIGGERED: ${reason}`);
    this.addLog(`🔒 ESCROW FROZEN INSTANTLY. Reclaiming $${remainingUnspent} USDC unspent capital to Lender Pool.`);

    this.transactions.push({
      type: "CIRCUIT_BREAKER_RECOVERY",
      amountRecovered: remainingUnspent,
      reason,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      timestamp: new Date().toLocaleTimeString()
    });

    return {
      recoveredCapital: remainingUnspent,
      capitalLoss: this.spentCapital
    };
  }

  getState() {
    return {
      id: this.id,
      agentDID: this.agentDID,
      loanAmount: this.loanAmount,
      interestRatePercent: this.interestRatePercent,
      interestAmount: this.interestAmount,
      totalDebt: this.totalDebt,
      targetVendor: this.targetVendor,
      lockedCapital: this.lockedCapital,
      spentCapital: this.spentCapital,
      buyerDeposit: this.buyerDeposit,
      status: this.status,
      logs: [...this.logs],
      transactions: [...this.transactions]
    };
  }
}
