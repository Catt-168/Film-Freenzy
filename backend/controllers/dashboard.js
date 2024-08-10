const Genre = require("../models/genre");
const Movie = require("../models/movie");
const Rental = require("../models/rental");

exports.getPieChartData = async (req, res) => {
  try {
    let pieData = [];

    const allGenres = await Genre.find();
    for (let i = 0; i <= allGenres.length; i++) {
      const genre = await Genre.findOne({ name: allGenres[i]?.name });
      const data = await Movie.find({ genre });

      pieData.push({ id: i + 1, value: data.length, label: genre?.name });
    }

    res.json({ pieData: pieData }).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getBarChartData = async (req, res) => {
  try {
    const { count } = req.params;
    const rentals = await Rental.find();
    const hightestRentals = rentals.map((r) => r.movie.title);
    const counts = countDuplicates(hightestRentals);
    const t3 = getTop(counts, count);
    res
      .json({ barChartData: t3, totalCount: Object.keys(counts).length })
      .status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMoviesByReleaseDate = async (req, res) => {
  try {
    const movies = await Movie.find({}, "releasedYear -_id");
    const m2 = movies.map((i) => i.releasedYear);
    const cD = countDuplicates(m2);
    const t3 = getTop(cD, 5);
    res.json({ t3 }).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getHighestPurchasedUsers = async (req, res) => {
  try {
    const rentals = await Rental.find({}, "customer -_id");
    const sec = rentals.map((item) => item.customer.name);
    const customers = countDuplicates(sec);
    const top3Customers = getTop(customers, 20);
    res.json({ customers: top3Customers }).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

function countDuplicates(arr) {
  const countMap = {};
  arr.forEach((element) => {
    countMap[element] = (countMap[element] || 0) + 1;
  });
  return countMap;
}

function getTop(counts, limit) {
  // Convert object to array of key-value pairs
  const entries = Object.entries(counts);

  // Sort by value in descending order
  entries.sort((a, b) => b[1] - a[1]);

  // Extract the top 3 movies
  const topThree = entries.slice(0, limit);

  return topThree;
}
