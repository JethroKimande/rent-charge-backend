const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
};

module.exports = authMiddleware;