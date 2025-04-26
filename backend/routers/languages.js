const express = require("express");
const languageController = require("../controllers/language");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

router.put("/:id", adminAuth, languageController.updateLanguage);
router.delete("/:id", adminAuth, languageController.deleteLanguage);
router.get("/:id", adminAuth, languageController.getLanguageDetails);
router.get("/", adminAuth, languageController.getAllLanguages);
router.post("/", adminAuth, languageController.createLanguage);

module.exports = router;
