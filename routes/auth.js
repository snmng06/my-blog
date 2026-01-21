const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const bcrypt = require("bcrypt");
const { requireLogin } = require('../middlewares/auth');

//회원가입 화면 불러오기 
router.get('/signup',(req, res) => {
  res.render("auth/signup",{error:null});
});

// 로그인 화면 불러오기
router.get("/login", async (req, res) => {
    res.render("auth/login",{error:null});
});


//회원가입 데이터 저장하기 
router.post('/signup',async(req,res)=>{
  try{
    //데이터 들어왔는지 확인용
    console.log("signup body:", req.body);

    const{name,email,password}=req.body;
    const password_hash = await bcrypt.hash(password,10);

    const sql = "INSERT INTO users (user_name,password_hash,email) VALUES (?,?,?)";
    await pool.query(sql,[name,password_hash,email]);
    return res.redirect("/auth/login");
    }
  catch(err) {
    console.error("SIGNUP ERROR >>",err);
    console.error("SIGNUP ERROR CODE>>",err.code);
    console.error("SIGNUP ERROR MSG >>",err.message);
    return  res.render("auth/signup",{error:err.message});
    }
})

// 로그인하기
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) email로 유저 조회
    const sql = "SELECT id, password_hash FROM users WHERE email = ?";
    const [rows] = await pool.query(sql, [email]);

    // 2) 이메일이 없으면 (error=1)
    if (rows.length === 0) {
      return res.render("auth/login", { error: "이메일이 존재하지 않습니다."});
    }

    // 3) 비밀번호 비교
    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    // 4) 비밀번호가 틀리면 (error=2)
    if (!ok) {
      return res.render("auth/login", { error:"비밀번호 오류"});
    }

    // 5) 로그인 성공 → 세션 저장
    req.session.userId = user.id;

    console.log("login session user:", req.session.userId);
    console.log("session id:", req.sessionID);

    // 6) 성공 후 이동
    return res.redirect("/posts");
  }catch (err) {
  res.status(500).send("에러");
}
});

//로그아웃 
router.post('/logout',requireLogin,async(req,res)=>{

  req.session.destroy();
  res.redirect('/about');
})

module.exports = router;
