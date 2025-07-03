import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../footer";
import Navbar from "../Navbar";
import { menuAPI } from "../../utils/api";
// Import multiple images
import foodDeliveryImg1 from "../../assets/homepage.jpg";
import foodDeliveryImg2 from "../../assets/Chicken-Biryani.jpg";
import foodDeliveryImg3 from "../../assets/mattar-paneer.jpg";
import foodDeliveryImg4 from "../../assets/Idli Dosa Batter.jpg";
import foodDeliveryImg5 from "../../assets/Easy-Fried-Rice.webp";
import foodDeliveryImg6 from "../../assets/ThaiFriedRice.jpg";
import foodDeliveryImg7 from "../../assets/Easy-Fried-Rice.webp";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await menuAPI.getAllMenuItems();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu items:', err);
      // Fallback to static data if API fails
      setMenuItems([
        { _id: '1', name: "Home Special", price: 249, description: "Delicious and freshly prepared.", image: foodDeliveryImg1 },
        { _id: '2', name: "Chicken Biryani", price: 249, description: "Delicious and freshly prepared.", image: foodDeliveryImg2 },
        { _id: '3', name: "Mattar Paneer", price: 249, description: "Delicious and freshly prepared.", image: foodDeliveryImg3 },
        { _id: '4', name: "Idli Dosa Batter", price: 249, description: "Delicious and freshly prepared.", image: foodDeliveryImg4 },
        { _id: '5', name: "Easy Fried Rice", price: 249, description: "Delicious and freshly prepared.", image: foodDeliveryImg5 },
        { _id: '6', name: "Thai Fried Rice", price: 249, description: "Delicious and freshly prepared.", image: foodDeliveryImg6 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Static images for fallback
  const staticImages = [
    foodDeliveryImg1, foodDeliveryImg2, foodDeliveryImg3,
    foodDeliveryImg4, foodDeliveryImg5, foodDeliveryImg6, foodDeliveryImg7
  ];

  const categories = [
    { name: "Burger", icon: "🍔" },
    { name: "Beverage", icon: "🥤" },
    { name: "Chicken Pasta", icon: "🍝" },
    { name: "Dinner", icon: "🍽️" },
    { name: "Food", icon: "🥘" },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (item) => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', item);
    // You can navigate to cart page or show a toast notification
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="container-fluid p-0">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Enhanced Background */}
      <div className="position-relative overflow-hidden" style={{
        background: "linear-gradient(135deg, rgba(252,176,69,0.15) 0%, rgba(253,29,29,0.15) 50%, rgba(255,87,34,0.1) 100%)",
        borderRadius: "0 0 50px 50px",
        padding: "3rem 1rem 8rem 1rem",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center"
      }}>
        {/* Floating decorative elements */}
        <div className="position-absolute" style={{
          top: "10%",
          right: "10%",
          width: "100px",
          height: "100px",
          background: "linear-gradient(45deg, #FFC107, #FF9800)",
          borderRadius: "50%",
          opacity: "0.1",
          animation: "float 6s ease-in-out infinite"
        }}></div>
        <div className="position-absolute" style={{
          bottom: "20%",
          left: "5%",
          width: "60px",
          height: "60px",
          background: "linear-gradient(45deg, #FF5722, #E91E63)",
          borderRadius: "50%",
          opacity: "0.1",
          animation: "float 8s ease-in-out infinite reverse"
        }}></div>
        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <motion.div
              className="col-lg-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="badge bg-warning text-dark fw-normal mb-3 px-3 py-2">SIMPLE WAY TO MAKE ORDER</span>
              <h1 className="display-4 fw-bold mb-4">
                Delivered Your <span className="text-warning">Food</span> in {" "}
                <span className="text-warning">30 minutes.</span>
              </h1>
              <p className="lead text-muted mb-4">Online Food Home Delivery Services in India with contactless delivery and premium quality ingredients.</p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <motion.button
                  onClick={() => navigate("/menu")}
                  className="btn btn-warning btn-lg px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ borderRadius: "12px", boxShadow: "0 4px 10px rgba(255, 193, 7, 0.3)" }}
                >
                  Order Now
                </motion.button>
                <motion.button
                  className="btn btn-outline-dark btn-lg px-4 py-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ borderRadius: "12px" }}
                >
                  Table Reservation
                </motion.button>
              </div>
            </motion.div>

            {/* Right Side - Hero Image */}
            <motion.div
              className="col-lg-6 d-flex justify-content-center mt-5 mt-lg-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="position-relative">
                <motion.img
                  src={foodDeliveryImg1}
                  alt="Hero food"
                  className="img-fluid"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    maxHeight: "400px",
                    objectFit: "cover"
                  }}
                  whileHover={{ scale: 1.03 }}
                />
                <div className="position-absolute top-0 start-0 translate-middle bg-white p-3 rounded-circle shadow">
                  <span className="fw-bold text-warning">30<br />min</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Search Bar - Floating */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.div
              className="search-container bg-white p-3 rounded-4 shadow"
              style={{ marginTop: "-40px" }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="input-group">
                <span className="input-group-text bg-transparent border-0">
                  <i className="bi bi-search text-warning fs-5"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 py-3 fs-5"
                  placeholder="Search food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ boxShadow: "none" }}
                />
                <motion.button
                  className="btn btn-warning px-4 py-3 rounded-pill"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mt-5 pt-3">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="fw-bold">Popular Categories</h2>
          <p className="text-muted">Browse food by category</p>
        </motion.div>

        <motion.div
          className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {categories.map((category, index) => (
            <div className="col" key={index}>
              <motion.div
                className="card h-100 border-0 bg-light"
                style={{ borderRadius: "16px", cursor: "pointer" }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff"
                }}
              >
                <div className="card-body text-center py-4">
                  <div className="display-5 mb-3">{category.icon}</div>
                  <h5 className="card-title mb-0">{category.name}</h5>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Featured Food Section */}
      <div className="container mt-5 pt-4">
        <motion.div
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div>
            <h2 className="fw-bold mb-1">Featured Food</h2>
            <p className="text-muted">Discover our most popular dishes</p>
          </div>
          <button className="btn btn-outline-warning rounded-pill px-3">
            View All
          </button>
        </motion.div>

        <motion.div
          className="position-relative overflow-hidden py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading delicious food items...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-warning mb-3">
                <i className="bi bi-exclamation-triangle fs-1"></i>
              </div>
              <p className="text-muted">Failed to load menu items. Showing sample items.</p>
            </div>
          ) : null}

          <motion.div
            className="d-flex gap-4"
            drag="x"
            dragConstraints={{ right: 0, left: -1200 }}
            style={{ cursor: "grab" }}
          >
            {filteredMenuItems.map((item, index) => (
              <motion.div
                key={item._id || index}
                className="card border-0"
                style={{
                  minWidth: "280px",
                  maxWidth: "280px",
                  borderRadius: "20px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
                }}
              >
                <img
                  src={item.image || staticImages[index % staticImages.length]}
                  className="card-img-top"
                  alt={item.name}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "20px 20px 0 0"
                  }}
                />
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-title mb-0 fw-bold">{item.name}</h5>
                    <span className="badge bg-light text-warning">★ 4.8</span>
                  </div>
                  <p className="card-text text-muted">
                    {item.description || "Delicious and freshly prepared."}
                  </p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="fs-5 fw-bold">₹{item.price}</span>
                    <button
                      className="btn btn-warning rounded-pill px-3"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* App Download Section */}
      <div className="container mt-5 py-5">
        <div className="row align-items-center">
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <h2 className="fw-bold display-6 mb-3">Download Our Mobile App</h2>
            <p className="lead mb-4">Get exclusive offers and track your orders in real-time with our mobile app.</p>
            <div className="d-flex flex-wrap gap-3">
              <motion.button
                className="btn btn-dark px-4 py-3 d-flex align-items-center gap-2"
                style={{ borderRadius: "12px" }}
                whileHover={{ scale: 1.05 }}
              >
                <i className="bi bi-apple fs-4"></i>
                <div className="text-start">
                  <div className="small fw-light">Download on the</div>
                  <div className="fw-bold">App Store</div>
                </div>
              </motion.button>
              <motion.button
                className="btn btn-dark px-4 py-3 d-flex align-items-center gap-2"
                style={{ borderRadius: "12px" }}
                whileHover={{ scale: 1.05 }}
              >
                <i className="bi bi-google-play fs-4"></i>
                <div className="text-start">
                  <div className="small fw-light">GET IT ON</div>
                  <div className="fw-bold">Google Play</div>
                </div>
              </motion.button>
            </div>
          </motion.div>
          <motion.div
            className="col-lg-6 text-center mt-5 mt-lg-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <img
              src={foodDeliveryImg2}
              alt="Mobile App"
              className="img-fluid"
              style={{
                maxHeight: "400px",
                borderRadius: "20px",
                boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;