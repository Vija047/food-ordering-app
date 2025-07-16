import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaPlus, FaTrashAlt, FaStore, FaUtensils } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const OrderWithCart = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [filteredMenuItems, setFilteredMenuItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [isLoading, setIsLoading] = useState(true);
    const [cartVisible, setCartVisible] = useState(false);
    const [error, setError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();

    // Define the API base URL
    const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:7000";

    // Debug log to check API URL
    console.log('API_URL:', API_URL);

    // Function to get full image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) {
            console.log('No image URL provided, returning null');
            return null;
        }

        // Validate API_URL first
        if (!API_URL || API_URL === 'undefined' || API_URL === 'null') {
            console.error('API_URL is not properly configured:', API_URL);
            return null;
        }

        // If it's already a full URL (starts with http), return as is
        if (imageUrl.startsWith('http')) {
            console.log('Full URL detected:', imageUrl);
            return imageUrl;
        }

        // If it's a relative path, construct full URL
        // Handle both cases: with and without leading slash
        let fullUrl;
        if (imageUrl.startsWith('/')) {
            fullUrl = `${API_URL}${imageUrl}`;
        } else {
            // Assume it's a filename that should be served from /uploads
            fullUrl = `${API_URL}/uploads/${imageUrl}`;
        }

        console.log('Constructed full URL:', fullUrl);
        return fullUrl;
    };

    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/api/restaurants`);
                setRestaurants(response.data);

                // Load cart from localStorage after restaurants are loaded
                const savedCart = localStorage.getItem('currentCart');
                if (savedCart) {
                    try {
                        const parsedCart = JSON.parse(savedCart);
                        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
                            setCart(parsedCart);
                            setCartVisible(true);
                        }
                    } catch (error) {
                        console.error("Error parsing saved cart:", error);
                        localStorage.removeItem('currentCart');
                    }
                }
            } catch (error) {
                console.error("Error fetching restaurants:", error);
                setError("Failed to load restaurants. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurants();
    }, [API_URL]);

    // Function to fetch all menu items from all restaurants using useCallback
    const fetchAllMenuItems = React.useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Get all menu items
            const response = await axios.get(`${API_URL}/api/allmenu`);

            if (response.data && Array.isArray(response.data)) {
                // Get restaurant information for each menu item
                const restaurantsResponse = await axios.get(`${API_URL}/api/restaurants`);
                const restaurantsData = restaurantsResponse.data;

                // Enrich menu items with restaurant information
                const enrichedMenuItems = response.data.map(item => {
                    // Use the correct field name from the backend model - 'restaurant' instead of 'restaurantId'
                    const restaurant = restaurantsData.find(r => r._id === item.restaurant);
                    let restaurantName = 'Unknown Restaurant';

                    // More robust restaurant name assignment
                    if (restaurant && restaurant.name) {
                        restaurantName = restaurant.name;
                    } else if (item.restaurantName) {
                        // Use existing name if already present
                        restaurantName = item.restaurantName;
                    } else if (item.restaurant && typeof item.restaurant === 'object' && item.restaurant.name) {
                        // If restaurant field is populated as an object instead of ID
                        restaurantName = item.restaurant.name;
                    }

                    // Add some debugging to help identify restaurant ID issues
                    console.log(`Menu item: ${item.name}, Restaurant ID: ${item.restaurant}, Found restaurant: ${restaurant ? restaurant.name : 'Not found'}`);
                    console.log(`Menu item image: ${item.image}`);

                    return {
                        ...item,
                        restaurantName: restaurantName
                    };
                });

                setMenuItems(enrichedMenuItems);
                setFilteredMenuItems(enrichedMenuItems);
                console.log(`Fetched ${enrichedMenuItems.length} total menu items`);
            } else {
                console.error("Invalid menu data received:", response.data);
                setError("Failed to load menu items. Received invalid data.");
                setMenuItems([]);
                setFilteredMenuItems([]);
            }
        } catch (error) {
            console.error("Error fetching all menu items:", error);
            setError("Failed to load menu items. Please try again later.");
            setMenuItems([]);
            setFilteredMenuItems([]);
        } finally {
            setIsLoading(false);
        }
    }, [API_URL]);

    // Separate useEffect to fetch all menu items
    useEffect(() => {
        fetchAllMenuItems();
    }, [fetchAllMenuItems]);

    const handleRestaurantChange = async (event) => {
        setIsLoading(true);
        setError(null);
        const restaurantId = event.target.value;

        // Find the selected restaurant object
        const restaurant = restaurants.find(r => r._id === restaurantId);
        setSelectedRestaurant(restaurant);

        // Clear cart and search term when restaurant changes
        setCart([]);
        setSearchTerm("");

        if (restaurant) {
            try {
                // Fetch menu items for the selected restaurant
                const response = await axios.get(`${API_URL}/api/getmenu/${restaurant._id}`);

                if (response.data && Array.isArray(response.data)) {
                    setMenuItems(response.data);
                    setFilteredMenuItems(response.data); // Initialize filtered items
                    console.log(`Fetched ${response.data.length} menu items for ${restaurant.name}`);
                } else {
                    console.error("Invalid menu data received:", response.data);
                    setError("Failed to load menu items. Received invalid data.");
                    setMenuItems([]);
                    setFilteredMenuItems([]);
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
                setError("Failed to load menu items. Please try again later.");
                setMenuItems([]);
                setFilteredMenuItems([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setMenuItems([]);
            setFilteredMenuItems([]);
            setIsLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        // Clear any previous errors
        setError(null);

        // Check if the user is trying to mix items from different restaurants
        if (cart.length > 0 && selectedRestaurant) {
            const firstItemRestaurant = cart[0].restaurant;
            if (item.restaurant && item.restaurant !== firstItemRestaurant) {
                setError("Cannot add items from different restaurants to the same cart. Please clear your cart first.");
                return;
            }
        }

        // For items from "All Restaurant Menu Items" view, ensure consistency
        if (!selectedRestaurant && cart.length > 0) {
            const firstItemRestaurant = cart[0].restaurant;
            if (item.restaurant !== firstItemRestaurant) {
                setError("Cannot add items from different restaurants to the same cart. Please clear your cart first.");
                return;
            }
        }

        // Check if the item is already in the cart
        const existingItem = cart.find(cartItem => cartItem._id === item._id);

        if (existingItem) {
            // If item exists, increase quantity
            const updatedCart = cart.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
            setCart(updatedCart);
        } else {
            // If item doesn't exist, add it with quantity 1
            setCart([...cart, { ...item, quantity: 1 }]);
        }

        // Show cart when adding items
        setCartVisible(true);

        // Save cart to localStorage for persistence
        const updatedCart = cart.some(cartItem => cartItem._id === item._id)
            ? cart.map(cartItem =>
                cartItem._id === item._id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            )
            : [...cart, { ...item, quantity: 1 }];

        localStorage.setItem('currentCart', JSON.stringify(updatedCart));
        showToastMessage(`${item.name} added to cart!`);
    };

    const handleRemoveFromCart = (itemId) => {
        const updatedCart = cart.filter(item => item._id !== itemId);
        setCart(updatedCart);

        // Update localStorage
        localStorage.setItem('currentCart', JSON.stringify(updatedCart));

        // If cart becomes empty, hide it
        if (updatedCart.length === 0) {
            setCartVisible(false);
        }
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cart.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);

        // Update localStorage
        localStorage.setItem('currentCart', JSON.stringify(updatedCart));
    };

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const toggleCart = () => {
        setCartVisible(!cartVisible);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    };

    const handlePlaceOrder = async () => {
        // Determine the restaurant for the order
        let orderRestaurant = selectedRestaurant;

        if (!orderRestaurant && cart.length > 0) {
            // If no restaurant is selected but cart has items, find the restaurant from cart items
            const firstItemRestaurantId = cart[0].restaurant;
            orderRestaurant = restaurants.find(r => r._id === firstItemRestaurantId);
        }

        if (!orderRestaurant) {
            setError("Please select a restaurant before placing an order!");
            return;
        }

        if (cart.length === 0) {
            setError("Your cart is empty! Add some items before placing an order.");
            return;
        }

        // Get delivery address
        const address = prompt("Please enter your delivery address:", "123 Main Street, City, State");
        if (!address || address.trim() === "") {
            setError("Delivery address is required!");
            return;
        }

        // Get customer details if not authenticated
        let customerEmail = "";
        let customerPhone = "";

        if (!isAuthenticated()) {
            customerEmail = prompt("Please enter your email address:");
            customerPhone = prompt("Please enter your phone number:");

            if (!customerEmail || !customerPhone) {
                setError("Email and phone number are required for order placement!");
                return;
            }
        }

        setIsPlacingOrder(true);
        setError(null);

        try {
            const subtotal = calculateTotal();
            const deliveryFee = 40;
            const packagingFee = 20;
            const tax = Math.round(subtotal * 0.05);
            const total = subtotal + deliveryFee + packagingFee + tax;

            const orderData = {
                items: cart.map(item => ({
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    restaurant: item.restaurant || orderRestaurant._id,
                    restaurantName: item.restaurantName || orderRestaurant.name,
                    category: item.category || 'Main Course',
                    description: item.description || ''
                })),
                subtotal,
                discount: 0,
                tax,
                deliveryFee,
                packagingFee,
                total,
                address: address.trim(),
                appliedCoupon: null,
                customerEmail: customerEmail || null,
                customerPhone: customerPhone || null,
                paymentMethod
            };

            const response = await axios.post(`${API_URL}/api/orders`, orderData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Order placed:", response.data);
            setOrderSuccess(true);
            setCart([]); // Clear the cart after placing the order
            setCartVisible(false);

            // Clear cart from localStorage
            localStorage.removeItem('currentCart');

            // Show success message
            showToastMessage(`Order placed successfully! Order ID: ${response.data.orderId}`);

            // Optionally redirect to orders page after a delay
            setTimeout(() => {
                navigate("/orders");
            }, 3000);
        } catch (error) {
            console.error("Error placing order:", error);
            setError(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    // Filter menu items when search term or category changes
    useEffect(() => {
        if (menuItems.length > 0) {
            let filtered = menuItems;

            // Apply search filter
            if (searchTerm) {
                filtered = filtered.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            // Apply category filter
            if (selectedCategory !== "all") {
                if (selectedCategory === "popular") {
                    // Filter popular items (you can customize this logic)
                    filtered = filtered.filter(item => item.price > 200); // Example: expensive items as popular
                } else if (selectedCategory === "recommended") {
                    // Filter recommended items (you can customize this logic)
                    filtered = filtered.filter(item => item.name.toLowerCase().includes('biryani') ||
                        item.name.toLowerCase().includes('pizza') ||
                        item.name.toLowerCase().includes('burger'));
                }
            }

            setFilteredMenuItems(filtered);
        } else {
            setFilteredMenuItems([]);
        }
    }, [searchTerm, menuItems, selectedCategory]);

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Escape') {
            setSearchTerm("");
        }
    };

    const refreshMenu = async () => {
        if (!selectedRestaurant) {
            // If no restaurant is selected, refresh all menu items
            await fetchAllMenuItems();
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/api/getmenu/${selectedRestaurant._id}`);

            if (response.data && Array.isArray(response.data)) {
                setMenuItems(response.data);
                setFilteredMenuItems(response.data); // Refresh filtered items
                console.log(`Refreshed ${response.data.length} menu items for ${selectedRestaurant.name}`);
            } else {
                console.error("Invalid menu data received:", response.data);
                setError("Failed to refresh menu items. Received invalid data.");
            }
        } catch (error) {
            console.error("Error refreshing menu items:", error);
            setError("Failed to refresh menu items. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Check for pending cart after login
    useEffect(() => {
        const pendingCartData = localStorage.getItem('pendingCart');

        if (pendingCartData && isAuthenticated()) {
            try {
                const { items, restaurantId } = JSON.parse(pendingCartData);

                // Find the restaurant
                const restaurant = restaurants.find(r => r._id === restaurantId);
                if (restaurant) {
                    // Set the restaurant in the dropdown
                    setSelectedRestaurant(restaurant);

                    // Fetch menu items for the restaurant
                    const fetchMenuItems = async () => {
                        try {
                            const response = await axios.get(`${API_URL}/api/getmenu/${restaurantId}`);
                            setMenuItems(response.data);

                            // Restore cart with valid menu items
                            const validItems = items.map(cartItem => {
                                const menuItem = response.data.find(m => m._id === cartItem._id);
                                return menuItem ? { ...menuItem, quantity: cartItem.quantity } : null;
                            }).filter(Boolean);

                            if (validItems.length > 0) {
                                setCart(validItems);
                                setCartVisible(true);
                            }
                        } catch (error) {
                            console.error("Error restoring cart:", error);
                        }
                    };

                    fetchMenuItems();
                }
            } catch (error) {
                console.error("Error parsing pending cart:", error);
            }

            // Clear the pending cart from localStorage
            localStorage.removeItem('pendingCart');
        }
    }, [restaurants, API_URL]);
    const handleback = () => {
        navigate("/home");
    }

    const handleClearCart = () => {
        setCart([]);
        setCartVisible(false);
        localStorage.removeItem('currentCart');
        setError(null);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const showToastMessage = (message) => {
        setToastMessage(message);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div style={{ backgroundColor: "#FFF9F4", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
            <button onClick={handleback} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm">Back</button>

            {/* Toast Notification */}
            {showToast && (
                <div
                    className="position-fixed top-0 start-50 translate-middle-x mt-3 alert alert-success alert-dismissible fade show"
                    style={{ zIndex: 1055, minWidth: "300px" }}
                    role="alert"
                >
                    {toastMessage}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowToast(false)}
                        aria-label="Close"
                    ></button>
                </div>
            )}

            <div className="container my-4">
                {/* Display error message if any */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <strong>Error:</strong> {error}
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setError(null)}
                        ></button>
                    </div>
                )}

                {/* Display success message if order is placed successfully */}
                {orderSuccess && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <strong>Success!</strong> Your order has been placed successfully.
                        <button
                            type="button"
                            className="btn-close"
                            aria-label="Close"
                            onClick={() => setOrderSuccess(false)}
                        ></button>
                    </div>
                )}

                <div className="row">
                    {/* Main Content */}
                    <div className={`col-lg-${cartVisible ? '8' : '12'}`}>
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4 fw-bold" style={{ color: "#FFA500" }}>
                                    <FaStore className="me-2" /> Select a Restaurant
                                </h2>

                                {/* Restaurant Dropdown */}
                                <div className="text-center mb-4">
                                    <div className="position-relative w-75 mx-auto">
                                        <select
                                            className="form-select form-select-lg rounded-pill"
                                            onChange={handleRestaurantChange}
                                            defaultValue=""
                                            style={{ borderColor: "#FFA500" }}
                                        >
                                            <option value="" disabled>-- Select a Restaurant --</option>
                                            {restaurants.map((restaurant) => (
                                                <option key={restaurant._id} value={restaurant._id}>
                                                    {restaurant.name} {restaurant.cuisine && `(${restaurant.cuisine})`}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="form-text mt-1 text-center">
                                            {restaurants.length} restaurants available
                                        </div>
                                    </div>
                                </div>

                                {isLoading && (
                                    <div className="text-center my-5">
                                        <div className="spinner-border" style={{ color: "#FFA500" }} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3 text-muted">
                                            {selectedRestaurant
                                                ? `Loading menu for ${selectedRestaurant.name}...`
                                                : 'Loading restaurants...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Menu Section */}
                        {!isLoading && (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="fw-bold" style={{ color: "#FFA500" }}>
                                            <FaUtensils className="me-2" /> {selectedRestaurant ? `${selectedRestaurant.name} Menu` : 'All Restaurant Menu Items'}
                                        </h3>
                                        <div>
                                            <button
                                                className="btn btn-sm btn-outline-warning me-2"
                                                onClick={refreshMenu}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Refreshing...' : 'Refresh Menu'}
                                            </button>
                                            <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#FFA500" }}>
                                                {searchTerm
                                                    ? `${filteredMenuItems.length}/${menuItems.length} Items`
                                                    : `${menuItems.length} Items Available`}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Categories Tabs with Search */}
                                    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                                        <ul className="nav nav-pills mb-2 mb-md-0">
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link rounded-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                                                    onClick={() => handleCategoryChange('all')}
                                                    style={{
                                                        backgroundColor: selectedCategory === 'all' ? '#FFA500' : 'transparent',
                                                        color: selectedCategory === 'all' ? 'white' : '#6c757d',
                                                        border: 'none'
                                                    }}
                                                >
                                                    All Items
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link rounded-pill ${selectedCategory === 'popular' ? 'active' : ''}`}
                                                    onClick={() => handleCategoryChange('popular')}
                                                    style={{
                                                        backgroundColor: selectedCategory === 'popular' ? '#FFA500' : 'transparent',
                                                        color: selectedCategory === 'popular' ? 'white' : '#6c757d',
                                                        border: 'none'
                                                    }}
                                                >
                                                    Popular
                                                </button>
                                            </li>
                                            <li className="nav-item">
                                                <button
                                                    className={`nav-link rounded-pill ${selectedCategory === 'recommended' ? 'active' : ''}`}
                                                    onClick={() => handleCategoryChange('recommended')}
                                                    style={{
                                                        backgroundColor: selectedCategory === 'recommended' ? '#FFA500' : 'transparent',
                                                        color: selectedCategory === 'recommended' ? 'white' : '#6c757d',
                                                        border: 'none'
                                                    }}
                                                >
                                                    Recommended
                                                </button>
                                            </li>
                                        </ul>
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control rounded-pill"
                                                placeholder="Search menu... (Press Esc to clear)"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                onKeyDown={handleSearchKeyPress}
                                                style={{ width: "220px" }}
                                            />
                                            {searchTerm && (
                                                <button
                                                    className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 text-secondary"
                                                    onClick={() => setSearchTerm("")}
                                                    style={{ background: "none", border: "none" }}
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row g-4">
                                        {menuItems.length === 0 ? (
                                            <div className="col-12 text-center py-5">
                                                <p className="text-muted mb-0">No menu items available for this restaurant.</p>
                                                <button
                                                    className="btn btn-outline-warning mt-3"
                                                    onClick={refreshMenu}
                                                >
                                                    Retry Loading Menu
                                                </button>
                                            </div>
                                        ) : filteredMenuItems.length === 0 && searchTerm ? (
                                            <div className="col-12 text-center py-5">
                                                <p className="text-muted mb-0">No items match your search "{searchTerm}"</p>
                                                <button
                                                    className="btn btn-outline-warning mt-3"
                                                    onClick={() => setSearchTerm("")}
                                                >
                                                    Clear Search
                                                </button>
                                            </div>
                                        ) : (
                                            filteredMenuItems.map((item) => {
                                                console.log(`Rendering item: ${item.name}, image: ${item.image}`);
                                                const imageUrl = getImageUrl(item.image);
                                                console.log(`Final image URL: ${imageUrl}`);

                                                return (
                                                    <div key={item._id} className="col-md-6 col-lg-6 col-xl-4">
                                                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                            <div className="position-relative">
                                                                <div
                                                                    className="menu-item-img d-flex align-items-center justify-content-center"
                                                                    style={{
                                                                        height: "160px",
                                                                        backgroundColor: "#f8f9fa",
                                                                        overflow: "hidden"
                                                                    }}
                                                                >
                                                                    {imageUrl ? (
                                                                        <img
                                                                            src={imageUrl}
                                                                            alt={item.name}
                                                                            style={{
                                                                                width: "100%",
                                                                                height: "100%",
                                                                                objectFit: "cover"
                                                                            }}
                                                                            onError={(e) => {
                                                                                // If image fails to load, hide the image and show no image text
                                                                                console.log(`Image failed to load for ${item.name}:`, e.target.src);
                                                                                e.target.style.display = 'none';
                                                                                e.target.nextSibling.style.display = 'block';
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    <div
                                                                        className="text-center text-muted"
                                                                        style={{
                                                                            display: imageUrl ? 'none' : 'block',
                                                                            fontSize: '14px',
                                                                            fontWeight: '500'
                                                                        }}
                                                                    >
                                                                        <div className="mb-2">
                                                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                                                <polyline points="21,15 16,10 5,21" />
                                                                            </svg>
                                                                        </div>
                                                                        No image available
                                                                    </div>
                                                                </div>
                                                                {Math.random() > 0.5 && (
                                                                    <span className="position-absolute top-0 start-0 m-2 badge rounded-pill px-3 py-2" style={{ backgroundColor: "#FF4500" }}>
                                                                        <BiSolidOffer className="me-1" /> 15% OFF
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="card-body p-3">
                                                                <h5 className="card-title fw-bold mb-1">{item.name}</h5>
                                                                <div className="mb-1">
                                                                    <span className="badge rounded-pill" style={{ backgroundColor: "#6c757d", fontSize: "0.7rem" }}>
                                                                        {item.restaurantName || 'Unknown Restaurant'}
                                                                    </span>
                                                                </div>
                                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                                    <span className="fw-bold" style={{ color: "#FFA500" }}>₹{item.price}</span>
                                                                    <div className="rating">
                                                                        ★★★★<span className="text-muted">★</span> <span className="small text-muted">(4.1)</span>
                                                                    </div>
                                                                </div>
                                                                <p className="card-text small text-muted mb-3">
                                                                    {item.description || `Delicious ${item.name} prepared with premium ingredients.`}
                                                                </p>
                                                                <button
                                                                    className="btn btn-sm w-100 rounded-pill py-2"
                                                                    style={{ backgroundColor: "#FFA500", color: "white" }}
                                                                    onClick={() => handleAddToCart(item)}
                                                                >
                                                                    <FaPlus size={14} className="me-2" /> Add to Cart
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderWithCart;