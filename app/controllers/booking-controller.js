const Booking = require('../models/booking-model.js');
const Pg = require('../models/pg-model.js');
const bookingValidationSchema = require('../validations/booking-validation.js');
const bookingCltr = {};

bookingCltr.createBooking = async (req, res) => {
    res.send('create booking');
}

bookingCltr.confirmBooking = async (req, res) => {
    res.send('confirm booking');
}

bookingCltr.cancelBooking = async (req, res) => {
    res.send('cancel Booking');
}

module.exports = bookingCltr;