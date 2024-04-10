const mongoose = require("mongoose");
const Rental = require("../models/rental");

module.exports = async function (req, res, next) {
  const rental = await Rental.findById(req.params.id);
  if (!rental) return res.status(404).send({ message: "Not Founds" });
  checkRental(rental);
  next();
};
function checkRental(rental) {
  const getDueDate = rental.dateOut.setDate(
    rental.dateOut.getDate() + rental.rentalDate
  );
  const expireDate = new Date(getDueDate);

  if (new Date().getTime() >= expireDate.getTime()) {
    deleteRental(rental.id);
  }
}
const deleteRental = async (id) => {
  try {
    const rental = await Rental.findById(id);
    if (!rental) return {};
    await Rental.deleteOne(rental);
  } catch (e) {
    return e;
  }
};
