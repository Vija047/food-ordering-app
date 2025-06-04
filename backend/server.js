require("dotenv").config();
const express = require("express");
const connectWithRetry = require("./config/db");
const app = express();

// Connect to MongoDB
connectWithRetry();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
