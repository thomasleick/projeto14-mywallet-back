const authService = require('../services/authService')

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({'message': 'A valid email is required.'})
  }
  if (!pwd) {
    return res.status(400).json({'message': 'Password is required.'})
  }
  const foundUser = await authService.findUserByEmail(email)
  if (!foundUser) {
    return res.sendStatus(404) //unauthorized
  }
  const match = await authService.comparePassword(pwd, foundUser.pwd)
  if (match) {
    const { accessToken, refreshToken } = authService.generateTokens(foundUser)
    await authService.saveRefreshToken(foundUser._id, refreshToken)

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 })

    console.log(`login the ${foundUser.name} efetuado com sucesso...`)

    return res.json({ name: foundUser.name, email: foundUser.email, id: foundUser._id, accessToken })

  } else {
    return res.sendStatus(401) //unauthorized
  }
}
module.exports = { handleLogin }