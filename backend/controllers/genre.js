const Genre = require("../models/genre");
const Movie = require("../models/movie");

exports.getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getGenreDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).json({ message: "Not Found" });
    res.send(genre).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createGenre = async (req, res) => {
  const genre = new Genre({
    name: req.body.name,
  });
  try {
    const genres = await Genre.find();
    const isOldGenreExist = genres.filter(
      (item) => item.name === req.body.name
    );

    if (isOldGenreExist.length !== 0)
      return res.status(409).json({ message: "Already Exists" });
    const newGenre = await genre.save();
    res.status(201).json(newGenre);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.updateGenre = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const filter = { _id: id };
  const update = {
    name,
  };
  try {
    const movie = await Movie.find({ "genre._id": id });
    if (movie.length !== 0)
      return res.status(409).json({ message: "Can not edit" });
    const updatedGenre = await Genre.findOneAndUpdate(filter, update, {
      new: true,
    });
    res.status(200).json(updatedGenre);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteGenre = async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).json({ message: "Genre Not Found!" });
    const movie = await Movie.find({ genre: genre });
    if (movie.length !== 0) {
      return res
        .status(409)
        .json({ message: "Action cannot be performed due to dependencies" });
    }
    await Genre.deleteOne(genre);
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
