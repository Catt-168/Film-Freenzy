const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actorSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Actor", actorSchema);
exports.actorSchema = actorSchema;
