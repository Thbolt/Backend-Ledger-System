const accountModel = require("../models/account.model");


//Create account controller
async function createAccountController(req,res){
    const user = req.user;
    
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized: user not found"
        });
    }
    
    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
}


//Get account controller
async function getUserAccountsController(req, res){
    const accounts = await accountModel.find({ 
        user: req.user._id
    });

    res.status(200).json({
        accounts
    })
}



//Account balance controller

async function getAccountBalanceController(req, res){
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if(!account){
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    return res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}




module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}