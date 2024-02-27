const express = require("express");
const router = express.Router();
const photosController = require("../../controllers/photosController");

router.post("/", photosController.getAllPhotos);

module.exports = router;
