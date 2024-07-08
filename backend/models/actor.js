const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const actorSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  image: {
    type: new Schema({
      name: { type: String, required: true },
      contentType: { type: String, required: true },
      path: { type: String, required: true },
    }),
  },
});

module.exports = mongoose.model("Actor", actorSchema);
exports.actorSchema = actorSchema;
