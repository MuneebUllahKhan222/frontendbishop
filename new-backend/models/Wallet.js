const db = require('../config/db')

class CryptoWallet {

    constructor(iban, BTC, ETH, DGC) {
        this.iban = iban
        this.BTC = BTC
        this.ETH = ETH
        this.DGC = DGC
    }

    save() {

        let sql = `
        INSERT INTO crypto_wallet(
            IBAN_no,
            BTC, 
            ETH,
            DGC

        )
        VALUES(
            '${this.iban}', 
            '${this.BTC}', 
            '${this.ETH}',
            '${this.DGC}'
            )`

        return db.execute(sql)
    }

    static findWalletById(userId) {
        let sql = `SELECT * FROM crypto_wallet WHERE IBAN_no=(SELECT IBAN_no FROM bank_account WHERE customer_id=${userId})`

        return db.execute(sql)

    }

    static buyBTC(userId, crypto_amount, amount) {
        let sql = `CALL buy_crypto_btc_userid(${userId},${crypto_amount},${amount});`

        return db.execute(sql)

    }

    static buyETH(userId, crypto_amount, amount) {
        let sql = `CALL buy_crypto_eth_userid(${userId},${crypto_amount},${amount});`

        return db.execute(sql)

    } 

    static buyDGC(userId, crypto_amount, amount) {
        let sql = `CALL buy_crypto_dgc_userid(${userId},${crypto_amount},${amount});`

        return db.execute(sql)

    }

    static sellBTC(userId, crypto_amount, amount) {
        let sql = `CALL sell_crypto_btc_userid(${userId},${crypto_amount},${amount});`

        return db.execute(sql)

    }
    static sellETH(userId, crypto_amount, amount) {
        let sql = `CALL sell_crypto_eth_userid(${userId},${crypto_amount},${amount});`

        return db.execute(sql)

    }
    static sellDGC(userId, crypto_amount, amount) {
        let sql = `CALL sell_crypto_dgc_userid(${userId},${crypto_amount},${amount});`

        return db.execute(sql)

    }
}
module.exports = CryptoWallet