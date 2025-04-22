'use strict';
const {Enums} = require('../utils/common');
const {PENDING,IN_PROGRESS,CANCELLED,CONFIRMED,REFUNDED} = Enums.BOOKING_STATUS;
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init({
    flightId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Flight',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM,
      values: [PENDING, IN_PROGRESS, CONFIRMED, CANCELLED, REFUNDED],
      
      allowNull: false,
      defaultValue: PENDING,
    },
    noOfSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 10
      }
      
    },
    totalCost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};