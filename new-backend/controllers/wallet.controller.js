const Wallet = require("../models/Wallet")

const getWalletDetails = async (req, res) => {
    const userId = req.userId
    const [walletDetails, _] = await Wallet.findWalletById(userId)
    res.status(200).json(walletDetails)

}

const walletBuy = async (req, res) => {
    const coinAmount = req.body.coin_amount
    const amount = req.body.amount
    const coinName = req.body.coin_name


    const userId = req.userId

    console.log(coinAmount, amount, coinName, userId)

    switch (coinName) {
        case "BTC":
            const [boughtCoin1, _1] = await Wallet.buyBTC(userId, coinAmount, amount)
            console.log(boughtCoin1)

            if (boughtCoin1[0][0]['`rows_affected`'] == 2) {
                res.status(200).json({ "success": `You bought ${coinAmount} BTC at ${amount}` })
            } else {
                res.status(400).json({ error: "Something Went Wrong" })
            }
            break;
        case "ETH":
            const [boughtCoin2, _2] = await Wallet.buyETH(userId, coinAmount, amount)
            console.log(boughtCoin2)

            if (boughtCoin2[0][0]['`rows_affected`'] == 2) {
                res.status(200).json({ "success": `You bought ${coinAmount} ETH at ${amount}` })
            } else {
                res.status(400).json({ error: "Something Went Wrong" })
            }
            break;
        case "DGC":
            const [boughtCoin3, _3] = await Wallet.buyETH(userId, coinAmount, amount)
            console.log(boughtCoin3)

            if (boughtCoin3[0][0]['`rows_affected`'] == 2) {
                res.status(200).json({ "success": `You bought ${coinAmount} DGC at ${amount}` })
            } else {
                res.status(400).json({ error: "Something Went Wrong" })
            }
            break;
        default:
            res.status(400).json({ error: "Coin not exists" })
        // code block
    }

}


const walletSell = async (req, res) => {
    const coinAmount = req.body.coin_amount
    const amount = req.body.amount
    const coinName = req.body.coin_name


    const userId = req.userId

    console.log(coinAmount, amount, coinName, userId)

    switch (coinName) {
        case "BTC":
            const [boughtCoin1, _1] = await Wallet.sellBTC(userId, coinAmount, amount)
            console.log(boughtCoin1)

            if (boughtCoin1[0][0]['`rows_affected`'] == 2) {
                res.status(200).json({ "success": `You sold ${coinAmount} BTC at ${amount}` })
            } else {
                res.status(400).json({ error: "Something Went Wrong" })
            }
            break;
        case "ETH":
            const [boughtCoin2, _2] = await Wallet.sellETH(userId, coinAmount, amount)
            console.log(boughtCoin2)

            if (boughtCoin2[0][0]['`rows_affected`'] == 2) {
                res.status(200).json({ "success": `You sold ${coinAmount} ETH at ${amount}` })
            } else {
                res.status(400).json({ error: "Something Went Wrong" })
            }
            break;
        case "DGC":
            const [boughtCoin3, _3] = await Wallet.sellDGC(userId, coinAmount, amount)
            console.log(boughtCoin3)

            if (boughtCoin3[0][0]['`rows_affected`'] == 2) {
                res.status(200).json({ "success": `You sold ${coinAmount} DGC at ${amount}` })
            } else {
                res.status(400).json({ error: "Something Went Wrong" })
            }
            break;
        default:
            res.status(400).json({ error: "Coin not exists" })
        // code block
    }
}

module.exports = {
    getWalletDetails: getWalletDetails,
    walletBuy: walletBuy,
    walletSell: walletSell
}