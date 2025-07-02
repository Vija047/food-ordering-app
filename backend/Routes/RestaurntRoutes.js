const express = require('express');
const {
  addRestaurant,
  addMenuItem: addMenuItemController, // Avoid naming conflict
  updateMenuItem,
  deleteMenuItem,
  getRestaurants,
  getRestaurantsForAdmin,
  getAdminDashboardStats
} = require('../controllers/Restaurant_Menu_Management/RestaurantController');
const {
  getAllMenuItems,
  addMenuItem,
  getMenuItems
} = require('../controllers/Restaurant_Menu_Management/Menucontroller');
const { updateAdminProfile } = require('../controllers/User_controller/Users_Register');

const {
  authenticate,
  authorizeAdmin
} = require('../middleware/auth_Resta');

const router = express.Router();

// Restaurant Routes
router.post('/admin', authenticate, authorizeAdmin, addRestaurant);
router.get('/restaurants', getRestaurants);
router.get('/admin/restaurants', authenticate, authorizeAdmin, getRestaurantsForAdmin);
router.get('/admin/dashboard/stats', authenticate, authorizeAdmin, getAdminDashboardStats);

// Menu Routes
router.post('/:id/menu', authenticate, authorizeAdmin, addMenuItemController);
router.put('/menu/:menuItemId', authenticate, authorizeAdmin, updateMenuItem);
router.delete('/menu/:menuItemId', authenticate, authorizeAdmin, deleteMenuItem);
router.get('/getmenu/:id', getMenuItems);
router.get('/allmenu', getAllMenuItems);

// Admin Profile Routes
router.put('/admin/profile', authenticate, authorizeAdmin, updateAdminProfile);

module.exports = router;
