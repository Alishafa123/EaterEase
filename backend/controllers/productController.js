const asyncHandler = require("express-async-handler");
const Item = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const Category = require('../models/categoryModel');



//config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Prouct
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, ingredients } = req.body;

  //   Validation
  if (!name || !category || !quantity || !price || !ingredients) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "DineWise",
        resource_type: "image",
      });
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error.message);
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Item
  const product = await Item.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,  //to be removed
    price,
    ingredients,
    image: fileData,
  });

  res.status(201).json(product);
});

// Get all Items
const getProducts = asyncHandler(async (req, res) => {
  const products = await Item.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get single Item
const getProduct = asyncHandler(async (req, res) => {
  const product = await Item.findById(req.params.id);
  // if product doesnt exist
  console.log(product);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match Item to its restaurant
  // if (product.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }
  res.status(200).json(product);
});

// // Delete Item
// const deleteProduct = asyncHandler(async (req, res) => {
//   console.log("here in del")
//   const product = await Item.findById(req.params.id);
//   // if product doesnt exist
//   if (!product) {
//     res.status(404);
//     throw new Error("Product not found");
//   }
//   // Match product to its user
//   // if (product.user.toString() !== req.user.id) {
//   //   res.status(401);
//   //   throw new Error("User not authorized");
//   // }
//   await product.deleteOne(product._id);
//   res.status(200).json({ message: "Product deleted." });
// });


const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Item.findById(req.params.id);
  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }
  console.log("in del");

  // Get the category of the product
  const category = await Category.findOne({ itemList: product._id });
  console.log(category)
  if (category) {
    // Remove the product from its category
    category.itemList.pull(product._id);
    await category.save();
    
    // If the category is now empty, remove it from the restaurant's menu
    // if (category.itemList.length === 0) {
    //   await Restaurant.updateMany(
    //     { menu: category._id },
    //     { $pull: { menu: category._id } }
    //   );
    //   // Optionally, delete the category if it should not exist without items
    //   await category.remove();
    // }
  }

  console.log("category removed");


  // Delete the product itself
  await product.deleteOne(product._id);
  res.status(200).json({ message: "Product deleted and references updated." });
});

// Update Item
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, ingredients } = req.body;
  const { id } = req.params;

  const product = await Item.findById(id);

  // if item doesnt exist
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  // Match item to its user
  // if (product.user.toString() !== req.user.id) {
  //   res.status(401);
  //   throw new Error("User not authorized");
  // }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "DineWise",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Update item
  const updatedProduct = await Item.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      ingredients,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};