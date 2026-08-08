/**
 * Authentication & Protocol Authorization Middleware for CredAgent API
 */

export function requireApiKey(req, res, next) {
  const expectedKey = process.env.API_KEY;
  
  // If API_KEY is set in environment, enforce strict checking
  if (expectedKey) {
    const apiKey = req.headers['x-api-key'] || req.headers['x-credagent-key'];
    if (!apiKey || apiKey !== expectedKey) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Unauthorized: Invalid or missing API key protocol authorization' 
      });
    }
  }
  
  next();
}
