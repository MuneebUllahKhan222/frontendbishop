const jwt = require('jsonwebtoken');

const db = require('../config/db');

const verifyJwt = (req, res, next)=>{
    // const token = req.headers["authorization"].split(" ")[1]
    // console.log(req.headers)
    // console.log(req.headers["authorization"].split(" ")[1])
    const token = req.headers["authorization"]
    console.log(req.headers)
    console.log(req.headers["authorization"])




    if(!token){
        res.send("Yo u need a token")
    }else{
        jwt.verify(token, "jwtSecret", (err, decoded)=>{
            if(err){
            res.json({ auth: false, message: "U failed to auth"})
            }else{
                console.log(decoded)
                req.userId = decoded.id 
                next()
            }
        })
    }
}

module.exports = {
    verifyJwt: verifyJwt
}