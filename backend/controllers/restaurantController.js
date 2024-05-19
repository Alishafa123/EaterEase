const fs = require('fs');
const path = require('path');
const Restaurant = require("../models/restuarantsModel");
const Category = require("../models/categoryModel");
const Item = require("../models/productModel");
const { addTable, editTable } = require("../controllers/tableController");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Table = require("../models/tableModel");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerRestaurant = asyncHandler(async (req, res) => {
    const { name, phoneNo, description, openingTime, closingTime, admin } = req.body;
    const adminExists = await Restaurant.findOne({ admin: admin });
    console.profile(adminExists);
    if (adminExists) {
        res.status(400).json({ message:"Admin already has a Restaurant"})
    }
    else {
        if (req.file && !adminExists) {
            let uploadedFile;
            try {
            uploadedFile = await cloudinary.uploader.upload(req.file.path, {
                folder: "DineWise",
                resource_type: "image",
            });
            } catch (error) {
                console.error('Error uploading image to Cloudinary:', error.message);
                res.status(500).json({ message: "Image could not be uploaded" });
            }
            const restaurant = await Restaurant.create({
                name,
                phoneNo,
                description,
                logo:uploadedFile.secure_url,
                openingTime,
                closingTime,
                admin
            })
            if (restaurant) {
                res.status(201).json({
                    message: "Restaurant added successfully "
                })
            }
            else {
                res.status(400).json({message: "Error while adding a new Restaurant"})
            }
        }
        else {
            res.status(400).json({message: "Error while adding a new Restaurant"})
        }
    }
})
const viewRestaurantDetails = asyncHandler(async (req, res) => {
    const restaurantId = req.query.restaurantId;  // Retrieve from query parameters
    console.log("Restaurant ID:", restaurantId);

    if (!restaurantId) {
        return res.status(400).json({ message: "No restaurant ID provided" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
        res.status(200).json(restaurant);  // Respond with the found restaurant directly
    } else {
        res.status(404).json({ message: "Restaurant not found" });
    }
});

const addMenuItem = asyncHandler(async (req, res) => {
    const {
         // Ensure this is being sent in the body from the frontend
        restaurantId,
        itemName,
        itemDescription,
        itemIngredients,
        itemPrice,
        categoryId,
    } = req.body;
    
    console.log("here")
    var imageUrl = null;
    if (req.file) {
        try {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "DineWise",
                resource_type: "image",
            });
            imageUrl = uploadedImage.secure_url;
        } catch (error) {
            res.status(500).json({ message: 'Image could not be uploaded' });
            return;
        }
    }

    // Verify that the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Verify that the category exists
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json({ message: 'Category not found' });
    }

    console.log("here");

    // Create the new item
    const newItem = new Item({
        restaurant: restaurantId,
        category: category._id,
        name: itemName,
        description: itemDescription,
        ingredients: itemIngredients,
        price: itemPrice,
        image: imageUrl,

    });

    await newItem.save();
    console.log("New Item Created")
    // Add item to the category's item list
    category.itemList.push(newItem._id);
    await category.save();

    if (!restaurant.menu.includes(category._id)) {
        restaurant.menu.push(category._id);
        await restaurant.save();
        console.log("Updated Restaurant Menu:", restaurant.menu);
    }



    res.status(201).json({
        message: 'Item added to category successfully',
        item: newItem
    });
});


