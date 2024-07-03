const Language = require("../models/language");
const Movie = require("../models/movie");

exports.getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.json(languages).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.getLanguageDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const language = await Language.findById(id);
    if (!language) return res.status(404).json({ message: "Not Found" });
    res.send(language).status(200);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.createLanguage = async (req, res) => {
  const language = new Language({
    language: req.body.language,
  });
  try {
    const languages = await Language.find();

    const isOldLanguageExist = languages.filter(
      (item) => item.language.toLowerCase() === req.body.language.toLowerCase()
    );

    if (isOldLanguageExist.length !== 0)
      return res.status(409).json({ message: "Language Already Exists!" });
    const newLanguage = await language.save();
    res.status(201).json(newLanguage);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.updateLanguage = async (req, res) => {
  const { id } = req.params;
  const { language } = req.body;
  const filter = { _id: id };
  const update = {
    language,
  };
  try {
    const movie = await Movie.find({ "language._id": id });
    if (movie.length !== 0)
      return res.status(409).json({ message: "Can not edit" });
    const updatedLanguage = await Language.findOneAndUpdate(filter, update, {
      new: true,
    });

    res.status(200).json(updatedLanguage);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.deleteLanguage = async (req, res) => {
  const { id } = req.params;

  try {
    const language = await Language.findById(id);
    if (!language)
      return res.status(404).json({ message: "Language Not Found!" });

    const movie = await Movie.find({ language: language });
    if (movie.length !== 0) {
      return res
        .status(409)
        .json({ message: "Action cannot be performed due to dependencies" });
    }
    await Language.deleteOne(language);
    res.status(204).json({ message: "Successfully Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
