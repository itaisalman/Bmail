const express = require("express");
const multer = require("multer");
const path = require("path");
var router = express.Router();
const controller = require("../controllers/users");
const middleware = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Sets the destination folder for uploading files
    cb(null, path.join(__dirname, "../../data/upload"));
  },
  filename: function (req, file, cb) {
    // Keep the original file extension
    const ext = path.extname(file.originalname);
    // Generate a unique name for the image to avoid files with duplicate names
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

router.route("/").post(upload.single("image"), controller.createUser);
router.route("/").get(middleware.isLoggedIn, controller.getUserById);

router.route("/:id").get(controller.getUserById);

module.exports = router;
