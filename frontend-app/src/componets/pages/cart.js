import React, { useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, Clock, MapPin } from "lucide-react";

const ShoppingCart = () => {
    // Sample cart data for demonstration
    const [cart, setCart] = useState([
        {
            id: 1,
            name: "Butter Chicken",
            price: 320,
            quantity: 2,
            image: "🍛",
            restaurant: "Spice Garden",
            note: "Extra spicy",
            category: "Main Course"
        },
        {
            id: 2,
            name: "Garlic Naan",
            price: 80,
            quantity: 3,
            image: "🫓",
            restaurant: "Spice Garden",
            note: "",
            category: "Bread"
        },
        {
            id: 3,
            name: "Mango Lassi",
            price: 120,
            quantity: 2,
            image: "🥤",
            restaurant: "Spice Garden",
            note: "Less sugar",
            category: "Beverages"
        }
    ]);
    
    const [coupon, setCoupon] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [deliveryAddress, setDeliveryAddress] = useState("456 Koramangala, Bangalore");
    
    const salesTaxRate = 0.10; // 10% sales tax
    const deliveryFee = 40;
    const packagingFee = 20;

    // Available coupons
    const availableCoupons = {
        "SAVE50": { discount: 50, type: "fixed", description: "₹50 off on orders above ₹500" },
        "FIRST20": { discount: 20, type: "percent", description: "20% off for first order" },
        "WELCOME100": { discount: 100, type: "fixed", description: "₹100 off on orders above ₹800" }
    };

    // Handle quantity change
    const updateQuantity = (id, change) => {
        setCart(cart.map(item => 
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
        ));
    };

    // Remove item from cart
    const removeItem = (id) => {
        setCart(cart.filter(item => item.id !== id));
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

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const salesTax = subtotal * salesTaxRate;
    
    let discount = 0;
    if (appliedCoupon) {
        discount = appliedCoupon.type === "percent" 
            ? (subtotal * appliedCoupon.discount) / 100 
            : appliedCoupon.discount;
    }
    
    const totalBeforeTax = subtotal - discount;
    const finalTax = totalBeforeTax * salesTaxRate;
    const grandTotal = totalBeforeTax + finalTax + deliveryFee + packagingFee;

    return (
        <>
            {/* Bootstrap CSS */}
            <link 
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
                rel="stylesheet" 
            />
            
            <div className="min-vh-100" style={{ backgroundColor: '#fef7ed' }}>
              
                <div className="container py-4">
                    <div className="row">
                        {/* Cart Items */}
                        <div className="col-lg-8 mb-4">
                            <div className="card border-0 shadow-sm rounded-4">
                                <div className="card-header bg-white border-0 py-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h3 className="mb-0 fw-bold">
                                            <ShoppingBag className="me-2" style={{ width: '24px', height: '24px' }} />
                                            Your Cart ({cart.length} items)
                                        </h3>
                                        <div className="d-flex align-items-center text-muted">
                                            <Clock className="me-2" style={{ width: '18px', height: '18px' }} />
                                            <span className="small">30-40 min delivery</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-body p-0">
                                    {cart.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div style={{ fontSize: '64px' }}>🛒</div>
                                            <h5 className="text-muted mt-3">Your cart is empty</h5>
                                            <p className="text-muted">Add some delicious food to get started!</p>
                                            <button 
                                                className="btn rounded-pill px-4 py-2"
                                                style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000', fontWeight: '600' }}
                                            >
                                                Browse Menu
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="table-responsive">
                                            {cart.map((item, index) => (
                                                <div 
                                                    key={item.id} 
                                                    className={`p-4 ${index !== cart.length - 1 ? 'border-bottom' : ''}`}
                                                >
                                                    <div className="row align-items-center">
                                                        <div className="col-auto">
                                                            <div 
                                                                className="rounded-3 d-flex align-items-center justify-content-center"
                                                                style={{ 
                                                                    width: '80px', 
                                                                    height: '80px', 
                                                                    backgroundColor: '#fef3c7',
                                                                    fontSize: '32px'
                                                                }}
                                                            >
                                                                {item.image}
                                                            </div>
                                                        </div>
                                                        <div className="col">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <h6 className="mb-1 fw-bold">{item.name}</h6>
                                                                    <p className="text-muted small mb-1">{item.restaurant}</p>
                                                                    <span 
                                                                        className="badge rounded-pill small"
                                                                        style={{ backgroundColor: '#fef3c7', color: '#92400e' }}
                                                                    >
                                                                        {item.category}
                                                                    </span>
                                                                    {item.note && (
                                                                        <div className="text-warning small mt-1">
                                                                            <strong>Note:</strong> {item.note}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <button 
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => removeItem(item.id)}
                                                                >
                                                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="row align-items-center mt-3">
                                                        <div className="col-auto">
                                                            <h6 className="mb-0 fw-bold">₹{item.price}</h6>
                                                        </div>
                                                        <div className="col-auto ms-auto">
                                                            <div className="d-flex align-items-center">
                                                                <button 
                                                                    className="btn btn-outline-secondary btn-sm rounded-circle"
                                                                    onClick={() => updateQuantity(item.id, -1)}
                                                                    style={{ width: '36px', height: '36px' }}
                                                                >
                                                                    <Minus style={{ width: '16px', height: '16px' }} />
                                                                </button>
                                                                <span className="mx-3 fw-bold">{item.quantity}</span>
                                                                <button 
                                                                    className="btn btn-sm rounded-circle"
                                                                    onClick={() => updateQuantity(item.id, 1)}
                                                                    style={{ 
                                                                        width: '36px', 
                                                                        height: '36px',
                                                                        backgroundColor: '#fbbf24',
                                                                        border: 'none',
                                                                        color: '#000'
                                                                    }}
                                                                >
                                                                    <Plus style={{ width: '16px', height: '16px' }} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="col-auto">
                                                            <h6 className="mb-0 fw-bold">₹{(item.price * item.quantity).toFixed(2)}</h6>
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
                                <div className="card border-0 shadow-sm rounded-4 mt-4">
                                    <div className="card-body p-4">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center">
                                                <MapPin className="me-3 text-warning" style={{ width: '20px', height: '20px' }} />
                                                <div>
                                                    <h6 className="mb-1 fw-bold">Delivery Address</h6>
                                                    <p className="mb-0 text-muted">{deliveryAddress}</p>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-warning btn-sm">Change</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="col-lg-4">
                            {cart.length > 0 && (
                                <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: '20px' }}>
                                    <div className="card-header bg-white border-0 py-4">
                                        <h5 className="mb-0 fw-bold">Order Summary</h5>
                                    </div>
                                    
                                    <div className="card-body">
                                        {/* Coupon Section */}
                                        <div className="mb-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <Tag className="me-2 text-warning" style={{ width: '18px', height: '18px' }} />
                                                <h6 className="mb-0 fw-bold">Apply Coupon</h6>
                                            </div>
                                            
                                            {!appliedCoupon ? (
                                                <div className="d-flex">
                                                    <input 
                                                        type="text" 
                                                        className="form-control me-2" 
                                                        placeholder="Enter coupon code" 
                                                        value={coupon} 
                                                        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                                                    />
                                                    <button 
                                                        className="btn px-3"
                                                        style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000', fontWeight: '600' }}
                                                        onClick={applyCoupon}
                                                    >
                                                        Apply
                                                    </button>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="d-flex align-items-center justify-content-between p-3 rounded-3"
                                                    style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0' }}
                                                >
                                                    <div>
                                                        <span className="fw-bold text-success">{appliedCoupon.code}</span>
                                                        <br />
                                                        <small className="text-success">{appliedCoupon.description}</small>
                                                    </div>
                                                    <button 
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={removeCoupon}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                            
                                            {/* Available Coupons */}
                                            <div className="mt-3">
                                                <small className="text-muted fw-bold">Available Coupons:</small>
                                                {Object.entries(availableCoupons).map(([code, coupon]) => (
                                                    <div key={code} className="small text-muted mt-1">
                                                        <strong>{code}:</strong> {coupon.description}
                                                    </div>
                                                ))}
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
                                                <span>₹{deliveryFee}</span>
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
                                            {grandTotal > 1000 && (
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
                                            >
                                                Proceed to Checkout
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