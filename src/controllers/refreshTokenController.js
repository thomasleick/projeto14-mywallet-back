const refreshTokenService = require('../services/refreshTokenService');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const result = await refreshTokenService.verifyRefreshToken(refreshToken);
    if (!result) return res.sendStatus(403);
    const { foundUser, accessToken } = result;

    res.json({
        name: foundUser.name,
        email: foundUser.email,
        id: foundUser._id,
        accessToken,
    });
};

module.exports = { handleRefreshToken };