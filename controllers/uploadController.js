// S3 upload route, protected by authentication check
const AWS = require("aws-sdk");
require("dotenv").config();
const s3 = require("../config/s3");
const PDF = require("../models/PDF");
exports.upload = (req, res) => {
  if (!req.files || !req.files.pdf) {
    return res.status(400).send("No PDF file uploaded");
  }

  const file = req.files.pdf;
  console.log("Uploaded file:", file);
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.name}`,
    Body: file.data,
    ContentType: file.mimetype,
  };

  s3.upload(uploadParams, async (err, data) => {
    if (err) return res.status(500).send(err);

    // Store PDF metadata in MongoDB
    const newPDF = new PDF({
      title: file.name,
      url: data.Location,
      owner: req.user.id,
    });
    await newPDF.save();

    res.send({ url: data.Location });
  });
};