const updateMenuItem = asyncHandler(async (req, res) => {
     const
    {
        categoryId,
        restaurantId,
        itemId,
        itemName,
        itemDescription,
        itemIngredients,
        itemPrice,
        itemQuantity,
        isPopular } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found' });
    }
    const category = restaurant.menu.find(menuItem => menuItem.equals(categoryId));
    if (!category) {
        res.status(404).json({ message: 'Category not found in the restaurant' });
    }
    const item = await Item.findById(itemId);
    if (!item) {
        res.status(404);
        throw new Error('Item not found in the category');
    }
    itemName && (item.name = itemName);
    itemDescription && (item.description = itemDescription);
    itemIngredients && (item.ingredients = itemIngredients);
    itemPrice && (item.price = itemPrice);
    itemQuantity && (item.quantity = itemQuantity);
    isPopular && (item.isPopular = isPopular);
    
    var imageUrl=null;
    if (req.file) {
        try {
            const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
                folder: "DineWise",
                resource_type: "image",
            });
            imageUrl = uploadedImage.secure_url;
            item.image = imageUrl;
        } catch (error) {
            res.status(500).json({ message:'Image could not be uploaded'});
        }
    }
    await item.save();
    res.status(200).json({
        message: 'Item updated successfully',
        item
    });
});

const deleteMenuItem = asyncHandler(async (req, res) => {
    const { restaurantId, categoryId, itemId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found' });
    }

    const categoryIndex = restaurant.menu.findIndex(menuItem => menuItem.equals(categoryId));

    if (categoryIndex === -1) {
        res.status(404).json({ message: 'Category not found in the restaurant' });
    }

    const category = await Category.findById(categoryId);

    const itemIndex = category.itemList.findIndex(item => item.equals(itemId));

    if (itemIndex === -1) {
        res.status(404).json({ message: 'Item not found in the category' });
    }

    category.itemList.splice(itemIndex, 1);
    
    await Item.findByIdAndDelete(itemId);
    await category.save();
    if (category.itemList.length === 0) {
        restaurant.menu.splice(categoryIndex, 1);
        await Category.findByIdAndDelete(categoryId);
    }
    await restaurant.save();

    res.status(200).json({
        message: 'Item deleted successfully'
    });
});

const viewAllCategories = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
        const categoryList = [];
        for (const menuItem of restaurant.menu) {
            const categoryId = menuItem.toString();
            if (!categoryList.some(cat => cat.id === categoryId)) {
                const category = await Category.findById(menuItem);
                if (category) {
                    categoryList.push({
                        id: category._id,
                        title: category.title,
                    });
                }
            }
        }
        res.status(200).json(categoryList);   
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
})

