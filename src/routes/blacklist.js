const express = require("express");
var router = express.Router();
const controller = require("../controllers/blacklist");

router.route("/").post(controller.addUrlToBlacklist);

module.exports = router;
