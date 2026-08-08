import express from 'express';
import Escrow from '../models/EscrowModel.js'; 

const router = express.Router();

// GET all escrows from DB
router.get('/contracts', async (req, res) => {
  try {
    const escrows = await Escrow.find().sort({ createdAt: -1 });
    res.json({ status: 'success', count: escrows.length, data: escrows });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST new loan to DB
router.post('/request-loan', async (req, res) => {
  const { agentDID, loanAmount, interestRatePercent = 6.5, targetVendor = "modal.com" } = req.body;

  const escrowId = `escrow_${Math.floor(Math.random() * 900000 + 100000)}`;
  const amt = Number(loanAmount);
  const rate = Number(interestRatePercent);
  const interest = Math.round(amt * (rate / 100) * 100) / 100;
  const debt = amt + interest;
  const timestamp = new Date().toLocaleTimeString();

  try {
    const newEscrow = await Escrow.create({
      id: escrowId,
      agentDID,
      loanAmount: amt,
      interestRatePercent: rate,
      interestAmount: interest,
      totalDebt: debt,
      targetVendor,
      lockedCapital: amt,
      status: "INITIALIZED",
      logs: [
        `[${timestamp}] Smart Escrow Wallet initialized: ${escrowId}`,
        `[${timestamp}] Capital locked: $${amt} USDC | Debt: $${debt} USDC (Interest: ${rate}%)`
      ]
    });

    res.status(201).json({ status: 'success', message: 'Escrow initialized', data: newEscrow });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// POST disburse funds (Append-only Ledger)
router.post('/disburse', async (req, res) => {
  const { escrowId, vendorDomain, amount, description } = req.body;
  
  try {
    const escrow = await Escrow.findOne({ id: escrowId });
    if (!escrow) return res.status(404).json({ status: 'error', message: 'Escrow not found' });
    if (escrow.status === "CIRCUIT_BREAKER_FROZEN") return res.status(400).json({ status: 'error', message: 'Escrow FROZEN' });

    const spendAmt = Number(amount);
    const isWhitelisted = ["modal.com", "runpod.io", "together.ai", "uniswap.v3", "chainlink.oracle"].includes(vendorDomain);
    const timestamp = new Date().toLocaleTimeString();

    if (!isWhitelisted) {
      escrow.status = "CIRCUIT_BREAKER_FROZEN";
      const unspent = escrow.lockedCapital - escrow.spentCapital;
      escrow.logs.push(`[${timestamp}] 🚨 CIRCUIT BREAKER: Unauthorized vendor '${vendorDomain}'`);
      escrow.transactions.push({
        type: "CIRCUIT_BREAKER_RECOVERY",
        amount: unspent,
        description: `Recovered from unauthorized vendor '${vendorDomain}'`,
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...`
      });
      await escrow.save();
      return res.status(400).json({ status: 'error', message: `Unauthorized vendor. Escrow frozen.`, data: escrow });
    }

    escrow.spentCapital += spendAmt;
    escrow.status = "ACTIVE";
    escrow.logs.push(`[${timestamp}] Disbursed $${spendAmt} to '${vendorDomain}'`);
    escrow.transactions.push({
      type: "VENDOR_SPEND",
      vendor: vendorDomain,
      amount: spendAmt,
      description: description || 'Vendor Disbursement',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`
    });

    await escrow.save();
    res.json({ status: 'success', message: 'Disbursed successfully', data: escrow });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
// POST receive payment (Repayment Interception) — NO auth middleware for demo stability
router.post('/receive-payment', async (req, res) => {
  try {
    const { escrowId, amount } = req.body;

    const escrow = await Escrow.findOne({ id: escrowId });
    if (!escrow) return res.status(404).json({ status: 'error', message: 'Escrow not found' });

    const paymentAmt = Number(amount) || 0;
    const timestamp = new Date().toLocaleTimeString();

    // Waterfall Math (backend-authoritative)
    const principalDeduction = Math.min(paymentAmt, escrow.loanAmount || 0);
    const interestDeduction = Math.min(paymentAmt - principalDeduction, escrow.interestAmount || 0);
    const netProfit = Math.max(0, paymentAmt - (principalDeduction + interestDeduction));

    escrow.buyerDeposit = (Number(escrow.buyerDeposit) || 0) + paymentAmt;
    escrow.status = 'REPAID';

    escrow.logs.push(`[${timestamp}] Buyer deposited earnings: ₹${paymentAmt} INR into Escrow Contract.`);
    escrow.logs.push(`[${timestamp}] ⚡ REPAYMENT ENFORCED: ₹${principalDeduction} Principal + ₹${interestDeduction} Interest auto-routed to Lender Pool.`);
    escrow.logs.push(`[${timestamp}] 🎉 NET PROFIT DISBURSED: ₹${netProfit} INR auto-transferred to Agent Owner.`);

    escrow.transactions.push({
      type: 'REVENUE_INTERCEPTED',
      amount: paymentAmt,
      buyerPayment: paymentAmt,
      repaidPrincipal: principalDeduction,
      repaidInterest: interestDeduction,
      netProfitDisbursed: netProfit,
      description: 'Buyer payment interception and automated split',
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`
    });

    await escrow.save();

    res.json({ status: 'success', message: 'Repayment processed securely', data: escrow });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;