const express = require("express");
const genreController = require("../controllers/genre");
const router = express.Router();

router.put("/:id", genreController.updateGenre);
router.delete("/:id", genreController.deleteGenre);
router.get("/:id", genreController.getGenreDetails);
router.get("/", genreController.getAllGenres);
router.post("/", genreController.createGenre);

module.exports = router;
