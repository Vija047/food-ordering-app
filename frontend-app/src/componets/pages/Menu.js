import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaPlus, FaTrashAlt, FaStore, FaUtensils } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import { getAuthToken, isAuthenticated } from "../../utils/auth";
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
    const navigate = useNavigate();

    // Define the API base URL
    const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:7000";

    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_URL}/api/restaurants`);
                setRestaurants(response.data);
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
        // Check if the user is trying to mix items from different restaurants
        if (cart.length > 0 && selectedRestaurant) {
            const firstItemRestaurant = cart[0].restaurant;
            if (item.restaurant && item.restaurant !== firstItemRestaurant) {
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
    };

    const handleRemoveFromCart = (itemId) => {
        const updatedCart = cart.filter(item => item._id !== itemId);
        setCart(updatedCart);
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedCart = cart.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
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
        if (!selectedRestaurant && cart.some(item => !item.restaurant)) {
            setError("Please select a restaurant before placing an order!");
            return;
        }

        if (cart.length === 0) {
            setError("Your cart is empty! Add some items before placing an order.");
            return;
        }

        // Check if user is authenticated
        if (!isAuthenticated()) {
            // Save current cart to localStorage for after login
            localStorage.setItem('pendingCart', JSON.stringify({
                items: cart,
                restaurantId: selectedRestaurant._id
            }));
            // Redirect to login page
            navigate("/login?redirect=menu");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const orderData = {
                restaurantId: selectedRestaurant._id,
                items: cart.map(item => ({
                    menuItem: item._id,
                    quantity: item.quantity || 1,
                    price: item.price
                })),
                totalAmount: calculateTotal() + 40 + Math.round(calculateTotal() * 0.05),
                paymentMethod,
                deliveryFee: 40,
                tax: Math.round(calculateTotal() * 0.05)
            };

            const token = getAuthToken();

            const response = await axios.post(`${API_URL}/api/order`, orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("Order placed:", response.data);
            setOrderSuccess(true);
            setCart([]); // Clear the cart after placing the order
            setCartVisible(false);

            // Show success message
            alert(`Order placed successfully from ${selectedRestaurant.name}!`);

            // Optionally redirect to orders page
            // navigate("/orders");
        } catch (error) {
            console.error("Error placing order:", error);
            setError(error.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter menu items when search term changes
    useEffect(() => {
        if (menuItems.length > 0) {
            if (!searchTerm) {
                setFilteredMenuItems(menuItems);
            } else {
                const filtered = menuItems.filter(item =>
                    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setFilteredMenuItems(filtered);
            }
        } else {
            setFilteredMenuItems([]);
        }
    }, [searchTerm, menuItems]);

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const refreshMenu = async () => {
        if (!selectedRestaurant) {
            setError("Please select a restaurant first!");
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

    return (
        <div style={{ backgroundColor: "#FFF9F4", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
            <button onClick={handleback}  className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 shadow-sm">Back</button>

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
                                                <a className="nav-link active rounded-pill" href="#all">All Items</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link rounded-pill" href="#popular">Popular</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link rounded-pill" href="#recommended">Recommended</a>
                                            </li>
                                        </ul>
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="form-control rounded-pill"
                                                placeholder="Search menu..."
                                                value={searchTerm}
                                                onChange={handleSearchChange}
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
                                            filteredMenuItems.map((item) => (
                                                <div key={item._id} className="col-md-6 col-lg-6 col-xl-4">
                                                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                                        <div className="position-relative">
                                                            <div
                                                                className="menu-item-img"
                                                                style={{
                                                                    height: "160px",
                                                                    backgroundImage: `url(https://source.unsplash.com/random/300x200/?${item.name.replace(/\s/g, '-')})`,
                                                                    backgroundSize: "cover",
                                                                    backgroundPosition: "center"
                                                                }}
                                                            ></div>
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
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cart Section (Sliding) */}
                    {cartVisible && (
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: "20px" }}>
                                <div className="card-header bg-white border-0 py-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="fw-bold mb-0" style={{ color: "#FFA500" }}>
                                            <FaShoppingCart className="me-2" /> Your Cart
                                        </h4>
                                        <span
                                            className="btn-close"
                                            onClick={toggleCart}
                                            style={{ cursor: "pointer" }}
                                        ></span>
                                    </div>
                                </div>
                                <div className="card-body p-3">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div className="mb-3" style={{ color: "#DDD" }}>
                                                <FaShoppingCart size={48} />
                                            </div>
                                            <h5>Your cart is empty</h5>
                                            <p className="text-muted small">Add items from the menu to place an order</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="cart-items mb-4" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                                {cart.map((item, index) => (
                                                    <div key={index} className="card mb-2 border-0 bg-light rounded-3">
                                                        <div className="card-body py-2 px-3">
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <div>
                                                                    <h6 className="mb-0 fw-medium">{item.name}</h6>
                                                                    <p className="text-muted small mb-0">₹{item.price} each</p>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="input-group input-group-sm quantity-control">
                                                                        <button
                                                                            className="btn btn-outline-secondary border-0"
                                                                            onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) - 1)}
                                                                        >−</button>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control text-center border-0 bg-light"
                                                                            value={item.quantity || 1}
                                                                            readOnly
                                                                            style={{ width: "30px" }}
                                                                        />
                                                                        <button
                                                                            className="btn btn-outline-secondary border-0"
                                                                            onClick={() => handleUpdateQuantity(item._id, (item.quantity || 1) + 1)}
                                                                        >+</button>
                                                                    </div>
                                                                    <button
                                                                        className="btn btn-sm text-danger ms-2"
                                                                        onClick={() => handleRemoveFromCart(item._id)}
                                                                    >
                                                                        <FaTrashAlt />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Cart Summary */}
                                            <div className="card bg-light border-0 rounded-3 mb-3">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Subtotal</span>
                                                        <span>₹{calculateTotal()}</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Delivery Fee</span>
                                                        <span>₹40</span>
                                                    </div>
                                                    <div className="d-flex justify-content-between mb-2">
                                                        <span>Taxes</span>
                                                        <span>₹{Math.round(calculateTotal() * 0.05)}</span>
                                                    </div>
                                                    <hr />
                                                    <div className="d-flex justify-content-between fw-bold">
                                                        <span>Total</span>
                                                        <span style={{ color: "#FFA500" }}>₹{calculateTotal() + 40 + Math.round(calculateTotal() * 0.05)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method Section */}
                                            <div className="mb-3">
                                                <label className="form-label fw-medium">Payment Method</label>
                                                <select
                                                    className="form-select rounded-pill"
                                                    value={paymentMethod}
                                                    onChange={handlePaymentChange}
                                                >
                                                    <option value="Cash on Delivery">Cash on Delivery</option>
                                                    <option value="UPI">UPI</option>
                                                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                                                </select>
                                            </div>

                                            {/* Place Order Button */}
                                            <button
                                                className="btn btn-lg w-100 rounded-pill py-2 fw-medium"
                                                style={{ backgroundColor: "#FFA500", color: "white" }}
                                                onClick={handlePlaceOrder}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>Place Order • ₹{calculateTotal() + 40 + Math.round(calculateTotal() * 0.05)}</>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderWithCart;