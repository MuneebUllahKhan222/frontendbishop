const db = require('../config/db')

class Account {
    // constructor(username,name,email,password,phone_number){
    //     this.username = username
    //     this.name = name
    //     this.email = email
    //     this.password = password
    //     this.phone_number = phone_number

    // }

    constructor(iban, balance, userId, pincode) {
        this.iban = iban
        this.balance = balance
        this.userId = userId
        this.pinCode = pincode



    }

    save() {

        let sql = `
        INSERT INTO bank_account(
            IBAN_no,
            Balance, 
            customer_id,
            pin_code

        )
        VALUES(
            '${this.iban}', 
            '${this.amount}', 
            '${this.userId}',
            '${this.pinCode}'
            )`

        return db.execute(sql)
    }

    static findAll() {
        let sql = `SELECT * FROM bank_account`

        return db.execute(sql)

    }


    static findByIBan(iban) {
        let sql = `SELECT IBAN_no FROM bank_account WHERE IBAN_no='${iban}'`

        return db.execute(sql)
    }

    // static findByIBan(id) {
    //     let sql = `SELECT IBAN_no FROM bank_account WHERE customer_id='${id}'`

    //     return db.execute(sql)
    // }

    static findByUserId(userID) {
        let sql = `SELECT * FROM bank_account WHERE customer_id='${userID}'`

        return db.execute(sql)
    }

    static checkBalance(userID) {
        let sql = `SELECT balance FROM bank_account WHERE customer_id='${userID}'`

        return db.execute(sql)
    }
    static updateAccount(userid, iban_no, balance, pin_code) {
        let sql = `UPDATE bank_account SET IBAN_no = ${iban_no}, balance=${balance}, pin_code = ${pin_code} WHERE customer_id=${userid} `

        return db.execute(sql)
    }

    static findAccountDetail(userid) {
        let sql = `SELECT c.Username, ba.IBAN_no, ba.Pin_Code, ba.Balance , d.Wallet_Id
    FROM customer c 
    JOIN bank_account ba
     ON c.Customer_Id = ba.Customer_Id
    JOIN crypto_wallet d
    ON c.Customer_Id=d.Customer_Id
    WHERE c.customer_id = ${userid}`

        return db.execute(sql)
    }

    // static findAccountDetialByIban(iban_no) {
    //     let sql = `SELECT ba.IBAN_no, c.Email, c.Username 
    // FROM bank_account ba 
    // JOIN customer c 
    //     ON c.Customer_Id=ba.Customer_Id
    // WHERE ba.IBAN_no = ${iban_no}`

    //     return db.execute(sql)
    // }

    static findAccountDetialByIban(iban_no) {
        let sql = `SELECT ba.IBAN_no, c.Email, c.Username
    FROM bank_account ba 
    JOIN customer c 
    ON c.Customer_Id=ba.Customer_Id
    WHERE ba.IBAN_no = ${iban_no}`

        return db.execute(sql)
    }

    static transferAmount(user_id, IBAN, amount) {
        let sql = `CALL bank_transfer_customer_to_iban(${user_id},${IBAN},${amount});`

        return db.execute(sql)
    }

    // static deposit(userID){
    //     let sql = `UPDATE '`

    //     return db.execute(sql)
    // }

}

module.exports = Account