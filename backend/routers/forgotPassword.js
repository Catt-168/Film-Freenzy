const express = require("express");
const forgotPasswordController = require("../controllers/forgotPassword");
const router = express.Router();

router.post("/:email", forgotPasswordController.resetPassword);
router.post("/", forgotPasswordController.createForgotPassword);
router.get("/", forgotPasswordController.getForgotPasswordList);

module.exports = router;
