const express = require("express")
const walletController  = require("../controllers/wallet.controller")
const verifyJwt = require("../middlewares/auth").verifyJwt


const router = express.Router()

router.get("/",verifyJwt,  walletController.getWalletDetails)

router.post("/buy",verifyJwt,  walletController.walletBuy)
router.post("/sell",verifyJwt,  walletController.walletSell)



module.exports = router