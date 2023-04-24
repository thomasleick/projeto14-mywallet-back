const User = require('../models/User')

const findUserByEmail = async email => {
    return User.findOne({ email }).exec()
}

const findUserByRefreshToken = async refreshToken => {
    return User.findOne({ refreshToken }).exec();
}


module.exports = { findUserByEmail, findUserByRefreshToken }