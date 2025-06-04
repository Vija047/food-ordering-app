const express = require('express');
const { addRestaurant, getRestaurants } = require('../controllers/Restaurant_Menu_Management/RestaurantController');
const { getAllMenuItems, addMenuItem, getMenuItems } = require('../controllers/Restaurant_Menu_Management/Menucontroller');
const { authenticate, authorizeAdmin } = require('../middleware/auth_Resta'); // Ensure this path is correct

const router = express.Router();

// Restaurant Routes
router.post('/admin', authenticate, authorizeAdmin, addRestaurant); // Add a new restaurant (Admin only)
router.get('/get/admin', getRestaurants); // Get list of restaurantss
// Menu Routes
router.post('/:id/menu', authenticate, authorizeAdmin, addMenuItem); // Add a menu item (Admin only)
router.get('/getmenu/:id', getMenuItems); // Fetch menu items of a restaurant
router.get('./allmenu', getAllMenuItems);
module.exports = router;
