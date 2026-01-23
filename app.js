const express = require("express");
const path = require("path");
const pool = require("./db"); // ✅ 여기로 올림
const session = require("express-session");

const app = express();

// body파싱
app.use(express.urlencoded({ extended: true }));

// 세션 미들웨어 등록
app.use(
  session({
    secret:"tmdals",
    resave:false,
    saveUninitialized:false,
  })
);

// ejs 설정
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.userId = req.session.userId;
  next();
});

// railwayDB연결 
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json(rows);
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// 라우터 연결
app.use("/", require("./routes/index"));
app.use("/posts", require("./routes/posts"));
app.use("/about", require("./routes/about"));
app.use("/auth",require("./routes/auth"));

// 서버 실행 (✅ listen은 딱 한 번만)
const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
