const db = require('../config/db')

class Account{
    // constructor(username,name,email,password,phone_number){
    //     this.username = username
    //     this.name = name
    //     this.email = email
    //     this.password = password
    //     this.phone_number = phone_number

    // }

    constructor(iban,amount,userId){
        this.iban = iban
        this.amount = amount
        this.userId = userId



    }

    save(){

        let sql = `
        INSERT INTO Account(
            iban,
            amount, 
            userId

        )
        VALUES(
            '${this.iban}', 
            '${this.amount}', 
            '${this.userId}'

            )`

        return db.execute(sql)
    }

    static findAll(){
        let sql = `SELECT * FROM Account`

        return db.execute(sql)

    }


    static findById(id){
        let sql = `SELECT * FROM Account WHERE id='${id}'`

        return db.execute(sql)
    }

    static findByUserId(userID){
        let sql = `SELECT * FROM Account WHERE userID='${userID}'`

        return db.execute(sql)
    }

    static checkAmount(userID){
        let sql = `SELECT amount FROM Account WHERE userID='${userID}'`

        return db.execute(sql)
    }
    // static deposit(userID){
    //     let sql = `UPDATE '`

    //     return db.execute(sql)
    // }

}

module.exports = Account