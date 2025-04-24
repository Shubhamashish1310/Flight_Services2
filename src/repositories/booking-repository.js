const {StatusCodes} = require('http-status-codes');


const {Booking} = require('../models');
const {Op} = require('sequelize');
const CrudRepository = require('./crud-repository');


class BookingRepository extends CrudRepository {
    constructor() {
        super(Booking);
    }

    async createBooking(data,transaction) {
        
            const booking = await Booking.create(data, { transaction: transaction });
            return booking;
        
          
        
    }
}

module.exports = BookingRepository;