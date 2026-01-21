// db.js (CommonJS)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "tmdals",
  database: "blog_db",
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
