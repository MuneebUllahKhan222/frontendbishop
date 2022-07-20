const BuyLog = require("../models/BuyLog")

const getAllBuyLog = async (req, res) =>{
    const userId = req.userId 
    const [allBuyLog, _] = await BuyLog.findAll(userId)
    res.status(200).json(allBuyLog)

}

module.exports = {
    getAllBuyLog: getAllBuyLog
}