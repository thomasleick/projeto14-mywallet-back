const User = require('../models/User');
const bcrypt = require('bcrypt');

const newUser = async (name, email, pwd) => {
    const user = new User({ name, email, pwd });
    return user;
};

const hashPwd = async pwd => {
    return bcrypt.hash(pwd, 10);
}
module.exports = { newUser, hashPwd };