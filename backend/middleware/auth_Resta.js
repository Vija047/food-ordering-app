const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Models/users");

dotenv.config();

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  console.error("Missing JWT secret key!");
}

const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secretKey);



    // Fix: Use 'id' instead of 'userId' as per your JWT payload
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      console.warn("JWT payload missing userId property!");
      return res
        .status(401)
        .json({ message: "Invalid token payload: userId missing" });
    }

    // Fetch user from database to check current role
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Check if attempting to access wrong role endpoints
    const requestedRole = req.path.includes("restaurant")
      ? "restaurant-owner"
      : req.path.includes("customer")
        ? "customer"
        : null;

    if (
      requestedRole &&
      (!user.role || user.role !== requestedRole)
    ) {
      return res.status(403).json({
        message: `Access denied. You are registered as ${user.role || "unknown"}, cannot access ${requestedRole} features`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res
      .status(403)
      .json({ message: "Unauthorized: Invalid or expired token" });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin access required" });
  }
  next();
};

const authorizeRestaurantOwner = (req, res, next) => {
  if (!req.user || req.user.role !== "restaurant_owner") {
    return res
      .status(403)
      .json({ message: "Unauthorized: Restaurant owner access required" });
  }
  next();
};

const authorizeAdminOrRestaurantOwner = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "restaurant_owner")) {
    return res
      .status(403)
      .json({ message: "Unauthorized: Admin or Restaurant owner access required" });
  }
  next();
};

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach user info

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Unauthorized: Required role(s): ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeRestaurantOwner,
  authorizeAdminOrRestaurantOwner,
  protect,
  authorizeRole,
};
