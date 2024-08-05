const express = require("express");
const dashboardController = require("../controllers/dashboard");
const router = express.Router();

router.get("/getPieChartData", dashboardController.getPieChartData);
router.get("/getBarChartData", dashboardController.getBarChartData);

module.exports = router;
