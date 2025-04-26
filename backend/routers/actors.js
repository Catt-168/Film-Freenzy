const express = require("express");
const actorController = require("../controllers/actors");
const multer = require("multer");
const adminAuth = require("../middleware/adminAuth");

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

router.get("/", adminAuth, actorController.getActors);
router.post("/", upload.single("file"), actorController.createActor);
router.put("/:id", upload.single("file"), actorController.updateActor);
router.delete("/:id", adminAuth, actorController.deleteActor);

module.exports = router;
