const Payment = require('../models/payment-model.js');
const Booking = require('../models/booking-model.js');
const instance = require('../utils/razorpay.js');
const crypto = require('crypto');

const paymentCltr = {};

paymentCltr.createOrder = async (req, res) => {
    try {
        const { amount, bookingId } = req.body;
        const userId = req.userId;
        const order = await instance.orders.create({
            amount: amount * 100,
            currency: 'INR'
        });
        const payment = await Payment.create({
            userId,
            bookingId,
            amount,
            razorpay_order_id: order.id,
            paymentStatus: 'pending'
        });
        res.json({
            success: true,
            order,
            paymentId: payment._id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

paymentCltr.getKey = (req, res) => {
    res.json({
        key: process.env.RAZORPAY_API_KEY
    });
};

paymentCltr.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
            .update(body)
            .digest('hex');
        if (expectedSignature !== razorpay_signature) {
            await Payment.findOneAndUpdate(
                { razorpay_order_id },
                { paymentStatus: 'failed' }
            );
            return res.status(400).json({ success: false });
        }
        const payment = await Payment.findOneAndUpdate(
            { razorpay_order_id },
            {
                razorpay_payment_id,
                paymentStatus: 'complete'
            },
            { new: true }
        );
        await Booking.findByIdAndUpdate(payment.bookingId, {
            status: 'confirmed'
        });
        res.json({
            success: true,
            paymentId: razorpay_payment_id
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = paymentCltr;
