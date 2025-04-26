const express = require("express");
const genreController = require("../controllers/genre");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

router.put("/:id", adminAuth, genreController.updateGenre);
router.delete("/:id", adminAuth, genreController.deleteGenre);
router.get("/:id", adminAuth, genreController.getGenreDetails);
router.get("/", adminAuth, genreController.getAllGenres);
router.post("/", adminAuth, genreController.createGenre);

module.exports = router;
