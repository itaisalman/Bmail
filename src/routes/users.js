const express = require("express");
var router = express.Router();
const controller = require("../controllers/users");

router.route("/").post(controller.createUser);

router.route("/:id").get(controller.getUserById);

module.exports = router;
