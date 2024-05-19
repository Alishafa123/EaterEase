const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        // required:[true,'Restaurant Id is necessary']
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        // required:[true,'Table Id is necessary']
    },
    cartList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Cart'
    }],
    status: {
        type: String,
        enum: ["new", "preparing", "served", "cancelled", "payment_pending", "completed"],
        default:"new"
    },
    totalPrice: {
        type: Number,
        default: 0,
    }
},{timestamps: true});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;