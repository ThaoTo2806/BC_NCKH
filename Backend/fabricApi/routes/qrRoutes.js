const express= require("express");
const router = express.Router();
const qrController = require("../controllers/qrController");

router.get("/generate-qr" ,qrController.qrGenerate);

router.post("/verify-qr" , qrController.verifyQR);

module.exports = router;
