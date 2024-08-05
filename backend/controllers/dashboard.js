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
    const rentals = await Rental.find();
    const hightestRentals = rentals.map((r) => r.movie.title);
    const counts = countDuplicates(hightestRentals);
    const t3 = getTop(counts, 5);
    res.json({ barChartData: t3 }).status(200);
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
