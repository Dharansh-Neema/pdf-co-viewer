require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const initializeSocket = require("./config/socket");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Connect to Database
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Initialize Socket.io
initializeSocket(server);
