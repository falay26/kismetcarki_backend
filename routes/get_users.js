const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router.post("/", usersController.getUsers);

module.exports = router;
