const db = require('../config/db')

class TransferLog {

    constructor(transferee_iban, transferor_iban, amount, userId) {
        this.transferee_iban = transferee_iban
        this.transferor_iban = transferor_iban
        this.userId = userId
        this.amount = amount
    }
    save() {
        let sql = `
        INSERT INTO transfer_log(
            transferee_iban,
            transferor_iban, 
            amount,
            userId
        )
        VALUES(
            '${this.transferee_iban}', 
            '${this.transferor_iban}', 
            '${this.amount}',
            '${this.userId}'
            )`

        return db.execute(sql)
    }

    static findTransferLogById(userID) {
        let sql = `CALL get_transfer_log_by_user_id(${userID});`

        return db.execute(sql)

    }
}

module.exports = TransferLog