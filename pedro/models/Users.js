const db = require('../config/db')

class Users{
    // constructor(username,name,email,password,phone_number){
    //     this.username = username
    //     this.name = name
    //     this.email = email
    //     this.password = password
    //     this.phone_number = phone_number

    // }

    constructor(username,email,password,address){
        this.username = username
        this.email = email
        this.password = password
        this.address = address

    }

    save(){

        let sql = `
        INSERT INTO Customer(
            UserName, 
            Password, 
            Address,
            Email
        )
        VALUES(
            '${this.username}', 
            '${this.password}', 
            '${this.address}', 
            '${this.email}'
            )`

        return db.execute(sql)
    }

    static findAll(){
        let sql = `SELECT * FROM users`

        return db.execute(sql)

    }

    static findByEmail(email){
        let sql = `SELECT * FROM Customer WHERE email='${email}'`

        return db.execute(sql)
    }

    static findById(id){
        let sql = `SELECT * FROM users WHERE id='${id}'`

        return db.execute(sql)
    }
}

module.exports = Users