const viewMenuDetails = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;
  
    try {
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      // Use Promise.all to handle multiple async operations concurrently
      const menuDetails = await Promise.all(restaurant.menu.map(async (menuItem) => {
        const category = await Category.findById(menuItem);
        if (!category) {
          console.error(`Category not found for menuItem: ${menuItem}`);
          return null; // Return null and filter it out later
        }
  
        // Fetch all items in this category concurrently
        const items = await Promise.all(category.itemList.map(itemId =>
          Item.findById(itemId).then(item => item ? item : null) // Return null for missing items
        ));
  
        return {
          _id: category._id,
          categoryTitle: category.title,
          itemList: items.filter(item => item != null) // Filter out null items
        };
      }));
  
      // Filter out null categories and respond with the populated menu details
      res.status(200).json(menuDetails.filter(detail => detail != null));
    } catch (error) {
      console.error('Error fetching menu details:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

const addRestaurantTable = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;
    const { tableNumber, capacity } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
 
    if (restaurant) {
        if (!restaurant.table) {
            restaurant.table = [];
        }
        const table = await addTable({ tableNumber, capacity, restaurantId });
        restaurant.tables.push(table._id);
        restaurant.save();
        res.status(200).json({message:"Table saved successfully"})
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
})
const editRestaurantTable = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;
    const { tableId, tableNumber, capacity, status } = req.body;
    const restaurant = await Restaurant.findById(restaurantId); 
    if (restaurant) {
        const table = await editTable({ tableId, tableNumber, tableCapacity:capacity, status });
        if (table) {
            res.status(200).json({message:"Table edited successfully"})   
        }
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
})
const deleteTable = asyncHandler(async (req, res) => {
    const { restaurantId, tableId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found' });
    }
    const tableIndex = restaurant.tables.findIndex(table => table.equals(tableId));

    if (tableIndex === -1) {
        res.status(404).json({ message: 'Table not found in the restaurant' });
    }

    restaurant.tables.splice(tableIndex, 1);
    
    await Table.findByIdAndDelete(tableId);
    await restaurant.save();
    res.status(200).json({message:"Table deleted successfully"})
})
const viewAllTables = asyncHandler(async (req, res) => {
    const { restaurantId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
        const tableDetails = [];
        for (const tbl of restaurant.tables) {
            const table = await Table.findById(tbl);
            if (table) {
                tableDetails.push({
                    _id: table._id,
                    tableNumber: table.tableNumber,
                    capacity: table.tableCapacity,
                    status: table.status,
                })
            }
            else {
                res.status(404).json({message: "Table Id is not correct"});
            }
        }
        if (tableDetails.length > 0) {
            res.status(200).json(tableDetails);
        }
        else {
            res.status(200).json([]);
        }
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
})
const getQRCode = asyncHandler(async (req, res) => {
    const { restaurantId, tableId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
        const table = await Table.findById(tableId);
        if (table && table.qrCode) {
            const qrCodeBuffer = Buffer.from(table.qrCode.split(",")[1], 'base64');
            res.set('Content-Type', 'image/png');
            res.send(qrCodeBuffer);
        }
        else {
            res.status(404);
            throw new Error("Code not found");
        }
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
});
const addRestaurantStaff = asyncHandler(async (req, res) => {
    const { restaurantId, userId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
 
    if (restaurant) {
        if (!restaurant.staff) {
            console.log("staff not found");
            restaurant.staff = [];
        }
        restaurant.staff.push(userId);
        await restaurant.save();
        res.status(200).json({message:"Staff saved successfully"})
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
})

const viewStaff = asyncHandler(async (req, res) => {
    try {
      const { restaurantId } = req.query;
      const restaurant = await Restaurant.findById(restaurantId);
      
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      const staffDetails = [];
      for (const member of restaurant.staff) {
        const staff = await User.findById(member);
        if (staff) {
          staffDetails.push({
            _id: staff._id,
            name: staff.name,
            email: staff.email
          });
        } else {
          return res.status(404).json({ message: 'User Id is not correct' });
        }
      }
  
      if (staffDetails.length > 0) {
        res.status(200).json(staffDetails);
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      // Handle other errors
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
const editStaff = asyncHandler(async(req, res) => {
    const { restaurantId, staffId } = req.query;
    const { name, email } = req.body;
    const restaurant = await Restaurant.findById(restaurantId);
    if (restaurant) {
        const memberIndex = restaurant.staff.findIndex(member => member.equals(staffId));
        if (memberIndex !== -1) {
            const staff = await User.findById(staffId);
            name && (staff.name = name)
            email && (staff.email = email)
            staff.save()
            res.status(200).json({message:"Staff updated successfully"})
        }
        else {
            res.status(404).json({message:"Staff not found"})            
        }
    }
    else {
        res.status(404).json({ message: 'Restaurant not found' });
    }
})
const deleteStaff = asyncHandler(async (req, res) => {
    const { restaurantId, staffId } = req.query;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
        res.status(404).json({ message: 'Restaurant not found' });
    }

    const memberIndex = restaurant.staff.findIndex(member => member.equals(staffId));

    if (memberIndex === -1) {
        res.status(404).json({ message: 'Member not found in the restaurant' });
    }

    restaurant.staff.splice(memberIndex, 1);
    
    await User.findByIdAndDelete(staffId);
    await restaurant.save();
    res.status(200).json({message:"Staff deleted successfully"})
})
const viewRestaurantsList = asyncHandler(async (req, res) => {
    try {
    
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(400).json('Error fetching tables');
    }
})
module.exports={
    registerRestaurant,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    viewAllCategories,
    viewRestaurantDetails,
    viewMenuDetails,
    addRestaurantStaff,
    viewStaff,
    editStaff,
    deleteStaff,
    addRestaurantTable,
    deleteTable,
    viewAllTables,
    editRestaurantTable,
    getQRCode,
    viewRestaurantsList,
}