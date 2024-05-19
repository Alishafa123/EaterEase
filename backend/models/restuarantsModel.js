const mongoose = require("mongoose");
const restaurantSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Restaurant's Name is necessary"]
    },
    phoneNo:{
        type: String,
        required: [true, "Phone Number is necessary"],
        unique:true
    },
    description:{
        type: String,
        required: [true,"Description of the Restaurant is necessary"],
        validate: {
            validator: function(v) {
                return v.length <= 500;
            },
            message: props => `${props.value} are greater than 500 characters!`
        }
    },
    logo:{
        type: String,
        required: [true, "logo is necessary"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png"
    },
    openingTime: {
        type: Date,
        required: [true,"Opening time is necessary"]
    },
    closingTime: {
        type: Date,
        required: [true,"Closing time is necessary"]
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(userId) {
                const user = await mongoose.model('User').findById(userId);
                return user && user.role === 'admin';
            },
            message: 'Admin must be registered with an admin role'
        }
    },
    tables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table'
    }],
    staff: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    
}, {timeStamps: true})

restaurantSchema.path('staff').validate(async function(staff) {
  if (!staff || staff.length === 0) return true;

  const Staff = mongoose.model('User');
  const promises = staff.map(staffId => Staff.findById(staffId));
  const staffDocuments = await Promise.all(promises);

  return staffDocuments.every(staff => staff && staff.role === 'staff');
}, 'Each Staff must have a role of staff');

const Restaurant = mongoose.model("Restaurant",restaurantSchema)
module.exports = Restaurant