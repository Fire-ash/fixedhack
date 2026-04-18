const jwt = require('jsonwebtoken');

// Middleware: Verify JWT token
function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Missing or malformed Authorization header' });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    console.error('[AUTH][VERIFY]', err.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// Middleware: Require Admin or Host role
function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'host')) {
    return res.status(403).json({ message: 'Access denied: Admin or Host only' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin };
