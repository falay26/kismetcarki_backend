const express = require("express");
const router = express.Router();
const photosController = require("../../controllers/photosController");

router.post("/", photosController.deletePhoto);

module.exports = router;
