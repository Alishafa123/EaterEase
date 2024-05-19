const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getRestaurant} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleWare");


  router.post("/register", registerUser);
  router.post("/login",loginUser);
  router.get("/logout", logout);
  router.get("/getUser",protect, getUser); // dont want anyone to access
  router.get("/loggedin", loginStatus);
  router.patch("/updateuser",protect,updateUser);
  router.patch("/changepassword",protect,changePassword);
  router.post("/forgotpassword",forgotPassword);
  router.put("/resetpassword/:resetToken",resetPassword);
  router.get("/getrestaurant", protect, getRestaurant);

  module.exports = router;

