const Booking = require('../models/booking-model.js');
const Pg = require('../models/pg-model.js');
const bookingValidationSchema = require('../validations/booking-validation.js');
const bookingCltr = {};

bookingCltr.createBooking = async (req, res) => {
    const body = req.body;
    try {
        const { error, value } = bookingValidationSchema.validate(body);
        if(error) {
            res.status(400).json({ error: error.details });
        }
        const { pgId, roomType, duration, durationType } = req.body;
        const userId = req.userId;
        const pg = await Pg.findById(pgId);
        if(!pg) {
            res.status(404).json({ error: 'Pg not found' });
        }
        const selectedRoom = pg.roomTypes.find(ele => ele.roomType === roomType);
        if(!selectedRoom) {
            res.status(400).json({ error: 'Invalid room type'});
        }
        if(selectedRoom.count <= 0) {
            res.status(400).json({ error: 'Room not available' });
        }
        // const amount = selectedRoom.rent * duration;
        let amount;
        if(durationType == 'month') {
            amount = selectedRoom.rent * duration;
        } else if(durationType == 'week') {
            amount = (selectedRoom.rent / 4) * duration;
        } else {
            return res.status(400).json({ error: "durationType must be 'month' or 'week'" });
        }
        const booking = await Booking.create({
            userId,
            pgId,
            roomType,
            duration,
            durationType,
            amount,
            status: 'pending'
        });
        const populatedBooking = await Booking.findById(booking._id)
            .populate("userId", "name email")
            .populate("pgId", "pgname location")
        res.status(201).json({ success: true, booking: populatedBooking });
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: 'something went wrong!!!' });
    }
}

bookingCltr.confirmBooking = async (req, res) => {
    res.send('confirm booking');
}

bookingCltr.cancelBooking = async (req, res) => {
    res.send('cancel Booking');
}

module.exports = bookingCltr;