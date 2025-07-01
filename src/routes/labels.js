const express = require("express");
var router = express.Router();
const controller = require("../controllers/labels");

router.route("/").get(controller.getAllLabels).post(controller.createLabel);

router
  .route("/:id")
  .get(controller.getLabelById)
  .patch(controller.updateLabel)
  .delete(controller.deleteLabel);

  router.route("/mail/:mail_id").get(controller.getMailLabels).delete(controller.removeMailFromLabel);

module.exports = router;
