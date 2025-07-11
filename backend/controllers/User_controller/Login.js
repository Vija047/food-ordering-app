const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../Models/users");

const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body; // Added role from request
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (role) {
      // If role is 'admin', user must be admin
      if (role === 'admin' && !user.isAdmin) {
        return res.status(403).json({ error: "Access denied: Not an admin user" });
      }
      // If role is 'customer', user must not be admin
      if (role === 'customer' && user.isAdmin) {
        return res.status(403).json({ error: "Access denied: Not a customer user" });
      }
      // If role is provided but does not match user's role (if user.role exists)
      if (user.role && user.role !== role) {
        return res.status(403).json({ error: `Access denied: User is not a ${role}` });
      }
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: `Login successful as ${user.role || (user.isAdmin ? 'admin' : 'user')}`,
      token,
      user: { name: user.name, email: user.email, role: user.role, isAdmin: user.isAdmin } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email"); // ✅ Fetch name & email only

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { loginUser, getUserDetails };
