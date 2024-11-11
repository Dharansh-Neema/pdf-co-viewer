const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  title: String,
  url: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  currentPage: { type: Number, default: 1 },
});

module.exports = mongoose.model("PDF", pdfSchema);
