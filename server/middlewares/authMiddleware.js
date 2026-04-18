const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
exports.verifyToken = (req, res, next) => {
const auth = req.headers.authorization;
if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });
const token = auth.split(' ')[1];
try {
const decoded = jwt.verify(token, JWT_SECRET);
req.user = decoded;
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
next();
} catch (err) {
return res.status(401).json({ message: 'Invalid token' });
}
};
