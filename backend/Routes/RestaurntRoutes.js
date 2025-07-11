const express = require('express');
const {
  addRestaurant,
  addMenuItem: addMenuItemController, // Avoid naming conflict
  updateMenuItem,
  deleteMenuItem,
  getRestaurants,
  getRestaurantsForAdmin,
  getAdminDashboardStats,
  upload
} = require('../controllers/Restaurant_Menu_Management/RestaurantController');
const {
  getAllMenuItems,
  addMenuItem,
  getMenuItems,
  getMenuItemById // Import the missing controller function
} = require('../controllers/Restaurant_Menu_Management/Menucontroller');
const { updateAdminProfile } = require('../controllers/User_controller/Users_Register');

const {
  authenticate,
  authorizeAdmin,
  authorizeAdminOrRestaurantOwner
} = require('../middleware/auth_Resta');

const router = express.Router();

// Restaurant Routes
router.post('/admin', authenticate, authorizeAdminOrRestaurantOwner, addRestaurant);
router.get('/restaurants', getRestaurants);
router.get('/admin/restaurants', authenticate, authorizeAdmin, getRestaurantsForAdmin);
router.get('/admin/dashboard/stats', authenticate, authorizeAdmin, getAdminDashboardStats);

// Menu Routes
router.post('/:id/menu', authenticate, authorizeAdminOrRestaurantOwner, upload.single('image'), addMenuItemController);
router.put('/menu/:menuItemId', authenticate, authorizeAdmin, upload.single('image'), updateMenuItem);
router.delete('/menu/:menuItemId', authenticate, authorizeAdmin, deleteMenuItem);

router.get('/allmenu', getAllMenuItems);
router.get('/getmenu/:id', getMenuItems);
router.get('/menu/:menuItemId', getMenuItemById); // Add the missing route for individual menu items
// Admin Profile Routes
router.put('/admin/profile', authenticate, authorizeAdmin, updateAdminProfile);

// Restaurant Owner routes
const {
  getRestaurantOrders,
  updateOrderStatus,
  getRestaurantDashboard,
  getRestaurantDetails,
  getRestaurantsByOwner
} = require('../controllers/Restaurant_Menu_Management/resturant_owener');

// Restaurant owner dashboard routes
router.get('/restaurant/:restaurantId/dashboard', getRestaurantDashboard);
router.get('/restaurant/:restaurantId/orders', getRestaurantOrders);
router.put('/restaurant/order/:orderId/status', updateOrderStatus);
router.get('/restaurant/:restaurantId/details', getRestaurantDetails);
router.get('/restaurants/owner/:ownerEmail', getRestaurantsByOwner);

module.exports = router;
