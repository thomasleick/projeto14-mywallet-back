const User = require('../model/User');
const bcrypt = require('bcrypt');
const express = require('express');

const handleNewUser = async (req, res) => {
    const { name, email, pwd } = req.body;
    if (!name || !email || !pwd) return res.status(400).json({'message': 'name, email and pwd are required.'});

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ name }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        //create and store the new user
        const result = await User.create({ 
            name,
            email,
            pwd: hashedPwd
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${name} created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
};

module.exports = { handleNewUser };