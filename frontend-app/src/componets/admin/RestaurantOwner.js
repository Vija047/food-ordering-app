import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FaStore,
    FaClipboardList,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaClock,
    FaRupeeSign,
    FaEdit,
    FaEye,
    FaCheck,
    FaTruck,
    FaHourglass,
    FaUtensils
} from 'react-icons/fa';

const RestaurantOwnerDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({});
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);

    // Replace with actual restaurant ID (would come from authentication)
    const restaurantId = "6747a8f99090e39e8a16cdb5"; // Example restaurant ID

    const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:7000";

    const statusColors = {
        'Pending': 'warning',
        'Preparing': 'info',
        'Out for Delivery': 'primary',
        'Delivered': 'success',
        'Cancelled': 'danger'
    };

    const statusIcons = {
        'Pending': FaHourglass,
        'Preparing': FaUtensils,
        'Out for Delivery': FaTruck,
        'Delivered': FaCheck,
        'Cancelled': FaEdit
    };

    useEffect(() => {
        fetchDashboardData();
        fetchOrders();
        fetchRestaurantDetails();
    }, [selectedStatus]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurantId}/dashboard`);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
        }
    };

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurantId}/orders`, {
                params: { status: selectedStatus }
            });
            setOrders(response.data.orders);
            setError(null);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurantId}/details`);
            setRestaurant(response.data.restaurant);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await axios.put(`${API_URL}/api/restaurant/order/${orderId}/status`, {
                status: newStatus,
                restaurantId: restaurantId
            });

            // Refresh orders after update
            await fetchOrders();
            await fetchDashboardData();

            alert(`Order status updated to ${newStatus}`);
            setSelectedOrder(null);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            'Pending': 'Preparing',
            'Preparing': 'Out for Delivery',
            'Out for Delivery': 'Delivered'
        };
        return statusFlow[currentStatus];
    };

    if (loading && orders.length === 0) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h2 className="mb-1 text-warning">
                                        <FaStore className="me-2" />
                                        Restaurant Owner Dashboard
                                    </h2>
                                    {restaurant && (
                                        <h5 className="text-muted mb-0">{restaurant.name}</h5>
                                    )}
                                </div>
                                <div className="text-end">
                                    <div className="badge bg-warning text-dark fs-6 px-3 py-2">
                                        Restaurant ID: {restaurantId.slice(-8)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="row mb-4">
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="text-warning mb-2">
                                <FaClipboardList size={30} />
                            </div>
                            <h4 className="mb-1">{stats.totalOrders || 0}</h4>
                            <small className="text-muted">Total Orders</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="text-info mb-2">
                                <FaCalendarAlt size={30} />
                            </div>
                            <h4 className="mb-1">{stats.todayOrders || 0}</h4>
                            <small className="text-muted">Today's Orders</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="text-success mb-2">
                                <FaRupeeSign size={30} />
                            </div>
                            <h4 className="mb-1">₹{stats.todayRevenue || 0}</h4>
                            <small className="text-muted">Today's Revenue</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body text-center">
                            <div className="text-warning mb-2">
                                <FaHourglass size={30} />
                            </div>
                            <h4 className="mb-1">{stats.pendingOrders || 0}</h4>
                            <small className="text-muted">Pending Orders</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Section */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="mb-0">
                                    <FaClipboardList className="me-2 text-warning" />
                                    Orders Management
                                </h4>
                                <div className="d-flex gap-2">
                                    <select
                                        className="form-select form-select-sm"
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="all">All Orders</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Preparing">Preparing</option>
                                        <option value="Out for Delivery">Out for Delivery</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => {
                                            fetchOrders();
                                            fetchDashboardData();
                                        }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            {error && (
                                <div className="alert alert-danger m-3" role="alert">
                                    {error}
                                </div>
                            )}

                            {orders.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaClipboardList size={50} className="text-muted mb-3" />
                                    <h5 className="text-muted">No orders found</h5>
                                    <p className="text-muted">
                                        {selectedStatus === 'all'
                                            ? 'No orders have been placed yet.'
                                            : `No ${selectedStatus.toLowerCase()} orders found.`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Order ID</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Customer</th>
                                                <th>Address</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => {
                                                const StatusIcon = statusIcons[order.status];
                                                const nextStatus = getNextStatus(order.status);

                                                return (
                                                    <tr key={order._id}>
                                                        <td>
                                                            <strong className="text-warning">
                                                                #{order.orderId}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            <div className="small">
                                                                {order.items.map((item, index) => (
                                                                    <div key={index}>
                                                                        {item.name} x{item.quantity}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <strong>₹{order.total}</strong>
                                                        </td>
                                                        <td>
                                                            <div className="small">
                                                                {order.customerEmail && (
                                                                    <div>
                                                                        <FaEnvelope className="me-1" />
                                                                        {order.customerEmail}
                                                                    </div>
                                                                )}
                                                                {order.customerPhone && (
                                                                    <div>
                                                                        <FaPhone className="me-1" />
                                                                        {order.customerPhone}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="small">
                                                                <FaMapMarkerAlt className="me-1 text-danger" />
                                                                {order.address}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${statusColors[order.status]} d-flex align-items-center gap-1`}>
                                                                <StatusIcon size={12} />
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="small">
                                                                <div>
                                                                    <FaCalendarAlt className="me-1" />
                                                                    {formatDate(order.createdAt)}
                                                                </div>
                                                                {order.estimatedDeliveryTime && (
                                                                    <div className="text-muted">
                                                                        <FaClock className="me-1" />
                                                                        ETA: {formatDate(order.estimatedDeliveryTime)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex gap-1">
                                                                <button
                                                                    className="btn btn-sm btn-outline-info"
                                                                    onClick={() => setSelectedOrder(order)}
                                                                    title="View Details"
                                                                >
                                                                    <FaEye />
                                                                </button>
                                                                {nextStatus && (
                                                                    <button
                                                                        className="btn btn-sm btn-success"
                                                                        onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                                                        disabled={updating}
                                                                        title={`Mark as ${nextStatus}`}
                                                                    >
                                                                        {updating ? '...' : <FaCheck />}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Order Details - #{selectedOrder.orderId}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setSelectedOrder(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6>Customer Information</h6>
                                        <div className="mb-3">
                                            {selectedOrder.customerEmail && (
                                                <p><FaEnvelope className="me-2" />{selectedOrder.customerEmail}</p>
                                            )}
                                            {selectedOrder.customerPhone && (
                                                <p><FaPhone className="me-2" />{selectedOrder.customerPhone}</p>
                                            )}
                                            <p><FaMapMarkerAlt className="me-2" />{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Order Information</h6>
                                        <div className="mb-3">
                                            <p><strong>Status:</strong>
                                                <span className={`badge bg-${statusColors[selectedOrder.status]} ms-2`}>
                                                    {selectedOrder.status}
                                                </span>
                                            </p>
                                            <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
                                            <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <h6>Order Items</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.name}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>₹{item.price}</td>
                                                    <td>₹{item.price * item.quantity}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer">
                                {getNextStatus(selectedOrder.status) && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => handleStatusUpdate(selectedOrder._id, getNextStatus(selectedOrder.status))}
                                        disabled={updating}
                                    >
                                        {updating ? 'Updating...' : `Mark as ${getNextStatus(selectedOrder.status)}`}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setSelectedOrder(null)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantOwnerDashboard;
