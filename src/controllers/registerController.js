const User = require('../models/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, email, pwd } = req.body;
    if (!name || !email || !pwd) return res.status(400).json({'message': 'name, email and pwd are required.'});

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        // Validate input data against the User schema
        const user = new User({ name, email, pwd });
        const validationResult = user.validateSync();
    
        if (validationResult) {
          const errors = validationResult.errors;
          return res.status(422).json({ message: errors });
        }
    
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
    
        // Set the hashed password on the user instance
        user.pwd = hashedPwd;

        // Save the user instance to the database
        await user.save();
    
        res.status(201).json({ success: `New user ${name} created!` });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };

module.exports = { handleNewUser };