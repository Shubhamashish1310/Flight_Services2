const express = require('express');
const { BookingController } = require('../../controller');

const router = express.Router();
console.log('Inside routes/v1/booking-routes.js');

router.post('/', BookingController.createBooking);


module.exports = router;