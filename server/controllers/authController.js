const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../config/db');   //  USE GLOBAL DB POOL

async function getPool() {
  return pool;  //  RETURN THE SHARED POOL
}


// ---------- SIGNUP ----------
exports.signup = async (req, res) => {
  try {
    const {
      name,
      organization,
      email,
      password,
      education,
      interests,
      role = 'student',
    } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const pool = await getPool();

    // Check existing user
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const displayName =
      role === 'host' && organization ? organization : name || 'User';

    await pool.query(
      `INSERT INTO users (name, email, password, role, education, interests, organization, is_verified)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [displayName, email, hashed, role, education || null, interests || null, organization || null]
    );

    console.log(`[SIGNUP] ${role} -> ${email}`);

    res.status(201).json({ message: 'User registered successfully', role });
  } catch (e) {
    console.error('[SIGNUP][ERR]', e);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// ---------- LOGIN ----------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const pool = await getPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || process.env.SECRET,
      { expiresIn: '1d' }
    );

    console.log(`[LOGIN] ${user.role} -> ${email}`);

   res.json({
  message: 'Login successful',
  token,
  role: user.role,
  userId: user.id
});

  } catch (e) {
    console.error('[LOGIN][ERR]', e);
    res.status(500).json({ message: 'Server error during login' });
  }
};
