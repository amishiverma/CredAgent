/**
 * Production-ready Structured Logger for CredAgent Backend
 */

const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
};

function formatLog(level, message, meta = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: 'credagent-backend',
    message,
    ...meta
  });
}

export const logger = {
  info: (msg, meta) => console.log(formatLog(LOG_LEVELS.INFO, msg, meta)),
  warn: (msg, meta) => console.warn(formatLog(LOG_LEVELS.WARN, msg, meta)),
  error: (msg, meta) => console.error(formatLog(LOG_LEVELS.ERROR, msg, meta)),
  debug: (msg, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog(LOG_LEVELS.DEBUG, msg, meta));
    }
  }
};

export default logger;
