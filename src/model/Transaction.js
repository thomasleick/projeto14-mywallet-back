const mongoose = require('mongoose')
const Schema = mongoose.Schema

const transactionSchema = new Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // reference the User model for population
    },
    value: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value > 0 && Number.isFinite(value);
            },
            message: 'Value must be a positive float'
        }
    },
    type: {
        type: String,
        required: true,
        enum: ['in', 'out']
    },
    description: {
        type: String,
        required: true
    },

})

module.exports = mongoose.model('Transaction', transactionSchema)