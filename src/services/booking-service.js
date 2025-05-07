const axios = require('axios');
const { BookingRepository } = require('../repositories');
const {ServerConfig} = require('../config');
const db=require('../models');
const AppError = require('../utils/errors/app-error');
const {Enums} = require('../utils/common');

const {CONFIRMED,CANCELLED} = Enums.BOOKING_STATUS;
 


const bookingRepository = new BookingRepository();

async function createBooking(data) {
    const transaction = await db.sequelize.transaction();
    console.log("Inside createBooking service:", data);
    
  try {
    const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
    const flightData = flight.data.data;
    if (flightData.totalSeat < data.noOfSeats) {
      throw new Error("Not enough seats available");
    }
   const totalBill = flightData.price * data.noOfSeats;
    console.log("Total bill:", totalBill);
    const bookingPayload = {...data,totalCost:totalBill};
    const booking = await bookingRepository.create(bookingPayload, transaction);
    console.log("Booking created:", booking);

 
    

  await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
      seats: data.noOfSeats,
  });

    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    console.error("Error in createBooking service done:", error.message);
    throw new Error("Error in createBooking service ok: " + error.message);
  }
}

async function makePayment(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const booking = await bookingRepository.get(data.bookingId, transaction);
if(booking.status==CANCELLED){
            //already confirmed or cancelled booking
            await transaction.rollback();
            throw new AppError("Booking already confirmed", 400);
        }
        if (!booking) {
            throw new Error("Booking not found");
        }
        if(booking.totalCost!=data.totalCost){
            throw new AppError("Total cost mismatch", 400);
        }
        if(booking.userId!=data.userId){
            throw new AppError("User ID mismatch", 400);
        } 
console.log("Booking found:", booking);
const dt = new Date(booking.createdAt);
const currentDate = new Date();
const timeDiff = currentDate.getTime() - dt.getTime(); // Difference in milliseconds
console.log("Time difference in milliseconds:", timeDiff);
        if (timeDiff > 5 * 60 * 1000) {   
        await cancelBooking(data.bookingId) 
        throw new AppError("Payment time limit exceeded", 400);
        }
        // Proceed with payment processing logic here
        await bookingRepository.update(data.bookingId, { status: CONFIRMED }, transaction);

        
        await transaction.commit();
        
    } catch (error) {
        await transaction.rollback();
        console.error("Error in makePayment service:", error.message);
        throw new Error("Error in makePayment service: " + error.message);
    }
}


async function cancelBooking(data) {
    const transaction = await db.sequelize.transaction();
    try {
        const booking = await bookingRepository.get(data, transaction);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.status === CANCELLED) {
            throw new Error("Booking already cancelled");
        }
        console.log("dekho dekho yaha dekho",booking.noOfSeats)
        await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${booking.flightId}/seats`, {
            
            seats: -booking.noOfSeats,
        });
        await bookingRepository.update(data.bookingId, { status: CANCELLED }, transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.error("Error in cancelBooking service:", error.message);
        throw new Error("Error in cancelBooking service: " + error.message);
    }
}

async function cancelOldBookings() {
  try {
    console.log("Inside service")
    const time = new Date( Date.now() - 1000 * 300 ); // time 5 mins ago
    const response = await bookingRepository.cancelOldBookings(time);
    
    return response;
} catch(error) {
    console.log(error);
}
}

module.exports = {
    createBooking,
    makePayment,
    cancelBooking,
    cancelOldBookings
};