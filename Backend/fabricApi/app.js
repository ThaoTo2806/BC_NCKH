const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
//app.use(cors());
app.use(cors({
    origin: 'http://blockchain.onlineai.vn',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // nếu có sử dụng cookies/token
  }));
const testRoutes = require("./routes/testRoutes.js");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const degreeRoutes = require("./routes/degreeRoutes");
const timeRoutes = require("./routes/timeRoutes");
const qrRoutes = require("./routes/qrRoutes");
const degreeDetailRoutes = require("./routes/degreeDetailRoutes");
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views'); 
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/degrees", degreeRoutes);
app.use("/degrees", degreeDetailRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/time", timeRoutes);
app.use("/api/v1/QR", qrRoutes );
app.use('/api/v1/test', testRoutes);
module.exports = app;
