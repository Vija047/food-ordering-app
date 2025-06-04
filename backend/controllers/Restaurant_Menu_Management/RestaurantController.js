const Restaurant = require('../../Models/Restaurants');

// Add a new restaurant (Admin only)
const addRestaurant = async (req, res) => {
    try {
        const { name, location } = req.body;

        // Check if restaurant already exists
        const existingRestaurant = await Restaurant.findOne({ name });
        if (existingRestaurant) {
            return res.status(400).json({ message: 'Restaurant already exists' });
        }

        const newRestaurant = new Restaurant({ name, location });
        await newRestaurant.save();

        return res.status(201).json({ message: 'Restaurant added successfully', restaurant: newRestaurant });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding restaurant', error: error.message });
    }
};

// Get list of all restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        return res.status(200).json(restaurants);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching restaurants', error: error.message });
    }
};

module.exports = { addRestaurant, getRestaurants };

