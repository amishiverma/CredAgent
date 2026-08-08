import express from 'express';
import { sanitizeString, parseValidPositiveNumber } from '../middleware/validator.js';
import { requireApiKey } from '../middleware/auth.js';

const router = express.Router();

let liquidityPools = [
  {
    id: "pool_senior_01",
    name: "Senior Tranche (Low Risk)",
    asset: "INR",
    tvl: 200900000,
    apy: 7.2,
    utilizationRate: 84.5,
    minScoreRequired: 700,
    activeLoans: 142,
    description: "Capital allocated only to Tier A/A+ prime agents backed by verified buyer escrow contracts."
  },
  {
    id: "pool_junior_02",
    name: "Junior Tranche (High Yield)",
    asset: "INR",
    tvl: 69700000,
    apy: 18.5,
    utilizationRate: 91.2,
    minScoreRequired: 550,
    activeLoans: 68,
    description: "First-loss capital tranche yielding higher returns for underwriting Tier B & C emerging agents."
  }
];

// GET /api/lender/pools - Get liquidity pools and lending metrics
router.get('/pools', (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error fetching lender pools' });
  }
});

// POST /api/lender/deposit - Supply liquidity to a pool safely
router.post('/deposit', requireApiKey, (req, res) => {
  try {
    const poolId = sanitizeString(req.body.poolId);
    const depositAmt = parseValidPositiveNumber(req.body.amount);
    const lenderAddress = sanitizeString(req.body.lenderAddress) || "0xUser...1234";

    if (!poolId) {
      return res.status(400).json({ status: 'error', message: 'Pool ID is required' });
    }

    const pool = liquidityPools.find(p => p.id === poolId);
    if (!pool) {
      return res.status(404).json({ status: 'error', message: 'Liquidity pool not found' });
    }

    if (!depositAmt || depositAmt <= 0 || depositAmt > 1e11) {
      return res.status(400).json({ status: 'error', message: 'Valid deposit amount between ₹1 and ₹10,000 Cr is required' });
    }

    pool.tvl = Math.round((pool.tvl + depositAmt) * 100) / 100;

    res.json({
      status: 'success',
      message: `Successfully deposited ₹${depositAmt.toLocaleString('en-IN')} ${pool.asset} into ${pool.name}`,
      data: {
        poolId: pool.id,
        newPoolTVL: pool.tvl,
        sharesIssued: Math.round(depositAmt * 1.02 * 100) / 100,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Deposit failed: ' + error.message });
  }
});

export default router;
