# boiler-plate-nodejs

- [따라하며 배우는 노드, 리액트 시리즈 - 기본 강의](https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-%EB%85%B8%EB%93%9C-%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B8%B0%EB%B3%B8/)(Node.js)
- [강사 github](https://github.com/jaewonhimnae/boiler-plate-ko)

## Using Docker For Dev Environment
- [Ubuntu에 Node.js 설치](https://velog.io/@ywoosang/Node.js-%EC%84%A4%EC%B9%98)
```sh
# Shell
docker run -it ubuntu
  apt-get update
  apt-get install nodejs
  apt-get install npm
  apt-get install vi
  apt-get install vim
  apt-get install git-all
  mkdir workspace
docker commit -m "node, npm installed" heuristic_panini node_basic:0.1
docker run -p 3000:3000 -p 5000:5000 -v /Users/chosangmuk/Documents:/workspace -it node_basic:0.1
```
   
## 실행 방법 (로컬)
1. MongoDB atlas 가입 및 클러스터 설정, [참고](#3장-몽고-db-연결)
2. config/dev.js 생성 및 mongoDB 정보입력
```js
// config/dev.js
module.exports = {
  mongoURI : '',
  tokenKey : ''
}
```
3. Node.js Back-End 실행
```sh
# Shell
# root directory에서 종속성 다운로드
npm install

# Node.js 실행
npm run start
# or
npm run dev
```

## 1장 소개
- 로그인, 회원가입 등 자주 사용하는 기능을 boiler-plate 라함

## 2장 NODE JS 와 EXPRESS JS 다운로드 하기
- Node.js : 자바스크립트 서버 사이드에서 사용, 런타임 환경, V8 엔진
- Express : Node JS 웹 프래임워크, 조립
  - [NodeJS - Express란?](https://velog.io/@neity16/Nodejs-Express%EB%9E%80) 
```sh
# Shell
# 현재 경로에 npm 패키지(package.json) 생성
npm init

# 시작 페이지(index.js) 생성
touch index.js

# express 설치 및 사용 예제
# --save 옵션은 package.json 에 표시
# node_modules 폴더 안에 다운받은 라이브러리가 포함됨
npm install express --save
```
- [express Hello World 예제](https://expressjs.com/ko/starter/hello-world.html)를 index.js에 추가
```js
// index.js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```
- package.json에 시작 스크립트 추가
```json
// package.json
"scripts": {
  "start": "node index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},		
```
- node 실행 및 모듈 다운 받기
```sh
# Shell
# node 실행
npm run start

# node 모듈 다운
npm update
```

## 3장 몽고 DB 연결
- [Mongo DB](https://www.mongodb.com/) 회원가입 및 클러스터(boiler-plate) 생성
- Mongo DB 연결 계정 생성, Connect Your Application, URI복사
- [Mongoose](https://mongoosejs.com/) : Node.js 와 MongoDb를 위한 ODM(Object Data Mapping) 라이브러리
```sh
# Shell
npm install mongoose --save
```
- mongoose 사용
```js
// index.js
const mongoose = require('mongoose')
// mongoDb Connect
mongoose.connect('~~~~~~~', 
  {
    useNewUrlParser : true, 
    useUnifiedTopology : true, 
    useCreateIndex : true, 
    useFindAndModify : false
  }
).then(() => console.log("MongoDB Connected ... "))
.catch(err => console.log(err))
```
- 강의 댓글 참고
```
Q : 일반적으로 schema를 정의하는 게 데이터베이스에 데이터를 넣을 때 체크를 해서 넣어주는 것으로 알고있습니다.
그런데 뒷편 강의에서 포스트맨으로 json 방식으로 회원가입을 실행하더라구요...
이게 schema를 정의해주면 몽고디비에서 알아서 테이블을 생성해주는 기능이 있는건가요?

A : 현재 mongoose 라는 모듈을 이용하고 있기에  MongoDB 에 쉽게 테이블을 생성해줄수있습니다. 
그래서  mongoose 는 MongoDB를 사용하기 쉽게 만들어 주는것이라고 생각하시면 됩니다.
결론적으로는 몽구스를 이용해서  Schema에 정의를 하면 몽고디비에 알아서 테이블이 생성이 됩니다 ~ 
```

## 4장 MongoDB Model & Schema
- 모델은 스키마를 감싸주는 역활(모델 > 스키마)
```sh
# Shell
mkdir models
touch User.js
```
- User 스키마 파일 작성, 모듈로서 사용 가능하게끔 exports
```js
// User.js
const mongoose = require('mongoose')
const userSchema = mongoose.Schema( {
    name : { type : String, maxlength : 50 }, 
    email : { type : String, trim : true,unique : 1 }, 
    password : { type : String, minlength : 5 }, 
    lastname : { type : String, maxlength : 50 }, 
    role : { type : Number, default : 0 }, 
    image : String, 
    token : { type : String }, 
    tokenExp : { type : Number } 
} )
const User =  mongoose.model('User', userSchema)
module.exports = {User}
```

## 5장 GIT 설치
- git 설치, 기본 명령어(init, add, commit)
```sh
# Shell
# git 저장소 생성 (해당 프로젝트의 쵯ㅇ위 디렉토리에서 실행)
git init

# git 상태 보기
git status
# Untracked files: -> working directory

# staging area 로 옮기기
git add .

# staging area 로 옮기기 제외(node_modules)
# 모듈이 경우 용량이 크며, package.json에 의해 확인 할 수 있음으로 git에 올리지 않아도됨
# add 하기 전에 설정
# staging area에서 지움 git rm --cached ndoe_modules -r
.gitignore

# local repository에 올리기
git commit -m "Comment" 
```

## 6장 SSH를 이용해 GITHUB 연결
- [github](https://github.com/) repository 생성(계정 생성 포함) 
```sh
# Shell
# ssh 키 생성
ssh-keygen -t ed25519 -C "mail@mail.com"

# 에이전트 실행
eval `ssh-agent -s`

# 에이전트에 프라이빗 키 추가
ssh-add ~/.ssh/id_ed25519

# github에 퍼블릭 키 등록(개인 설정)
clip < ~/.ssh/id_ed25519.pub
cat ~/.ssh/id_ed25519.pub

# git remote push
git remote add origin https://github.com/ChoSangmuk/boiler-plate-nodejs.git
git branch -M master
git push -u origin master
```

## 7장 BodyParser & PostMan & 회원 가입 기능
- [body-parser](https://www.npmjs.com/package/body-parser) : Request Body 데이터 파싱 
```sh
# Shell
npm install body-parser --save
```
- [PostMan](https://www.postman.com/) 가입, front-end가 미개발 상태인 경우, 해당 SW로 테스트 가능
- register router(end point) 지정, post method 이용
- postman으로 URL 실행, DB에 넣어주기 코딩, 삽입 결과 알리기
```js
// index.js
// 사용자 등록(/api/user/register)
app.post('/api/user/register', (req, res) => {
  console.log("\napp.post('/api/user/register', (req, res) => {})")
  const user = new User(req.body) // 사용자가 입력한 정보 user를 저장
  // 회원가입 정보를 클라이언트에서 가져와 DB에 넣어준다.
  user.save((err, userInfo) => {
    console.log("user.save((err, userInfo) => {})")
    if(err) return res.json({registerSuccess : false, err})
    return res.status(200).json({registerSuccess : true})
  })
})
```

## 8장 Nodemon 설치
- [nodemon](https://www.npmjs.com/package/nodemon) : 파일 변경이 감지되면 Node.JS 애플리케이션을 자동으로 다시 시작, 개발 서버에서만 사용(--save-dev)
```sh
# Shell
npm install nodemon --save-dev 
```
- nodemon 스크립트 추가, 테스트
```json
// package.json
"scripts": {
  "dev": "nodemon index.js"
}
```

## 9장 비밀 설정 정보 관리
- mongoDB URI에 ID, PW 노출(git 등록 시 위험) 
- 해당 내용 분리(config/dev.js) 후에 .gitignore에 등록
```js
// config/key.js
if(process.env.NODE_ENV === 'production' ) {
  module.exports = require('./prod')
} else {
  module.exports = require('./dev')
} 

// config/prod.js
module.exports = {
    mongoURI : process.env.MONGO_URI
}

// index.js
// mongoDb Connect
mongoose.connect(config.mongoURI, 
  {...}
).then(() => console.log("MongoDB Connected ... "))
.catch(err => console.log(err))
```

## 10장 Bcrypt로 비밀번호 암호화 하기
- [bcrypt](https://www.npmjs.com/package/bcrypt) : 암호화 라이브러리
- 사용자 정보를 암호화하여 데이터 베이스에 저장
```sh
# Shell
npm install bcrypt --save
```
- save(몽고 DB 메소드)가 진행되기 전에 암호화 진행, mongoose의 pre 이용
- salt 생성 후 salt로 암호화
```js
// User.js
const bcrypt = require('bcrypt')
const saltRounds = 10 //  salt 길이
// 비밀번호 저장 전 암호화
userSchema.pre('save', function(next) {
  console.log("userSchema.pre('save', function(next) {})")
  let user = this // 사용자가 입력한 정보
  if(user.isModified('password')) { // 비밀번호 변경시에만 작동
    console.log("user.isModified('password')")
    bcrypt.genSalt(saltRounds, (err, salt) => { // salt 생성
      console.log("bcrypt.genSalt(saltRounds, (err, salt) => {})")
      if(err) return next(err)
      bcrypt.hash(user.password, salt, (err, hash) => { // hash 생성
        console.log("bcrypt.hash(user.password, salt, (err, hash) => {})")
        // Store hash in your password DB
        if(err) return next(err)
        user.password = hash
        console.log("next()")
        next()
      })
    })
  } else {
    console.log("else")
    console.log("next()")
    next()
  }
})
```

## 11장 로그인 기능 with Bcrypt(1)
- 로그인 프로세스
```md
1. 입력이 올바르다면 진행, 그렇지 않다면 경고(생략)
2. 아이디(email)가 존재하는지 확인, 그렇지 않다면 경고
    - 몽고 DB에 findOne 메소드 사용
3. 비밀번호가 정확한지 확인, 그렇지 않다면 경고 
    - 사용자 스키마에 비교 메소드 생성 
    - bcrypt.compare 사용
4. 성공 결과 보낸 후, 홈 페이지로 이동 + 토큰 생성
    - 사용자 스키마에 토큰 생성 메소드 생성
    - 이 부분은 다음 강의에서 진행 
```
- login router(end point) 지정, post method 이용
```js
// index.js
// 로그인 기능(/api/user/login)
app.post('/api/user/login', (req, res) => {
  console.log("\napp.post('/api/user/login', (req, res) => {})")
  const user = new User(req.body)// 사용자가 입력한 정보 user를 저장
  // 요청된 이메일을 데이터베이스(User)에 있는지 찾는다
  User.findOne({email : user.email}, (err, userInfo) => {
    console.log("User.findOne({email : user.email}, (err, userInfo) => {})")
    // user : 사용자가 입력한 정보, userInfo : 이메일로 찾아온 정보
    if(err) return res.json({loginSucces : false, err})
    if(!userInfo) return res.json({loginSucces : false, message : '입력한 이메일에 해당하는 계정이 없습니다.'})
    // 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호 인지 확인, comparePassword 생성 필요
    userInfo.comparePassword(user.password, (err, isMatch) => {
      console.log("userInfo.comparePassword(user.password, (err, isMatch) => {}")
    // user.comparePassword2(userInfo.password, (err, isMatch) => {
    //   console.log("user.comparePassword2(userInfo.password, (err, isMatch) => {}")
      if(err) return res.json({loginSucces : false, err})
      if(!isMatch) return res.json({loginSucces : false, message : '비밀번호가 틀렸습니다.'})
      // 비밀번호까지 맞다면 토큰을 생성하기, generateToken 생성 필요
      userInfo.generateToken((err, userInfo) => {
        // 토큰 생성 후 클라이언트에 저장
      })
    })
  })
})

// User.js
// 비밀번호 비교 메소드
// 이메일로 검색된 정보로 해당 메소드 실행
userSchema.methods.comparePassword = function(plainPassword, callback) {
  console.log("userSchema.methods.comparePassword = function(plainPassword, callback) {})")
  // plainPassword : 사용자가 입력한 정보, this.password : 이메일로 찾아온 정보(비밀번호)
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    console.log("bcrypt.compare(plainPassword, this.password, (err, isMatch) => {})")
    if(err) return callback(err) 
    return callback(null, isMatch)
  })
}

// 비밀번호 비교 메소드2 
// 사용자가 입력한 정보로 해당메소드 실행(가능하긴 하지만 사용은 고려해볼 것)
userSchema.methods.comparePassword2 = function(encodePassword, callback) {
  console.log("userSchema.methods.comparePassword2 = function(encodePassword, callback) {})")
  // this.password : 사용자가 입력한 정보, encodePassword : 이메일로 찾아온 정보(비밀번호)
  bcrypt.compare(this.password, encodePassword, (err, isMatch) => {
    console.log("bcrypt.compare(this.password, encodePassword, (err, isMatch) => {})")
    if(err) return callback(err) 
    return callback(null, isMatch)
  })
}
```

## 12장 토큰 생성 with jsonwebtoken
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) : 토큰 생성을 위해 라이브러리
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) : 쿠키에 정보 저장, 읽기
```sh
# Shell
# jsonwebtoken 설치
npm install jsonwebtoken --save

# cookie-parser 설치
npm install cookie-parser --save
```
- jsonwebtoken.sign 메소드를 사용하여 토큰 생성, DB에 저장 후 결과 값 리턴
- 쿠키에 토큰 저장
```js
// User.js
var jwt = require('jsonwebtoken')
// ... 토큰 생성 
userSchema.methods.generateToken = function(callback) {
  console.log("User.js userSchema.methods.generateToken = function(callback) {})")
  var user = this // 여기서 this는 이메일을 통해 DB에서 얻어온 정보(userInfo)
  // user._id + 'screetToken' => token
  // token + 'screetToken' => user._id
  // jsonwebtoken을 이용해서 토큰 생성
  var token = jwt.sign(user._id.toHexString(), config.tokenKey)
  user.token = token
  user.save((err, userInfo) => {
    console.log("User.js user.save((err, userInfo) => {})")
    if(err) return callback(err) 
    return callback(null, userInfo)
  })
}

// index.js
const cookieParse = require('cookie-parser')
// ...
userInfo.generateToken((err, userInfo) => {
  console.log("index.js userInfo.generateToken((err, user) => {}")
  // 토큰 생성에서 오류가 발생하는 경우 서버의 문제임으로 400 error를 내보냄
  if(err) return res.status(400).send(err)
  // 생성한 토큰을 쿠키에 저장, 다른 저장 방법에 대해서는 추후 진행
  return res.status(200).cookie("x_auth", userInfo.token).json({loginSucces : true})
})
```

## 13장 Auth 기능 만들기
- 인증 end point, 권한에 대한 확인
- 해당 페이지 이동시, 쿠키에 저장된 토큰 + (salt)으로 권한 확인 
- express의 middleware를 이용
```js
// index.js
const {auth} = require('./middleware/auth') 
// 권한 인증(/api/user/auth)
app.get('/api/user/auth', auth, (req, res) => {
  console.log("index.js app.get('/api/user/auth', auth, (req, res) => {})")
  return res.status(200).json({isAuth : true, authedUser : req.authedUser})
})

// User.js
// 토큰으로 권한 확인
userSchema.statics.findByToken = function(token, callback) {
  console.log("User.js userSchema.statics.findByToken = function(token, callback) {})")
  // jsonwebtoken.verify를 이용해서 받아온 토큰을 디코드 -> 결과는 err, decoded(user._id)
  console.log("User.js jwt.verify(token, config.tokenKey, (err, decoded) => {})")
  jwt.verify(token, config.tokenKey, (err, decoded) => {
    // 쿠키의 토큰과 사용자의 decoded(user._id)로 DB 저장된 값이 있는지 확인
    // 디코드하지 않고 토큰만으로 검색해도 되지만 사용 가능성을 넓힐 수 있을듯
    console.log("User.js User.findOne({_id : decoded, token : token}, (err, foundUser) => {})")
    User.findOne({_id : decoded, token : token}, (err, foundUser) => {
      if(err) return callback(err)
      return callback(null, foundUser)
    })
  })
}

// middleware/auth.js
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
```

## 14장 로그아웃 기능
- 저장된 토큰을 지우면 로그아웃, findOneAndUpdate 이용
```js
// index.js
// 로그아웃(/api/user/logout)
app.get('/api/user/logout', auth, (req, res) => {
  console.log("index.js app.get('/api/user/logout', auth, (req, res) => {})")
  console.log("index.js User.findOneAndUpdate({_id : req.authedUser._id}, {token : ''}, (err, udatedUser) => {})")
  User.findOneAndUpdate({_id : req.authedUser._id}, {token : ''}, (err, udatedUser) => {
    if(err) return res.status(400).send(err)
    return res.status(200).clearCookie('x_auth').json({logoutSuccess : true})
  })
})
```