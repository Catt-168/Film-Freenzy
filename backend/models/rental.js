const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
    }),
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
      },
      genre: [
        {
          name: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 50,
          },
        },
      ],
      dailyRentalRate: {
        type: Number,
        min: 0,
      },
    }),
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },

  rentalDate: {
    type: Number,
    required: true,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

module.exports = mongoose.model("Rental", rentalSchema);
