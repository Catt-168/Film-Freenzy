const express = require("express");
const userController = require("../controllers/users");
const multer = require("multer");
const adminAuth = require("../middleware/adminAuth");
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

router.get("/:id", auth, userController.getUserDetail);
router.put("/:id", upload.single("file"), userController.updateUser);
router.delete("/:id", adminAuth, userController.deleteUser);
router.get("/", adminAuth, userController.getAllUsers);
router.post("/", upload.single("file"), userController.createUser);

module.exports = router;
