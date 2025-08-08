const jwt = require('jsonwebtoken');

// Protect route (require login)
const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded contains user id & role
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Only allow Admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Access denied, admin only' });
  }
  next();
};

module.exports = { protect, adminOnly };
