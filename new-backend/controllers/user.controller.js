const User = require("../models/Users")
const bcrypt = require('bcrypt')
const Validator = require("fastest-validator")
const jwt = require("jsonwebtoken")
// app.get('/login', (req,res) => {
//     if (req.session.user) {
//         res.send({loggedIn:true, user:req.session.user})
//     } else {
//         res.send({loggedIn:false})
//     }
// })

// app.post('/login', async (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     console.log(email, password);

//     let [user, _] = await User.findByEmail(email)

//     if (user.length === 0) {
//         console.log("Email not exist");
//     } else {
//         user = user[0]
//         console.log(user.Password);

//         bcrypt.compare(password, user.Password).then(function (result) {
//             if (result) {
//                 const id  = user.id 
//                 const token = jwt.sign({id}, "jwtSecret",{
//                     expiresIn: 300,
//                 })
//                 console.log(token);
//                 req.session.user = user
//                 console.log(req.session.user)
//                 res.json({auth: true, token: token, result: user })
//             } else {
//                 console.log("pass incorrect")
//             }
//         });
//     }
// })
// app.post('/register', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const address = req.body.phoneNumber
//     const userName = req.body.userName;
//     const saltRound = 10
//     console.log(userName);

//     bcrypt.hash(password, saltRound)
//         .then((hashPassword) => {
//             const user = new User(userName, email, hashPassword, address)
//             user.save()
//         })
//         .catch((err) => {
//             console.log(err)
//         });

// })



const loginGet = (req, res) =>{
    if (req.session.user) {
        res.send({loggedIn:true, user:req.session.user})
    } else {
        res.send({loggedIn:false})
    }
}

const loginPost = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    let [user, _] = await User.findByEmail(email)

    if (user.length === 0) {
        console.log("Email not exist");
        res.status(400).json({error: "Email Incorrect "})

    } else {
        user = user[0]
        console.log(user.Password);

        bcrypt.compare(password, user.Password).then(function (result) {
            if (result) {
                console.log("USer creds ", user.Customer_Id)
                const id  = user.Customer_Id
                const token = jwt.sign({id}, "jwtSecret",{
                    expiresIn: 3000,
                })
                console.log(token);
                req.session.user = user
                console.log(req.session.user)
                console.log("token", token)
                res.json({auth: true, token: token, result: user })
            } else {
                console.log("pass incorrect")
                res.status(400).json({error: "Password Incorrect "})
            }
        });
    }

}

const register = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address
    const userName = req.body.userName;
    const fullName = req.body.fullName;

    console.log(email, password, address, userName, fullName)
    // Validating Data 
    const v = new Validator()
    const schema = {
        username: { type: "string", min: 3, max: 255 },
        fullname: { type: "string", min: 3, max: 255 },
        address: { type: "string", min: 3, max: 255 },
        email: {type: "email"},
        password: { type: "string", min: 6 }
    }
    const validationResponse = v.validate({
        username: userName,
        fullname: fullName,
        address: address,
        email: email,
        password: password
    }, schema)

    if(validationResponse !== true){
        return res.status(400).json({
            message: "Validation Failed", 
            error: validationResponse
        })
    }


    const [savedEmail, _1] = await User.findByEmail(email)
    if(savedEmail[0]){
        res.status(400).json({
            message: "Email Already Exists"
        })
    }
    const [savedUsername, _2] = await User.findByUserName(userName)
    if(savedUsername[0]){
        res.status(400).json({  
            message: "Username Already Exists"
        })
    }


    // Encrypting password and Model Interface 

    const saltRound = 10

    bcrypt.hash(password, saltRound)
        .then((hashPassword) => {
            const user = new User(userName, email, hashPassword, address, fullName)
            user.save()
            console.log('sucess');
            res.status(201).json({message: "User Created Successfully "})
        })
        .catch((err) => {
            console.log(err)
        });

}




module.exports = {
    loginGet: loginGet,
    loginPost: loginPost,
    register: register
}