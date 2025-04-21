const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI
// "mongodb://127.0.0.1:27017/rentalService";

console.log('env',process.env.MONGO_URI)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
