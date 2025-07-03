const express = require('express');
const { placeOrder, getOrderDetails, getAllOrders, updateOrderStatus, getUserOrderHistory } = require('../controllers/OrderController/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth_Resta');

const router = express.Router();

// Route to place a new order (Public route for now, since cart doesn't require authentication)
router.post('/orders', placeOrder);

// Route to get user order history by email/phone (Public route) - MUST be before the /:id route
router.get('/orders/user/history', getUserOrderHistory);

// Route to get all orders (Admin only) - MUST be before the /:id route
router.get('/orders/admin/all', authenticate, authorizeAdmin, getAllOrders);

// Route to fetch order details by ID (Public route for order tracking)
router.get('/orders/:id', getOrderDetails);

// Route to update order status (Admin/Restaurant only)
router.put('/orders/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
