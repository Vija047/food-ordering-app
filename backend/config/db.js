const mongoose = require("mongoose");
const dns = require("dns");
require("dotenv").config();

// Configure DNS settings
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]); // Use Google's DNS servers

const connectWithRetry = async (retryCount = 0) => {
  const maxRetries = 5;
  const backoffDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      family: 4,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(`Connection error: ${error.message}`);

    if (retryCount < maxRetries) {
      console.log(
        `Retrying in ${backoffDelay / 1000}s... (${retryCount + 1
        }/${maxRetries})`
      );
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return connectWithRetry(retryCount + 1);
    }
    process.exit(1);
  }
};

module.exports = connectWithRetry;
