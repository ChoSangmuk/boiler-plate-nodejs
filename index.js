const bodyParser = require('body-parser')
const cookieParse = require('cookie-parser')
const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000

// 설정정보 가져오기
const config = require('./config/key')
const {User} = require('./models/User')
// auth 중간 과정 -> 미들웨어
const {auth} = require('./middleware/auth') 

//bodyparser를 미들웨어에 등록
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
//cookiepatser를 미들웨어에 등록
app.use(cookieParse())

// 전체 로깅
app.use((req, res, next) => {
  console.log("\nindex.js app.use((req, res, next) => {})")
  console.log("index.js req.path : " + req.path)
  next();
})

// port listen
app.listen(port, () => {
  console.log(`index.js Example app listening at http://localhost:${port}`)
})

// mongoDb Connect
mongoose.connect(config.mongoURI, 
  {
    useNewUrlParser : true, 
    useUnifiedTopology : true, 
    useCreateIndex : true, 
    useFindAndModify : false
  }
).then(() => console.log("index.js MongoDB Connected ... "))
.catch(err => console.log(err))

// root 페이지
app.get('/', (req, res) => {
  console.log("index.js app.get('/', (req, res) => {})")
  return res.send('Hello World!')
})

// hello api
app.get('/api/hello', (req, res) => {
  console.log("index.js app.get('/api/hello', (req, res) => {})")
  return res.send('Hello World! - /api/hello')
})

// 사용자 등록(/api/user/register)
// save(enteredUser) -> savedUser
app.post('/api/user/register', (req, res) => {
  console.log("index.js app.post('/api/user/register', (req, res) => {})")
  const enteredUser = new User(req.body)// 사용자가 입력한 정보 user를 저장
  // 회원가입 정보를 클라이언트에서 가져와 DB에 넣어준다.
  console.log("index.js enteredUser.save((err, savedUser) => {})")
  enteredUser.save((err, savedUser) => {
    if(err) return res.json({registerSuccess : false, err})
    return res.status(200).json({registerSuccess : true})
  })
})

// 로그인 기능(/api/user/login)
// findOne(enteredUser) -> foundUser
// generateToken(foundUser) -> tokenReceivedUser
app.post('/api/user/login', (req, res) => {
  console.log("index.js app.post('/api/user/login', (req, res) => {})")
  const enteredUser = new User(req.body)// 사용자가 입력한 정보 user를 저장
  // 요청된 이메일을 데이터베이스(User)에 있는지 찾는다
  console.log("index.js User.findOne({email : enteredUser.email}, (err, foundUser) => {})")
  User.findOne({email : enteredUser.email}, (err, foundUser) => {
    // user : 사용자가 입력한 정보, userInfo : 이메일로 찾아온 정보
    if(err) return res.json({loginSuccess : false, err})
    if(!foundUser) return res.json({loginSuccess : false, message : "입력한 이메일에 해당하는 계정이 없습니다."})
    // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호 인지 확인, comparePassword 생성 필요
    console.log("index.js foundUser.comparePassword(enteredUser.password, (err, isMatch) => {}")
    foundUser.comparePassword(enteredUser.password, (err, isMatch) => {
    // enteredUser.comparePassword2(foundUser.password, (err, isMatch) => {
    //   console.log("index.js enteredUser.comparePassword2(foundUser.password, (err, isMatch) => {}")
      if(err) return res.json({loginSuccess : false, err})
      if(!isMatch) return res.json({loginSuccess : false, message : "비밀번호가 틀렸습니다."})
      // 비밀번호까지 맞다면 토큰을 생성하기, generateToken 생성 필요
      console.log("index.js foundUser.generateToken((err, tokenReceivedUser) => {}")
      foundUser.generateToken((err, tokenReceivedUser) => {
        // 토큰 생성에서 오류가 발생하는 경우 서버의 문제임으로 400 error를 내보냄
        if(err) return res.status(400).send(err)
        // 생성한 토큰을 쿠키에 저장, 다른 저장 방법에 대해서는 추후 진행
        return res.status(200).cookie("x_auth", tokenReceivedUser.token).json({loginSuccess : true})
      })
    })
  })
})

// 권한 인증(/api/user/auth)
app.get('/api/user/auth', auth, (req, res) => {
  console.log("index.js app.get('/api/user/auth', auth, (req, res) => {})")
  return res.status(200).json({isAuth : true, authedUser : req.authedUser})
})

// 로그아웃(/api/user/logout)
app.get('/api/user/logout', auth, (req, res) => {
  console.log("index.js app.get('/api/user/logout', auth, (req, res) => {})")
  console.log("index.js User.findOneAndUpdate({_id : req.authedUser._id}, {token : ''}, (err, udatedUser) => {})")
  User.findOneAndUpdate({_id : req.authedUser._id}, {token : ''}, (err, udatedUser) => {
    if(err) return res.status(400).send(err)
    return res.status(200).clearCookie('x_auth').json({logoutSuccess : true})
  })
})