const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {

    const { email, pwd } = req.body
    if (!email || !pwd) return res.status(400).json({'message': 'Email and password are required.'})

       const foundUser = await User.findOne({ email }).exec()
    if (!foundUser) return res.sendStatus(404) //unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.pwd)
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {"UserInfo": {
                "name": foundUser.name,
                "email": foundUser.email
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s'}
        )
        const refreshToken = jwt.sign(
            {"username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )
        foundUser.refreshToken = refreshToken
        const result = await foundUser.save()
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }) //secure: true
        res.json({ name: result.name, email: result.email, accessToken })
    } else {
        res.sendStatus(401) //unauthorized
    }
}

module.exports = { handleLogin }