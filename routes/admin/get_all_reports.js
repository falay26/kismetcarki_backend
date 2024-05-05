const express = require("express");
const router = express.Router();
const reportsController = require("../../controllers/reportsController");

router.post("/", reportsController.getAllReports);

module.exports = router;
