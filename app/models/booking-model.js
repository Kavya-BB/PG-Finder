const mongoose = require('mongoose');

const bookingschema = new mongoose.Schema({
});

const Booking = mongoose.model('Booking', bookingschema);

module.exports = Booking;