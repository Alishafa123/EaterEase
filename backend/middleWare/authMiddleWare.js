const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");


const protect = asyncHandler (async (req,res,next)=> {

    const token = req.cookies.token
    if(!token ){
        res.status(401)// unauthorized
        throw new Error("Not authorized, please login")
    }
    // token verification
    const verified = jwt.verify(token, process.env.JWT_SECRET)
    // get user from token

    const user  = await User.findById(verified.id).select("-password")

    if(!user)
    {
        res.status(401)// unauthorized
        throw new Error("user not found")
    }

    req.user = user
    next()

});


module.exports = protect