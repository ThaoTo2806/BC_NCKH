const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const degreeRoutes = require("./routes/degreeRoutes");
const timeRoutes = require("./routes/timeRoutes");
const qrRoutes = require("./routes/qrRoutes");
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/degrees", degreeRoutes);

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/time", timeRoutes);
app.use("/api/v1/QR", qrRoutes );
module.exports = app;
