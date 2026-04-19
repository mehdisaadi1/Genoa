const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token missing or invalid format' });
      }

      const token = authHeader.split(' ')[1];
      const decodedInfo = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = decodedInfo;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden: insufficient rights' });
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
