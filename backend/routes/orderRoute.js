const express = require("express");
const router = express.Router();
const { addToTable, placeOrder, viewAllMembers, changeStatus,viewCurrentOrdersRestaurant } = require("../controllers/orderController");
const protect = require("../middleWare/authMiddleWare");

router.post("/add_to_table", protect, addToTable);
router.post("/place_order", protect, placeOrder);
router.get("/view_all", protect, viewAllMembers);
router.post("/change_status", protect, changeStatus);
router.get("/view_current_orders_restaurant", protect, viewCurrentOrdersRestaurant);
module.exports = router;
