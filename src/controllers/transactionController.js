const Transaction = require('../model/Transaction');
const User = require('../model/User')

const postTransaction = async (req, res) => {
    const { type } = req?.params;
    const { value, description } = req?.body;
    const { userid } = req?.headers;

    try {
        // Validate input data against the User schema
        const transaction = new Transaction({ userId: userid, value, type, description });
        const validationResult = transaction.validateSync();
    
        if (validationResult) {
          const errors = validationResult.errors;
          return res.status(422).json({ message: errors });
        }

        // Check if there is a user with the userId
        const isUser = await User.findOne({ _id: userid }).exec();
        if (!isUser) return res.sendStatus(404); //404

        // Save the transaction instance to the database
        await transaction.save();

        return res.status(201).json({ success: `New transaction of type '${type}' created!` });
    }

    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const getTransaction = async (req, res) => {
    const userId = req?.headers?.id;

    if (!userId) return res.sendStatus(400)

    try {
      const transactions = await Transaction.find({ userId }); // find all transactions with the given userId
      return res.json(transactions); // return the transactions
    } catch (err) {
      console.error(err);
      return res.sendStatus(500);
    }
  };

module.exports = { postTransaction, getTransaction };