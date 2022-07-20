const express = require("express")
const sellLogController  = require("../controllers/sellLog.controller")
const verifyJwt = require("../middlewares/auth").verifyJwt

const router = express.Router()

router.get("/allLogs", verifyJwt, sellLogController.getAllSellLog)



module.exports = router