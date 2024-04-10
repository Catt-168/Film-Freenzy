const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const languageSchema = new Schema({
  language: {
    type: String,
    required: true,
    maxlength: 50,
  },
});

module.exports = mongoose.model("Language", languageSchema);
exports.languageSchema = languageSchema;
