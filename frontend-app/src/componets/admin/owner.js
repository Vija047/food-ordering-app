import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    FaStore,
    FaClipboardList,
    FaClock,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaUtensils,
    FaSync,
    FaEye,
    FaCheck,
    FaTruck,
    FaBoxOpen
} from "react-icons/fa";

const RestaurantOwner = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [liveOrders, setLiveOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [refreshInterval, setRefreshInterval] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:7001";

    const fetchRestaurants = React.useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/api/restaurants`);
            setRestaurants(response.data);
            if (response.data.length > 0) {
                setSelectedRestaurant(response.data[0]);
            }
        } catch (error) {
            console.error("Error fetching restaurants:", error);
            setError("Failed to load restaurants");
        }
    }, [API_URL]);

    const fetchLiveOrders = React.useCallback(async (restaurantId = selectedRestaurant?._id) => {
        if (!restaurantId) return;

        try {
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurantId}/live-orders`);
            setLiveOrders(response.data.liveOrders || []);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching live orders:", error);
        }
    }, [API_URL, selectedRestaurant]);

    // Fetch restaurants on component mount
    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    // Auto-refresh live orders every 30 seconds
    useEffect(() => {
        if (selectedRestaurant) {
            fetchLiveOrders();
            const interval = setInterval(() => {
                fetchLiveOrders();
            }, 30000);
            setRefreshInterval(interval);

            return () => {
                if (interval) clearInterval(interval);
            };
        }
    }, [selectedRestaurant, fetchLiveOrders]);

    const fetchOrdersForRestaurant = async (restaurantId = selectedRestaurant?._id) => {
        if (!restaurantId) return;

        setIsLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurantId}/orders?status=${statusFilter}`);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestaurantChange = (restaurant) => {
        setSelectedRestaurant(restaurant);
        setOrders([]);
        setLiveOrders([]);
        fetchOrdersForRestaurant(restaurant._id);
        fetchLiveOrders(restaurant._id);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        fetchOrdersForRestaurant();
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        if (!selectedRestaurant) return;

        try {
            await axios.put(`${API_URL}/api/restaurant/${selectedRestaurant._id}/orders/${orderId}/status`, {
                status: newStatus
            });

            // Refresh both live orders and all orders
            fetchLiveOrders();
            fetchOrdersForRestaurant();

            // Show success message
            alert(`Order status updated to: ${newStatus}`);
        } catch (error) {
            console.error("Error updating order status:", error);
            setError("Failed to update order status");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'warning';
            case 'Preparing': return 'info';
            case 'Ready for Pickup': return 'primary';
            case 'Out for Delivery': return 'secondary';
            case 'Delivered': return 'success';
            case 'Cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <FaClock />;
            case 'Preparing': return <FaUtensils />;
            case 'Ready for Pickup': return <FaBoxOpen />;
            case 'Out for Delivery': return <FaTruck />;
            case 'Delivered': return <FaCheck />;
            default: return <FaClock />;
        }
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const getTimeElapsed = (createdAt) => {
        const minutes = Math.floor((new Date() - new Date(createdAt)) / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ${minutes % 60}m ago`;
    };

    return (
        <div style={{ backgroundColor: "#FFF9F4", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
            <div className="container-fluid py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <h2 className="text-center mb-4 fw-bold" style={{ color: "#FFA500" }}>
                                    <FaStore className="me-2" /> Restaurant Owner Dashboard
                                </h2>

                                {/* Restaurant Selector */}
                                <div className="row align-items-center">
                                    <div className="col-md-6">
                                        <label className="form-label fw-medium">Select Restaurant:</label>
                                        <select
                                            className="form-select"
                                            value={selectedRestaurant?._id || ''}
                                            onChange={(e) => {
                                                const restaurant = restaurants.find(r => r._id === e.target.value);
                                                handleRestaurantChange(restaurant);
                                            }}
                                        >
                                            <option value="">-- Select Restaurant --</option>
                                            {restaurants.map((restaurant) => (
                                                <option key={restaurant._id} value={restaurant._id}>
                                                    {restaurant.name} ({restaurant.cuisine})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6 text-md-end">
                                        <button
                                            className="btn btn-outline-warning me-2"
                                            onClick={() => fetchLiveOrders()}
                                            disabled={!selectedRestaurant}
                                        >
                                            <FaSync className="me-1" /> Refresh
                                        </button>
                                        <small className="text-muted">
                                            Last updated: {lastUpdate.toLocaleTimeString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {selectedRestaurant && (
                    <>
                        {/* Live Orders Section */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-header bg-white border-0 py-3">
                                        <h4 className="fw-bold mb-0" style={{ color: "#FFA500" }}>
                                            <FaClipboardList className="me-2" /> Live Orders ({liveOrders.length})
                                        </h4>
                                        <small className="text-muted">Orders currently being processed</small>
                                    </div>
                                    <div className="card-body">
                                        {liveOrders.length === 0 ? (
                                            <div className="text-center py-5">
                                                <FaClipboardList size={48} className="text-muted mb-3" />
                                                <h5>No active orders</h5>
                                                <p className="text-muted">New orders will appear here automatically</p>
                                            </div>
                                        ) : (
                                            <div className="row g-3">
                                                {liveOrders.map((order) => (
                                                    <div key={order._id} className="col-lg-6 col-xl-4">
                                                        <div className="card border-0 bg-light rounded-3 h-100">
                                                            <div className="card-body">
                                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                                    <div>
                                                                        <h6 className="fw-bold mb-1">#{order.orderId}</h6>
                                                                        <small className="text-muted">{getTimeElapsed(order.createdAt)}</small>
                                                                    </div>
                                                                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                                                                        {getStatusIcon(order.status)} {order.status}
                                                                    </span>
                                                                </div>

                                                                {/* Order Items */}
                                                                <div className="mb-3">
                                                                    <h6 className="small fw-medium mb-2">Items:</h6>
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} className="d-flex justify-content-between small">
                                                                            <span>{item.quantity}x {item.name}</span>
                                                                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                                                        </div>
                                                                    ))}
                                                                    <hr className="my-2" />
                                                                    <div className="d-flex justify-content-between fw-medium">
                                                                        <span>Total:</span>
                                                                        <span>₹{order.restaurantSubtotal.toFixed(2)}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Customer Info */}
                                                                <div className="mb-3">
                                                                    <h6 className="small fw-medium mb-2">Customer:</h6>
                                                                    {order.customerPhone && (
                                                                        <div className="small mb-1">
                                                                            <FaPhone className="me-1" size={12} />
                                                                            {order.customerPhone}
                                                                        </div>
                                                                    )}
                                                                    {order.customerEmail && (
                                                                        <div className="small mb-1">
                                                                            <FaEnvelope className="me-1" size={12} />
                                                                            {order.customerEmail}
                                                                        </div>
                                                                    )}
                                                                    <div className="small">
                                                                        <FaMapMarkerAlt className="me-1" size={12} />
                                                                        {order.address}
                                                                    </div>
                                                                </div>

                                                                {/* Status Update Buttons */}
                                                                <div className="d-grid gap-2">
                                                                    {order.status === 'Pending' && (
                                                                        <button
                                                                            className="btn btn-info btn-sm"
                                                                            onClick={() => updateOrderStatus(order._id, 'Preparing')}
                                                                        >
                                                                            <FaUtensils className="me-1" /> Start Preparing
                                                                        </button>
                                                                    )}
                                                                    {order.status === 'Preparing' && (
                                                                        <button
                                                                            className="btn btn-primary btn-sm"
                                                                            onClick={() => updateOrderStatus(order._id, 'Ready for Pickup')}
                                                                        >
                                                                            <FaBoxOpen className="me-1" /> Ready for Pickup
                                                                        </button>
                                                                    )}
                                                                    {order.status === 'Ready for Pickup' && (
                                                                        <button
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                                                                        >
                                                                            <FaTruck className="me-1" /> Out for Delivery
                                                                        </button>
                                                                    )}
                                                                    {order.status === 'Out for Delivery' && (
                                                                        <button
                                                                            className="btn btn-success btn-sm"
                                                                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                                        >
                                                                            <FaCheck className="me-1" /> Mark Delivered
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* All Orders Section */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card border-0 shadow-sm rounded-4">
                                    <div className="card-header bg-white border-0 py-3">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <h4 className="fw-bold mb-0" style={{ color: "#FFA500" }}>
                                                <FaEye className="me-2" /> All Orders
                                            </h4>
                                            <div className="d-flex gap-2">
                                                {['all', 'Pending', 'Preparing', 'Delivered', 'Cancelled'].map((status) => (
                                                    <button
                                                        key={status}
                                                        className={`btn btn-sm ${statusFilter === status ? 'btn-warning' : 'btn-outline-secondary'}`}
                                                        onClick={() => handleStatusFilter(status)}
                                                    >
                                                        {status === 'all' ? 'All' : status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        {isLoading ? (
                                            <div className="text-center py-5">
                                                <div className="spinner-border" style={{ color: "#FFA500" }} role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="text-center py-5">
                                                <FaClipboardList size={48} className="text-muted mb-3" />
                                                <h5>No orders found</h5>
                                                <p className="text-muted">Orders will appear here once customers place them</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Time</th>
                                                            <th>Status</th>
                                                            <th>Items</th>
                                                            <th>Customer</th>
                                                            <th>Address</th>
                                                            <th>Total</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map((order) => (
                                                            <tr key={order._id}>
                                                                <td className="fw-medium">#{order.orderId}</td>
                                                                <td>{formatTime(order.createdAt)}</td>
                                                                <td>
                                                                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                                                                        {getStatusIcon(order.status)} {order.status}
                                                                    </span>
                                                                </td>
                                                                <td>
                                                                    <small>
                                                                        {order.items.map((item, idx) => (
                                                                            <div key={idx}>
                                                                                {item.quantity}x {item.name}
                                                                            </div>
                                                                        ))}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <small>
                                                                        {order.customerPhone && <div><FaPhone className="me-1" size={10} />{order.customerPhone}</div>}
                                                                        {order.customerEmail && <div><FaEnvelope className="me-1" size={10} />{order.customerEmail}</div>}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <small title={order.address}>
                                                                        <FaMapMarkerAlt className="me-1" size={10} />
                                                                        {order.address.substring(0, 30)}...
                                                                    </small>
                                                                </td>
                                                                <td className="fw-medium">₹{order.restaurantSubtotal.toFixed(2)}</td>
                                                                <td>
                                                                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                                                                        <div className="btn-group" role="group">
                                                                            {order.status === 'Pending' && (
                                                                                <button
                                                                                    className="btn btn-sm btn-info"
                                                                                    onClick={() => updateOrderStatus(order._id, 'Preparing')}
                                                                                >
                                                                                    Start
                                                                                </button>
                                                                            )}
                                                                            {order.status === 'Preparing' && (
                                                                                <button
                                                                                    className="btn btn-sm btn-primary"
                                                                                    onClick={() => updateOrderStatus(order._id, 'Ready for Pickup')}
                                                                                >
                                                                                    Ready
                                                                                </button>
                                                                            )}
                                                                            {order.status === 'Ready for Pickup' && (
                                                                                <button
                                                                                    className="btn btn-sm btn-secondary"
                                                                                    onClick={() => updateOrderStatus(order._id, 'Out for Delivery')}
                                                                                >
                                                                                    Dispatch
                                                                                </button>
                                                                            )}
                                                                            {order.status === 'Out for Delivery' && (
                                                                                <button
                                                                                    className="btn btn-sm btn-success"
                                                                                    onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                                                                >
                                                                                    Delivered
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

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
            </div>
        </div>
    );
};

const Owner = () => {
    return <RestaurantOwner />;
};

export default Owner;