const express = require("express");
const dashboardController = require("../controllers/dashboard");
const router = express.Router();

router.get("/getPieChartData", dashboardController.getPieChartData);

module.exports = router;
