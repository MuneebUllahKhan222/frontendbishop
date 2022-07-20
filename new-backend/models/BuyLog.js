const db = require('../config/db')

class BuyLog {

    constructor(coin, coin_amount, amount_deduct, wallet_id) {
        this.coin = coin
        this.coin_amount = coin_amount
        this.amount_add = amount_deduct
        this.wallet_id = wallet_id

    }

    save() {

        let sql = `
        INSERT INTO buy_log(
            coin,
            coin_amount, 
            amount_deduct,
            wallet_id

        )
        VALUES(
            '${this.coin}', 
            '${this.coin_amount}', 
            '${this.amount_deduct}',
            '${this.wallet_id}'
            )`

        return db.execute(sql)
    }

    static findAll(userId) {
        let sql = `SELECT * FROM buy_log WHERE Wallet_id=(SELECT wallet_id FROM Crypto_wallet WHERE IBAN_no=(SELECT IBAN_no FROM bank_account WHERE Customer_id=${userId}))`

        return db.execute(sql)

    }
}

module.exports = BuyLog