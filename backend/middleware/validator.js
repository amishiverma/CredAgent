/**
 * Input Validation & Sanitization Helpers for CredAgent Backend
 */

export function sanitizeString(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return ''; // Prevent NoSQL object injection
  const str = String(val).trim();
  // Strip control characters and dangerous mongo query characters if passed directly
  return str.replace(/[\$\{\}]/g, '');
}

export function parseValidPositiveNumber(val) {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num) || num <= 0) {
    return null;
  }
  return num;
}

export function parseValidNonNegativeNumber(val, defaultVal = 0) {
  const num = Number(val);
  if (isNaN(num) || !isFinite(num) || num < 0) {
    return defaultVal;
  }
  return num;
}

export function sanitizeDomain(domain) {
  if (!domain || typeof domain !== 'string') return '';
  return domain.trim().toLowerCase().replace(/[^a-z0-9\.\-]/g, '');
}

export function validatePagination(pageVal, limitVal) {
  const page = Math.max(1, parseInt(pageVal, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(limitVal, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
