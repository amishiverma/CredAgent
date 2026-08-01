import express from 'express';

const router = express.Router();

let activeEscrows = [
  {
    id: "escrow_778129",
    agentDID: "did:cred:agent:8f9a2b1",
    loanAmount: 1000,
    interestRatePercent: 6.5,
    interestAmount: 65,
    totalDebt: 1065,
    targetVendor: "modal.com",
    lockedCapital: 1000,
    spentCapital: 400,
    buyerDeposit: 0,
    status: "ACTIVE",
    logs: [
      "[17:00:01] Smart Escrow Wallet initialized: escrow_778129",
      "[17:00:01] Capital locked: $1000 USDC | Debt: $1065 USDC (Interest: 6.5%)",
      "[17:00:05] Disbursed $400 to whitelisted vendor 'modal.com' for Serverless H100 GPU cluster rent"
    ],
    transactions: [
      {
        type: "VENDOR_SPEND",
        vendor: "modal.com",
        amount: 400,
        description: "Serverless H100 GPU cluster rent",
        txHash: "0x8f2a91b...",
        timestamp: "17:00:05"
      }
    ]
  }
];

// GET /api/escrow/contracts - Get all active/past escrow contracts
router.get('/contracts', (req, res) => {
  res.json({
    status: 'success',
    count: activeEscrows.length,
    data: activeEscrows
  });
});

// GET /api/escrow/contracts/:id - Get specific escrow contract
router.get('/contracts/:id', (req, res) => {
  const escrow = activeEscrows.find(e => e.id === req.params.id);
  if (!escrow) {
    return res.status(404).json({ status: 'error', message: 'Escrow contract not found' });
  }
  res.json({ status: 'success', data: escrow });
});

// POST /api/escrow/request-loan - Initialize new escrow contract
router.post('/request-loan', (req, res) => {
  const { agentDID, loanAmount, interestRatePercent = 6.5, targetVendor = "modal.com" } = req.body;

  if (!agentDID || !loanAmount) {
    return res.status(400).json({ status: 'error', message: 'agentDID and loanAmount are required' });
  }

  const escrowId = `escrow_${Math.floor(Math.random() * 900000 + 100000)}`;
  const amt = Number(loanAmount);
  const rate = Number(interestRatePercent);
  const interest = Math.round(amt * (rate / 100) * 100) / 100;
  const debt = amt + interest;

  const timestamp = new Date().toLocaleTimeString();

  const newEscrow = {
    id: escrowId,
    agentDID,
    loanAmount: amt,
    interestRatePercent: rate,
    interestAmount: interest,
    totalDebt: debt,
    targetVendor,
    lockedCapital: amt,
    spentCapital: 0,
    buyerDeposit: 0,
    status: "INITIALIZED",
    logs: [
      `[${timestamp}] Smart Escrow Wallet initialized: ${escrowId}`,
      `[${timestamp}] Capital locked: $${amt} USDC | Debt: $${debt} USDC (Interest: ${rate}%)`
    ],
    transactions: []
  };

  activeEscrows.unshift(newEscrow);

  res.status(201).json({
    status: 'success',
    message: 'Smart Escrow Contract initialized successfully',
    data: newEscrow
  });
});

