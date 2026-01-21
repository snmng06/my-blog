const express = require('express');
const router = express.Router();
const {requireLogin} = require('../middlewares/auth');

// db.js에서 만든 DB 연결
const pool = require("../db"); 

//게시글 목록화면 불러오기 o
router.get('/', async(req, res) => {
  const sql = "SELECT post_num,title,created_at FROM posts ORDER BY post_num DESC";
  const [rows] = await pool.query(sql);

  res.render("post-list",{posts:rows});
});

//새 게시글 쓰는 화면 불러오기 o o 
router.get('/new',requireLogin,(req,res)=>{

  console.log("new page session user:", req.session.userId);
  console.log("session id:", req.session.userId);

  res.render('post-new');
})

//id에 해당하는 게시글 상세보기 o 
router.get('/:id', async(req, res) => {
  const sql = "SELECT post_num,user_id,title,created_at,content FROM posts WHERE post_num=?"
  const [rows] = await pool.query(sql,[req.params.id]);
if(rows.length === 0)
  return 404;
res.render('post-detail',{post: rows[0]});
});

//POST 요청 받아서 새 글 불러오기!! o 
router.post('/',requireLogin,async(req,res)=>{
  
  const user_id = req.session.userId;
  const {title, content}= req.body;
  const sql ="INSERT INTO posts (user_id, title, content) VALUES (?,?,?)";
  await pool.query(sql,[user_id,title,content]);

  res.redirect('/posts');
})

//글 삭제하기 o o
router.post('/:id/delete',requireLogin,async(req,res)=>{

  const post_id = Number(req.params.id);
  const sql1 ="SELECT user_id FROM posts WHERE post_num =?";
  const [user] = await pool.query(sql1, [post_id]);

  console.log("session userId:", req.session.userId);
  console.log("db user_id:", user[0]?.user_id);
  console.log("post_id:", post_id);

  if (user.length === 0) return res.status(404).send("게시글을 찾을 수 없습니다.");

  if(Number(req.session.userId)===Number(user[0].user_id)){

  const sql2 = "DELETE FROM posts WHERE post_num =?";
  await pool.query(sql2,[post_id]);
  return res.redirect('/posts');

  }else {
    return res.status(403).send("삭제 권한이 없습니다.");
  }
});

//수정화면 렌더링 하기 o o
router.get('/:id/edit',requireLogin,async(req,res)=>{

  const post_id = req.params.id;
  const sql = "SELECT * FROM posts WHERE post_num=?"
  const [rows] = await pool.query(sql,[req.params.id]);

  if(rows.length===0)
    return res.status(404).send("게시글을 찾을 수 없습니다.");
  const user_id = rows[0].user_id;
  if(req.session.userId != user_id)
    return res.redirect('/posts');

  res.render('post-edit',{ post:rows[0]});
})

//수정완료화면 렌더링 하기 o o+)작성자 확인 필요-->없으면 남의 글이어도 post로 업뎃 가능
router.post('/:id/edit',requireLogin, async(req, res) => {

  const post_id = Number(req.params.id);
  const sql1 = "SELECT user_id FROM posts WHERE post_num=?";
  const [rows] = await pool.query(sql1,[post_id]);

  if(rows.length===0)
    return res.status(404).send("해당하는 게시글이 존재하지 않습니다.");

  if(Number(req.session.userId)===Number(rows[0].user_id)){
    const { title, content } = req.body;
    const sql = "UPDATE posts SET title = ?, content = ? WHERE post_num=? "
    await pool.query(sql,[title,content,post_id]);

   res.redirect(`/posts/${post_id}`);
  }else{
    return res.redirect(`/posts/${post_id}`);
  }
});

module.exports = router;
