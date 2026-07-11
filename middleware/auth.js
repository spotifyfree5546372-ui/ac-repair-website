const User = require('../models/User');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
  }
  if (req.session.user.role !== 'admin') {
    return res.status(403).send('Access Denied: Admin privileges required.');
  }
  next();
}

function setUserLocals(req, res, next) {
  res.locals.user = req.session.user || null;
  next();
}

module.exports = { requireAuth, requireAdmin, setUserLocals };
