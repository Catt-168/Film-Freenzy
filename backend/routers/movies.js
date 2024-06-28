const express = require("express");
const multer = require("multer");
const moviesController = require("../controllers/movies");
const auth = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend3/public/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.put("/:id", upload.single("file"), moviesController.updateMovie);
router.delete("/:id", moviesController.deleteMovie);
router.get("/:id", moviesController.getMovieDetails);
router.get("/", moviesController.getAllMovies);
router.post("/", upload.single("file"), moviesController.createMovie);

module.exports = router;
