const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require("cors");

const PORT = process.env.PORT || 7000;

// Connect to the database
connectDB();

// Import Routes
const userRoutes = require('./Routes/UserRoutes');
const restaurantRoutes = require("./Routes/RestaurntRoutes");
const orderRoutes = require('./Routes/orderRoutes');

// Middleware to parse JSON
app.use(express.json());

// CORS middleware for handling cross-origin requests
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

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
