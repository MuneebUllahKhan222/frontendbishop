const express = require("express")
const userController  = require("../controllers/user.controller")

const router = express.Router()

router.get("/signin", userController.loginGet)
router.post("/signin", userController.loginPost)

router.post("/register", userController.register)

module.exports = router