const express = require("express")
const accountController  = require("../controllers/account.controller")
const verifyJwt = require("../middlewares/auth").verifyJwt

const router = express.Router()

router.post("/addInfo", verifyJwt, accountController.accountInfo)
router.get("/", verifyJwt, accountController.accountInfoGet)

router.post("/transferAmount", verifyJwt, accountController.transferAmount)



module.exports = router