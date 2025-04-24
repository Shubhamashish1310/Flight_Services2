const axios = require('axios');
const { BookingRepository } = require('../repositories');
const {ServerConfig} = require('../config');
const db=require('../models');


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
module.exports = {
    createBooking,
};