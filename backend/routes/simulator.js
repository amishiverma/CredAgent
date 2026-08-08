import express from 'express';
import { sanitizeString, sanitizeDomain, parseValidPositiveNumber } from '../middleware/validator.js';

const router = express.Router();

// POST /api/simulator/step - Execute a step of autonomous agent credit & execution cycle safely
router.post('/step', (req, res) => {
  try {
    const agentDID = sanitizeString(req.body.agentDID) || "did:cred:agent:8f9a2b1";
    const stepName = sanitizeString(req.body.stepName) || "DISBURSE_COMPUTE";
    const loanAmount = parseValidPositiveNumber(req.body.loanAmount) || 82000;
    const targetVendor = sanitizeDomain(req.body.targetVendor) || "modal.com";
    const expectedPayoff = parseValidPositiveNumber(req.body.expectedPayoff) || 110700;

    const timestamp = new Date().toLocaleTimeString();
    let stepResult = {};

    switch (stepName) {
      case 'UNDERWRITE':
        stepResult = {
          phase: 'Underwriting Evaluation',
          score: 795,
          approved: true,
          tier: 'Tier A+ (Prime Agent)',
          borrowLimit: 205000,
          apr: 6.5,
          log: `[${timestamp}] Underwriting Engine verified buyer contract & agent track record. Approved ₹${loanAmount} at 6.5% APR.`
        };
        break;

      case 'LOCK_ESCROW':
        stepResult = {
          phase: 'Escrow Initialization',
          escrowId: `escrow_${Math.floor(Math.random() * 900000 + 100000)}`,
          lockedAmount: loanAmount,
          status: 'INITIALIZED',
          log: `[${timestamp}] Locked ₹${loanAmount} INR in Smart Escrow Account Abstraction Contract.`
        };
        break;

      case 'DISBURSE_COMPUTE':
        stepResult = {
          phase: 'Vendor Disbursement',
          vendor: targetVendor,
          amount: Math.round(loanAmount * 0.4),
          whitelisted: true,
          log: `[${timestamp}] Executed whitelisted spend of ₹${Math.round(loanAmount * 0.4)} INR to '${targetVendor}' for H100 GPU cluster.`
        };
        break;

      case 'EXECUTE_JOB':
        stepResult = {
          phase: 'Task Execution',
          progress: '100%',
          status: 'SUCCESS',
          log: `[${timestamp}] Agent successfully completed deep learning fine-tuning task. Proof of Work delivered to Buyer.`
        };
        break;

      case 'INTERCEPT_REVENUE':
        const interest = Math.round(loanAmount * 0.065 * 100) / 100;
        const totalDebt = loanAmount + interest;
        const profit = Math.max(0, expectedPayoff - totalDebt);

        stepResult = {
          phase: 'Automated Repayment & Settlement',
          buyerPayment: expectedPayoff,
          principalRepaid: loanAmount,
          interestRepaid: interest,
          agentOwnerProfit: profit,
          status: 'REPAID',
          log: `[${timestamp}] Buyer deposited ₹${expectedPayoff}. Intercepted ₹${totalDebt} (₹${loanAmount} Principal + ₹${interest} Yield) to Lender Pool. ₹${profit} Profit sent to Agent Owner.`
        };
        break;

      default:
        stepResult = {
          phase: 'General Step',
          log: `[${timestamp}] Simulation step '${stepName}' executed.`
        };
    }

    res.json({
      status: 'success',
      data: stepResult
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Simulation step failed: ' + error.message });
  }
});

export default router;
