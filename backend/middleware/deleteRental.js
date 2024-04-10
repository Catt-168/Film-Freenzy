const mongoose = require("mongoose");
const Rental = require("../models/rental");

module.exports = async function (req, res, next) {
  const rental = await Rental.find();
  if (rental.length === 0)
    return res.status(404).send({ message: "Not Found" });
  checkRental(rental);
  next();
};
function checkRental(rental) {
  rental.forEach((_r) => {
    const getDueDate = _r.dateOut.setDate(_r.dateOut.getDate() + _r.rentalDate);
    const expireDate = new Date(getDueDate);

    if (new Date().getTime() >= expireDate.getTime()) {
      deleteRental(_r.id);
    }
  });
}
const deleteRental = async (id) => {
  try {
    const rental = await Rental.findById(id);
    if (!rental) return {};
    await Rental.deleteOne(rental);
    // await Rental.find();
    // res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    // res.status(400).json({ message: e.message });
    return e;
  }
};
