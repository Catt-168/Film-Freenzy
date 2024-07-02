const Actor = require("../models/actor");

exports.getActors = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.json(actors).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createActor = async (req, res) => {
  const actor = new Actor({
    name: req.body.name,
  });

  try {
    const actors = await Actor.find();

    const isOldActorExist = actors.filter(
      (item) => item.name === req.body.name
    );

    if (isOldActorExist.length !== 0)
      return res.status(409).json({ message: "Actor Already Exists!" });
    const newActor = await actor.save();
    res.status(201).json(newActor);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
