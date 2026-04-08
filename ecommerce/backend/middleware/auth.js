const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    next();
  });
};

const deliveryAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user.isDeliveryPartner && !req.user.isAdmin) return res.status(403).json({ message: 'Delivery partner access required' });
    next();
  });
};

module.exports = { auth, adminAuth, deliveryAuth };
