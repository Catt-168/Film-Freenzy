const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const generSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Gener", generSchema);
exports.generSchema = generSchema;
