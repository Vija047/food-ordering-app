const bcrypt = require("bcrypt");
const User = require("../../Models/users");

const registerUser = async (req, res) => {
  try {
    // Log the incoming request for debugging
    console.log('Registration request received:', req.body);

    // Ensure that req.body is not undefined
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    // Destructure the necessary fields from the request body
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "All fields are required",
        details: {
          name: !name ? "Name is required" : null,
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
          role: !role ? "Role is required" : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Please provide a valid email address" });
    }

    // Validate role
    const validRoles = ['customer', 'admin', 'restaurant_owner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Role must be 'customer', 'admin', or 'restaurant_owner'" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user to the database
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // Don't send the password back in the response
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse
    });
  } catch (error) {
    console.error("Error in user registration:", error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        error: "User with this email already exists"
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
};

// Update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const updates = req.body.profile; // Expecting profile object in req.body.profile
    const user = await User.findById(adminId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized or not an admin' });
    }
    user.profile = { ...user.profile, ...updates };
    await user.save();
    return res.status(200).json({ message: 'Profile updated successfully', profile: user.profile });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

module.exports = { registerUser, updateAdminProfile };
