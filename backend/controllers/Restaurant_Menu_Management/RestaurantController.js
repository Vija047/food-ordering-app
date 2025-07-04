const Restaurant = require('../../Models/Restaurants');
const MenuItem = require('../../Models/MenuItems');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

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
        const { name, price, description, category } = req.body; // Get other data from body

        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
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

        // Create new menu item
        const newMenuItem = new MenuItem({
            restaurant: restaurantId,
            name,
            price: parseFloat(price),
            description,
            category: category || 'Main Course',
            image: req.file ? req.file.filename : null // Save the filename
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
        const updates = req.body; // name, price, description, image, etc.
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, updates, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        return res.status(200).json({ message: 'Menu item updated successfully', menuItem: updatedMenuItem });
    } catch (error) {
        return res.status(500).json({ message: 'Error updating menu item', error: error.message });
    }
};

// Delete a menu item (Admin only)
const deleteMenuItem = async (req, res) => {
    try {
        const { menuItemId } = req.params;
        const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        return res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting menu item', error: error.message });
    }
};

module.exports = { addRestaurant, getRestaurants, getRestaurantsForAdmin, getAdminDashboardStats, addMenuItem, updateMenuItem, deleteMenuItem, upload };

