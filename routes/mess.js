const express = require("express")
const MessController = require("../controllers/mess")

const Router4 = express.Router()

Router4.get("/:idRoom", MessController.getMessOfRoom)

module.exports = Router4