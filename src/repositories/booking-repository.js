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

    async get(data,transaction) {
        const response = await Booking.findByPk(data,{transaction:transaction});
        if (!response) {
            throw new Error("Booking not found");
        }
        return response;
    }

    async update(id, data, transaction) {
       const response = await Booking.update(data, {
            where: { id: id },
            transaction: transaction,
        },{transaction:transaction});
        if (response[0] === 0) {
            throw new Error("Booking not found");
        }
        return response;
    }
}

module.exports = BookingRepository;