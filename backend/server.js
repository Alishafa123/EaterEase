const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const  userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const restaurantRoute = require("./routes/restaurantRoute");
const orderRoute = require("./routes/orderRoute");
const catRoute = require("./routes/categoryRoute");

const errorHandler = require("./middleWare/errorMiddleWare");
const cookieParser = require("cookie-parser");
const path = require("path");


const app = express()

const PORT = process.env.PORT || 5000;

//middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(
    cors({
      origin: ["http://localhost:3000"],
      credentials: true,
    })
  );


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//RouteMiddlewares
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/orders", orderRoute);
app.use("/api/category", catRoute);
//routes
app.get("/",(req,res)=> {
    res.send("Home Page");
})

//Error Middleware
app.use(errorHandler); //refrencing errorhandler

//connecting my db

mongoose.
connect(process.env.MONGO_URI).then( ()=>{

    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    })
})
.catch((err)=> console.log(err))