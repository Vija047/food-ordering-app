import React, { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, Search, MapPin, Phone, Mail, RefreshCw } from 'lucide-react';
import { ordersAPI } from '../../utils/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [previousOrders, setPreviousOrders] = useState([]);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingPrevious, setLoadingPrevious] = useState(false);
    const [showManualSearch, setShowManualSearch] = useState(false);
    const [manualEmail, setManualEmail] = useState('');
    const [manualPhone, setManualPhone] = useState('');

    useEffect(() => {
        // Load pending order from localStorage
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
            try {
                const order = JSON.parse(pendingOrder);
                console.log('Loaded pending order:', order);
                setOrders([order]);
            } catch (error) {
                console.error('Error loading pending order:', error);
            }
        }

        // Load previous orders
        loadPreviousOrders();

        // Debug: Log all localStorage data related to user
        console.log('Debug - localStorage data:', {
            userEmail: localStorage.getItem('userEmail'),
            customerEmail: localStorage.getItem('customerEmail'),
            userPhone: localStorage.getItem('userPhone'),
            customerPhone: localStorage.getItem('customerPhone'),
            pendingOrder: localStorage.getItem('pendingOrder')
        });
    }, []);

    const loadPreviousOrders = async () => {
        setLoadingPrevious(true);
        try {
            // Get user's email or phone from localStorage or recent orders
            const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('customerEmail');
            const userPhone = localStorage.getItem('userPhone') || localStorage.getItem('customerPhone');

            // Try to get from pending order if not in localStorage
            const pendingOrder = localStorage.getItem('pendingOrder');
            let customerEmail = userEmail;
            let customerPhone = userPhone;

            if (!customerEmail && !customerPhone && pendingOrder) {
                try {
                    const order = JSON.parse(pendingOrder);
                    customerEmail = order.customerEmail;
                    customerPhone = order.customerPhone;
                } catch (error) {
                    console.error('Error parsing pending order:', error);
                }
            }

            if (customerEmail || customerPhone) {
                console.log('Fetching order history for:', { customerEmail, customerPhone });

                try {
                    const data = await ordersAPI.getUserOrderHistory(customerEmail, customerPhone);
                    console.log('Order history response:', data);
                    setPreviousOrders(data.orders || []);
                } catch (apiError) {
                    console.error('API Error:', apiError);
                    // Try alternative approach if the first fails
                    console.log('Trying alternative API approach...');

                    // Fallback to direct fetch if API utility fails
                    const params = new URLSearchParams();
                    if (customerEmail) params.append('email', customerEmail);
                    if (customerPhone) params.append('phone', customerPhone);

                    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:7000/api'}/orders/user/history?${params.toString()}`);

                    if (response.ok) {
                        const fallbackData = await response.json();
                        console.log('Fallback response:', fallbackData);
                        setPreviousOrders(fallbackData.orders || []);
                    } else {
                        console.log('No previous orders found or error fetching orders:', response.status);
                    }
                }
            } else {
                console.log('No customer email or phone found');
            }
        } catch (error) {
            console.error('Error loading previous orders:', error);
        } finally {
            setLoadingPrevious(false);
        }
    };

    const reorderItems = (order) => {
        try {
            // Add items to cart
            const cartItems = order.items.map(item => ({
                ...item,
                id: item._id || item.id,
                quantity: item.quantity || 1
            }));

            // Save to localStorage for cart
            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            // Show confirmation and redirect to cart
            const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
            if (window.confirm(`${itemCount} item(s) added to cart! Go to cart to place order?`)) {
                window.location.href = '/cart';
            }
        } catch (error) {
            console.error('Error reordering items:', error);
            alert('Error adding items to cart. Please try again.');
        }
    };

    const searchOrder = async () => {
        if (!searchOrderId.trim()) {
            alert('Please enter an Order ID');
            return;
        }

        setLoading(true);
        try {
            console.log('Searching for order:', searchOrderId);

            try {
                const order = await ordersAPI.getOrderById(searchOrderId);
                console.log('Order found:', order);
                setSearchedOrder(order);
            } catch (apiError) {
                console.error('API Error:', apiError);

                // Fallback to direct fetch if API utility fails
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:7000/api'}/orders/${searchOrderId}`);

                if (response.ok) {
                    const order = await response.json();
                    console.log('Order found via fallback:', order);
                    setSearchedOrder(order);
                } else {
                    console.log('Order not found via fallback:', response.status);
                    alert('Order not found. Please check your Order ID.');
                    setSearchedOrder(null);
                }
            }
        } catch (error) {
            console.error('Error searching order:', error);
            alert('Error searching for order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadOrdersManually = async () => {
        if (!manualEmail && !manualPhone) {
            alert('Please enter either email or phone number');
            return;
        }

        setLoadingPrevious(true);
        try {
            console.log('Manually fetching orders for:', { manualEmail, manualPhone });

            const data = await ordersAPI.getUserOrderHistory(manualEmail, manualPhone);
            console.log('Manual search response:', data);
            setPreviousOrders(data.orders || []);

            // Store in localStorage for future use
            if (manualEmail) localStorage.setItem('customerEmail', manualEmail);
            if (manualPhone) localStorage.setItem('customerPhone', manualPhone);

            setShowManualSearch(false);
        } catch (error) {
            console.error('Error in manual search:', error);
            alert('Error fetching orders. Please check your email/phone and try again.');
        } finally {
            setLoadingPrevious(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#fbbf24';
            case 'Preparing': return '#f97316';
            case 'Out for Delivery': return '#3b82f6';
            case 'Delivered': return '#10b981';
            case 'Cancelled': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock className="me-2" style={{ width: '18px', height: '18px' }} />;
            case 'Preparing': return <Package className="me-2" style={{ width: '18px', height: '18px' }} />;
            case 'Out for Delivery': return <Truck className="me-2" style={{ width: '18px', height: '18px' }} />;
            case 'Delivered': return <CheckCircle className="me-2" style={{ width: '18px', height: '18px' }} />;
            default: return <Package className="me-2" style={{ width: '18px', height: '18px' }} />;
        }
    };

    const OrderCard = ({ order, isPrevious = false }) => {
        // Safely handle missing order data
        if (!order) return null;

        const safeOrder = {
            orderId: order.orderId || 'N/A',
            status: order.status || 'Unknown',
            createdAt: order.createdAt || new Date(),
            estimatedDeliveryTime: order.estimatedDeliveryTime,
            address: order.address || 'Address not provided',
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            items: order.items || [],
            subtotal: order.subtotal || 0,
            discount: order.discount || 0,
            tax: order.tax || 0,
            deliveryFee: order.deliveryFee || 0,
            packagingFee: order.packagingFee || 0,
            total: order.total || 0
        };

        return (
            <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-body p-4">
                    {isPrevious && (
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <small className="text-muted">Order placed on {new Date(safeOrder.createdAt).toLocaleDateString()}</small>
                            {safeOrder.status === 'Delivered' && (
                                <span className="badge bg-success-subtle text-success border border-success">
                                    <CheckCircle className="me-1" style={{ width: '12px', height: '12px' }} />
                                    Completed
                                </span>
                            )}
                        </div>
                    )}
                    <div className="row">
                        <div className="col-md-8">
                            <div className="d-flex align-items-center mb-3">
                                <h5 className="mb-0 fw-bold">Order #{safeOrder.orderId}</h5>
                                <span
                                    className="badge ms-3 px-3 py-2 rounded-pill d-flex align-items-center"
                                    style={{ backgroundColor: getStatusColor(safeOrder.status), color: '#fff' }}
                                >
                                    {getStatusIcon(safeOrder.status)}
                                    {safeOrder.status}
                                </span>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center text-muted">
                                        <Clock className="me-2" style={{ width: '16px', height: '16px' }} />
                                        <small>Ordered: {new Date(safeOrder.createdAt).toLocaleString()}</small>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center text-muted">
                                        <Truck className="me-2" style={{ width: '16px', height: '16px' }} />
                                        <small>Est. Delivery: {safeOrder.estimatedDeliveryTime ? new Date(safeOrder.estimatedDeliveryTime).toLocaleString() : '30-40 mins'}</small>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="d-flex align-items-start">
                                    <MapPin className="me-2 mt-1 text-warning" style={{ width: '16px', height: '16px' }} />
                                    <div>
                                        <small className="text-muted">Delivery Address:</small>
                                        <p className="mb-0 small">{safeOrder.address}</p>
                                    </div>
                                </div>
                            </div>

                            {safeOrder.customerEmail && (
                                <div className="mb-2">
                                    <div className="d-flex align-items-center">
                                        <Mail className="me-2 text-info" style={{ width: '16px', height: '16px' }} />
                                        <small className="text-muted">{safeOrder.customerEmail}</small>
                                    </div>
                                </div>
                            )}

                            {safeOrder.customerPhone && (
                                <div className="mb-3">
                                    <div className="d-flex align-items-center">
                                        <Phone className="me-2 text-success" style={{ width: '16px', height: '16px' }} />
                                        <small className="text-muted">{safeOrder.customerPhone}</small>
                                    </div>
                                </div>
                            )}

                            <div className="border-top pt-3">
                                <h6 className="mb-2 fw-bold">Order Items ({safeOrder.items.length})</h6>
                                {safeOrder.items.length > 0 ? (
                                    <>
                                        {safeOrder.items.slice(0, 3).map((item, index) => (
                                            <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small">{item.quantity || 1}x {item.name || 'Unknown Item'}</span>
                                                <span className="small text-muted">₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        {safeOrder.items.length > 3 && (
                                            <p className="small text-muted mb-0">... and {safeOrder.items.length - 3} more items</p>
                                        )}
                                    </>
                                ) : (
                                    <p className="small text-muted mb-0">No items found</p>
                                )}
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="bg-light rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <h6 className="fw-bold mb-3 text-center">Bill Summary</h6>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small>Subtotal:</small>
                                        <small>₹{safeOrder.subtotal.toFixed(2)}</small>
                                    </div>
                                    {safeOrder.discount > 0 && (
                                        <div className="d-flex justify-content-between mb-1 text-success">
                                            <small>Discount:</small>
                                            <small>-₹{safeOrder.discount.toFixed(2)}</small>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between mb-1">
                                        <small>Tax:</small>
                                        <small>₹{safeOrder.tax.toFixed(2)}</small>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                        <small>Delivery:</small>
                                        <small>{safeOrder.deliveryFee === 0 ? 'FREE' : '₹' + safeOrder.deliveryFee.toFixed(2)}</small>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <small>Packaging:</small>
                                        <small>₹{safeOrder.packagingFee.toFixed(2)}</small>
                                    </div>
                                    <hr className="my-2" />
                                    <div className="d-flex justify-content-between">
                                        <strong>Total:</strong>
                                        <strong style={{ color: '#fbbf24' }}>₹{safeOrder.total.toFixed(2)}</strong>
                                    </div>
                                </div>

                                {isPrevious && safeOrder.status === 'Delivered' && safeOrder.items.length > 0 && (
                                    <div className="mt-3">
                                        <button
                                            className="btn btn-outline-warning btn-sm w-100"
                                            onClick={() => reorderItems(safeOrder)}
                                            title="Add these items to cart"
                                        >
                                            🛒 Reorder
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
           
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .spin {
                        animation: spin 1s linear infinite;
                    }
                `}
            </style>

            <div className="min-vh-100" style={{ backgroundColor: '#fef7ed' }}>
                <div className="container py-4">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="fw-bold mb-4">My Orders</h2>

                            {/* Order Search */}
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">Track Your Order</h5>
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-8">
                                            <label className="form-label">Enter Order ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="e.g., ORD123456789"
                                                value={searchOrderId}
                                                onChange={(e) => setSearchOrderId(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <button
                                                className="btn w-100"
                                                style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000' }}
                                                onClick={searchOrder}
                                                disabled={loading}
                                            >
                                                <Search className="me-2" style={{ width: '18px', height: '18px' }} />
                                                {loading ? 'Searching...' : 'Track Order'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Searched Order */}
                            {searchedOrder && (
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold mb-0">Search Result</h5>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={() => {
                                                setSearchedOrder(null);
                                                setSearchOrderId('');
                                            }}
                                        >
                                            Clear Search
                                        </button>
                                    </div>
                                    <OrderCard order={searchedOrder} />
                                </div>
                            )}

                            {/* Recent/Current Orders */}
                            {orders.length > 0 && (
                                <div className="mb-4">
                                    <h5 className="fw-bold mb-3">Current Orders</h5>
                                    {orders.map((order, index) => (
                                        <OrderCard key={index} order={order} />
                                    ))}
                                </div>
                            )}

                            {/* Loading Previous Orders */}
                            {loadingPrevious && previousOrders.length === 0 && (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="visually-hidden">Loading previous orders...</span>
                                    </div>
                                    <p className="text-muted mt-2">Loading your order history...</p>
                                </div>
                            )}

                            {/* Previous Orders */}
                            {previousOrders.length > 0 && (
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="fw-bold mb-0">Previous Orders</h5>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            onClick={loadPreviousOrders}
                                            disabled={loadingPrevious}
                                        >
                                            <RefreshCw className={`me-1 ${loadingPrevious ? 'spin' : ''}`} style={{ width: '14px', height: '14px' }} />
                                            {loadingPrevious ? 'Loading...' : 'Refresh'}
                                        </button>
                                    </div>
                                    {previousOrders.map((order, index) => (
                                        <OrderCard key={order._id || index} order={order} isPrevious={true} />
                                    ))}
                                </div>
                            )}

                            {/* Manual Search for Orders */}
                            {!loadingPrevious && previousOrders.length === 0 && orders.length === 0 && (
                                <div className="card border-0 shadow-sm rounded-4 mb-4">
                                    <div className="card-body p-4">
                                        <h5 className="fw-bold mb-3">Find Your Orders</h5>
                                        <p className="text-muted mb-3">Enter your email or phone number to find your order history</p>

                                        {!showManualSearch && (
                                            <button
                                                className="btn btn-outline-warning"
                                                onClick={() => setShowManualSearch(true)}
                                            >
                                                Search My Orders
                                            </button>
                                        )}

                                        {showManualSearch && (
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label">Email Address</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder="your@email.com"
                                                        value={manualEmail}
                                                        onChange={(e) => setManualEmail(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        className="form-control"
                                                        placeholder="+91 9876543210"
                                                        value={manualPhone}
                                                        onChange={(e) => setManualPhone(e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-warning"
                                                            onClick={loadOrdersManually}
                                                            disabled={loadingPrevious}
                                                        >
                                                            {loadingPrevious ? 'Searching...' : 'Find Orders'}
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-secondary"
                                                            onClick={() => setShowManualSearch(false)}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* No Previous Orders Message */}
                            {!loadingPrevious && previousOrders.length === 0 && orders.length > 0 && !showManualSearch && (
                                <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="card-body p-4 text-center">
                                        <div style={{ fontSize: '48px' }}>📝</div>
                                        <h6 className="text-muted mt-2">No Previous Orders Found</h6>
                                        <p className="text-muted small mb-2">This seems to be your first order with us!</p>
                                        <button
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => setShowManualSearch(true)}
                                        >
                                            Search with different email/phone
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* No Orders */}
                            {orders.length === 0 && previousOrders.length === 0 && !searchedOrder && !loadingPrevious && !showManualSearch && (
                                <div className="text-center py-5">
                                    <div style={{ fontSize: '64px' }}>📦</div>
                                    <h5 className="text-muted mt-3">No Orders Yet</h5>
                                    <p className="text-muted">Your order history will appear here</p>
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button
                                            className="btn rounded-pill px-4 py-2"
                                            style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000' }}
                                            onClick={() => window.location.href = '/menu'}
                                        >
                                            Start Ordering
                                        </button>
                                        <button
                                            className="btn btn-outline-warning rounded-pill px-4 py-2"
                                            onClick={() => setShowManualSearch(true)}
                                        >
                                            Find My Orders
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Manual Search Section */}
                            <div className="card border-0 shadow-sm rounded-4 mb-4">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3">Or, View Orders by Email/Phone</h5>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                placeholder="Enter your email"
                                                value={manualEmail}
                                                onChange={(e) => setManualEmail(e.target.value)}
                                                disabled={loadingPrevious}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                placeholder="Enter your phone number"
                                                value={manualPhone}
                                                onChange={(e) => setManualPhone(e.target.value)}
                                                disabled={loadingPrevious}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <button
                                            className="btn w-100"
                                            style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000' }}
                                            onClick={loadOrdersManually}
                                            disabled={loadingPrevious}
                                        >
                                            {loadingPrevious ? 'Loading...' : 'View Orders'}
                                        </button>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <small className="text-muted">
                                            We will fetch your order history based on the provided email or phone number.
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;
