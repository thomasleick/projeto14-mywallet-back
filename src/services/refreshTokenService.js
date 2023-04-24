const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAccessToken = (userInfo) => {
    return jwt.sign({ UserInfo: userInfo }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10s',
    });
};

const verifyRefreshToken = async (refreshToken) => {
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        return false;
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (foundUser._id.toString() !== decoded.id) {
            return false;
        }
        const accessToken = generateAccessToken({
            name: decoded.name,
            email: decoded.email,
            id: decoded._id,
        });
        return { foundUser, accessToken };
    } catch (error) {
        return false;
    }
};

module.exports = { verifyRefreshToken };