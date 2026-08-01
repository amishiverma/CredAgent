import express from 'express';
import { initialAgents } from '../data/agentsData.js';

const router = express.Router();
let agents = [...initialAgents];

// GET /api/agents - Get all registered agents
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    count: agents.length,
    data: agents
  });
});

// GET /api/agents/:did - Get agent by DID
router.get('/:did', (req, res) => {
  const agent = agents.find(a => a.did === req.params.did || a.id === req.params.did);
  if (!agent) {
    return res.status(404).json({ status: 'error', message: 'Agent identity not found' });
  }
  res.json({ status: 'success', data: agent });
});

// POST /api/agents - Register new agent identity
router.post('/', (req, res) => {
  const { name, owner, type, reputation = 700, collateral = 500 } = req.body;

  if (!name || !owner) {
    return res.status(400).json({ status: 'error', message: 'Name and owner address are required' });
  }

  const newAgent = {
    id: `agent_${Date.now()}`,
    did: `did:cred:agent:${Math.random().toString(36).substring(2, 9)}`,
    name,
    owner,
    type: type || 'Autonomous Task Agent',
    reputation: Number(reputation),
    successRate: 98.5,
    completedTasks: 0,
    historicalDefaults: 0,
    walletBalance: Number(collateral),
    collateralStaked: Number(collateral),
    createdAt: new Date().toISOString()
  };

  agents.unshift(newAgent);

  res.status(201).json({
    status: 'success',
    message: 'Agent Decentralized Identity registered successfully',
    data: newAgent
  });
});

export default router;
