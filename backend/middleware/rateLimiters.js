import rateLimit from 'express-rate-limit';

/**
 * Strict Rate Limiter for Financial & Underwriting Actions
 * Allows max 30 evaluations per 5 minutes per IP
 */
export const financialLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many financial protocol requests from this IP, please try again in 5 minutes.'
  }
});

/**
 * Strict Rate Limiter for Registration & Agent Creation
 * Allows max 15 agent registrations per 15 minutes per IP
 */
export const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Agent registration rate limit exceeded. Please wait 15 minutes.'
  }
});
