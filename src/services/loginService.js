const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const findUserByEmail = async (email) => {
  return User.findOne({ email }).exec()
}

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword)
}

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {"UserInfo": {
        "name": user.name,
        "email": user.email,
        "id": user._id
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '10s'}
  )
  const refreshToken = jwt.sign(
    {"id": user._id},
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d'}
  )
  return { accessToken, refreshToken }
}

const saveRefreshToken = async (userId, refreshToken) => {
  const user = await User.findById(userId).exec()
  user.refreshToken = refreshToken
  return user.save()
}

module.exports = { findUserByEmail, comparePassword, generateTokens, saveRefreshToken }