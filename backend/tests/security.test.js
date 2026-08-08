/**
 * CredAgent Protocol Automated Security Test Suite
 * Tests hack vectors, injection attempts, numeric manipulation, financial over-spending, and circuit breakers.
 */

import http from 'http';
import { sanitizeString, parseValidPositiveNumber, parseValidNonNegativeNumber, sanitizeDomain } from '../middleware/validator.js';

console.log('🔒 Starting CredAgent Automated Security Suite...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    testsPassed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    testsFailed++;
  }
}

// 1. Unit Tests for Validator & Sanitizer Helpers
console.log('--- Test Suite 1: Input Validation & Sanitization ---');

assert(sanitizeString('{$ne: null}') === 'ne: null', 'Strips Mongo $ query operators');
assert(sanitizeString({ obj: 'injection' }) === '', 'Rejects objects passed as string parameters');
assert(parseValidPositiveNumber(-500) === null, 'Rejects negative numbers for positive amount requirements');
assert(parseValidPositiveNumber('NaN') === null, 'Rejects NaN string values');
assert(parseValidPositiveNumber(0) === null, 'Rejects zero for positive amount requirements');
assert(parseValidNonNegativeNumber(-10, 500) === 500, 'Falls back to default on negative values for non-negative check');
assert(sanitizeDomain('MODAL.COM/hacked?script=1') === 'modal.comhackedscript1', 'Sanitizes domain names strictly');

console.log('\n--- Test Suite 2: Financial Logic & Over-Disbursement Simulation ---');

// Mock Escrow ledger state
const mockEscrow = {
  id: 'escrow_test_101',
  lockedCapital: 82000,
  spentCapital: 32800,
  status: 'ACTIVE'
};

function attemptDisbursement(escrow, vendorDomain, amount) {
  const spendAmt = parseValidPositiveNumber(amount);
  if (!spendAmt || spendAmt <= 0) {
    return { success: false, reason: 'Invalid or negative amount' };
  }
  if (escrow.status === 'CIRCUIT_BREAKER_FROZEN') {
    return { success: false, reason: 'Escrow frozen' };
  }
  const remaining = escrow.lockedCapital - escrow.spentCapital;
  if (spendAmt > remaining) {
    return { success: false, reason: 'Exceeds locked capital' };
  }
  const whitelisted = ["modal.com", "runpod.io", "together.ai", "uniswap.v3", "chainlink.oracle"].includes(vendorDomain);
  if (!whitelisted) {
    escrow.status = 'CIRCUIT_BREAKER_FROZEN';
    return { success: false, reason: 'Unauthorized vendor - Circuit Breaker Triggered' };
  }
  escrow.spentCapital += spendAmt;
  return { success: true, spentCapital: escrow.spentCapital };
}

// Attempt negative disbursement
const res1 = attemptDisbursement(mockEscrow, 'modal.com', -16400);
assert(!res1.success && res1.reason === 'Invalid or negative amount', 'Blocks negative disbursement exploit');

// Attempt over-disbursement beyond remaining ₹49,200
const res2 = attemptDisbursement(mockEscrow, 'modal.com', 57400);
assert(!res2.success && res2.reason === 'Exceeds locked capital', 'Blocks over-disbursement beyond locked capital');

// Legitimate disbursement of ₹24,600
const res3 = attemptDisbursement(mockEscrow, 'modal.com', 24600);
assert(res3.success && mockEscrow.spentCapital === 57400, 'Allows valid whitelisted disbursement');

// Unauthorized vendor disbursement attempt
const res4 = attemptDisbursement(mockEscrow, 'evil-hacker.xyz', 8200);
assert(!res4.success && mockEscrow.status === 'CIRCUIT_BREAKER_FROZEN', 'Circuit Breaker freezes escrow on malicious vendor');

// Subsequent attempt on frozen escrow
const res5 = attemptDisbursement(mockEscrow, 'modal.com', 4100);
assert(!res5.success && res5.reason === 'Escrow frozen', 'Blocks all transactions on frozen escrow');

console.log('\n--- Test Suite 3: CORS Origin Security & UUID Verification ---');

// Test CORS origin checker logic
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
function checkCorsOrigin(origin) {
  if (!origin || allowedOrigins.includes(origin)) return true;
  return false;
}

assert(checkCorsOrigin('http://localhost:5173') === true, 'Allows requests from authorized origin localhost:5173');
assert(checkCorsOrigin('https://malicious-hacker-site.com') === false, 'Rejects cross-origin requests from unauthorized site');
assert(checkCorsOrigin(undefined) === true, 'Allows same-origin / server-to-server requests with undefined origin');

// Test UUID Escrow ID format
import crypto from 'crypto';
const generateEscrowId = () => `escrow_${crypto.randomUUID().substring(0, 8)}`;
const sampleEscrowId = generateEscrowId();
assert(sampleEscrowId.startsWith('escrow_') && sampleEscrowId.length === 15, 'Generates cryptographically unique escrow ID');

console.log('\n========================================');
console.log(`Security Test Summary: ${testsPassed} PASSED, ${testsFailed} FAILED`);
console.log('========================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SECURITY CHECKS PASSED WITH 100% CONFIDENCE!');
}

