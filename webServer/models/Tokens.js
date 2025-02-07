const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Tokens = new Schema({
    username: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the creation timestamp
    },
});

module.exports = mongoose.model('Tokens', Tokens);
