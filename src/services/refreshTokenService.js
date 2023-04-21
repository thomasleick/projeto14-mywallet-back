const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            "UserInfo": {
                "name": user.name,
                "email": user.email,
                "id": user._id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
    )
}

const refreshToken = async (refreshToken) => {
    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) throw new Error('User not found') // Throw error if user not found
    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser._id.toString() !== decoded.id) throw new Error('Invalid token') // Throw error if invalid token
            const accessToken = generateAccessToken(foundUser)
            return accessToken
        }
    )
}

module.exports = {
    refreshToken,
    generateAccessToken
}