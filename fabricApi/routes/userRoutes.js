const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.post("/create-pin", userController.createPin);
router.get("/get-pin", userController.getPin);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserDetail);
router.post("/reset-password", userController.resetPassword);

router.post("/change-password", userController.changePassword);
router.get("/degrees/:id", userController.getDegreesByUser);

module.exports = router;
