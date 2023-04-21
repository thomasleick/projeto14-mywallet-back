const logoutService = require('../services/logoutService')

const handleLogout = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) {
    return res.sendStatus(204) // no content
  }

  const refreshToken = cookies.jwt
  const deleted = await logoutService.deleteRefreshToken(refreshToken)

  if (!deleted) {
    res.clearCookie('jwt'), { httpOnly: true }
    return res.sendStatus(403) //Forbidden
  }

  res.clearCookie('jwt'), { httpOnly: true, sameSite: 'None', secure: true } // secure: true - only serves on https
  res.sendStatus(204)
}

module.exports = { handleLogout }