import React, { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, Search, MapPin, Phone, Mail } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [searchOrderId, setSearchOrderId] = useState('');
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Load pending order from localStorage
        const pendingOrder = localStorage.getItem('pendingOrder');
        if (pendingOrder) {
            try {
                const order = JSON.parse(pendingOrder);
                setOrders([order]);
            } catch (error) {
                console.error('Error loading pending order:', error);
            }
        }
    }, []);

    const searchOrder = async () => {
        if (!searchOrderId.trim()) {
            alert('Please enter an Order ID');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/orders/${searchOrderId}`);
            if (response.ok) {
                const order = await response.json();
                setSearchedOrder(order);
            } else {
                alert('Order not found. Please check your Order ID.');
                setSearchedOrder(null);
            }
        } catch (error) {
            console.error('Error searching order:', error);
            alert('Error searching for order. Please try again.');
        } finally {
            setLoading(false);
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

    const OrderCard = ({ order }) => (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
                <div className="row">
                    <div className="col-md-8">
                        <div className="d-flex align-items-center mb-3">
                            <h5 className="mb-0 fw-bold">Order #{order.orderId}</h5>
                            <span
                                className="badge ms-3 px-3 py-2 rounded-pill d-flex align-items-center"
                                style={{ backgroundColor: getStatusColor(order.status), color: '#fff' }}
                            >
                                {getStatusIcon(order.status)}
                                {order.status}
                            </span>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center text-muted">
                                    <Clock className="me-2" style={{ width: '16px', height: '16px' }} />
                                    <small>Ordered: {new Date(order.createdAt).toLocaleString()}</small>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="d-flex align-items-center text-muted">
                                    <Truck className="me-2" style={{ width: '16px', height: '16px' }} />
                                    <small>Est. Delivery: {order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime).toLocaleString() : '30-40 mins'}</small>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="d-flex align-items-start">
                                <MapPin className="me-2 mt-1 text-warning" style={{ width: '16px', height: '16px' }} />
                                <div>
                                    <small className="text-muted">Delivery Address:</small>
                                    <p className="mb-0 small">{order.address}</p>
                                </div>
                            </div>
                        </div>

                        {order.customerEmail && (
                            <div className="mb-2">
                                <div className="d-flex align-items-center">
                                    <Mail className="me-2 text-info" style={{ width: '16px', height: '16px' }} />
                                    <small className="text-muted">{order.customerEmail}</small>
                                </div>
                            </div>
                        )}

                        {order.customerPhone && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center">
                                    <Phone className="me-2 text-success" style={{ width: '16px', height: '16px' }} />
                                    <small className="text-muted">{order.customerPhone}</small>
                                </div>
                            </div>
                        )}

                        <div className="border-top pt-3">
                            <h6 className="mb-2 fw-bold">Order Items ({order.items.length})</h6>
                            {order.items.slice(0, 3).map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="small">{item.quantity}x {item.name}</span>
                                    <span className="small text-muted">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            {order.items.length > 3 && (
                                <p className="small text-muted mb-0">... and {order.items.length - 3} more items</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="bg-light rounded-3 p-3 h-100 d-flex flex-column justify-content-between">
                            <div>
                                <h6 className="fw-bold mb-3 text-center">Bill Summary</h6>
                                <div className="d-flex justify-content-between mb-1">
                                    <small>Subtotal:</small>
                                    <small>₹{order.subtotal.toFixed(2)}</small>
                                </div>
                                {order.discount > 0 && (
                                    <div className="d-flex justify-content-between mb-1 text-success">
                                        <small>Discount:</small>
                                        <small>-₹{order.discount.toFixed(2)}</small>
                                    </div>
                                )}
                                <div className="d-flex justify-content-between mb-1">
                                    <small>Tax:</small>
                                    <small>₹{order.tax.toFixed(2)}</small>
                                </div>
                                <div className="d-flex justify-content-between mb-1">
                                    <small>Delivery:</small>
                                    <small>{order.deliveryFee === 0 ? 'FREE' : '₹' + order.deliveryFee.toFixed(2)}</small>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <small>Packaging:</small>
                                    <small>₹{order.packagingFee.toFixed(2)}</small>
                                </div>
                                <hr className="my-2" />
                                <div className="d-flex justify-content-between">
                                    <strong>Total:</strong>
                                    <strong style={{ color: '#fbbf24' }}>₹{order.total.toFixed(2)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

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
                                    <h5 className="fw-bold mb-3">Search Result</h5>
                                    <OrderCard order={searchedOrder} />
                                </div>
                            )}

                            {/* Recent Orders */}
                            {orders.length > 0 && (
                                <div>
                                    <h5 className="fw-bold mb-3">Recent Orders</h5>
                                    {orders.map((order, index) => (
                                        <OrderCard key={index} order={order} />
                                    ))}
                                </div>
                            )}

                            {/* No Orders */}
                            {orders.length === 0 && !searchedOrder && (
                                <div className="text-center py-5">
                                    <div style={{ fontSize: '64px' }}>📦</div>
                                    <h5 className="text-muted mt-3">No Orders Yet</h5>
                                    <p className="text-muted">Your order history will appear here</p>
                                    <button
                                        className="btn rounded-pill px-4 py-2"
                                        style={{ backgroundColor: '#fbbf24', border: 'none', color: '#000' }}
                                        onClick={() => window.location.href = '/menu'}
                                    >
                                        Start Ordering
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Orders;
