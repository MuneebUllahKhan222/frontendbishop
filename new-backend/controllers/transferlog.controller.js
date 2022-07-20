const TransferLog = require("../models/TransferLog")

const allTransferLogGet = async (req, res) =>{
    const userId = req.userId 
    const [allTransferLog, _] = await TransferLog.findTransferLogById(userId) 
    res.status(200).json(allTransferLog[0])

}

module.exports = {
    allTransferLogGet: allTransferLogGet
}