const mongoose = require("mongoose");
const MONGO_URI = "mongodb://127.0.0.1:27017/rentalService";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
