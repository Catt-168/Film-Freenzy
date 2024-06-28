const Rental = require("../models/rental");
const user = require("../models/user");
const Movie = require("../models/movie");
const { ObjectId } = require("mongodb");

exports.getRentals = async (req, res) => {
  let { movieId, customerId } = req.query;
  const movie = movieId ? new ObjectId(movieId) : null;
  const customer = customerId ? new ObjectId(customerId) : null;
  let query = {};
  let filteredRental = [];

  if (!movie && !customer) {
    const rental = await Rental.find();
    if (!rental) res.status(404).json({ message: "No Rental Movies Exist" });
    return res.send(rental);
  }
  if (customer) {
    query = { "customer._id": customer };
  } else if (movie) {
    query = { "movie._id": movie };
  }
  filteredRental = await Rental.find(query, "-__v");
  console.log(filteredRental.length);
  return filteredRental.length > 0
    ? res.send(filteredRental)
    : res.json({ message: "No Rental Movies Exist" });
};

exports.getRentalDetails = async (req, res) => {
  const { id } = req.params;
  await Rental.findById(id);
  try {
    const rental = await Rental.findById(id);
    if (!rental) return res.status(404).json({ message: "Not Found" });
    res.send(rental).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createRental = async (req, res) => {
  const { customerId, movieId } = req.body;
  const customer = await user.findById(customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(movieId);
  if (!customer) return res.status(400).send("Invalid Movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie out of Stock.");

  const { rentalDate } = req.body;

  if (rentalDate === 0)
    return res.status(401).json({ message: "Rental Date at least one day" });

  const rental = new Rental({
    customer: {
      name: customer.name,
      _id: customer._id,
    },
    movie: {
      title: movie.title,
      _id: movie._id,
      dailyRentalRate: movie.dailyRentalRate,
      genre: movie.genre,
    },
    rentalDate,
    rentalFee: movie.dailyRentalRate * rentalDate,
  });

  const filter = { _id: movie._id };
  const update = {
    numberInStock: movie.numberInStock - 1,
  };
  try {
    const newRental = await rental.save();
    await Movie.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json({
      message: "Movie Updated Reduce",
      rental: newRental,
    });
  } catch (e) {
    res.status(500).send("SERVER ERROR");
  }
};

exports.updateRental = async (req, res) => {
  const { id } = req.query;
  const filter = { _id: id };
  const update = {
    rentalDate: req.body.rentalDate,
    rentalFee: req.body.dailyRentalRate * 1,
  };
  try {
    const oldRental = await Rental.findById(id);

    update.rentalDate = oldRental.rentalDate + 1;
    update.rentalFee = update.rentalFee + oldRental.rentalFee;

    await Rental.findOneAndUpdate(filter, update, { new: true });
    res.status(200).json(oldRental);
  } catch (e) {
    res.status(500).send("SERVER ERROR");
  }
};
