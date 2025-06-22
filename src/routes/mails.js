const express = require("express");
var router = express.Router();
const controller = require("../controllers/mails");

router.route("/").get(controller.getFiftyMails).post(controller.addMail);

router.route("/draft")
  .post(controller.createNewDraft);
  
router
  .route("/:id")
  .delete(controller.deleteMailById)
  .get(controller.getMailById)
  .patch(controller.patchMail);

router.route("/search/:query").get(controller.searchMails);

module.exports = router;
