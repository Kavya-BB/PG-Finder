const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'complete', 'failed'],
        default: 'pending'
    },
    transactionId: {
        type: String
    }
}, { timestamps: true });

const Payment = new mongoose.model('Payment', paymentSchema);

module.exports = Payment;