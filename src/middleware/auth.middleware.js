const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/blacklist.model")



// auth Middleware to protect routes that require authentication


async function authMiddleware(req, res, next) {
    
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    console.log(token);
    
    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    //Check if token is blacklisted
    const isBlackListed = await tokenBlackListModel.findOne({ token: token });

    if(isBlackListed){
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted"
        })
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        /*
        decoded will have userId as we have set in token
        sign method in auth controller
        */
        const user = await userModel.findById(decoded.userId);
        

        req.user = user;

        return next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}



//auth SystemUser

async function authSystemUserMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if(!token){
        return res.status(401).json({
            message: "Unauthorized access, token is missing"
        })
    }

    
    //Check if token is blacklisted
    const isBlackListed = await tokenBlackListModel.findOne({ token: token });

    if(isBlackListed){
        return res.status(401).json({
            message: "Unauthorized access, token is blacklisted"
        })
    }


    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findById(decoded.userId).select("+systemUser")
        
        if(!user.systemUser){
            return res.status(403).json({
                message: "Forbidden access, not a system user"
            })
        }

        req.user = user

        return next()
    }
    catch(err){
        return res.status(401).json({
            message: "Unauthorized access, token is invalid"
        })
    }
}



module.exports = {
    authMiddleware,
    authSystemUserMiddleware
}