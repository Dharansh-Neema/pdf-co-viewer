// MongoDB connection
const mongoose = require("mongoose");
const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then("MongoDB connected successfully")
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });
};
module.exports = connectDb;
