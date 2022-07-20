const db = require('../config/db')

class SellLog {

    constructor(coin, coin_amount, amount_add, wallet_id) {
        this.coin = coin
        this.coin_amount = coin_amount
        this.amount_add = amount_add
        this.wallet_id = wallet_id

    }

    save() {

        let sql = `
        INSERT INTO sell_log(
            coin,
            coin_amount, 
            amount_add,
            wallet_id

        )
        VALUES(
            '${this.coin}', 
            '${this.coin_amount}', 
            '${this.amount_add}',
            '${this.wallet_id}'
            )`

        return db.execute(sql)
    }

    static findAll(userId) {
        let sql = `SELECT * FROM sell_log WHERE Wallet_id=(SELECT wallet_id FROM Crypto_wallet WHERE IBAN_no=(SELECT IBAN_no FROM bank_account WHERE Customer_id=${userId}))`

        return db.execute(sql)

    }
}

module.exports = SellLog