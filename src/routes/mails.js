const express = require("express");
var router = express.Router();
const controller = require("../controllers/mails");

router.route("/").get(controller.getFiftyMails).post(controller.addMail);

router.route("/trash").delete(controller.emptyTrash);

router.route("/draft").post(controller.createNewDraft);

router
  .route("/draft/:id")
  .get(controller.getDraftById)
  .delete(controller.deleteDraftById);

router.route("/spam/:id").post(controller.moveMailToSpam);

router
  .route("/:id")
  .delete(controller.deleteMailById)
  .get(controller.getMailById)
  .patch(controller.patchMail);

router.route("/search/:query").get(controller.searchMails);

router.route("/star/:id").patch(controller.toggleMailStar);
router.route("/important/:id").patch(controller.toggleMailImportant);
router.route("/:id/assign-label").patch(controller.assignLabelToMail);

module.exports = router;
