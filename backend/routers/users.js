const express = require("express");
const userController = require("../controllers/users");

const router = express.Router();

router.get("/:id", userController.getUserDetail);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);

module.exports = router;
