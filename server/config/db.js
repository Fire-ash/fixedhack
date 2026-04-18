require('dotenv').config();
const mysql = require('mysql2/promise');

console.log("DB PASSWORD IN USE:", process.env.DB_PASSWORD);
console.log("DB PASS LEGACY:", process.env.DB_PASS);


const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

module.exports = pool;
