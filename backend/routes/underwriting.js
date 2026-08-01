import express from 'express';

const router = express.Router();

const VENDOR_TRUST = {
  "modal.com": 99,
  "runpod.io": 98,
  "together.ai": 97,
  "uniswap.v3": 95,
  "chainlink.oracle": 100,
  "unknown-suspicious-api.xyz": 15
};

function getVendorTrustScore(domain) {
  return VENDOR_TRUST[domain] || 50;
}

// POST /api/underwrite/evaluate - Underwriting evaluation for an agent loan request
router.post('/evaluate', (req, res) => {
  const {
    agentReputation = 700,
    successRate = 95,
    requestedAmount = 1000,
    expectedPayoff = 1300,
    targetVendorDomain = "modal.com",
    hasBuyerEscrowProof = true,
    historicalDefaults = 0
  } = req.body;

  // 1. Compute Base Score (300 - 850)
  let score = 300;
  score += (Number(agentReputation) / 850) * 350; // max 350 pts
  score += (Number(successRate) / 100) * 150;     // max 150 pts

  if (hasBuyerEscrowProof) score += 40;
  if (Number(historicalDefaults) === 0) score += 30;

  const vendorTrust = getVendorTrustScore(targetVendorDomain);
  score += (vendorTrust / 100) * 30;

  score = Math.min(850, Math.max(300, Math.round(score)));

  // 2. Determine Risk Tier & Terms
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
    approved = Number(requestedAmount) <= 500;
  } else {
    tier = "Tier D / F (High Risk)";
    maxLimit = 250;
    baseRate = 22.0;
    approved = false;
  }

  if (Number(requestedAmount) > maxLimit) {
    approved = false;
  }

  const expectedInterest = Math.round(Number(requestedAmount) * (baseRate / 100) * 100) / 100;
  const totalRepaymentNeeded = Number(requestedAmount) + expectedInterest;
  const LTVRatio = Math.round((Number(requestedAmount) / (Number(expectedPayoff) || Number(requestedAmount) * 1.3)) * 100);

  const reasons = [];
  if (score >= 750) reasons.push("High historical task completion track record.");
  if (hasBuyerEscrowProof) reasons.push("Verifiable buyer escrow deposit detected (Zero Collateral, Guaranteed Payoff).");
  if (vendorTrust > 90) reasons.push("Target vendor is on top-tier whitelisted compute protocol.");
  if (!approved && Number(requestedAmount) > maxLimit) reasons.push(`Requested amount ($${requestedAmount}) exceeds approved tier limit ($${maxLimit}).`);
  if (vendorTrust < 30) reasons.push("Target vendor domain flagged as unverified / high anomaly risk.");

  res.json({
    status: 'success',
    data: {
      creditScore: score,
      tier,
      approved,
      maxLimit,
      interestRatePercent: baseRate,
      requestedAmount: Number(requestedAmount),
      expectedPayoff: Number(expectedPayoff),
      expectedInterest,
      totalRepaymentNeeded,
      LTVRatio,
      vendorTrustScore: vendorTrust,
      hasBuyerEscrowProof: Boolean(hasBuyerEscrowProof),
      reasons
    }
  });
});

export default router;
