const express = require("express")
const authController = require("../controllers/auth")
const Router1 = express.Router()

Router1.post("/register", authController.registerUser)
Router1.post("/login", authController.loginUser)
Router1.get("/", authController.verifyToken , authController.getListFr)
Router1.get("/search?",authController.getUser)

module.exports = Router1