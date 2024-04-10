const express = require("express");
const deleteRental = require("../middleware/deleteRental");
const rentalController = require("../controllers/rentals");
const deleteSingleRental = require("../middleware/deleteSingleRental");
const validateObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.get("/:id", deleteSingleRental, rentalController.getRentalDetails);
router.put("/", rentalController.updateRental);
router.get("/", deleteRental, rentalController.getRentals);
router.post("/", rentalController.createRental);

module.exports = router;
