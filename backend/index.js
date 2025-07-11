require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require("cors");

const PORT = process.env.PORT || 7000;

// Connect to the database
connectDB();

// CORS middleware for handling cross-origin requests (MUST be before routes)
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"], // Allow both ports
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// Middleware to parse JSON
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));



// Import Routes
const userRoutes = require('./Routes/UserRoutes');
const restaurantRoutes = require("./Routes/RestaurntRoutes");
const orderRoutes = require('./Routes/orderRoutes');

// Register routes
app.use('/api', userRoutes);
app.use("/api", restaurantRoutes);
app.use("/api", orderRoutes);

// Basic test route
app.get('/get', (req, res) => {
  res.json({ at: 'Hello World! hey am Vijay' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
