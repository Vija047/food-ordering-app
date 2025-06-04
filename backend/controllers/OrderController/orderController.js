const Order = require('../../Models/Orders'); // Ensure correct path

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const { restaurant, items, totalPrice } = req.body;
        const userId = req.user.id; // Get user from JWT

        const newOrder = new Order({ user: userId, restaurant, items, totalPrice, status: 'Pending' });
        await newOrder.save();

        return res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        return res.status(500).json({ message: 'Error placing order', error: error.message });
    }
};

// Get order details
const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').populate('restaurant');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Correctly exporting functions
module.exports = { placeOrder, getOrderDetails, updateOrderStatus };
