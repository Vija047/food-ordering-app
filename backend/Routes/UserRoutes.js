const express = require("express");

const  { registerUser}  = require("../controllers/User_controller/Users_Register");
const  {loginUser, getUserDetails }=require('../controllers/User_controller/Login');
const { protect } = require("../middleware/auth_Resta");

const router = express.Router();

router.post("/Register",registerUser);
router.post("/Login",loginUser );
router.get("/user",protect, getUserDetails);
module.exports = router;