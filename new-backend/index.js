require("dotenv").config(); // For Env Variables 
const cors = require('cors')
const express = require("express");
const app = express();

// const User = require("./models/Users")
// const bcrypt = require('bcrypt')
// const jwt = require('jsonwebtoken');
// const db = require("./config/db");
// const { raw } = require("body-parser");

const bodyParser = require('body-parser');
const cookieParser= require("cookie-parser")
const session = require("express-session")

const Account = require("./models/Account")


const verifyJwt = require('./middlewares/auth').verifyJwt

// Routes
const userRoute = require("./routes/user")
const accountRoute = require("./routes/account")
const transferRoute = require("./routes/transferlog")
const walletRoute = require("./routes/wallet")
const sellRoute = require("./routes/sellLog")
const buyRoute = require("./routes/buylog")


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


app.use("/", userRoute)
app.use("/account", accountRoute)
app.use("/transfer", transferRoute)
app.use("/wallet", walletRoute)
app.use("/sellLogs", sellRoute)
app.use("/buyLogs", buyRoute)


app.get('/', (req, res) => {
    res.send('hello')
});


// app.get('/login', (req,res) => {
//     if (req.session.user) {
//         res.send({loggedIn:true, user:req.session.user})
//     } else {
//         res.send({loggedIn:false})
//     }
// })

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

// const verifyJwt = (req, res, next)=>{
//     // const token = req.headers["authorization"].split(" ")[1]
//     // console.log(req.headers)
//     // console.log(req.headers["authorization"].split(" ")[1])
//     const token = req.headers["authorization"]
//     console.log(req.headers)
//     console.log(req.headers["authorization"])




//     if(!token){
//         res.send("Yo u need a token")
//     }else{
//         jwt.verify(token, "jwtSecret", (err, decoded)=>{
//             if(err){
//             res.json({ auth: false, message: "U failed to auth"})
//             }else{
//                 req.userId = decoded.id 
//                 next()
//             }
//         })
//     }
// }

app.get("/isUserInfo", verifyJwt ,async (req, res)=>{
    console.log(req.userId, "==========")
    console.log(req.headers, "==========")
    // res.send(req.userId)
    console.log(req.userId)
})






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

// })







app.listen('8000', console.log('server running on port 8000'));