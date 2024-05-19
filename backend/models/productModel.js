const mongoose = require("mongoose");
const itemSchema = mongoose.Schema({
    name: {
      type: String,
      required: [true, "Please add a name of item"],
      validate: {
        validator: function(v) {
            return v.length <= 30;
        },
        message: props => `${props.value} is greater than 30 characters!`
      }
    },
    description: {
      type: String,
      required: [true, "Please add a Description of item"],
      validate: {
        validator: function(v) {
            return v.length <= 100;
        },
        message: props => `${props.value} is greater than 100 characters!`
      }
    },
    ingredients: {
      type: String,
      lowercase: true
    },
    price: {
      type: Number,
      required: [true,"Price of the item should be inserted"]
    },

    image: {
      type: String,
      required:[true, "Image for the item is required"]
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, "Please specify the restaurant this item belongs to"]
    },
  
  
  },{timestamps: true});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;