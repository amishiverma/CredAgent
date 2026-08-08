import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import agentsRouter from './routes/agents.js';
import underwritingRouter from './routes/underwriting.js';
import escrowRouter from './routes/escrow.js';
import lenderRouter from './routes/lender.js';
import simulatorRouter from './routes/simulator.js';
import oracleRouter from './routes/oracle.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

dotenv.config();
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5000;

// Response Compression Middleware
app.use(compression());

// Security HTTP Headers
app.use(helmet());

// Request Timing & Structured Logging Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip
    });
  });
  next();
});

// Global Rate Limiter (Prevent DoS / Brute Force attacks)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 'error', message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api', apiLimiter);

// Dynamic CORS Configuration allowing all local development ports
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin or matching localhost/127.0.0.1 on any port
    if (!origin || allowedOrigins.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS origin restrictions'));
  },
  credentials: true
}));

app.use(express.json({ limit: '100kb' })); // Limit body size to 100kb to prevent payload flooding

// API Routes
app.use('/api/agents', agentsRouter);
app.use('/api/underwrite', underwritingRouter);
app.use('/api/escrow', escrowRouter);
app.use('/api/lender', lenderRouter);
app.use('/api/simulator', simulatorRouter);
app.use('/api/oracle', oracleRouter);

// Enhanced Health & Performance Monitoring Endpoint
app.get('/api/health', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

  res.json({
    status: dbState === 1 ? 'success' : 'degraded',
    service: 'CredAgent Backend Protocol API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      readyState: dbState
    },
    performance: {
      memoryRssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
      heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2)
    }
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
      escrow: 'GET /api/escrow/contracts, POST /api/escrow/request-loan, POST /api/escrow/disburse',
      lender: 'GET /api/lender/pools, POST /api/lender/deposit',
      simulator: 'POST /api/simulator/step'
    }
  });
});

// Global Error Handler Middleware (Prevents internal stack trace leakage)
app.use((err, req, res, next) => {
  logger.error('Unhandled Server Error:', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    status: 'error',
    message: 'An internal server security error occurred'
  });
});

app.listen(PORT, () => {
  logger.info(`CredAgent Hardened Backend Protocol running on http://localhost:${PORT}`);
});
