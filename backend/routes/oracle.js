import express from 'express';
import { sanitizeString } from '../middleware/validator.js';

const router = express.Router();

// POST /api/oracle/lyzr-risk-analysis - Server-side proxy for Lyzr Risk Oracle API
router.post('/lyzr-risk-analysis', async (req, res) => {
  try {
    const userMsg = sanitizeString(req.body.message);
    if (!userMsg) {
      return res.status(400).json({ status: 'error', message: 'Message text is required for risk analysis' });
    }

    const apiKey = process.env.LYZR_API_KEY || 'sk-default-fAdVn51ZIStzC6BvfSLlUl4PugnJ63Nt';
    const userId = sanitizeString(req.body.user_id) || 'yashmhatre2810@gmail.com';
    const agentId = sanitizeString(req.body.agent_id) || '6a6f2cda10d4d2ddb52d4966';
    const sessionId = sanitizeString(req.body.session_id) || `session_${Date.now()}`;

    const lyzrResponse = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        user_id: userId,
        agent_id: agentId,
        session_id: sessionId,
        message: userMsg
      })
    });

    if (!lyzrResponse.ok) {
      const errText = await lyzrResponse.text();
      return res.status(lyzrResponse.status).json({ 
        status: 'error', 
        message: `Lyzr Oracle API HTTP ${lyzrResponse.status}: ${errText}` 
      });
    }

    const data = await lyzrResponse.json();
    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    console.error('Lyzr Oracle Proxy Error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to communicate with Lyzr Risk Oracle: ' + error.message });
  }
});

export default router;
