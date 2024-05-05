const express = require("express");
const router = express.Router();
const supportsController = require("../../controllers/supportsController");

router.post("/", supportsController.getAllSupports);

module.exports = router;
