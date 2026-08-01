import express from 'express';

const router = express.Router();

let liquidityPools = [
  {
    id: "pool_senior_01",
    name: "Senior Tranche (Low Risk)",
    asset: "USDC",
    tvl: 2450000,
    apy: 7.2,
    utilizationRate: 84.5,
    minScoreRequired: 700,
    activeLoans: 142,
    description: "Capital allocated only to Tier A/A+ prime agents backed by verified buyer escrow contracts."
  },
  {
    id: "pool_junior_02",
    name: "Junior Tranche (High Yield)",
    asset: "USDC",
    tvl: 850000,
    apy: 18.5,
    utilizationRate: 91.2,
    minScoreRequired: 550,
    activeLoans: 68,
    description: "First-loss capital tranche yielding higher returns for underwriting Tier B & C emerging agents."
  }
];

// GET /api/lender/pools - Get liquidity pools and lending metrics
router.get('/pools', (req, res) => {
  const totalTVL = liquidityPools.reduce((acc, p) => acc + p.tvl, 0);
  const totalLoans = liquidityPools.reduce((acc, p) => acc + p.activeLoans, 0);

  res.json({
    status: 'success',
    summary: {
      totalValueLocked: totalTVL,
      totalActiveLoansCount: totalLoans,
      protocolProtocolDefaultRate: 0.04
    },
    data: liquidityPools
  });
});

// POST /api/lender/deposit - Supply liquidity to a pool
router.post('/deposit', (req, res) => {
  const { poolId, amount, lenderAddress = "0xUser...1234" } = req.body;
  const pool = liquidityPools.find(p => p.id === poolId);

  if (!pool) {
    return res.status(404).json({ status: 'error', message: 'Liquidity pool not found' });
  }

  const depositAmt = Number(amount);
  if (!depositAmt || depositAmt <= 0) {
    return res.status(400).json({ status: 'error', message: 'Valid deposit amount required' });
  }

  pool.tvl += depositAmt;

  res.json({
    status: 'success',
    message: `Successfully deposited $${depositAmt} ${pool.asset} into ${pool.name}`,
    data: {
      poolId: pool.id,
      newPoolTVL: pool.tvl,
      sharesIssued: Math.round(depositAmt * 1.02 * 100) / 100,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
