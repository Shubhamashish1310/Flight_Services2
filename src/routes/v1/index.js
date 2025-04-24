const express = require('express');
const { InfoController} = require('../../controller');
const bookingRoutes = require('./booking-routes');

const router = express.Router();
console.log('Inside routes/v1/index.js');

router.get('/info', InfoController.info);

router.use('/bookings', bookingRoutes);




module.exports = router;