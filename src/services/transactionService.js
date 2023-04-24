const Transaction = require('../models/Transaction');
const User = require('../models/User');

const createTransaction = async ({ type, value, description, userId }) => {
    const date = new Date();

    try {
        // Validate input data against the User schema
        const transaction = new Transaction({ userId, value, type, description, date });
        const validationResult = transaction.validateSync();

        if (validationResult) {
            const errors = validationResult.errors;
            throw new Error(errors);
        }

        // Check if there is a user with the userId
        const isUser = await User.findOne({ _id: userId }).exec();
        if (!isUser) throw new Error('User not found');

        // Save the transaction instance to the database
        await transaction.save();

        return { success: `New transaction of type '${type}' created!` };
    }

    catch (err) {
        throw err;
    }
};

const getTransactionsByUserId = async (userId) => {
    try {
        const transactions = await Transaction.find({ userId });
        return transactions;
    } catch (err) {
        console.error(err);
        throw new Error('Error retrieving transactions');
    }
};

const deleteTransaction = async (userId, transactionId) => {
    try {
        // Check if transaction exists
        const transaction = await Transaction.findOne({ _id: transactionId, userId });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        // Delete transaction
        await Transaction.deleteOne({ _id: transactionId, userId });

        return { success: 'Transaction deleted successfully!' };
    } catch (err) {
        console.error(err);
        throw new Error('Error deleting transaction');
    }
};

const updateTransaction = async ({ transactionId, userId, value, description }) => {
    try {
        // Update transaction
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, userId },
            { value, description },
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            throw new Error('Transaction not found');
        }

        return updatedTransaction;
    } catch (error) {
        throw new Error(`Unable to update transaction: ${error.message}`);
    }
};

module.exports = { createTransaction, getTransactionsByUserId, deleteTransaction, updateTransaction };