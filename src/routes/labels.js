const express = require("express");
var router = express.Router();
const controller = require("../controllers/labels");

router.route("/").get(controller.getAllUserLabels).post(controller.createLabel);

router
  .route("/:id")
  .get(controller.getLabelById)
  .patch(controller.updateLabel)
  .delete(controller.deleteLabel);

router
  .route("/mail/:mail_id")
  .get(controller.getMailLabels)
  .delete(controller.removeMailFromLabel);

router.route("/:mail_id/assign-label").patch(controller.assignMailToLabel);

module.exports = router;
