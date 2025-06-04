import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaShoppingCart, FaPlus, FaTrashAlt, FaStore, FaUtensils } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";

const OrderWithCart = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [isLoading, setIsLoading] = useState(true);
    const [cartVisible, setCartVisible] = useState(false);

    useEffect(() => {
        const fetchRestaurants = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get("http://localhost:7000/api/get/admin");
                setRestaurants(response.data);
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const handleRestaurantChange = async (event) => {
        setIsLoading(true);
        const restaurantId = event.target.value;
        const restaurant = restaurants.find(r => r._id === restaurantId);
        setSelectedRestaurant(restaurant);
        setCart([]); // Clear cart when restaurant changes

        if (restaurant) {
            try {
                const response = await axios.get(`http://localhost:7000/api/getmenu/${restaurant._id}`);
                setMenuItems(response.data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setMenuItems([]);
            setIsLoading(false);
        }
    };

    const handleAddToCart = (item) => {
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

    const handlePlaceOrder = () => {
        if (!selectedRestaurant) {
            alert("Please select a restaurant before placing an order!");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty! Add some items before placing an order.");
            return;
        }

        console.log("Order placed:", { 
            items: cart, 
            restaurant: selectedRestaurant, 
            paymentMethod: paymentMethod,
            total: calculateTotal()
        });

        alert(`Order placed successfully from ${selectedRestaurant.name}!`);
        setCart([]); // Clear the cart after placing the order
        setCartVisible(false);
    };

    return (
        <div style={{ backgroundColor: "#FFF9F4", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
        
            <div className="container my-4">
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
                                    <select 
                                        className="form-select form-select-lg w-75 mx-auto rounded-pill" 
                                        onChange={handleRestaurantChange} 
                                        defaultValue=""
                                        style={{ borderColor: "#FFA500" }}
                                    >
                                        <option value="" disabled>-- Select a Restaurant --</option>
                                        {restaurants.map((restaurant) => (
                                            <option key={restaurant._id} value={restaurant._id}>
                                                {restaurant.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {isLoading && (
                                    <div className="text-center my-5">
                                        <div className="spinner-border" style={{ color: "#FFA500" }} role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-3 text-muted">Loading menu items...</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Menu Section */}
                        {selectedRestaurant && !isLoading && (
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h3 className="fw-bold" style={{ color: "#FFA500" }}>
                                            <FaUtensils className="me-2" /> {selectedRestaurant.name} Menu
                                        </h3>
                                        <span className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "#FFA500" }}>
                                            Delivery in 30 min
                                        </span>
                                    </div>

                                    {/* Categories Tabs */}
                                    <ul className="nav nav-pills mb-4">
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

                                    <div className="row g-4">
                                        {menuItems.length === 0 ? (
                                            <div className="col-12 text-center py-5">
                                                <p className="text-muted mb-0">No menu items available for this restaurant.</p>
                                            </div>
                                        ) : (
                                            menuItems.map((item) => (
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
                                            >
                                                Place Order • ₹{calculateTotal() + 40 + Math.round(calculateTotal() * 0.05)}
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