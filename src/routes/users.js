const express = require("express");
var router = express.Router();
const controller = require("../controllers/users");

router.route("/").post(controller.createUser);

module.exports = router;
