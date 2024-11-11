const express = require("express");
const router = express.Router();
const { upload } = require("../controller/uploadController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
router.route("/upload").post(upload, ensureAuthenticated);

module.exports = router;
