const {User} = require('../models/User') 

// 인증 처리 미들웨어
// findByToken(req.cookies.x_auth) -> foundUser = authedUser
let auth = (req, res, next) => {
  console.log("auth.js let auth = (req, res, next) => {})")
  // req 쿠키에서 토큰 가져오기(쿠키 이외에 어떠한 정보(사용자 ID, 이메일, password)도 없음)
  let token = req.cookies.x_auth
  // 토큰을 복호화하여 사용, findByToken 메소드 생성 필요
  // console.log("auth.js User.findByToken(token, (err, foundUser) => {})")
  // User.findByToken(token, (err, foundUser) => {
  //   if(err) throw err // 메소드 오류
  //   if(!foundUser) return res.json({isAuth : false, message : '인증된 사용자가 아닙니다.'}) // 토큰으로 검색된 사용자 정보없음
  //   req.authedUser = foundUser
  //   next()
  // })
  // 토큰 그대로 사용
  console.log("auth.js User.findOne({token : token}, (err, foundUser) => {})")
  User.findOne({token : token}, (err, foundUser) => {
    if(err) throw err
    if(!foundUser) return res.json({isAuth : false, message : '인증된 사용자가 아닙니다.'})
    req.authedUser = foundUser
    next()
  })
}

module.exports = {auth}