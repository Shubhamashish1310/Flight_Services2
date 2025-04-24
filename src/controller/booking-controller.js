const {BookingService} = require('../services');
const {SuccessResponse, ErrorResponse} = require('../utils/common');



async function createBooking(req, res) {
    try {
        console.log("Creating booking with data:", req.body);
        const booking = await BookingService.createBooking({
            flightId: req.body.flightId,
            userId: req.body.userId,
            noOfSeats: req.body.noOfSeats,
        });
        SuccessResponse.data = booking;
        SuccessResponse.message = "Booking created successfully";
        return res.status(201).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.message = "Error creating booking controller yeh controller hai";
        console.error("Error in createBooking controller:", error.message);
        ErrorResponse.error = error.message;
        return res.status(400).json(ErrorResponse);
    }
}

module.exports = {
    createBooking
};