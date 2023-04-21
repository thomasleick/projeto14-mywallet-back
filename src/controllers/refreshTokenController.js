const User = require('../models/User')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403) //Forbidden
    // evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser._id.toString() !== decoded.id) return res.sendStatus(403)
            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "name": decoded.name,
                        "email": decoded.email,
                        "id": decoded._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s'}
            )
            res.json({ accessToken })
        }
    )
}
module.exports = { handleRefreshToken }