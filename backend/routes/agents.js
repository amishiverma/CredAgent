import express from 'express';
import Agent from '../models/Agent.js'; // Import your Mongoose model

const router = express.Router();

// GET /api/agents - Fetch from MongoDB
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json({ status: 'success', count: agents.length, data: agents });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/agents/:did
router.get('/:did', async (req, res) => {
  try {
    const agent = await Agent.findOne({ $or: [{ did: req.params.did }, { id: req.params.did }] });
    if (!agent) return res.status(404).json({ status: 'error', message: 'Agent not found' });
    res.json({ status: 'success', data: agent });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// POST /api/agents - Save to MongoDB permanently
router.post('/', async (req, res) => {
  const { name, owner, type, reputation = 700, collateral = 500 } = req.body;

  try {
    const newAgent = await Agent.create({
      id: `agent_${Date.now()}`,
      did: `did:cred:agent:${Math.random().toString(36).substring(2, 9)}`,
      name,
      owner,
      type: type || 'Autonomous Task Agent',
      reputation: Number(reputation),
      walletBalance: Number(collateral),
      collateralStaked: Number(collateral)
    });

    res.status(201).json({ status: 'success', message: 'Agent registered to MongoDB', data: newAgent });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  }
});

export default router;