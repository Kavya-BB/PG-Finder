const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({});

const Payment = new mongoose.model('Payment', paymentSchema);

module.exports = Payment;