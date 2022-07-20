const Validation = require("fastest-validator")
const Account = require("../models/Account")

const accountInfo = async(req, res) =>{
// IBAN PIN CODE AMOUNT

    const iban =  req.body.iban
    const balance = req.body.balance
    const pincode = req.body.pincode 


    // Model Interface 

    const userId = req.userId
    
    console.log(userId, iban, balance, pincode)
    if(iban.length !==7 || pincode.length !==4 ) {
        console.log('Wrong Iban or pincode');
        return res.json({error: "Wrong Iban or pincode"})
    }

    const storedIBAN = await Account.findByIBan(iban)
    console.log(storedIBAN[0][0] == undefined,'==========');

    if(storedIBAN[0][0] != undefined){
        console.log(storedIBAN);
        console.log('stored iban');
       return res.json({error: "Iban Number is in use with another account"})
    }

    
    const updateAccount = await Account.updateAccount(userId, iban,balance, pincode )

    console.log(updateAccount)
    if(updateAccount[0]["changedRows"] == 1){
        res.status(200).json({success: "Changes succesfull"})
    }else{
        console.log('else entered');
        res.status(400).json({error: "Changes not succesfull"})
    }

}   

const accountInfoGet = async (req, res) =>{
    const userId = req.userId
    
    const [accountDetail, _] = await Account.findAccountDetail(userId)

    res.status(200).json(accountDetail)
}

const transferAmount = async (req, res)=>{
    const amount = req.body.amount
    const iban = req.body.iban_no

    const userId = req.userId
    console.log(amount, iban, userId)

    const [receiverAccount, _1] = await Account.findAccountDetialByIban(iban)
    console.log(receiverAccount)

    if(receiverAccount[0] == undefined){
        return res.json({error: "IBAN not exist"})
    }
    const [transferAmount, _2] = await Account.transferAmount(userId, iban, amount)
    console.log(transferAmount)

    if(transferAmount[0]){
        res.status(200).json({success : "Your Transaction was Successfull", receiver: receiverAccount, amount: amount})
    }else{
        res.status(400).json({error : "Something Went Wrong "})
    }

}

module.exports = {
    accountInfo: accountInfo,
    accountInfoGet: accountInfoGet,
    transferAmount: transferAmount
}