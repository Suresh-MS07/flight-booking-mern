const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: 'Authentication is not configured' });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = requireAuth;
