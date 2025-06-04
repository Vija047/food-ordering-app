const express = require('express');
const { placeOrder, getOrderDetails, updateOrderStatus } = require('../controllers/OrderController/orderController'); // Ensure correct path
const { authenticate, authorizeAdmin } = require('../middleware/auth_Resta');

const router = express.Router();

// Route to place a new order (Authenticated users only)
router.post('/order', authenticate, placeOrder);

// Route to fetch order details
router.get('/orders/:id', authenticate, getOrderDetails);

// Route to update order status (Admin only)
router.put('/:id/status', authenticate, authorizeAdmin, updateOrderStatus);

module.exports = router;
