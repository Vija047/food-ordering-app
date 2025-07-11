const express = require("express");

const { registerUser } = require("../controllers/User_controller/Users_Register");
const { loginUser, getUserDetails } = require('../controllers/User_controller/Login');
const { protect } = require("../middleware/auth_Resta");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUserDetails);

module.exports = router;