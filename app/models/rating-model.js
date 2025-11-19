const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({});

const Rating = new mongoose.model('Rating', ratingSchema);

module.exports = Rating;