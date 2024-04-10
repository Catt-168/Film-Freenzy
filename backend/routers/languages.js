const express = require("express");
const languageController = require("../controllers/language");
const router = express.Router();

router.put("/:id", languageController.updateLanguage);
router.delete("/:id", languageController.deleteLanguage);
router.get("/:id", languageController.getLanguageDetails);
router.get("/", languageController.getAllLanguages);
router.post("/", languageController.createLanguage);

module.exports = router;
