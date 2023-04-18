const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
      },
      pwd: {
        type: String,
        required: true,
        minlength: 3
    },
    refreshToken: String
})

module.exports = mongoose.model('User', userSchema)