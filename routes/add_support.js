const express = require("express");
const router = express.Router();
const supportsController = require("../controllers/supportsController");

router.post("/", supportsController.addSupport);

module.exports = router;
