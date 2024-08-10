const Movie = require("../models/movie");
const Genre = require("../models/genre");
const Image = require("../models/image");
const Language = require("../models/language");
const Rental = require("../models/rental");
const Actor = require("../models/actor");

exports.getAllMovies = async (req, res) => {
  try {
    const {
      pageSize,
      page,
      genre = "",
      language = "",
      rating = "",
      yearStart = "",
      yearEnd = "",
      title = "",
    } = req.query;
    const skip = (page - 1) * pageSize;

    let movies = [];
    let moviesWithActors = [];
    let query = {};
    let query2 = {};

    if (title.length !== 0) {
      query.title = new RegExp(title, "i");
      query2 = {
        "actor.name": new RegExp(title, "i"),
      };
    }

    if (genre.length !== 0 && genre !== "All") {
      const filteredGenre = await Genre.findOne({ name: genre }, "-__v");
      query.genre = filteredGenre;
    }
    if (language.length !== 0 && language !== "All") {
      const filteredLangauge = await Language.findOne({ language }, "-__v");
      query.language = filteredLangauge;
    }
    if (rating.length !== 0 && rating !== "All") {
      query.rating = parseInt(rating);
    }
    if (yearStart.length !== 0 && yearStart !== "All") {
      if (yearEnd.length !== 0) {
        query.releasedYear = {
          $gte: parseInt(yearStart),
          $lte: parseInt(yearEnd),
        };
      } else {
        query.releasedYear = parseInt(yearStart);
      }
    }

    movies = await Movie.find(query, "-__v").limit(pageSize).skip(skip);
    if (title.length !== 0) {
      moviesWithActors = await Movie.find(query2, "-__v")
        .limit(pageSize)
        .skip(skip);
    }
    const isGreater = movies.length >= moviesWithActors.length;
    // console.log(isGreater, movies.length, moviesWithActors.length);

    let duplicate = [];
    if (isGreater) {
      for (let index = 0; index < movies.length; index++) {
        for (let index2 = 0; index2 < moviesWithActors.length; index2++) {
          if (movies[index].title === moviesWithActors[index2].title) {
            duplicate.push(movies[index]);
          }
        }
      }
    }
    if (!isGreater) {
      for (let index = 0; index < moviesWithActors.length; index++) {
        for (let index2 = 0; index2 < movies.length; index2++) {
          if (moviesWithActors[index].title === movies[index2].title) {
            duplicate.push(moviesWithActors[index]);
          }
        }
      }
    }

    if (duplicate.length !== 0) {
      for (let index = 0; index <= duplicate.length; index++) {
        if (isGreater) {
          if (movies.includes(duplicate[index])) {
            moviesWithActors = moviesWithActors.filter(
              (m) => m.title !== duplicate[index].title
            );
          }
        } else {
          if (moviesWithActors.includes(duplicate[index])) {
            moviesWithActors = moviesWithActors.filter(
              (m) => m.title !== duplicate[index].title
            );
          }
        }
      }
    }
    // console.log(moviesWithActors);

    const totalItems =
      (await Movie.countDocuments(query)) + moviesWithActors.length;
    const totalPages =
      totalItems % 10 === 0 ? totalItems / 10 : totalItems / 10 + 1;
    const metaData = {
      currentPage: parseInt(page),
      totalPages: parseInt(totalPages),
    };

    res.status(200).json({ movies, metaData, moviesWithActors });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getMovieDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Not Found" });
    res.send(movie).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createMovie = async (req, res) => {
  try {
    const imageData = {
      name: req.file.filename,
      contentType: req.file.mimetype,
      path: req.file.path,
    };
    const { title, description } = req.body;

    const rating = parseInt(req.body.rating);
    const length = parseInt(req.body.length);
    const releasedYear = parseInt(req.body.releasedYear);
    // const numberInStock = parseInt(req.body.numberInStock);
    const trailerLink = req.body.trailerLink;
    const price = req.body.price;

    const imageSchmea = new Image(imageData);
    await imageSchmea.save();

    const lang = await Language.find({ language: req.body.language });
    if (lang.length === 0)
      return res.status(401).json({ message: "Select at least one Language" });

    const genre = await Genre.find({ name: req.body.genre });
    if (genre.length === 0)
      return res.status(401).json({ message: "Select at least one genre" });

    const actor = await Actor.find({ name: req.body.actor });
    if (actor.length === 0) {
      return res.status(401).json({ message: "Select at least one actor" });
    }

    const schema = new Movie({
      title,
      description,
      rating,
      language: lang,
      length,
      releasedYear,
      // numberInStock,
      price,
      genre,
      image: imageData,
      trailerLink,
      actor,
    });
    const movie = await schema.save();
    res.status(201).json(movie);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.updateMovie = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };

  const { title, description } = req.body;

  const rating = parseInt(req.body.rating);
  const length = parseInt(req.body.length);
  const releasedYear = parseInt(req.body.releasedYear);

  // const numberInStock = parseInt(req.body.numberInStock);
  const price = req.body.price;
  const trailerLink = req.body.trailerLink;

  const lang = await Language.find({ language: req.body.language });
  if (lang.length === 0)
    return res.status(401).json({ message: "Select at least one Language" });

  const genre = await Genre.find({ name: req.body.genre });
  if (genre.length === 0)
    return res.status(401).json({ message: "Select at least one genre" });

  const actor = await Actor.find({ name: req.body.actor });

  if (actor.length === 0) {
    return res.status(401).json({ message: "Select at least one actor" });
  }
  try {
    const oldMovie = await Movie.findById(id);
    const imageData = req.file
      ? {
          name: req.file.filename,
          contentType: req.file.mimetype,
          path: req.file.path,
        }
      : oldMovie.image;
    const updatedMovie = await Movie.findOneAndUpdate(
      filter,
      {
        $set: {
          title,
          description,
          language: lang,
          rating,
          length,
          releasedYear,
          // numberInStock,
          price,
          genre,
          image: imageData,
          trailerLink,
          actor,
        },
      },
      {
        new: true,
      }
    );
    // await Rental.updateMany(
    //   { "movie._id": id },
    //   {
    //     "movie.title": title,
    //     "movie.genre": genre,
    //     "movie.price": price,
    //   }
    // );

    res.status(200).json(updatedMovie);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteMovie = async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: "Movie Not Found!" });
    const rentalMovie = await Rental.find({ "movie._id": movie._id });
    if (rentalMovie.length !== 0)
      return res
        .status(409)
        .json({ message: "Action cannot be performed due to dependencies" });
    await Image.findOneAndDelete({ name: movie.image.name });
    await Movie.deleteOne(movie);
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getPopularMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ rating: 5 });

    let newMovies = [];
    for (let i = 0; i <= 4; i++) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      if (!newMovies.includes(movies[randomIndex]))
        newMovies.push(movies[randomIndex]);
    }

    return res.json({ movies: newMovies });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getNewReleasedMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releasedYear: -1 }).limit(5);

    return res.json({ movies });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getRandomMovie = async (req, res) => {
  try {
    const count = await Movie.countDocuments();
    const random = Math.floor(Math.random() * count);
    const randomMovie = await Movie.findOne().skip(random);
    return res.json({ movie: randomMovie });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
