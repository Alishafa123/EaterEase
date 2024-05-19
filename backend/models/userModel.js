const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is necessary"] //field is required
    },
    email:{
        type: String,
        required: [true, "email is necessary"],
        unique:true,
        trim:true,
        match: [ // make sure valid
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
        ]
    },
    password:{
        type: String,
        required: [true, "password is necessary"],
        minLength: [6,"cannot be less than 6"],
        //maxLength: [30,"cannot be more than 30"] ,// avoid malicious string


    },
    photo:{
        type: String,
        required: [true, "photo is necessary"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"

    },
    phone:{
        type: String,
        default: "+92"

    },
    bio:{
        type: String,
        default: "bio",
        maxLength: [300, "Bio cant be more than 300 characters"]

    },
    role:{ 
        type: String, 
        enum: ['admin', 'staff', 'customer'],
        required: true 
    }
}, {
    timeStamps: true
} )

//hash pass  (encryption)

userSchema.pre("save",async function(next) {

if(!this.isModified("password"))
{
    return next()
}

//hash pass  (encryption)
const salt = await bcrypt.genSalt(11); //salt for hash
const hashedPassword = await bcrypt.hash(this.password,salt);

this.password = hashedPassword;
next()
})
// everytime i want to access ill user below


const User = mongoose.model("User",userSchema)
module.exports = User