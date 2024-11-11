// const express = require("express");

// const router = express.Router();

// const {
//   authenticate,
//   authenticateCallBack,
// } = require("../controller/authController");

// router.route("/google").get(authenticate);
// router.route("/google/callback").get(authenticateCallBack);
// module.exports = router;
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/google/url", authController.getAuthUrl);
router.get("/google/callback", authController.googleCallback);
router.get("/status", authController.checkAuth);
router.post("/logout", authController.logout);

module.exports = router;
