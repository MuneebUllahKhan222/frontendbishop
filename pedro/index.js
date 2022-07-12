require("dotenv").config(); // For Env Variables 
const cors = require('cors')
const express = require("express");
const db = require("./config/db");
const app = express();
const User = require("./models/Users")
const bcrypt = require('bcrypt')

const bodyParser = require('body-parser');
const cookieParser= require("cookie-parser")
const session = require("express-session")
const jwt = require('jsonwebtoken');
const { raw } = require("body-parser");

const Account = require("./models/Account")

app.use(express.json())
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(
    session({
    key: "userId",
    secret: "secret",
    resave: false, 
    saveUninitialized: false,
    cookie: {
        expires: 60*60*24
    },
}))



app.get('/', (req, res) => {
    res.send('hello')
});

app.get('/login', (req,res) => {
    if (req.session.user) {
        res.send({loggedIn:true, user:req.session.user})
    } else {
        res.send({loggedIn:false})
    }
})

// app.post('/register', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;
//     const phoneNumber = req.body.phoneNumber
//     const userName = req.body.userName;
//     const saltRound = 10

//     bcrypt.hash(password, saltRound)
//         .then((hashPassword) => {
//             const user = new User(userName, userName, email, hashPassword, phoneNumber)
//             user.save()
//         })
//         .catch((err) => {
//             console.log(err)
//         });

// })

app.post('/register', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.phoneNumber
    const userName = req.body.userName;
    const saltRound = 10
    console.log(userName);

    bcrypt.hash(password, saltRound)
        .then((hashPassword) => {
            const user = new User(userName, email, hashPassword, address)
            user.save()
        })
        .catch((err) => {
            console.log(err)
        });

})

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
                req.userId = decoded.id 
                next()
            }
        })
    }
}

app.get("/isUserInfo", verifyJwt , (req, res)=>{
    console.log(req.userId, "==========")
    console.log(req.headers, "==========")
    res.send("Yo You r Authenticted")
})

app.get("/account", verifyJwt , async (req, res)=>{
    const userId = req.userId
    const [accountDetails, _1] = await Account.findByUserId(userId)
    const [userData, _2 ] = await User.findByUserId(userId)
    res.send({account: accountDetails, user: userData})

    
})

// app.post("/account/deposit", verifyJwt , async (req, res)=>{
//     const userId = req.userId
//     const amount = req.body.amount

//     const currentAmount = await Account.checkAmount(userId)
//     if 
//     res.send({account: accountDetails, user: userData})
    
    
// })

app.post("/account/deduct", verifyJwt , async (req, res)=>{
    const userId = req.userId
    const amount = req.body.amount

    const currentAmount = await Account.checkAmount(userId)
    if (amount > currentAmount){
    res.send({error: "In sufficient amount"})
    }else{
        // Incomplete
    }
    
    
})




app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password);

    let [user, _] = await User.findByEmail(email)

    if (user.length === 0) {
        console.log("Email not exist");
    } else {
        user = user[0]
        console.log(user.Password);

        bcrypt.compare(password, user.Password).then(function (result) {
            if (result) {
                const id  = user.id 
                const token = jwt.sign({id}, "jwtSecret",{
                    expiresIn: 300,
                })
                console.log(token);
                req.session.user = user
                console.log(req.session.user)
                res.json({auth: true, token: token, result: user })
            } else {
                console.log("pass incorrect")
            }
        });
    }


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
    
    //         const match = await bcrypt.compare(password, user.Password)
    //         console.log(match);
    //         if (match) {
    //             const id  = user.id 
    //             const token = jwt.sign({id}, "jwtSecret",{
    //                 expiresIn: 300,
    //         })} else {
    //             console.log("inc");
    //         }}
    // User.findByEmail(email).then((result) => {
    //     // if (err) throw err;

    //     console.log(result[0]);

    //     let user = result[0]
    //     if (user.length == 0) {
    //         console.log("Email not exist ")
    //     } else {
    //         if (user[0].password == password) {
    //             console.log("Logged In ")
    //             // res.redirect("http://localhost:3000/")

    //         } else {
    //             console.log("Passs incorrect")
    //         }
    //     }
    // })





    // bcrypt.compare(password, user.password, (err, isMatch)=>{
    //     if(err){
    //         throw err
    //     } 
    //     if(isMatch){
    //         console.log(" correct ");

    //     }else{
    //         console.log("Not correct ");
    //     }
    // })

})







app.listen('8000', console.log('server running on port 8000'));