const db = require('../config/db')

class Users{
    // constructor(username,name,email,password,phone_number){
    //     this.username = username
    //     this.name = name
    //     this.email = email
    //     this.password = password
    //     this.phone_number = phone_number

    // }

    constructor(username,email,password,address, full_name){
        this.username = username
        this.email = email
        this.password = password
        this.address = address
        this.full_name = full_name

    }

    save(){

        let sql = `
        INSERT INTO registration(
            UserName, 
            Password, 
            Address,
            Email,
            full_name
        )
        VALUES(
            '${this.username}', 
            '${this.password}', 
            '${this.address}', 
            '${this.email}',
            '${this.full_name}'
            )`

        return db.execute(sql)
    }

    static findAll(){
        let sql = `SELECT * FROM customer`

        return db.execute(sql)

    }

    static findByEmail(email){
        let sql = `SELECT * FROM Customer WHERE email='${email}'`

        return db.execute(sql)
    }

    static findById(id){
        let sql = `SELECT * FROM customer WHERE customer_id='${id}'`

        return db.execute(sql)
    }
    static findByUserName(username){
        let sql = `SELECT * FROM customer WHERE username='${username}'`

        return db.execute(sql)
    }
}

module.exports = Users