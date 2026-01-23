// db.js
const mysql = require("mysql2/promise");

// 로컬에서만 .env 쓰고, Railway는 Variables가 process.env로 들어옴
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const pool = mysql.createPool(process.env.MYSQL_URL);
module.exports = pool