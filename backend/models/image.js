const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  name: { type: String, required: true },
  contentType: { type: String, required: true },
  path: { type: String, required: true },
});

module.exports = mongoose.model("Image", imageSchema);
exports.imageSchema = imageSchema;
