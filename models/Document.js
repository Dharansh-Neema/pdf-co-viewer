const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  s3Url: {
    type: String,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Document", documentSchema);
