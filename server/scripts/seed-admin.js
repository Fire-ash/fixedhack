const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function main() {
  const {
    DB_HOST, DB_USER, DB_PASS, DB_NAME
  } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error('Missing DB env vars. Check .env');
    process.exit(1);
  }

  const pool = await mysql.createPool({
    host: DB_HOST, user: DB_USER, password: DB_PASS, database: DB_NAME
  });

  const email = 'admin@example.com';
  const passwordPlain = 'password123';
  const name = 'Admin';

  const {rows} = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (rows.length > 0) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(passwordPlain, 10);
  await pool.query(
    'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)',
    [name, email, hash, 'admin', 1]
  );
  console.log('Admin seeded:', email, 'password:', passwordPlain);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
