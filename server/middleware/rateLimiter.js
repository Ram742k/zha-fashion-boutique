const rateLimit = {};

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const timeframe = 60 * 1000;
  const limit = 150;
  
  if (!rateLimit[ip]) {
    rateLimit[ip] = [];
  }
  
  rateLimit[ip] = rateLimit[ip].filter(t => now - t < timeframe);
  
  if (rateLimit[ip].length >= limit) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }
  
  rateLimit[ip].push(now);
  next();
};

module.exports = rateLimiter;
