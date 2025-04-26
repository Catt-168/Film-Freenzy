const express = require("express");
const dashboardController = require("../controllers/dashboard");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");

router.get("/getPieChartData", adminAuth, dashboardController.getPieChartData);
router.get(
  "/getBarChartData/:count",
  adminAuth,
  dashboardController.getBarChartData
);
router.get(
  "/getMoviesByReleaseDate",
  adminAuth,
  dashboardController.getMoviesByReleaseDate
);
router.get(
  "/getHighestPurchasedUsers/:count",
  adminAuth,
  dashboardController.getHighestPurchasedUsers
);

module.exports = router;
