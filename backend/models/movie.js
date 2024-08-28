const mongoose = require("mongoose");
const { generSchema } = require("./genre");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  description: { type: String, required: true },
  image: {
    type: new Schema({
      name: { type: String, required: true },
      contentType: { type: String, required: true },
      path: { type: String, required: true },
    }),
  },
  genre: {
    type: [
      new Schema({
        name: {
          type: String,
          required: true,
          maxlength: 50,
        },
      }),
    ],
  },
  language: {
    type: [
      new Schema({
        language: {
          type: String,
          required: true,

          maxlength: 50,
        },
      }),
    ],
  },
  rating: { type: Number, required: true },
  length: { type: Number, required: true },
  releasedYear: { type: Number, required: true },
  price: { type: Number, required: true, min: 0 },
  trailerLink: {
    type: String,
    min: 0,
    max: 500,
  },
  actor: {
    type: [
      new Schema({
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 50,
        },
      }),
    ],
  },
});

module.exports = mongoose.model("Movie", movieSchema);
exports.movieSchema = movieSchema;
