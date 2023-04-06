const express = require("express")
const authController = require("../controllers/auth")
const AwaitAddController = require("../controllers/awaitAdd")
const Router2 = express.Router()

Router2.get("/",authController.verifyToken, AwaitAddController.getListOfUser )

module.exports = Router2