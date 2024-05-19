const { response } = require("express");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");
const Restaurant = require("../models/restuarantsModel");
// token for each user session
const generateToken =(id,role) => {
    return jwt.sign({id,role}, process.env.JWT_SECRET,{expiresIn : "1d"});
}


const registerUser = asyncHandler(async (req,res) => {

   const {name,email,password,role} = req.body

   //validations
   if(!name || !email || !password || !role){
    res.status(400)
    throw new Error("Fill all fields")
   }

   if(password.length < 6){
    res.status(400)
    throw new Error("password should be upto atleast 6 characters")
   }

   //checking for existing mails
  const  userExists = await User.findOne({email})
  if(userExists)
  {
    res.status(400)
    throw new Error("Email already in use")
  }
  
  // create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })
  //Generate Token
  const token = generateToken(user._id,user.role)

  //HTTP cookie

  res.cookie("token",token,{
    path:"/",
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true //https
});


  if(user) // retireve info
  {// new user create 201 status code
    const{_id,name,email,photo,phone,bio,role}= user //not password
    res.status(201).json({ 
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        role,
        token
    })
  }else{
    res.status(400)
    throw new Error("Invalid user data")
  }
});

//Login user
const loginUser =asyncHandler(async (req,res)=>{
  const {email,password} = req.body

  //validating incoming requests
  if(!email || !password)
  {
    res.status(400);
    throw new Error("Please enter email and Password");
  }
  // checking user existence
  const user = await User.findOne({email});

  if(!user)
  {
    res.status(400);
    throw new Error("User not found");
  }

  //if user is valid

  const passwordCheck =  await bcrypt.compare(password,user.password);

  //generate token

  const token = generateToken(user._id,user.role)
  res.cookie("token",token,{
    path:"/",
    httpOnly: true,
    expiresIn: new Date(Date.now() + 1000 * 86400), // 1 day
    sameSite: "none",
    secure: true //https
});

  if(user && passwordCheck)
  {
      const{_id,name,email,photo,phone,bio,role}= user //not password
         res.status(201).json({ 
        _id,
        name,
        email,
        photo,
        phone,
        bio,
        role,
        token
    });
  }else{
    res.status(400)
    throw new Error("Invalid email or password");
  }
});

//logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio, role } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;
    user.role = role;
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      role:updatedUser.role
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio, role } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      role
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

//get status of login

const loginStatus = asyncHandler(async(req,res)=>
{
  const token = req.cookies.token;
  if(!token)
  {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET)

  if(verified)
  {
    return res.json(true);
  }
  return res.json(false);



})

//change password
const changePassword = asyncHandler(async(req,res)=>
{
  const user = await User.findById(req.user._id);

    const { oldPassword, password } = req.body;

    //validation
    if(!user)
    {
      res.status(400);
      throw new Error("No, user please signup");
    }

    if(!oldPassword || !password)
    {
      res.status(400);
      throw new Error("please add old along with new password");
    }

    //checking if old pass is correct
    const correct = await bcrypt.compare(oldPassword,user.password)

    //saving new password

    if(user && correct)
    {
      user.password = password;
      await user.save();
      res.status(200).send("password changed successfully")
    }
    else{
      res.status(400);
      throw new Error("Enter correct old password");
    }




    
    
  

})



//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  // Create Reset Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save Token to DB
  await new Token({
    userID: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // Thirty minutes
  }).save();

  // Construct Reset Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  // Reset Email
  const message = `
      <h2>Hello ${user.name}</h2>
      <p>Please use the url below to reset your password</p>  
      <p>This reset link is valid for only 30minutes.</p>

      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>

      <p>Regards...</p>
      <p>Pinvent Team</p>
    `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;
console.log(password)
  // Hash token, then compare to Token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    console.log(hashedToken)

  // fIND tOKEN in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  console.log(userToken)

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userID });
  console.log(user)
  user.password = password;
  await user.save();
  res.status(200).json({
    message: "Password Reset Successful, Please Login",
  });
});

const getRestaurant = asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const restaurant = await Restaurant.findOne({ admin: userId });
  if (restaurant) {
    res.status(200).json(
      restaurant
    );
  }
  else {
    res.status(400).json({ message: "No Restaurant belongs to this user" })
  }
});

module.exports = {
    registerUser,
    loginUser,
    logout,
    updateUser,
    getUser,
    loginStatus,
    changePassword,
    forgotPassword,
    resetPassword,
    getRestaurant
}