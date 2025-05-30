const express = require("express");
var router = express.Router();
const controller = require("../controllers/blacklist");

router
  .route("/")
  .post(controller.addUrlToBlacklist)
  .delete(controller.deleteUrlFromBlacklist);

module.exports = router;
