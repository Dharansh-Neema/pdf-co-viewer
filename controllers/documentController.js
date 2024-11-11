const s3 = require("../config/aws");
const Document = require("../models/Document");

const documentController = {
  async uploadDocument(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send("Admin only");
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `pdfs/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
    };

    try {
      const s3Upload = await s3.upload(params).promise();
      const document = await Document.create({
        fileName: req.file.originalname,
        s3Url: s3Upload.Location,
        uploadedBy: req.user.userId,
      });
      res.json({ documentId: document._id });
    } catch (error) {
      res.status(500).send("Upload failed");
    }
  },

  async getDocuments(req, res) {
    try {
      const documents = await Document.find().populate("uploadedBy", "email");
      res.json(documents);
    } catch (error) {
      res.status(500).send("Failed to fetch documents");
    }
  },
};

module.exports = documentController;
