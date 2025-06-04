import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function About() {
  const appVersion = "1.0.0"; // Update this when needed

  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Header Section */}
      <motion.div
        className="text-center mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="fw-bold text-">ABOUT US</h1>
        <p className="text-muted">Your go-to food ordering app for a seamless and delicious experience!</p>
      </motion.div>

      {/* About Section */}
      <div className="row align-items-center">
        <motion.div
          className="col-md-6"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/040/210/257/small/ai-generated-a-plate-of-delicious-enchiladas-with-taco-sauce-colorful-mexican-food-photo.jpeg"
            alt="Delicious Food"
            className="img-fluid rounded shadow-lg"
          />
        </motion.div>
        <motion.div
          className="col-md-6"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h2 className="card-title text-center text-success">Why Choose DishDash?</h2>
              <p className="card-text text-muted">
                DishDash is designed to make food ordering quick, simple, and efficient.
                Whether you're craving snacks, meals, or desserts, we bring the best food to your doorstep!
              </p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item border-0">✅ <strong>Fast & Easy Ordering</strong> - Just a few taps and your food is on the way.</li>
                <li className="list-group-item border-0">✅ <strong>Variety of Choices</strong> - From street food to fine dining, we have it all.</li>
                <li className="list-group-item border-0">✅ <strong>Live Order Tracking</strong> - Know exactly when your food will arrive.</li>
                <li className="list-group-item border-0">✅ <strong>Secure Payments</strong> - Multiple payment options for a hassle-free experience.</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <motion.div
        className="mt-5 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-primary">How It Works</h2>
        <p className="text-muted">Ordering your favorite food is easy with DishDash!</p>
        <div className="row">
          <div className="col-md-4">
            <motion.div
              className="p-3 shadow-lg rounded bg-white"
              whileHover={{ scale: 1.05 }}
            >
              <h5>📲 Choose Your Food</h5>
              <p>Browse through a variety of dishes from top restaurants.</p>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div
              className="p-3 shadow-lg rounded bg-white"
              whileHover={{ scale: 1.05 }}
            >
              <h5>💳 Make Payment</h5>
              <p>Secure payments via multiple methods including UPI & Cards.</p>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div
              className="p-3 shadow-lg rounded bg-white"
              whileHover={{ scale: 1.05 }}
            >
              <h5>🚀 Get It Delivered</h5>
              <p>Track your order live and enjoy delicious food at home.</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Customer Reviews Section */}
      <motion.div
        className="mt-5 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-success">What Our Customers Say</h2>
        <div className="row">
          <div className="col-md-4">
            <motion.div
              className="p-3 border rounded shadow-sm bg-light"
              whileHover={{ scale: 1.05 }}
            >
              <p>"DishDash is a game-changer! The food always arrives on time and tastes amazing!"</p>
              <h6>- Priya K.</h6>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div
              className="p-3 border rounded shadow-sm bg-light"
              whileHover={{ scale: 1.05 }}
            >
              <p>"Best food ordering app! The UI is so easy to use, and the service is fast."</p>
              <h6>- Rahul M.</h6>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div
              className="p-3 border rounded shadow-sm bg-light"
              whileHover={{ scale: 1.05 }}
            >
              <p>"The variety of restaurants available is amazing. I love how smooth everything works."</p>
              <h6>- Sneha D.</h6>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Contact Us Section */}
      <motion.div
        className="mt-5 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-primary">Contact Us</h2>
        <p className="text-muted">Need help? Reach out to our support team anytime!</p>
        <p>Email: <strong>support@dishdash.com</strong></p>
        <p>Phone: <strong>+91 98765 43210</strong></p>
      </motion.div>

      {/* App Version Section */}
      <div className="text-center mt-4">
        <p className="text-secondary">
          <strong>App Version:</strong> <span className="badge bg-success">{appVersion}</span>
        </p>
      </div>
    </motion.div>
  );
}

export default About;
