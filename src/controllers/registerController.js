const registerService = require('../services/registerService');
const userService = require('../services/userService');

const handleNewUser = async (req, res) => {
    const { name, email, pwd } = req.body;
    if (!name || !email || !pwd) return res.status(400).json({'message': 'name, email and pwd are required.'});

    const duplicate = await userService.findUserByEmail(email);
    if (duplicate) return res.sendStatus(409); //Conflict

    try {
        const user = await registerService.newUser(name, email, pwd);
        const validationResult = user.validateSync();
    
        if (validationResult) {
          const errors = validationResult.errors;
          return res.status(422).json({ message: errors });
        }
    
        const hashedPwd = await registerService.hashPwd(pwd);
        user.pwd = hashedPwd;
        await user.save();
    
        res.status(201).json({ success: `New user ${name} created!` });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    };

module.exports = { handleNewUser };