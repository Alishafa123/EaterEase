const express = require("express");
const router = express.Router();
const { registerRestaurant,addMenuItem,viewRestaurantDetails,updateMenuItem,deleteMenuItem,viewAllCategories, viewMenuDetails, addRestaurantStaff, viewStaff, editStaff, deleteStaff, addRestaurantTable, viewAllTables, editRestaurantTable, deleteTable, getQRCode, viewRestaurantsList } = require("../controllers/restaurantController");
const protect = require("../middleWare/authMiddleWare");
const { upload } = require("../utils/fileUpload");

//router.post("/register", protect, registerRestaurant);
router.post("/add_menu_item", protect, upload.single("image"), addMenuItem);
router.post("/update_menu_item", protect, upload.single("image"), updateMenuItem);
 router.get("/view_details", viewRestaurantDetails);
//router.get('/getRestDetails/:id', viewRestaurantDetails);

router.delete("/delete_item", protect, deleteMenuItem);
router.get("/view_categories", protect, viewAllCategories);
router.get("/view_menu_details", protect, viewMenuDetails);
router.post("/add_staff", protect, addRestaurantStaff);
router.get("/view_staff", protect, viewStaff);
router.post("/edit_staff", protect, editStaff);
router.delete("/delete_staff", protect, deleteStaff);
router.post("/add_table", protect, addRestaurantTable);
router.get("/view_tables", protect, viewAllTables);
router.post("/edit_table", protect, editRestaurantTable);
router.delete("/delete_table", protect, deleteTable);
router.get("/get_qr_code", protect, getQRCode);
router.get("/view_restaurants_list", protect, viewRestaurantsList);

router.post("/register", protect, upload.single("image"), registerRestaurant);
// router.post("/add_menu_item", protect, upload.single("image"), addMenuItem);
module.exports = router;
