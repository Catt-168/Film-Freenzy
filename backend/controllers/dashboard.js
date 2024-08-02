const Genre = require("../models/genre");
const Movie = require("../models/movie");

exports.getPieChartData = async (req, res) => {
  try {
    let pieData = [];

    const allGenres = await Genre.find();
    for (let i = 0; i <= allGenres.length; i++) {
      const genre = await Genre.findOne({ name: allGenres[i]?.name });
      const data = await Movie.find({ genre });

      pieData.push({ id: i + 1, value: data.length, label: genre?.name });
    }
    // console.log(pieData);
    res.json({ pieData: pieData }).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
