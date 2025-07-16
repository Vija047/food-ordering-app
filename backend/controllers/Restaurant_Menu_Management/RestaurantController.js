const mongoose = require('mongoose');
const Restaurant = require('../../Models/Restaurants');
const MenuItem = require('../../Models/MenuItems');

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
    return buffer.toString('base64');
};

// Helper function to validate image type
const isValidImageType = (mimetype) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return allowedTypes.includes(mimetype);
};

// Add a new restaurant (Admin or Restaurant Owner)
const addRestaurant = async (req, res) => {
    try {
        const { name, location, cuisine, phone, description, ownerEmail, ownerId } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ name });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Restaurant already exists' });
        }

        const newRestaurant = new Restaurant({
            name,
            location,
            cuisine,
            ownerEmail: ownerEmail || req.user?.email,
            ownerPhone: phone,
            description,
            ownerId: ownerId || req.user?.id
        });
        await newRestaurant.save();

        return res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding restaurant', error: error.message });
    }
};
// get all restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

// Get restaurants for admin dashboard with detailed info
const getRestaurantsForAdmin = async (req, res) => {
    try {
        // Get restaurants with populated menu items for admin dashboard
        const restaurants = await Restaurant.find().populate({
            path: 'menuItems',
            select: 'name price description image'
        });

        // Add count of menu items for each restaurant
        const restaurantsWithStats = restaurants.map(restaurant => {
            return {
                _id: restaurant._id,
                name: restaurant.name,
                location: restaurant.location,
                menuItems: restaurant.menuItems,
                menuItemsCount: restaurant.menuItems.length,
                createdAt: restaurant.createdAt,
                updatedAt: restaurant.updatedAt
            };
        });

        return res.status(200).json({
            message: 'Restaurants fetched successfully',
            count: restaurantsWithStats.length,
            restaurants: restaurantsWithStats
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching restaurants for admin', error: error.message });
    }
};

// Get admin dashboard statistics
const getAdminDashboardStats = async (req, res) => {
    try {
        const totalRestaurants = await Restaurant.countDocuments();
        const totalMenuItems = await MenuItem.countDocuments();

        // Get recently added restaurants
        const recentRestaurants = await Restaurant.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name location createdAt');

        return res.status(200).json({
            message: 'Dashboard statistics fetched successfully',
            stats: {
                totalRestaurants,
                totalMenuItems,
                recentRestaurants
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching dashboard statistics', error: error.message });
    }
};

// Add a menu item to a restaurant (Admin only)
const addMenuItem = async (req, res) => {
    try {
        const restaurantId = req.params.id; // Get restaurant ID from URL parameter
        const { name, price, description, category, image, imageType } = req.body; // Get data from body

        console.log('Request body:', req.body);
        console.log('Restaurant ID:', restaurantId);

        // Validate required fields
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        // Validate restaurant ID format
        if (!restaurantId || !restaurantId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid restaurant ID format' });
        }

        // Check if restaurant exists
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Validate image if provided
        if (image && imageType) {
            if (!isValidImageType(imageType)) {
                return res.status(400).json({ message: 'Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed.' });
            }

            // Check if image is valid base64
            try {
                const buffer = Buffer.from(image, 'base64');
                if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
                    return res.status(400).json({ message: 'Image size must be less than 5MB' });
                }
            } catch (error) {
                return res.status(400).json({ message: 'Invalid image format' });
            }
        }

        // Create new menu item
        const newMenuItem = new MenuItem({
            restaurant: restaurantId,
            name,
            price: parseFloat(price),
            description,
            category: category || 'Main Course',
            image: image || null, // Store base64 string
            imageType: imageType || null // Store MIME type
        });

        await newMenuItem.save();

        // Add the menu item to the restaurant's menuItems array
        restaurant.menuItems.push(newMenuItem._id);
        await restaurant.save();

        return res.status(201).json({
            message: 'Menu item added successfully',
            menuItem: newMenuItem,
            restaurantName: restaurant.name
        });
    } catch (error) {
        console.error('Error in addMenuItem:', error);
        return res.status(500).json({ message: 'Error adding menu item', error: error.message });
    }
};



// Update a menu item (Admin only)
const updateMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const { name, price, description, category, image, imageType } = req.body;

        // Build the update object
        const updates = {};
        if (name) updates.name = name;
        if (price) updates.price = parseFloat(price);
        if (description) updates.description = description;
        if (category) updates.category = category;

        // Handle image update if provided
        if (image && imageType) {
            if (!isValidImageType(imageType)) {
                return res.status(400).json({ message: 'Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed.' });
            }

            // Check if image is valid base64
            try {
                const buffer = Buffer.from(image, 'base64');
                if (buffer.length > 5 * 1024 * 1024) { // 5MB limit
                    return res.status(400).json({ message: 'Image size must be less than 5MB' });
                }
                updates.image = image;
                updates.imageType = imageType;
            } catch (error) {
                return res.status(400).json({ message: 'Invalid image format' });
            }
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, updates, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        return res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating menu item', error: error.message });
    }
};


module.exports = { addRestaurant, getRestaurants, getRestaurantsForAdmin, getAdminDashboardStats, addMenuItem, updateMenuItem };

