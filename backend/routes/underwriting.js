import express from 'express';
import { sanitizeDomain, parseValidNonNegativeNumber, parseValidPositiveNumber } from '../middleware/validator.js';
import { financialLimiter } from '../middleware/rateLimiters.js';
import logger from '../utils/logger.js';

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

// POST /api/underwrite/evaluate - Safe underwriting evaluation for an agent loan request
router.post('/evaluate', financialLimiter, (req, res) => {
  try {
    const agentReputation = Math.min(850, Math.max(0, parseValidNonNegativeNumber(req.body.agentReputation, 700)));
    const successRate = Math.min(100, Math.max(0, parseValidNonNegativeNumber(req.body.successRate, 95)));
    const requestedAmount = parseValidPositiveNumber(req.body.requestedAmount) || 1000;
    const expectedPayoff = parseValidPositiveNumber(req.body.expectedPayoff) || Math.round(requestedAmount * 1.3);
    const targetVendorDomain = sanitizeDomain(req.body.targetVendorDomain) || "modal.com";
    const hasBuyerEscrowProof = Boolean(req.body.hasBuyerEscrowProof);
    const historicalDefaults = parseValidNonNegativeNumber(req.body.historicalDefaults, 0);

    // 1. Compute Base Score (300 - 850)
    let score = 300;
    score += (agentReputation / 850) * 350; // max 350 pts
    score += (successRate / 100) * 150;     // max 150 pts

    if (hasBuyerEscrowProof) score += 40;
    if (historicalDefaults === 0) score += 30;

    const vendorTrust = getVendorTrustScore(targetVendorDomain);
    score += (vendorTrust / 100) * 30;

    score = Math.min(850, Math.max(300, Math.round(score)));

    // 2. Determine Risk Tier & Terms
    let tier = "Tier F (Unacceptable Risk)";
    let maxLimit = 8200;
    let baseRate = 24.0;
    let approved = false;

    if (score >= 780) {
      tier = "Tier A+ (Prime Agent)";
      maxLimit = 410000;
      baseRate = 4.2;
      approved = true;
    } else if (score >= 700) {
      tier = "Tier A (Low Risk)";
      maxLimit = 205000;
      baseRate = 6.5;
      approved = true;
    } else if (score >= 620) {
      tier = "Tier B (Moderate Risk)";
      maxLimit = 82000;
      baseRate = 9.8;
      approved = true;
    } else if (score >= 550) {
      tier = "Tier C (Elevated Risk)";
      maxLimit = 41000;
      baseRate = 14.5;
      approved = requestedAmount <= 41000;
    } else {
      tier = "Tier D / F (High Risk)";
      maxLimit = 20500;
      baseRate = 22.0;
      approved = false;
    }

    if (requestedAmount > maxLimit) {
      approved = false;
    }

    const expectedInterest = Math.round(requestedAmount * (baseRate / 100) * 100) / 100;
    const totalRepaymentNeeded = Math.round((requestedAmount + expectedInterest) * 100) / 100;
    
    // Prevent division by zero
    const safePayoff = expectedPayoff > 0 ? expectedPayoff : requestedAmount * 1.3;
    const LTVRatio = Math.round((requestedAmount / safePayoff) * 100);

    const reasons = [];
    if (score >= 750) reasons.push("High historical task completion track record.");
    if (hasBuyerEscrowProof) reasons.push("Verifiable buyer escrow deposit detected (Zero Collateral, Guaranteed Payoff).");
    if (vendorTrust > 90) reasons.push("Target vendor is on top-tier whitelisted compute protocol.");
    if (!approved && requestedAmount > maxLimit) reasons.push(`Requested amount (₹${requestedAmount}) exceeds approved tier limit (₹${maxLimit}).`);
    if (vendorTrust < 30) reasons.push("Target vendor domain flagged as unverified / high anomaly risk.");

    res.json({
      status: 'success',
      data: {
        creditScore: score,
        tier,
        approved,
        maxLimit,
        interestRatePercent: baseRate,
        requestedAmount,
        expectedPayoff: safePayoff,
        expectedInterest,
        totalRepaymentNeeded,
        LTVRatio,
        vendorTrustScore: vendorTrust,
        hasBuyerEscrowProof,
        reasons
      }
    });
  } catch (error) {
    logger.error('Evaluation error:', { error: error.message });
    res.status(500).json({ status: 'error', message: 'Evaluation failed: ' + error.message });
  }
});

export default router;
