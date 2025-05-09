const express = require("express");
const DegreeController = require("../controllers/degreeController");

const router = express.Router();

router.get("/", DegreeController.getDegrees);

router.get("/:id", DegreeController.getDegreeDetail);

router.put("/:id", DegreeController.UpdateDegree)
router.post("/", DegreeController.upload, DegreeController.createDegree);


module.exports = router;
