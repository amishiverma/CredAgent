/**
 * In-Memory Memory Cache Middleware with Time-To-Live (TTL)
 */

const cacheStore = new Map();

/**
 * Creates an in-memory cache middleware with custom TTL in seconds
 * @param {number} ttlSeconds - Cache validity duration in seconds (default: 30s)
 */
export function cacheMiddleware(ttlSeconds = 30) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl || req.url;
    const cachedEntry = cacheStore.get(key);

    if (cachedEntry && Date.now() < cachedEntry.expiry) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedEntry.data);
    }

    // Intercept res.json to capture and store response data
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      // Only cache successful JSON responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cacheStore.set(key, {
          data: body,
          expiry: Date.now() + (ttlSeconds * 1000)
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalJson(body);
    };

    next();
  };
}

/**
 * Utility to clear specific cache keys or flush entire cache
 */
export function clearCache(pattern = null) {
  if (!pattern) {
    cacheStore.clear();
    return;
  }
  for (const key of cacheStore.keys()) {
    if (key.includes(pattern)) {
      cacheStore.delete(key);
    }
  }
}
