import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShoppingCart = () => {
    const navigate = useNavigate();
    // Initialize cart from localStorage or use sample data
    const [cart, setCart] = useState([]);

    // Calculate total quantity of items
    const getTotalQuantity = () => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    };

    useEffect(() => {
        // Load cart items from localStorage
        try {
            const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCart(savedCart);
        } catch (error) {
            console.error('Error loading cart from localStorage:', error);
            setCart([]);
        }

        // Load delivery address from localStorage or set default
        try {
            const savedAddress = localStorage.getItem('deliveryAddress') || 'Please set your delivery address';
            setDeliveryAddress(savedAddress);
        } catch (error) {
            console.error('Error loading delivery address:', error);
            setDeliveryAddress('Please set your delivery address');
        }

        // Load customer info from localStorage
        try {
            const savedEmail = localStorage.getItem('customerEmail') || '';
            const savedPhone = localStorage.getItem('customerPhone') || '';
            setCustomerEmail(savedEmail);
            setCustomerPhone(savedPhone);
        } catch (error) {
            console.error('Error loading customer info:', error);
        }
    }, []); // Empty dependency array means this runs once when component mounts

    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    const salesTaxRate = 0.10; // 10% sales tax
    const deliveryFee = 40;
    const packagingFee = 20;

    // Available coupons
    const availableCoupons = {
        "SAVE50": { discount: 50, type: "fixed", description: "₹50 off on orders above ₹500" },
        "FIRST20": { discount: 20, type: "percent", description: "20% off for first order" },
        "WELCOME100": { discount: 100, type: "fixed", description: "₹100 off on orders above ₹800" }
    };

    // Get item ID consistently (prefer _id from MongoDB, fallback to id)
    const getItemId = (item) => item._id || item.id;

    // Handle quantity change
    const updateQuantity = (id, change) => {
        const updatedCart = cart.map(item => {
            const itemId = getItemId(item);
            if (itemId === id) {
                const newQuantity = Math.max(1, (item.quantity || 1) + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        });
        setCart(updatedCart);
        // Update localStorage
        try {
            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    };

    // Remove item from cart
    const removeItem = (id) => {
        const updatedCart = cart.filter(item => getItemId(item) !== id);
        setCart(updatedCart);
        // Update localStorage
        try {
            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
        }
    };

    // Clear entire cart
    const clearCart = () => {
        if (window.confirm('Are you sure you want to clear your entire cart?')) {
            setCart([]);
            setAppliedCoupon(null);
            try {
                localStorage.removeItem('cartItems');
            } catch (error) {
                console.error('Error clearing cart from localStorage:', error);
            }
        }
    };

    // Apply coupon
    const applyCoupon = () => {
        const couponCode = coupon.toUpperCase();
        if (availableCoupons[couponCode]) {
            const couponData = availableCoupons[couponCode];
            if (couponCode === "SAVE50" && subtotal < 500) {
                alert("Minimum order of ₹500 required for this coupon");
                return;
            }
            if (couponCode === "WELCOME100" && subtotal < 800) {
                alert("Minimum order of ₹800 required for this coupon");
                return;
            }
            setAppliedCoupon({ code: couponCode, ...couponData });
            setCoupon("");
        } else {
            alert("Invalid coupon code");
        }
    };

    // Remove applied coupon
    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    // Handle address change
    const handleAddressChange = () => {
        const newAddress = prompt('Enter your delivery address:', deliveryAddress);
        if (newAddress && newAddress.trim()) {
            setDeliveryAddress(newAddress);
            try {
                localStorage.setItem('deliveryAddress', newAddress);
            } catch (error) {
                console.error('Error saving delivery address:', error);
            }
        }
    };

    // Handle checkout
    const handleCheckout = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        if (!deliveryAddress || deliveryAddress === 'Please set your delivery address') {
            alert('Please set your delivery address before checkout!');
            handleAddressChange();
            return;
        }

        // Ask for customer email and phone if not provided
        let finalEmail = customerEmail;
        let finalPhone = customerPhone;

        if (!finalEmail) {
            finalEmail = prompt('Please enter your email address for order confirmation:');
            if (finalEmail) {
                setCustomerEmail(finalEmail);
                localStorage.setItem('customerEmail', finalEmail);
            }
        }

        if (!finalPhone) {
            finalPhone = prompt('Please enter your phone number for delivery updates:');
            if (finalPhone) {
                setCustomerPhone(finalPhone);
                localStorage.setItem('customerPhone', finalPhone);
            }
        }

        setIsCheckingOut(true);

        try {
            // Calculate order values here to ensure they're up-to-date
            const currentSubtotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
            
            let currentDiscount = 0;
            if (appliedCoupon) {
                currentDiscount = appliedCoupon.type === "percent"
                    ? (currentSubtotal * appliedCoupon.discount) / 100
                    : appliedCoupon.discount;
            }
            
            const currentTotalBeforeTax = currentSubtotal - currentDiscount;
            const currentTax = currentTotalBeforeTax * salesTaxRate;
            const currentTempTotal = currentTotalBeforeTax + currentTax + deliveryFee + packagingFee;
            const currentDeliveryFee = currentTempTotal > 1000 ? 0 : deliveryFee;
            const currentGrandTotal = currentTotalBeforeTax + currentTax + currentDeliveryFee + packagingFee;
            
            // Prepare order details
            const orderDetails = {
                items: cart,
                subtotal: currentSubtotal,
                discount: currentDiscount,
                tax: currentTax,
                deliveryFee: currentDeliveryFee,
                packagingFee: packagingFee,
                total: currentGrandTotal,
                address: deliveryAddress,
                appliedCoupon: appliedCoupon,
                customerEmail: finalEmail,
                customerPhone: finalPhone
            };

            // Send order to backend
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                let errorMsg = `Order failed: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (jsonErr) {
                    // If not JSON, try to get text
                    const errorText = await response.text();
                    if (errorText && errorText.startsWith('<!DOCTYPE')) {
                        errorMsg = 'Server error: Received HTML instead of JSON. Check backend route or proxy setup.';
                    } else if (errorText) {
                        errorMsg = errorText;
                    }
                }
                alert(errorMsg);
                setIsCheckingOut(false);
                return;
            }

            const data = await response.json();
            const orderId = data.orderId || data._id || 'N/A';

            // Save order to localStorage for order tracking
            const orderInfo = {
                ...orderDetails,
                orderId,
                status: 'Pending',
                createdAt: new Date().toISOString(),
                estimatedDeliveryTime: data.estimatedDeliveryTime
            };
            localStorage.setItem('pendingOrder', JSON.stringify(orderInfo));

            // Clear cart after order
            setCart([]);
            localStorage.removeItem('cartItems');

            // Show detailed success message
            let successMessage = `🎉 Order placed successfully!\n\n`;
            successMessage += `📋 Order ID: ${orderId}\n`;
            successMessage += `📍 Delivery Address: ${deliveryAddress}\n`;
            successMessage += `💰 Total Amount: ₹${currentGrandTotal.toFixed(2)}\n`;
            successMessage += `⏰ Estimated Delivery: ${data.estimatedDeliveryTime || '30-40 minutes'}\n\n`;

            if (finalEmail) {
                successMessage += `📧 Order confirmation sent to: ${finalEmail}\n`;
            }

            successMessage += `🔍 Use Order ID "${orderId}" to track your order.\n\n`;
            successMessage += `✅ Restaurants have been notified and will start preparing your order.\n\n`;
            successMessage += `Redirecting to orders page...`;

            alert(successMessage);

            // Navigate to orders page
            navigate('/orders');
        } catch (error) {
            alert('An error occurred while placing your order. Please try again.');
            setIsCheckingOut(false);
        } finally {
            setIsCheckingOut(false);
        }
    };

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

    let discount = 0;
    if (appliedCoupon) {
        discount = appliedCoupon.type === "percent"
            ? (subtotal * appliedCoupon.discount) / 100
            : appliedCoupon.discount;
    }

    const totalBeforeTax = subtotal - discount;
    const finalTax = totalBeforeTax * salesTaxRate;
    const tempTotal = totalBeforeTax + finalTax + deliveryFee + packagingFee;
    const finalDeliveryFee = tempTotal > 1000 ? 0 : deliveryFee; // Free delivery for orders above ₹1000
    const grandTotal = totalBeforeTax + finalTax + finalDeliveryFee + packagingFee;

    return (
        <>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div className="min-vh-100" style={{ backgroundColor: '#fef7ed' }}>
                <div className="container py-4">
                    <div className="row flex-column-reverse flex-lg-row">
                        {/* Cart Items */}
                        <div className="col-lg-8 mb-4 order-2 order-lg-1">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 py-4">
                                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
                                        <h3 className="mb-0 fw-bold">
                                            <ShoppingBag className="me-2" style={{ width: '24px', height: '24px' }} />
                                            Your Cart ({cart.length} unique items, {getTotalQuantity()} total items)
                                        </h3>
                                        <div className="d-flex flex-wrap align-items-center gap-2 mt-3 mt-md-0">
                                            <button
                                                className="btn btn-outline-warning rounded-pill"
                                                onClick={() => navigate('/')}
                                            >
                                                Continue Shopping
                                            </button>
                                            {cart.length > 0 && (
                                                <button
                                                    className="btn btn-outline-danger rounded-pill"
                                                    onClick={clearCart}
                                                >
                                                    Clear Cart
                                                </button>
                                            )}
                                            <div className="d-flex align-items-center text-muted ms-0 ms-md-3 mt-2 mt-md-0">
                                                <Clock className="me-2" style={{ width: '18px', height: '18px' }} />
                                                <span className="small">30-40 min delivery</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body p-0">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div style={{ fontSize: '64px' }}>🛒</div>
                                            <h5 className="text-muted mt-3">Your cart is empty</h5>
                                            <p className="text-muted">Add some delicious food to get started!</p>
                                            <div className="d-flex flex-column flex-sm-row justify-content-center gap-3">
                                                <button
                                                    className="btn rounded-pill px-4 py-2"
                                                    style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000', fontWeight: '600' }}
                                                    onClick={() => navigate('/menu')}
                                                >
                                                    Browse Menu
                                                </button>
                                                <button
                                                    className="btn btn-outline-secondary rounded-pill px-4 py-2"
                                                    onClick={() => navigate('/')}
                                                >
                                                    Go Home
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            {cart.map((item, index) => (
                                                <div
                                                    key={getItemId(item)}
                                                    className={`p-3 p-sm-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}
                                                >
                                                    <div className="row align-items-center gy-2">
                                                        <div className="col-3 col-sm-2">
                                                            <div
                                                                className="rounded-3 d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor: '#fef3c7',
                                                                    fontSize: '28px'
                                                                }}
                                                            >
                                                                {item.image || '🍽️'}
                                                            </div>
                                                        </div>
                                                        <div className="col-9 col-sm-10">
                                                            <div className="d-flex justify-content-between align-items-start flex-column flex-sm-row">
                                                                <div>
                                                                    <h6 className="mb-1 fw-bold">{item.name || 'Unknown Item'}</h6>
                                                                    <p className="text-muted small mb-1">{item.restaurant || 'Unknown Restaurant'}</p>
                                                                    <span
                                                                        className="badge rounded-pill small"
                                                                        style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                                                                    >
                                                                        {item.category || 'Uncategorized'}
                                                                    </span>
                                                                    {item.note && (
                                                                        <div className="text-warning small mt-1">
                                                                            <strong>Note:</strong> {item.note}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm mt-2 mt-sm-0"
                                                                    onClick={() => removeItem(getItemId(item))}
                                                                >
                                                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row align-items-center mt-3 gy-2">
                                                        <div className="col-4 col-sm-3">
                                                            <h6 className="mb-0 fw-bold">₹{(item.price || 0).toFixed(2)}</h6>
                                                        </div>
                                                        <div className="col-8 col-sm-6">
                                                            <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                                                                <button
                                                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                                                    onClick={() => updateQuantity(getItemId(item), -1)}
                                                                    style={{ width: '32px', height: '32px' }}
                                                                    disabled={item.quantity <= 1}
                                                                >
                                                                    <Minus style={{ width: '16px', height: '16px' }} />
                                                                </button>
                                                                <span className="mx-2 fw-bold">{item.quantity || 1}</span>
                                                                <button
                                                                    className="btn btn-sm rounded-circle"
                                                                    onClick={() => updateQuantity(getItemId(item), 1)}
                                                                    style={{
                                                                        width: '32px',
                                                                        height: '32px',
                                                                        backgroundColor: '#fbbf24',
                                                                        border: 'none',
                                                                        color: '#000'
                                                                    }}
                                                                >
                                                                    <Plus style={{ width: '16px', height: '16px' }} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 col-sm-3 text-end text-sm-start mt-2 mt-sm-0">
                                                            <h6 className="mb-0 fw-bold">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</h6>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* Delivery Address */}
                            {cart.length > 0 && (
                                <>
                                    <div className="card border-0 shadow-sm rounded-4 mt-4">
                                        <div className="card-body p-4">
                                            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
                                                <div className="d-flex align-items-center">
                                                    <MapPin className="me-3 text-warning" style={{ width: '20px', height: '20px' }} />
                                                    <div>
                                                        <h6 className="mb-1 fw-bold">Delivery Address</h6>
                                                        <p className="mb-0 text-muted" style={{ wordBreak: 'break-word', maxWidth: '220px' }}>{deliveryAddress}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-outline-warning btn-sm mt-2 mt-sm-0"
                                                    onClick={handleAddressChange}
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="card border-0 shadow-sm rounded-4 mt-4">
                                        <div className="card-body p-4">
                                            <h6 className="mb-3 fw-bold">Contact Information</h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted small">Email Address</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="your@email.com"
                                                        value={customerEmail}
                                                        onChange={(e) => {
                                                            setCustomerEmail(e.target.value);
                                                            localStorage.setItem('customerEmail', e.target.value);
                                                        }}
                                                    />
                                                    <small className="text-muted">For order confirmation</small>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label text-muted small">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="+91 XXXXX XXXXX"
                                                        value={customerPhone}
                                                        onChange={(e) => {
                                                            setCustomerPhone(e.target.value);
                                                            localStorage.setItem('customerPhone', e.target.value);
                                                        }}
                                                    />
                                                    <small className="text-muted">For delivery updates</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Order Summary */}
                        <div className="col-lg-4 mb-4 mb-lg-0 order-1 order-lg-2">
                            {cart.length > 0 && (
                                <div className="card border-0 shadow-sm rounded-4 sticky-top sticky-lg-top" style={{ top: '20px' }}>
                                    <div className="card-header bg-white border-0 py-4">
                                        <h5 className="mb-0 fw-bold">Order Summary</h5>
                                    </div>
                                    <div className="card-body">
                                        {/* Coupon Section */}
                                        <div className="mb-4">
                                            <h6 className="mb-3 fw-bold d-flex align-items-center">
                                                <Tag className="me-2" style={{ width: '18px', height: '18px' }} />
                                                Apply Coupon
                                            </h6>
                                            {!appliedCoupon ? (
                                                <div className="d-flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Enter coupon code"
                                                        value={coupon}
                                                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                                    />
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000' }}
                                                        onClick={applyCoupon}
                                                        disabled={!coupon.trim()}
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-between p-2 bg-success text-white rounded">
                                                    <span className="small">
                                                        ✅ {appliedCoupon.code} - {appliedCoupon.description}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-light"
                                                        onClick={removeCoupon}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                            <div className="mt-2">
                                                <small className="text-muted">Available: SAVE50, FIRST20, WELCOME100</small>
                                            </div>
                                        </div>

                                        {/* Bill Details */}
                                        <div className="border-top pt-4">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Subtotal</span>
                                                <span>₹{subtotal.toFixed(2)}</span>
                                            </div>
                                            {appliedCoupon && (
                                                <div className="d-flex justify-content-between mb-2 text-success">
                                                    <span>Discount ({appliedCoupon.code})</span>
                                                    <span>-₹{discount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Delivery Fee</span>
                                                <span>
                                                    {finalDeliveryFee === 0 ? (
                                                        <span className="text-success">FREE</span>
                                                    ) : (
                                                        `₹${finalDeliveryFee}`
                                                    )}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Packaging Fee</span>
                                                <span>₹{packagingFee}</span>
                                            </div>
                                            <div className="d-flex justify-content-between mb-2">
                                                <span>Sales Tax (10%)</span>
                                                <span>₹{finalTax.toFixed(2)}</span>
                                            </div>
                                            <hr />
                                            <div className="d-flex justify-content-between mb-4">
                                                <h5 className="fw-bold">Grand Total</h5>
                                                <h5 className="fw-bold" style={{ color: '#fbbf24' }}>₹{grandTotal.toFixed(2)}</h5>
                                            </div>
                                            {/* Free Shipping Message */}
                                            {tempTotal > 1000 && (
                                                <div className="alert alert-success py-2 mb-3">
                                                    <div className="d-flex align-items-center">
                                                        <Truck className="me-2" style={{ width: '18px', height: '18px' }} />
                                                        <small className="mb-0">🎉 Free delivery unlocked!</small>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Checkout Button */}
                                            <button
                                                className="btn w-100 py-3 fw-bold rounded-3"
                                                style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000' }}
                                                onClick={handleCheckout}
                                                disabled={isCheckingOut}
                                            >
                                                {isCheckingOut ? 'Processing Order...' : 'Proceed to Checkout'}
                                            </button>
                                            <div className="text-center mt-3">
                                                <small className="text-muted">
                                                    Estimated delivery: 30-40 minutes
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShoppingCart;