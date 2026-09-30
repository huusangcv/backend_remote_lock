// API Key authentication middleware
// The Electron app uses this to check lock status (read-only, no key needed)
// Admin operations (lock/unlock) require the ADMIN_API_KEY

const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required',
    });
  }

  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Invalid API key',
    });
  }

  next();
};

module.exports = { requireApiKey };