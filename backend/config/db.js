const mongoose = require("mongoose");
require("dotenv").config();

const connectWithRetry = async (retryCount = 0) => {
  const maxRetries = 5;
  const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB error:", err);
    });
  } catch (error) {
    console.error("Connection error:", error.message);

    if (retryCount < maxRetries) {
      console.log(
        `Retrying in ${backoffDelay / 1000}s... (${
          retryCount + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return connectWithRetry(retryCount + 1);
    }
    process.exit(1);
  }
};

module.exports = connectWithRetry;