// POST /api/escrow/disburse - Execute vendor disbursement
router.post('/disburse', (req, res) => {
  const { escrowId, vendorDomain, amount, description } = req.body;
  const escrow = activeEscrows.find(e => e.id === escrowId);

  if (!escrow) {
    return res.status(404).json({ status: 'error', message: 'Escrow contract not found' });
  }

  if (escrow.status === "CIRCUIT_BREAKER_FROZEN") {
    return res.status(400).json({ status: 'error', message: 'Escrow is FROZEN by Risk Circuit Breaker' });
  }

  const spendAmt = Number(amount);
  const remaining = escrow.lockedCapital - escrow.spentCapital;

  if (spendAmt > remaining) {
    return res.status(400).json({ status: 'error', message: 'Insufficient escrow funds' });
  }

  const isWhitelisted = ["modal.com", "runpod.io", "together.ai", "uniswap.v3", "chainlink.oracle"].includes(vendorDomain);

  const timestamp = new Date().toLocaleTimeString();

  if (!isWhitelisted) {
    escrow.status = "CIRCUIT_BREAKER_FROZEN";
    const unspent = escrow.lockedCapital - escrow.spentCapital;
    escrow.logs.push(`[${timestamp}] 🚨 CIRCUIT BREAKER TRIGGERED: Unauthorized vendor transaction attempt to '${vendorDomain}'`);
    escrow.logs.push(`[${timestamp}] 🔒 ESCROW FROZEN INSTANTLY. Reclaiming $${unspent} USDC unspent capital to Lender Pool.`);
    
    escrow.transactions.push({
      type: "CIRCUIT_BREAKER_RECOVERY",
      amountRecovered: unspent,
      reason: `Unauthorized vendor '${vendorDomain}'`,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
      timestamp
    });

    return res.status(400).json({
      status: 'error',
      message: `Unauthorized vendor '${vendorDomain}'. Risk Circuit Breaker triggered and escrow frozen!`,
      data: escrow
    });
  }

  escrow.spentCapital += spendAmt;
  escrow.status = "ACTIVE";
  escrow.logs.push(`[${timestamp}] Disbursed $${spendAmt} to whitelisted vendor '${vendorDomain}' for ${description || 'compute task'}`);

  const tx = {
    type: "VENDOR_SPEND",
    vendor: vendorDomain,
    amount: spendAmt,
    description: description || 'Vendor Disbursement',
    txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
    timestamp
  };

  escrow.transactions.push(tx);

  res.json({
    status: 'success',
    message: 'Vendor disbursement executed successfully',
    data: escrow
  });
});

// POST /api/escrow/receive-payment - Automated revenue interception and repayment split
router.post('/receive-payment', (req, res) => {
  const { escrowId, amount } = req.body;
  const escrow = activeEscrows.find(e => e.id === escrowId);

  if (!escrow) {
    return res.status(404).json({ status: 'error', message: 'Escrow contract not found' });
  }

  const paymentAmt = Number(amount);
  const timestamp = new Date().toLocaleTimeString();

  escrow.buyerDeposit += paymentAmt;

  const principalDeduction = Math.min(paymentAmt, escrow.loanAmount);
  const interestDeduction = Math.min(paymentAmt - principalDeduction, escrow.interestAmount);
  const totalDeducted = principalDeduction + interestDeduction;
  const netProfitToAgentOwner = Math.max(0, paymentAmt - totalDeducted);

  escrow.status = "REPAID";
  escrow.logs.push(`[${timestamp}] Buyer deposited earnings: $${paymentAmt} USDC into Escrow Contract.`);
  escrow.logs.push(`[${timestamp}] ⚡ REPAYMENT ENFORCED: $${principalDeduction} Principal + $${interestDeduction} Interest auto-routed to Lender Pool.`);
  escrow.logs.push(`[${timestamp}] 🎉 NET PROFIT DISBURSED: $${netProfitToAgentOwner} USDC auto-transferred to Agent Owner.`);

  const tx = {
    type: "REVENUE_INTERCEPTED",
    buyerPayment: paymentAmt,
    repaidPrincipal: principalDeduction,
    repaidInterest: interestDeduction,
    netProfitDisbursed: netProfitToAgentOwner,
    txHash: `0x${Math.random().toString(16).substring(2, 10)}...`,
    timestamp
  };

  escrow.transactions.push(tx);

  res.json({
    status: 'success',
    message: 'Revenue intercepted & loan automatically repaid',
    data: {
      escrow,
      repaymentSummary: {
        repaidPrincipal: principalDeduction,
        repaidInterest: interestDeduction,
        totalDeducted,
        netProfitToAgentOwner
      }
    }
  });
});

export default router;
