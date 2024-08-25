const Actor = require("../models/actor");
const Movie = require("../models/movie");

exports.getActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createActor = async (req, res) => {
  const imageData = req.file
    ? {
        name: req.file.filename,
        contentType: req.file.mimetype,
        path: req.file.path,
      }
    : null;
  const actor = new Actor({
    name: req.body.name,
    image: imageData,
  });

  try {
    const actors = await Actor.find();

    const isOldActorExist = actors.filter(
      (item) => item.name.toLowerCase() === req.body.name.toLowerCase()
    );

    if (isOldActorExist.length !== 0)
      return res.status(409).json({ message: "Actor Already Exists!" });
    const newActor = await actor.save();
    res.status(201).json(newActor);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.updateActor = async (req, res) => {
  const { id } = req.params;
  const filter = { _id: id };

  const { name } = req.body;
  try {
    const oldActor = await Actor.findById(id);
    const imageData = req.file
      ? {
          name: req.file.filename,
          contentType: req.file.mimetype,
          path: req.file.path,
        }
      : oldActor.image;
    // console.log(imageData);
    const updateActor = await Actor.findOneAndUpdate(
      filter,
      {
        $set: {
          name,
          image: imageData,
        },
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateActor);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteActor = async (req, res) => {
  const { id } = req.params;

  try {
    const actor = await Actor.findById(id);
    if (!actor) return res.status(404).json({ message: "Actor Not Found!" });

    const movie = await Movie.find({
      "actor.name": new RegExp(actor.name, "i"),
    });

    if (movie.length !== 0) {
      return res
        .status(409)
        .json({
          message: "Actors who exist in current movies can not be deleted",
        });
    }
    await Actor.deleteOne(actor);
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
