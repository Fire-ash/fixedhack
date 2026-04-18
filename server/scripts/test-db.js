require('dotenv').config();
const pool = require('../config/db'); // if this path errors, try './config/db'
(async () => {
  try {
    const [rows] = await pool.query("SELECT id,email,role,password_hash FROM users WHERE email = 'admin@example.com'");
    console.log('DB query rows:', rows.length);
    if (rows.length) console.log('row0:', { id: rows[0].id, email: rows[0].email, hashLen: (rows[0].password_hash||'').length });
    process.exit(0);
  } catch (err) {
    console.error('DB test error:', err);
    process.exit(1);
  }
})();
