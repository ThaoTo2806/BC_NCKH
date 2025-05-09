const express = require("express");
const router = express.Router();
const timeController = require("../controllers/timeController");

// Định tuyến GET /api/time
router.get("/getTime", timeController.getTime);

module.exports = router;
