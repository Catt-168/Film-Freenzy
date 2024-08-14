const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgorPasswordSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

module.exports = mongoose.model("ForgotPassword", forgorPasswordSchema);
exports.forgorPasswordSchema = forgorPasswordSchema;
