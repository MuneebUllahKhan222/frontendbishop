const express = require("express")
const buyLogController  = require("../controllers/buylog.controller")
const verifyJwt = require("../middlewares/auth").verifyJwt

const router = express.Router()

router.get("/allLogs", verifyJwt, buyLogController.getAllBuyLog)



module.exports = router