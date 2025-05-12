const express = require("express");
const route = express.Router();
const degreeService = require("../services/degreeService");
const degreeController = require("../controllers/degreeDetailController");
const SECRET_KEY  = process.env.JWT_SECRET;
const pool = require("../config/database_pool");
route.get("/:id", degreeController.getDegreeDetail);


module.exports = route;
