// db.js (CommonJS)
const mysql = require('mysql2/promise');

if (!process.env.MYSQL_URL) {
  console.error("MYSQL_URL is missing");
  process.exit(1);
}

const pool = mysql.createPool(process.env.MYSQL_URL);

module.exports = pool;
