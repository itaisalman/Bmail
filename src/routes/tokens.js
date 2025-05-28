const express = require("express");
var router = express.Router();
const controller = require("../controllers/tokens");

router.route("/").post(controller.returnUserId);

module.exports = router;
