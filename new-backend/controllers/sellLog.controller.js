const SellLog = require("../models/SellLog")

const getAllSellLog = async (req, res) =>{
    const userId = req.userId 
    const [allSellLog, _] = await SellLog.findAll(userId)
    res.status(200).json(allSellLog)

}

module.exports = {
    getAllSellLog: getAllSellLog
}