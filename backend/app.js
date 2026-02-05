const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./src/routes/user.routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.json({ success: true, message: "API running" });
});

app.use("/api/users", userRoutes);

module.exports = app;
