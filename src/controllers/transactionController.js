const transactionService = require('../services/transactionService');

const postTransaction = async (req, res) => {
  const { type } = req?.params;
  const { value, description } = req?.body;
  const userid = req?.headers?.id;

  try {
    const result = await transactionService.createTransaction({ type, value, description, userId: userid });
    return res.status(201).json(result);
  }

  catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getTransaction = async (req, res) => {
  const userId = req?.headers?.id;

  if (!userId) return res.sendStatus(400);

  try {
    const transactions = await transactionService.getTransactionsByUserId(userId);
    const sortedTransactions = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return res.json(sortedTransactions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  const userId = req?.headers?.id;
  const transactionId = req?.params?.id;

  if (!userId || !transactionId) return res.sendStatus(400);

  try {
    const result = await transactionService.deleteTransaction(userId, transactionId);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const putTransaction = async (req, res) => {
  const userId = req?.headers?.id;
  const transactionId = req?.params?.id;
  const { value, description } = req?.body;

  if (!userId || !transactionId) {
    return res.sendStatus(400);
  }

  try {
    const updatedTransaction = await transactionService.updateTransaction({
      transactionId,
      userId,
      value,
      description,
    });

    return res.json(updatedTransaction);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { postTransaction, getTransaction, deleteTransaction, putTransaction };