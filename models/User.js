const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const config = require('../config/key')
const saltRounds = 10 // salt 길이

const userSchema = mongoose.Schema({
  name: { type: String, maxlength: 50 },
  email: { type: String, trim: true, unique: 1 },
  password: { type: String, minlength: 5 },
  lastname: { type: String, maxlength: 50 },
  role: { type: Number, default: 0 },
  image: String,
  token: { type: String },
  tokenExp: { type: Number }
})

// 비밀번호 저장 전 암호화
userSchema.pre('save', function (next) {
  console.log("User.js userSchema.pre('save', function(next) {})")
  let enteredUser = this // 사용자가 입력한 정보
  if (enteredUser.isModified('password')) { // 비밀번호 변경시에만 작동
    console.log("User.js enteredUser.isModified('password')")
    console.log("User.js bcrypt.genSalt(saltRounds, (err, salt) => {})")
    bcrypt.genSalt(saltRounds, (err, salt) => { // salt 생성
      if (err) return next(err)
      console.log("User.js bcrypt.hash(enteredUser.password, salt, (err, hash) => {})")
      bcrypt.hash(enteredUser.password, salt, (err, hash) => { // hash 생성
        // Store hash in your password DB
        if (err) return next(err)
        enteredUser.password = hash
        next()
      })
    })
  } else if (enteredUser.isModified('token')) { // 토큰 변경시에 작동
    console.log("User.js enteredUser.isModified('token')")
    next()
  } else {
    console.log("User.js else")
    next()
  }
})

// 비밀번호 비교 메소드
// 이메일로 검색된 정보로 해당 메소드 실행
userSchema.methods.comparePassword = function (plainPassword, callback) {
  console.log("User.js userSchema.methods.comparePassword = function(plainPassword, callback) {})")
  // plainPassword : 사용자가 입력한 정보, this.password : 이메일로 찾아온 정보(비밀번호)
  console.log("User.js bcrypt.compare(plainPassword, this.password, (err, isMatch) => {})")
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return callback(err)
    return callback(null, isMatch)
  })
}

// 비밀번호 비교 메소드2 
// 사용자가 입력한 정보로 해당메소드 실행(가능하긴 하지만 사용은 고려해볼 것)
userSchema.methods.comparePassword2 = function (encodePassword, callback) {
  console.log("User.js userSchema.methods.comparePassword2 = function(encodePassword, callback) {})")
  // this.password : 사용자가 입력한 정보, encodePassword : 이메일로 찾아온 정보(비밀번호)
  console.log("User.js bcrypt.compare(this.password, encodePassword, (err, isMatch) => {})")
  bcrypt.compare(this.password, encodePassword, (err, isMatch) => {
    if (err) return callback(err)
    return callback(null, isMatch)
  })
}

// 토큰 생성 
userSchema.methods.generateToken = function (callback) {
  console.log("User.js userSchema.methods.generateToken = function(callback) {})")
  var enteredUser = this // 여기서 this는 이메일을 통해 DB에서 얻어온 정보(userInfo)
  // user._id + 'screetToken' => token
  // token + 'screetToken' => user._id
  // jsonwebtoken.sign을 이용해서 토큰 생성
  var token = jwt.sign(enteredUser._id.toHexString(), config.tokenKey)
  enteredUser.token = token
  console.log("User.js enteredUser.save((err, savedUser) => {})")
  enteredUser.save((err, savedUser) => {
    if (err) return callback(err)
    return callback(null, savedUser)
  })
}

// 토큰으로 권한 확인
userSchema.statics.findByToken = function (token, callback) {
  console.log("User.js userSchema.statics.findByToken = function(token, callback) {})")
  // jsonwebtoken.verify를 이용해서 받아온 토큰을 디코드 -> 결과는 err, decoded(user._id)
  console.log("User.js jwt.verify(token, config.tokenKey, (err, decoded) => {})")
  jwt.verify(token, config.tokenKey, (err, decoded) => {
    // 쿠키의 토큰과 사용자의 decoded(user._id)로 DB 저장된 값이 있는지 확인
    // 디코드하지 않고 토큰만으로 검색해도 되지만 사용 가능성을 넓힐 수 있을듯
    console.log("User.js User.findOne({_id : decoded, token : token}, (err, foundUser) => {})")
    User.findOne({ _id: decoded, token: token }, (err, foundUser) => {
      if (err) return callback(err)
      return callback(null, foundUser)
    })
  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }