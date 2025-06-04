const mongoose = require("mongoose"); // Import mongoose
const MenuItem = require("../../Models/MenuItems");
const Restaurant = require("../../Models/Restaurants");

// Get all menu items (regardless of restaurant)
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find(); // Fetch all menu items
    if (!menuItems.length) {
      return res.status(404).json({ message: "No menu items available" });
    }
    return res.status(200).json(menuItems);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching menu items", error: error.message });
  }
};

// Add a menu item to a restaurant (Admin only)
const addMenuItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    const restaurantId = req.params.id;

    // Validate if restaurantId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Validate if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if location is missing
    if (!restaurant.location) {
      return res.status(400).json({ message: "Restaurant location is required" });
    }

    // Check if name and price are provided
    if (!name || !price) {
      return res.status(400).json({ message: "Menu item name and price are required" });
    }

    // Create new menu item
    const newMenuItem = new MenuItem({ name, price, restaurant: restaurantId });
    await newMenuItem.save();

    // Add to restaurant's menu
    restaurant.menuItems.push(newMenuItem._id);
    await restaurant.save();

    return res.status(201).json({ message: "Menu item added successfully", menuItem: newMenuItem });
  } catch (error) {
    return res.status(500).json({ message: "Error adding menu item", error: error.message });
  }
};

// Get all menu items of a restaurant
const getMenuItems = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    // Validate if restaurantId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID format" });
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find menu items linked to this restaurant
    const menuItems = await MenuItem.find({ restaurant: restaurantId });

    if (!menuItems.length) {
      return res.status(404).json({ message: "No menu items found for this restaurant" });
    }

    return res.status(200).json(menuItems);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching menu items", error: error.message });
  }
};

module.exports = { getAllMenuItems, addMenuItem, getMenuItems };
