const Order = require('../../Models/Orders');
const { sendOrderConfirmationEmail, sendRestaurantNotificationEmail } = require('../../utils/emailService');

// Generate unique order ID
const generateOrderId = () => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp.slice(-6)}${random}`;
};

// Place a new order
const placeOrder = async (req, res) => {
    try {
        const {
            items,
            subtotal,
            discount,
            tax,
            deliveryFee,
            packagingFee,
            total,
            address,
            appliedCoupon,
            customerEmail,
            customerPhone
        } = req.body;

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }

        if (!address || address === 'Please set your delivery address') {
            return res.status(400).json({ message: 'Delivery address is required' });
        }

        // Generate unique order ID
        const orderId = generateOrderId();

        // Calculate estimated delivery time (40 minutes from now)
        const estimatedDeliveryTime = new Date(Date.now() + 40 * 60 * 1000);

        // Create new order
        const orderData = {
            orderId,
            items,
            subtotal: subtotal || 0,
            discount: discount || 0,
            tax: tax || 0,
            deliveryFee: deliveryFee || 0,
            packagingFee: packagingFee || 0,
            total: total || 0,
            address,
            appliedCoupon: appliedCoupon || null,
            customerEmail: customerEmail || null,
            customerPhone: customerPhone || null,
            estimatedDeliveryTime,
            status: 'Pending'
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        // Send email notifications
        const emailResults = {
            customerNotification: null,
            restaurantNotifications: null
        };

        // Send customer confirmation email if email provided
        if (customerEmail) {
            emailResults.customerNotification = await sendOrderConfirmationEmail(orderData, customerEmail);
        }

        // Send restaurant notifications
        // Extract unique restaurants from order items
        const restaurants = [...new Set(items.map(item => item.restaurant).filter(Boolean))];
        if (restaurants.length > 0) {
            // For demo purposes, using default restaurant emails
            // In production, fetch actual restaurant owner emails from database
            const restaurantEmails = {};
            restaurants.forEach(restaurant => {
                restaurantEmails[restaurant] = process.env.DEFAULT_RESTAURANT_EMAIL || 'restaurant@example.com';
            });

            emailResults.restaurantNotifications = await sendRestaurantNotificationEmail(orderData, restaurantEmails);
        }

        return res.status(201).json({
            message: 'Order placed successfully',
            orderId: orderId,
            order: newOrder,
            emailNotifications: emailResults,
            estimatedDeliveryTime: estimatedDeliveryTime.toLocaleString()
        });

    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({
            message: 'Error placing order',
            error: error.message
        });
    }
};

// Get order details by order ID
const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        let order;

        // Try to find by MongoDB _id first, then by orderId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // MongoDB ObjectId format
            order = await Order.findById(id);
        } else {
            // Custom orderId format
            order = await Order.findOne({ orderId: id });
        }

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
};

// Get all orders for admin/restaurant dashboard
const getAllOrders = async (req, res) => {
    try {
        const { status, restaurant, limit = 50, page = 1 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (restaurant) filter['items.restaurant'] = restaurant;

        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const totalOrders = await Order.countDocuments(filter);

        return res.status(200).json({
            orders,
            pagination: {
                total: totalOrders,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalOrders / parseInt(limit))
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Update order status (Admin/Restaurant only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        let order;

        // Try to find by MongoDB _id first, then by orderId
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            order = await Order.findById(id);
        } else {
            order = await Order.findOne({ orderId: id });
        }

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const validStatuses = ["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: 'Order status updated successfully',
            order,
            updatedAt: new Date().toLocaleString()
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

// Correctly exporting functions
module.exports = { placeOrder, getOrderDetails, getAllOrders, updateOrderStatus };
