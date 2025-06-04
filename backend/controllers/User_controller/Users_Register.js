const bcrypt = require("bcrypt");
const User = require("../../Models/users");

const registerUser = async (req, res) => {
  try {
    // Ensure that req.body is not undefined
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }

    // Destructure the necessary fields from the request body
    const { name, email, password, role } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already registered" });
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
    res.status(201).json({ message: "User registered successfully", user: newUser });

  } catch (error) {
    console.error("Error in user registration:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

module.exports = { registerUser };
