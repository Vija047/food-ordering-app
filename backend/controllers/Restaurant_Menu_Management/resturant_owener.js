const Order = require('../../Models/Orders');
const Restaurant = require('../../Models/Restaurants');

// Get restaurant details for the logged-in restaurant owner
const getRestaurantDetails = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        const restaurant = await Restaurant.findById(restaurantId)
            .populate('menuItems');

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: 'Restaurant not found'
            });
        }

        return res.status(200).json({
            success: true,
            restaurant
        });

    } catch (error) {
        console.error('Error fetching restaurant details:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching restaurant details',
            error: error.message
        });
    }
};

// Get restaurants by owner email (for finding user's restaurant)
const getRestaurantsByOwner = async (req, res) => {
    try {
        const { ownerEmail } = req.params;

        const restaurants = await Restaurant.find({ ownerEmail })
            .populate('menuItems');

        return res.status(200).json({
            success: true,
            restaurants
        });

    } catch (error) {
        console.error('Error fetching restaurants by owner:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching restaurants',
            error: error.message
        });
    }
};

// Get all orders for a specific restaurant
const getRestaurantOrders = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        // Build filter object
        const filter = {
            'items.restaurant': restaurantId
        };

        if (status && status !== 'all') {
            filter.status = status;
        }

        // Get orders with pagination
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        // Get total count for pagination
        const totalOrders = await Order.countDocuments(filter);

        // Format orders for response
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            orderId: order.orderId,
            items: order.items.filter(item => item.restaurant === restaurantId),
            total: order.total,
            address: order.address,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            status: order.status,
            createdAt: order.createdAt,
            estimatedDeliveryTime: order.estimatedDeliveryTime
        }));

        return res.status(200).json({
            success: true,
            orders: formattedOrders,
            pagination: {
                total: totalOrders,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalOrders / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Error fetching restaurant orders:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, restaurantId } = req.body;

        // Validate status
        const validStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Valid statuses are: ' + validStatuses.join(', ')
            });
        }

        // Find the order
        const order = await Order.findOne({
            $or: [
                { _id: orderId },
                { orderId: orderId }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Check if the restaurant has items in this order
        const hasRestaurantItems = order.items.some(item => item.restaurant === restaurantId);
        if (!hasRestaurantItems) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this order'
            });
        }

        // Update the order status
        order.status = status;

        // Update estimated delivery time if status is "Out for Delivery"
        if (status === 'Out for Delivery') {
            order.estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: {
                _id: order._id,
                orderId: order.orderId,
                status: order.status,
                estimatedDeliveryTime: order.estimatedDeliveryTime
            }
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};

// Get restaurant dashboard statistics
const getRestaurantDashboard = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // Get today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayOrders = await Order.find({
            'items.restaurant': restaurantId,
            createdAt: { $gte: today, $lt: tomorrow }
        });

        // Get all orders for this restaurant
        const allOrders = await Order.find({
            'items.restaurant': restaurantId
        });

        // Calculate statistics
        const stats = {
            totalOrders: allOrders.length,
            todayOrders: todayOrders.length,
            pendingOrders: allOrders.filter(order => order.status === 'Pending').length,
            preparingOrders: allOrders.filter(order => order.status === 'Preparing').length,
            outForDeliveryOrders: allOrders.filter(order => order.status === 'Out for Delivery').length,
            deliveredOrders: allOrders.filter(order => order.status === 'Delivered').length,
            cancelledOrders: allOrders.filter(order => order.status === 'Cancelled').length,
            todayRevenue: todayOrders.reduce((total, order) => {
                const restaurantItems = order.items.filter(item => item.restaurant === restaurantId);
                const restaurantTotal = restaurantItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return total + restaurantTotal;
            }, 0),
            totalRevenue: allOrders.reduce((total, order) => {
                const restaurantItems = order.items.filter(item => item.restaurant === restaurantId);
                const restaurantTotal = restaurantItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                return total + restaurantTotal;
            }, 0)
        };

        return res.status(200).json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Error fetching restaurant dashboard:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};

module.exports = {
    getRestaurantOrders,
    updateOrderStatus,
    getRestaurantDashboard,
    getRestaurantDetails,
    getRestaurantsByOwner
};