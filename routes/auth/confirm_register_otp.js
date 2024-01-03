const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/registerController");

router.post("/", registerController.confirmRegisterOtp);

module.exports = router;
