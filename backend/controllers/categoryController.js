const Category = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");


const addCategory = asyncHandler(async (req,res) =>  {
    const { title } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const newCategory = new Category({ title });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});
module.exports = {
    addCategory,getCategories
};
