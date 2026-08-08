import express from 'express';
import mongoose from 'mongoose';
import Agent from '../models/AgentModel.js';
import { initialAgents } from '../data/agentsData.js';
import { sanitizeString, parseValidNonNegativeNumber, validatePagination } from '../middleware/validator.js';
import { requireApiKey } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';
import { registrationLimiter } from '../middleware/rateLimiters.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /api/agents - Fetch agents with pagination & fallback
router.get('/', cacheMiddleware(15), async (req, res) => {
  try {
    const { page, limit, skip } = validatePagination(req.query.page, req.query.limit);
    
    if (mongoose.connection.readyState === 1) {
      const [agents, total] = await Promise.all([
        Agent.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Agent.countDocuments()
      ]);

      if (agents.length > 0) {
        return res.json({
          status: 'success',
          count: agents.length,
          pagination: { total, page, limit, totalPages: Math.ceil(total / limit) || 1 },
          data: agents
        });
      }
    }

    // In-memory fallback dataset
    const paginatedFallback = initialAgents.slice(skip, skip + limit);
    res.json({
      status: 'success',
      count: paginatedFallback.length,
      pagination: {
        total: initialAgents.length,
        page,
        limit,
        totalPages: Math.ceil(initialAgents.length / limit) || 1
      },
      data: paginatedFallback
    });
  } catch (error) {
    logger.error('Error fetching agents:', { error: error.message });
    res.json({ status: 'success', count: initialAgents.length, data: initialAgents });
  }
});

// GET /api/agents/:did - Fetch agent by DID or ID safely with 30s cache
router.get('/:did', cacheMiddleware(30), async (req, res) => {
  try {
    const cleanDid = sanitizeString(req.params.did);
    if (!cleanDid) {
      return res.status(400).json({ status: 'error', message: 'Invalid agent identifier provided' });
    }

    if (mongoose.connection.readyState === 1) {
      const agent = await Agent.findOne({ $or: [{ did: cleanDid }, { id: cleanDid }] });
      if (agent) return res.json({ status: 'success', data: agent });
    }

    const fallbackAgent = initialAgents.find(a => a.did === cleanDid || a.id === cleanDid);
    if (!fallbackAgent) return res.status(404).json({ status: 'error', message: 'Agent not found' });
    
    res.json({ status: 'success', data: fallbackAgent });
  } catch (error) {
    logger.error('Error fetching agent details:', { error: error.message });
    res.status(500).json({ status: 'error', message: 'Internal server error fetching agent details' });
  }
});

// POST /api/agents - Register new agent with rate limit & validation
router.post('/', registrationLimiter, requireApiKey, async (req, res) => {
  try {
    const name = sanitizeString(req.body.name);
    const owner = sanitizeString(req.body.owner);
    const type = sanitizeString(req.body.type) || 'Autonomous Task Agent';
    const reputation = Math.min(850, Math.max(300, parseValidNonNegativeNumber(req.body.reputation, 700)));
    const collateral = parseValidNonNegativeNumber(req.body.collateral, 500);

    if (!name || !owner) {
      return res.status(400).json({ status: 'error', message: 'Agent name and owner are required' });
    }

    const newAgent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      did: `did:cred:agent:${Math.random().toString(36).substring(2, 9)}`,
      name,
      owner,
      type,
      reputation,
      walletBalance: collateral,
      collateralStaked: collateral,
      createdAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      const dbAgent = await Agent.create(newAgent);
      return res.status(201).json({ status: 'success', message: 'Agent registered to MongoDB', data: dbAgent });
    }

    initialAgents.unshift(newAgent);
    logger.info(`New agent registered in-memory: ${newAgent.id}`, { agentId: newAgent.id, owner });
    res.status(201).json({ status: 'success', message: 'Agent registered in memory', data: newAgent });
  } catch (error) {
    logger.error('Failed to create agent:', { error: error.message });
    res.status(400).json({ status: 'error', message: 'Failed to create agent: ' + error.message });
  }
});

export default router;