const express = require("express");
var router = express.Router();
const controller = require("../controllers/labels");

router.route("/").get(controller.getAllLabels);

module.exports = router;
