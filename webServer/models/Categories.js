const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
  },
  promoted: {
    type: Boolean,
    required: true,
  },
  movies: {
    type: [String], // Store movie IDs as strings
    default: [],    // Default to an empty array
  },
});


module.exports = mongoose.model('Category', Category);
