/**
 * Autonomous Agent Underwriting & Risk Engine
 * Computes real-time credit score, max borrow limit, dynamic APY, and risk tier
 * based on task success rate, buyer escrow verification, vendor whitelist trust, and anomaly index.
 */

export class CreditScoringEngine {
  static evaluateLoanRequest({
    agentReputation,
    successRate,
    requestedAmount,
    expectedPayoff,
    targetVendorDomain,
    hasBuyerEscrowProof = true,
    historicalDefaults = 0
  }) {
    // 1. Compute Base Score (300 - 850)
    let score = 300;
    score += (agentReputation / 850) * 350; // up to 350 pts
    score += (successRate / 100) * 150;     // up to 150 pts

    if (hasBuyerEscrowProof) score += 40;   // buyer deposit verified
    if (historicalDefaults === 0) score += 30;

    // Vendor trust adjustment
    const vendorTrust = this.getVendorTrustScore(targetVendorDomain);
    score += (vendorTrust / 100) * 30;

    score = Math.min(850, Math.max(300, Math.round(score)));

    // 2. Determine Risk Tier & Interest Rate
    let tier = "Tier F (Unacceptable Risk)";
    let maxLimit = 100;
    let baseRate = 24.0;
    let approved = false;

    if (score >= 780) {
      tier = "Tier A+ (Prime Agent)";
      maxLimit = 5000;
      baseRate = 4.2;
      approved = true;
    } else if (score >= 700) {
      tier = "Tier A (Low Risk)";
      maxLimit = 2500;
      baseRate = 6.5;
      approved = true;
    } else if (score >= 620) {
      tier = "Tier B (Moderate Risk)";
      maxLimit = 1000;
      baseRate = 9.8;
      approved = true;
    } else if (score >= 550) {
      tier = "Tier C (Elevated Risk)";
      maxLimit = 500;
      baseRate = 14.5;
      approved = requestedAmount <= 500;
    } else {
      tier = "Tier D / F (High Risk)";
      maxLimit = 250;
      baseRate = 22.0;
      approved = false;
    }

    // Amount check
    if (requestedAmount > maxLimit) {
      approved = false;
    }

    // Calculate projected ROI and payoff security
    const expectedInterest = Math.round(requestedAmount * (baseRate / 100) * 100) / 100;
    const totalRepaymentNeeded = requestedAmount + expectedInterest;
    const LTVRatio = Math.round((requestedAmount / (expectedPayoff || requestedAmount * 1.3)) * 100);

    return {
      creditScore: score,
      tier,
      approved,
      maxLimit,
      interestRatePercent: baseRate,
      requestedAmount,
      expectedPayoff,
      expectedInterest,
      totalRepaymentNeeded,
      LTVRatio,
      vendorTrustScore: vendorTrust,
      hasBuyerEscrowProof,
      reasons: this.generateReasons(score, approved, vendorTrust, hasBuyerEscrowProof, requestedAmount, maxLimit)
    };
  }

  static getVendorTrustScore(domain) {
    const knownVendors = {
      "modal.com": 99,
      "runpod.io": 98,
      "together.ai": 97,
      "uniswap.v3": 95,
      "chainlink.oracle": 100,
      "unknown-suspicious-api.xyz": 15
    };
    return knownVendors[domain] || 50;
  }

  static generateReasons(score, approved, vendorTrust, hasEscrow, amount, limit) {
    const reasons = [];
    if (score >= 750) reasons.push("High historical task completion track record.");
    if (hasEscrow) reasons.push("Verifiable buyer escrow deposit detected (Zero Collateral, Guaranteed Payoff).");
    if (vendorTrust > 90) reasons.push("Target vendor is on top-tier whitelisted compute protocol.");
    if (!approved && amount > limit) reasons.push(`Requested amount ($${amount}) exceeds approved tier limit ($${limit}).`);
    if (vendorTrust < 30) reasons.push("Target vendor domain flagged as unverified / high anomaly risk.");
    return reasons;
  }
}
