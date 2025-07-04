import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import Footer from "../footer";

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
  const [cartMessage, setCartMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [isScrolled, setIsScrolled] = useState(false);

  // Hero carousel images
  const heroImages = [foodDeliveryImg1, foodDeliveryImg2, foodDeliveryImg3, foodDeliveryImg4];

  useEffect(() => {
    setIsVisible(true);
    fetchMenuItems();

    // Auto-rotate hero images
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    // Scroll detection for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [heroImages.length]);

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
        { _id: '1', name: "Signature Burger", price: 299, description: "Premium beef patty with fresh ingredients", image: foodDeliveryImg1, category: "Burger", rating: 4.8, cookingTime: "15 min", discount: 10 },
        { _id: '2', name: "Chicken Biryani", price: 349, description: "Aromatic basmati rice with tender chicken pieces", image: foodDeliveryImg2, category: "Dinner", rating: 4.9, cookingTime: "25 min", discount: 15 },
        { _id: '3', name: "Mattar Paneer", price: 249, description: "Fresh cottage cheese with green peas in rich gravy", image: foodDeliveryImg3, category: "Dinner", rating: 4.7, cookingTime: "20 min", discount: 5 },
        { _id: '4', name: "Idli Dosa Combo", price: 199, description: "South Indian breakfast combo with chutneys", image: foodDeliveryImg4, category: "Food", rating: 4.6, cookingTime: "12 min", discount: 20 },
        { _id: '5', name: "Thai Fried Rice", price: 279, description: "Exotic Thai-style fried rice with fresh vegetables", image: foodDeliveryImg5, category: "Food", rating: 4.8, cookingTime: "18 min", discount: 8 },
        { _id: '6', name: "Creamy Pasta", price: 329, description: "Italian pasta in rich cream sauce", image: foodDeliveryImg6, category: "Chicken Pasta", rating: 4.7, cookingTime: "22 min", discount: 12 },
        { _id: '7', name: "Fresh Smoothie", price: 149, description: "Healthy fruit smoothie with natural ingredients", image: foodDeliveryImg7, category: "Beverage", rating: 4.5, cookingTime: "5 min", discount: 0 },
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
    { name: "All", icon: "🍽️", color: "bg-warning" },
    { name: "Burger", icon: "🍔", color: "bg-danger" },
    { name: "Beverage", icon: "🥤", color: "bg-info" },
    { name: "Chicken Pasta", icon: "🍝", color: "bg-success" },
    { name: "Dinner", icon: "🍽️", color: "bg-primary" },
    { name: "Food", icon: "🥘", color: "bg-warning" },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToCart = (item) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Store current page for redirect after login
      localStorage.setItem('redirectAfterLogin', '/home');
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const existingItemIndex = cartItems.findIndex(cartItem => cartItem._id === item._id);

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity = (cartItems[existingItemIndex].quantity || 1) + 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    setCartMessage(`${item.name} added to cart!`);
    setTimeout(() => setCartMessage(""), 2000);
  };

  const handleQuickOrder = (item) => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // Store cart page for redirect after login
      localStorage.setItem('redirectAfterLogin', '/cart');
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    handleAddToCart(item);
    navigate("/cart");
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.round(price - (price * discount / 100));
  };

  const handlePriceRangeChange = (newRange) => {
    setPriceRange(newRange);
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 1000]);
    setSearchQuery("");
  };

  return (
    <div className="container-fluid p-0">
      {/* Floating Action Button */}
      <motion.div
        className="position-fixed bottom-0 end-0 m-4"
        style={{ zIndex: 1000 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <button
          className="btn btn-warning rounded-circle p-3 shadow-lg"
          onClick={() => {
            const token = localStorage.getItem('token');
            if (!token) {
              localStorage.setItem('redirectAfterLogin', '/cart');
              navigate('/login');
            } else {
              navigate('/cart');
            }
          }}
          style={{ width: "60px", height: "60px" }}
        >
          <i className="bi bi-cart3 fs-5"></i>
        </button>
      </motion.div>

      {/* Sticky Navigation Bar */}        <motion.div
        className={`position-fixed top-0 w-100 px-4 py-3 transition-all ${isScrolled ? 'bg-white shadow-sm' : ''}`}
        style={{
          zIndex: 999,
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(10px)' : 'none',
          borderBottomWidth: isScrolled ? '1px' : '0',
          borderBottomStyle: isScrolled ? 'solid' : 'none',
          borderBottomColor: isScrolled ? '#eee' : 'transparent'
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <h4 className={`mb-0 fw-bold ${isScrolled ? 'text-dark' : 'text-white'}`}>
                🍽️ FoodieApp
              </h4>
            </div>
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={() => setShowFilterModal(true)}
              >
                <i className="bi bi-funnel"></i> Filters
              </button>
              <button
                className="btn btn-warning btn-sm"
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    localStorage.setItem('redirectAfterLogin', '/cart');
                    navigate('/login');
                  } else {
                    navigate('/cart');
                  }
                }}
              >
                <i className="bi bi-cart3"></i> Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Show cart message */}
      {cartMessage && (
        <motion.div
          className="position-fixed top-0 start-50 translate-middle-x mt-5 pt-5"
          style={{ zIndex: 9999 }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          <div className="alert alert-success border-0 shadow-lg rounded-pill px-4 py-3">
            <i className="bi bi-check-circle-fill text-success me-2"></i>
            {cartMessage}
          </div>
        </motion.div>
      )}

      {/* Hero Section with Dynamic Background */}
      <div className="position-relative overflow-hidden" style={{
        backgroundImage: `linear-gradient(135deg, rgba(252,176,69,0.9) 0%, rgba(253,29,29,0.8) 50%, rgba(255,87,34,0.9) 100%), url(${heroImages[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRadius: "0 0 50px 50px",
        paddingTop: "5rem",
        paddingRight: "1rem",
        paddingBottom: "10rem",
        paddingLeft: "1rem",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center"
      }}>
        {/* Animated Background Elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="position-absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${50 + Math.random() * 50}px`,
              height: `${50 + Math.random() * 50}px`,
              background: `linear-gradient(45deg, ${['#FFC107', '#FF9800', '#FF5722', '#E91E63', '#9C27B0'][i]}, transparent)`,
              borderRadius: "50%",
              opacity: "0.1",
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <div className="container">
          <div className="row align-items-center">
            {/* Left Content */}
            <motion.div
              className="col-lg-6 text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span
                className="badge bg-white text-dark fw-normal mb-3 px-4 py-2"
                style={{ fontSize: "0.9rem", borderRadius: "25px" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                🚀 FASTEST DELIVERY IN TOWN
              </motion.span>

              <motion.h1
                className="display-3 fw-bold mb-4 text-shadow"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                Delicious Food <br />
                <span className="text-warning">Delivered Fast</span>
              </motion.h1>

              <motion.p
                className="lead mb-4 text-light"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                Experience the finest cuisine delivered to your doorstep in just 30 minutes.
                Premium ingredients, professional chefs, unbeatable taste.
              </motion.p>

              <motion.div
                className="d-flex flex-wrap gap-3 mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => navigate("/menu")}
                  className="btn btn-warning btn-lg px-5 py-3 fw-bold"
                  style={{ borderRadius: "50px", fontSize: "1.1rem" }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 193, 7, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-lightning-charge me-2"></i>
                  Order Now
                </motion.button>
                <motion.button
                  className="btn btn-outline-light btn-lg px-5 py-3 fw-bold"
                  style={{ borderRadius: "50px", fontSize: "1.1rem" }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  Watch Demo
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="row mt-5 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <div className="col-4">
                  <h3 className="fw-bold text-warning mb-1">10K+</h3>
                  <small className="text-light">Happy Customers</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-warning mb-1">500+</h3>
                  <small className="text-light">Food Items</small>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-warning mb-1">30min</h3>
                  <small className="text-light">Avg. Delivery</small>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Interactive Food Card */}
            <motion.div
              className="col-lg-6 d-flex justify-content-center mt-5 mt-lg-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="position-relative">
                <motion.div
                  className="card border-0 shadow-lg"
                  style={{
                    borderRadius: "30px",
                    overflow: "hidden",
                    maxWidth: "400px",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)"
                  }}
                  whileHover={{ y: -10, boxShadow: "0 25px 50px rgba(0,0,0,0.2)" }}
                >
                  <div className="position-relative">
                    <img
                      src={heroImages[currentImageIndex]}
                      alt="Featured food"
                      className="card-img-top"
                      style={{
                        height: "250px",
                        objectFit: "cover",
                        transition: "all 0.5s ease"
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-3">
                      <span className="badge bg-warning text-dark fw-bold px-3 py-2">
                        ⭐ 4.9
                      </span>
                    </div>
                    <div className="position-absolute bottom-0 start-0 m-3">
                      <span className="badge bg-success text-white fw-bold px-3 py-2">
                        🕒 25 min
                      </span>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="card-title fw-bold mb-2">Today's Special</h5>
                    <p className="card-text text-muted mb-3">
                      Chef's recommended dish prepared with finest ingredients
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 fw-bold text-warning mb-0">₹299</span>
                      <button className="btn btn-warning px-4 py-2 fw-bold">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <motion.div
              className="bg-white p-4 rounded-5 shadow-lg"
              style={{
                marginTop: "-60px",
                border: "1px solid #f0f0f0"
              }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="row align-items-center">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0 ps-0">
                      <i className="bi bi-search text-warning fs-4"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 py-3 fs-5"
                      placeholder="Search for food, restaurants, cuisine..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ boxShadow: "none", fontSize: "1.1rem" }}
                    />
                  </div>
                </div>
                <div className="col-md-4 text-end">
                  <motion.button
                    className="btn btn-warning px-4 py-3 fw-bold me-2"
                    style={{ borderRadius: "25px" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bi bi-search me-2"></i>
                    Search
                  </motion.button>
                  <motion.button
                    className="btn btn-outline-warning px-4 py-3"
                    style={{ borderRadius: "25px" }}
                    onClick={() => navigate("/location")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="bi bi-geo-alt"></i>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive Categories Section */}
      <div className="container mt-5 pt-5">
        <motion.div
          className="text-center mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="display-6 fw-bold mb-2">Explore Categories</h2>
          <p className="lead text-muted">Discover food by your favorite category</p>
        </motion.div>

        <motion.div
          className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-4 justify-content-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {categories.map((category, index) => (
            <div className="col" key={index}>
              <motion.div
                className={`card h-100 border-0 ${selectedCategory === category.name ? 'shadow-lg ' + category.color : 'bg-light'}`}
                style={{
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategorySelect(category.name)}
              >
                <div className="card-body text-center py-4">
                  <motion.div
                    className="display-4 mb-3"
                    animate={{ rotate: selectedCategory === category.name ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h6 className={`card-title mb-0 fw-bold ${selectedCategory === category.name ? 'text-white' : 'text-dark'}`}>
                    {category.name}
                  </h6>
                  {selectedCategory === category.name && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-2"
                    >
                      <i className="bi bi-check-circle text-white"></i>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Featured Food Section */}
      <div className="container mt-5 pt-5">
        <motion.div
          className="d-flex justify-content-between align-items-center mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div>
            <h2 className="display-6 fw-bold mb-2">Featured Delights</h2>
            <p className="lead text-muted">Handpicked favorites from our kitchen</p>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="badge bg-warning text-dark px-3 py-2">
              {filteredMenuItems.length} items found
            </span>
            <button
              className="btn btn-outline-warning px-4 py-2"
              onClick={() => navigate("/menu")}
              style={{ borderRadius: "25px" }}
            >
              <i className="bi bi-arrow-right me-2"></i>
              View All
            </button>
          </div>
        </motion.div>

        <motion.div
          className="position-relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <h5 className="text-muted">Loading delicious food items...</h5>
              <p className="text-muted">Please wait while we fetch the best dishes for you</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-warning mb-3">
                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "3rem" }}></i>
              </div>
              <h5 className="text-muted">Oops! Something went wrong</h5>
              <p className="text-muted">Failed to load menu items. Showing sample items instead.</p>
              <button className="btn btn-warning px-4 py-2" onClick={fetchMenuItems}>
                <i className="bi bi-arrow-clockwise me-2"></i>
                Try Again
              </button>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {filteredMenuItems.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  className="col"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <motion.div
                    className="card h-100 border-0 shadow-sm"
                    style={{ borderRadius: "25px", overflow: "hidden" }}
                    whileHover={{
                      y: -8,
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                      scale: 1.02
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="position-relative">
                      <img
                        src={item.image || staticImages[index % staticImages.length]}
                        className="card-img-top"
                        alt={item.name}
                        style={{
                          height: "220px",
                          objectFit: "cover",
                          filter: "brightness(0.9)"
                        }}
                      />
                      {/* Discount Badge */}
                      {item.discount && item.discount > 0 && (
                        <div className="position-absolute top-0 start-0 m-3">
                          <span className="badge bg-danger text-white px-3 py-2 fw-bold">
                            {item.discount}% OFF
                          </span>
                        </div>
                      )}
                      {/* Rating Badge */}
                      <div className="position-absolute top-0 end-0 m-3">
                        <span className="badge bg-dark text-white px-3 py-2">
                          ⭐ {item.rating || "4.5"}
                        </span>
                      </div>
                      {/* Cooking Time */}
                      <div className="position-absolute bottom-0 start-0 m-3">
                        <span className="badge bg-warning text-dark px-3 py-2 fw-bold">
                          🕒 {item.cookingTime || "20 min"}
                        </span>
                      </div>
                      {/* Heart Icon */}
                      <div className="position-absolute bottom-0 end-0 m-3">
                        <motion.button
                          className="btn btn-light btn-sm rounded-circle p-2"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <i className="bi bi-heart text-danger"></i>
                        </motion.button>
                      </div>
                    </div>

                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold mb-0" style={{ fontSize: "1.1rem" }}>
                          {item.name}
                        </h5>
                        <span className="badge bg-light text-success border">
                          <i className="bi bi-patch-check-fill"></i> Fresh
                        </span>
                      </div>

                      <p className="card-text text-muted mb-3" style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                        {item.description || "Delicious and freshly prepared with premium ingredients."}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <div className="price-section">
                          {item.discount && item.discount > 0 ? (
                            <div>
                              <span className="h5 fw-bold text-success mb-0">
                                ₹{getDiscountedPrice(item.price, item.discount)}
                              </span>
                              <span className="text-muted text-decoration-line-through ms-2">
                                ₹{item.price}
                              </span>
                            </div>
                          ) : (
                            <span className="h5 fw-bold text-warning mb-0">₹{item.price}</span>
                          )}
                        </div>

                        <div className="d-flex gap-2">
                          <motion.button
                            className="btn btn-outline-warning btn-sm px-3"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleQuickOrder(item)}
                          >
                            <i className="bi bi-lightning"></i>
                          </motion.button>
                          <motion.button
                            className="btn btn-warning btn-sm px-3 fw-bold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddToCart(item)}
                          >
                            <i className="bi bi-cart-plus me-1"></i>
                            Add
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Enhanced App Download Section */}
      <div className="container mt-5 py-5">
        <div className="row align-items-center">
          <motion.div
            className="col-lg-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <span className="badge bg-light text-warning fw-bold px-3 py-2 mb-3">
              📱 MOBILE APP
            </span>
            <h2 className="display-6 fw-bold mb-3">
              Order Faster with Our <span className="text-warning">Mobile App</span>
            </h2>
            <p className="lead mb-4 text-muted">
              Get exclusive app-only offers, real-time order tracking, and lightning-fast checkout.
              Download now and save 20% on your first order!
            </p>

            <div className="row mb-4">
              <div className="col-4 text-center">
                <div className="text-warning mb-2">
                  <i className="bi bi-lightning-charge fs-2"></i>
                </div>
                <small className="text-muted fw-bold">Faster Ordering</small>
              </div>
              <div className="col-4 text-center">
                <div className="text-warning mb-2">
                  <i className="bi bi-geo-alt fs-2"></i>
                </div>
                <small className="text-muted fw-bold">Live Tracking</small>
              </div>
              <div className="col-4 text-center">
                <div className="text-warning mb-2">
                  <i className="bi bi-percent fs-2"></i>
                </div>
                <small className="text-muted fw-bold">Exclusive Offers</small>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <motion.button
                className="btn btn-dark px-4 py-3 d-flex align-items-center gap-3"
                style={{ borderRadius: "15px" }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-apple fs-3"></i>
                <div className="text-start">
                  <div className="small fw-light">Download on the</div>
                  <div className="fw-bold">App Store</div>
                </div>
              </motion.button>
              <motion.button
                className="btn btn-dark px-4 py-3 d-flex align-items-center gap-3"
                style={{ borderRadius: "15px" }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-google-play fs-3"></i>
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
            <div className="position-relative">
              <motion.img
                src={foodDeliveryImg2}
                alt="Mobile App Preview"
                className="img-fluid"
                style={{
                  maxHeight: "450px",
                  borderRadius: "30px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              />

              {/* Floating elements around the phone */}
              <motion.div
                className="position-absolute top-0 start-0 bg-warning text-white px-3 py-2 rounded-pill"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🍕 Pizza
              </motion.div>

              <motion.div
                className="position-absolute top-0 end-0 bg-success text-white px-3 py-2 rounded-pill"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🍔 Burger
              </motion.div>

              <motion.div
                className="position-absolute bottom-0 start-0 bg-danger text-white px-3 py-2 rounded-pill"
                animate={{
                  y: [0, 10, 0],
                  rotate: [0, 3, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🍱 Meals
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-light py-5 mt-5">
        <div className="container">
          <motion.div
            className="row justify-content-center text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">Stay Updated with Our Latest Offers</h3>
              <p className="text-muted mb-4">
                Subscribe to our newsletter and get exclusive deals, new menu updates, and food tips delivered to your inbox.
              </p>
              <div className="input-group mb-3" style={{ maxWidth: "500px", margin: "0 auto" }}>
                <input
                  type="email"
                  className="form-control py-3"
                  placeholder="Enter your email address"
                  style={{ borderRadius: "25px 0 0 25px" }}
                />
                <motion.button
                  className="btn btn-warning px-4 fw-bold"
                  type="button"
                  style={{ borderRadius: "0 25px 25px 0" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
              <small className="text-muted">
                <i className="bi bi-shield-check text-success me-1"></i>
                We respect your privacy. Unsubscribe anytime.
              </small>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Filter Options</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowFilterModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <label className="form-label fw-bold">Price Range</label>
                  <div className="row">
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Min Price"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange([parseInt(e.target.value) || 0, priceRange[1]])}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Max Price"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value) || 1000])}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Category</label>
                  <div className="d-flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.name}
                        className={`btn btn-sm ${selectedCategory === category.name ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => setShowFilterModal(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;