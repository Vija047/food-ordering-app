const express = require('express');
const { placeOrder, getOrderDetails, getAllOrders, updateOrderStatus } = require('../controllers/OrderController/orderController');
const { authenticate, authorizeAdmin } = require('../middleware/auth_Resta');

const router = express.Router();

// Route to place a new order (Public route for now, since cart doesn't require authentication)
router.post('/orders', placeOrder);

// Route to fetch order details by ID (Public route for order tracking)
router.get('/orders/:id', getOrderDetails);

// Route to get all orders (Admin only)
router.get('/orders', authenticate, authorizeAdmin, getAllOrders);

// Route to update order status (Admin/Restaurant only)
router.put('/orders/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
