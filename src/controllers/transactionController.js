const { query } = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User')

const postTransaction = async (req, res) => {
  const { type } = req?.params;
  const { value, description } = req?.body;
  const userid = req?.headers?.id;
  const date = new Date();

  try {
    // Validate input data against the User schema
    const transaction = new Transaction({ userId: userid, value, type, description, date });
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

  if (!userId) return res.sendStatus(400);
  try {
    const transactions = await Transaction.find({ userId });
    return res.json(transactions); 
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

const deleteTransaction = async (req, res) => {
  const userId = req?.headers?.id;
  const transactionId = req?.params?.id;

  if (!userId || !transactionId) return res.sendStatus(400);

  try {
    // Check if transaction exists
    const transaction = await Transaction.findOne({ _id: transactionId, userId });
    if (!transaction) {
      return res.status(404).send({ message: 'Transaction not found' });
    }

    // Delete transaction
    await Transaction.deleteOne({ _id: transactionId, userId });

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

const putTransaction = async (req, res) => {
  return
}

module.exports = { postTransaction, getTransaction, deleteTransaction, putTransaction };