const mongoose = require("mongoose");
const categorySchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please add a name of Category"],
        validate: {
            validator: function (v) {
                return v.length <= 30;
            },
            message: props => `${props.value} is greater than 30 characters!`
        }
    },
    itemList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
    }],
},{timestamps: true});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;