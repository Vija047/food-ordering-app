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

// Get individual menu item by ID
const getMenuItemById = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;

    // Validate if menuItemId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId).populate('restaurant');

    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    return res.status(200).json(menuItem);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching menu item", error: error.message });
  }
};

// Delete a menu item by ID
const deleteMenuItem = async (req, res) => {
  try {
    const menuItemId = req.params.menuItemId;

    console.log("Delete request received for menu item ID:", menuItemId);
    console.log("User requesting deletion:", req.user.email, "Role:", req.user.role);

    // Validate if menuItemId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      console.error("Invalid menu item ID format:", menuItemId);
      return res.status(400).json({ message: "Invalid menu item ID format" });
    }

    // Find the menu item
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      console.error("Menu item not found:", menuItemId);
      return res.status(404).json({ message: "Menu item not found" });
    }

    console.log("Found menu item to delete:", menuItem.name);

    // Remove the menu item reference from the restaurant
    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant) {
      console.log("Removing menu item from restaurant:", restaurant.name);
      restaurant.menuItems.pull(menuItemId);
      await restaurant.save();
    }

    // Delete the menu item
    const deletedItem = await MenuItem.findByIdAndDelete(menuItemId);

    if (!deletedItem) {
      console.error("Failed to delete menu item:", menuItemId);
      return res.status(500).json({ message: "Failed to delete menu item" });
    }

    console.log("Successfully deleted menu item:", deletedItem.name);
    return res.status(200).json({ message: "Menu item deleted successfully" });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ message: "Error deleting menu item", error: error.message });
  }
};

module.exports = { getAllMenuItems, addMenuItem, getMenuItems, getMenuItemById, deleteMenuItem };
