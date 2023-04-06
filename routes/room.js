const express = require("express")
const authController = require("../controllers/auth")
const roomController = require("../controllers/room")

const Router3 = express.Router()

Router3.get("/getdataRoom/:id", roomController.getdataRoom)
Router3.get("/getRoom", authController.verifyToken, roomController.getRoomOnly)

module.exports = Router3