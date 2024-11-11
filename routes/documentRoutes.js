const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const documentController = require("../controllers/documentController");
const authenticateToken = require("../middleware/auth");

router.post(
  "/upload",
  authenticateToken,
  upload.single("pdf"),
  documentController.uploadDocument
);
router.get("/", authenticateToken, documentController.getDocuments);

module.exports = router;
