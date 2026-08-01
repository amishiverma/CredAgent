import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import agentsRouter from './routes/agents.js';
import underwritingRouter from './routes/underwriting.js';
import escrowRouter from './routes/escrow.js';
import lenderRouter from './routes/lender.js';
import simulatorRouter from './routes/simulator.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB(); 
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/agents', agentsRouter);
app.use('/api/underwrite', underwritingRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/lender', lenderRouter);
app.use('/api/simulator', simulatorRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    service: 'CredAgent Backend Protocol API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root route summary
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to CredAgent Autonomous Agent Underwriting & Escrow API',
    endpoints: {
      health: 'GET /api/health',
      agents: 'GET /api/agents, POST /api/agents',
      underwriting: 'POST /api/underwrite/evaluate',
      escrow: 'GET /api/escrow/contracts, POST /api/escrow/request-loan, POST /api/escrow/disburse, POST /api/escrow/receive-payment',
      lender: 'GET /api/lender/pools, POST /api/lender/deposit',
      simulator: 'POST /api/simulator/step'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CredAgent Backend Protocol running on http://localhost:${PORT}`);
});
