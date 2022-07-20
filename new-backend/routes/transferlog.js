const express = require("express")
const transferLogController  = require("../controllers/transferlog.controller")
const verifyJwt = require("../middlewares/auth").verifyJwt

const router = express.Router()

router.get("/allLogs", verifyJwt, transferLogController.allTransferLogGet)



module.exports = router