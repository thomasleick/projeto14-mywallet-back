const User = require('../models/User')

const deleteRefreshToken = async (refreshToken) => {
  const foundUser = await User.findOne({ refreshToken }).exec()
  if (!foundUser) {
    return false
  }

  foundUser.refreshToken = ''
  await foundUser.save()
  return true
}

module.exports = { deleteRefreshToken }