import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import {
    FaStore,
    FaClipboardList,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaCalendarAlt,
    FaRupeeSign,
    FaEdit,
    FaEye,
    FaCheck,
    FaTruck,
    FaHourglass,
    FaUtensils,
    FaPlus,
    FaUserCircle,
    FaSignOutAlt,
    FaChartLine,
    FaBox
} from 'react-icons/fa';

const RestaurantOwnerDashboard = () => {
    const [user, setUser] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showCreateRestaurant, setShowCreateRestaurant] = useState(false);
    const [showAddMenuItem, setShowAddMenuItem] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Form states
    const [restaurantForm, setRestaurantForm] = useState({
        name: '',
        location: '',
        cuisine: '',
        phone: '',
        description: ''
    });

    const [menuForm, setMenuForm] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Main Course',
        image: null
    });

    const navigate = useNavigate();
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
        checkAuthentication();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (restaurant) {
            fetchDashboardData();
            fetchOrders();
            fetchMenuItems();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [restaurant, selectedStatus]);

    const checkAuthentication = async () => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('usertype');

        if (!token || userType !== 'restaurant_owner') {
            navigate('/login');
            return;
        }

        try {
            // Get user details
            const response = await axios.get(`${API_URL}/api/user`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(response.data);

            // Find or create restaurant for this user
            await findOrCreateRestaurant(response.data);
        } catch (error) {
            console.error('Authentication error:', error);
            navigate('/login');
        }
    };

    const findOrCreateRestaurant = async (userData) => {
        try {
            // First try to find existing restaurant for this user by email
            const response = await axios.get(`${API_URL}/api/restaurants/owner/${userData.email}`);

            if (response.data.restaurants && response.data.restaurants.length > 0) {
                setRestaurant(response.data.restaurants[0]);
            } else {
                // Show create restaurant form if no restaurant found
                setShowCreateRestaurant(true);
            }
        } catch (error) {
            console.error('Error finding restaurant:', error);
            setShowCreateRestaurant(true);
        } finally {
            setLoading(false);
        }
    };

    const createRestaurant = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const response = await axios.post(`${API_URL}/api/admin`, {
                name: restaurantForm.name,
                location: restaurantForm.location,
                cuisine: restaurantForm.cuisine,
                phone: restaurantForm.phone,
                description: restaurantForm.description,
                ownerEmail: user.email,
                ownerId: user._id || user.id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setRestaurant(response.data.restaurant);
            setShowCreateRestaurant(false);
            setSuccess('Restaurant created successfully!');
            setRestaurantForm({ name: '', location: '', cuisine: '', phone: '', description: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Error creating restaurant');
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurant._id}/dashboard`);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/restaurant/${restaurant._id}/orders`, {
                params: { status: selectedStatus }
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        }
    };

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/getmenu/${restaurant._id}`);
            setMenuItems(response.data || []);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await axios.put(`${API_URL}/api/restaurant/order/${orderId}/status`, {
                status: newStatus,
                restaurantId: restaurant._id
            });

            setSuccess(`Order status updated to ${newStatus}`);
            fetchOrders();
            fetchDashboardData();
            setSelectedOrder(null);
        } catch (error) {
            setError('Failed to update order status');
        } finally {
            setUpdating(false);
        }
    };

    const addMenuItem = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            const formData = new FormData();
            formData.append('name', menuForm.name);
            formData.append('price', menuForm.price);
            formData.append('description', menuForm.description);
            formData.append('category', menuForm.category);
            if (menuForm.image) {
                formData.append('image', menuForm.image);
            }

            await axios.post(`${API_URL}/api/${restaurant._id}/menu`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Menu item added successfully!');
            setShowAddMenuItem(false);
            setMenuForm({ name: '', price: '', description: '', category: 'Main Course', image: null });
            fetchMenuItems();
        } catch (error) {
            setError(error.response?.data?.message || 'Error adding menu item');
        } finally {
            setLoading(false);
        }
    };

    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            'Pending': 'Preparing',
            'Preparing': 'Out for Delivery',
            'Out for Delivery': 'Delivered'
        };
        return statusFlow[currentStatus];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usertype');
        navigate('/login');
    };

    if (loading && !restaurant) {
        return (
            <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Spinner animation="border" variant="warning" />
            </Container>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header */}
            <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)' }}>
                <Container>
                    <span className="navbar-brand h1 mb-0 d-flex align-items-center">
                        <FaStore className="me-2" size={24} />
                        Restaurant Owner Dashboard
                    </span>
                    <div className="navbar-nav ms-auto d-flex flex-row align-items-center">
                        <div className="nav-item d-flex align-items-center me-3 bg-white bg-opacity-25 px-3 py-1 rounded-pill">
                            <FaUserCircle className="me-2" size={16} />
                            <span className="text-white small">{user?.name}</span>
                        </div>
                        <Button variant="light" size="sm" onClick={handleLogout} className="d-flex align-items-center">
                            <FaSignOutAlt className="me-1" size={14} />
                            Logout
                        </Button>
                    </div>
                </Container>
            </nav>

            <Container fluid className="py-4">
                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}

                {/* Restaurant Info */}
                {restaurant && (
                    <Row className="mb-4">
                        <Col>
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h2 className="mb-1 text-warning">
                                                <FaStore className="me-2" />
                                                {restaurant.name}
                                            </h2>
                                            <p className="text-muted mb-0">
                                                <FaMapMarkerAlt className="me-1" />
                                                {restaurant.location}
                                            </p>
                                        </div>
                                        <div className="text-end">
                                            <Badge bg="warning" className="fs-6 px-3 py-2">
                                                ID: {restaurant._id.slice(-8)}
                                            </Badge>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Navigation Tabs */}
                <Row className="mb-4">
                    <Col>
                        <div className="bg-white rounded-4 shadow-sm p-2 d-inline-flex">
                            {['dashboard', 'orders', 'menu'].map((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "warning" : "light"}
                                    className="me-1"
                                    onClick={() => setActiveTab(tab)}
                                    style={{ borderRadius: '20px', textTransform: 'capitalize' }}
                                >
                                    {tab === 'dashboard' && <FaChartLine className="me-1" />}
                                    {tab === 'orders' && <FaClipboardList className="me-1" />}
                                    {tab === 'menu' && <FaUtensils className="me-1" />}
                                    {tab}
                                </Button>
                            ))}
                        </div>
                    </Col>
                </Row>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <Row>
                        <Col md={3} className="mb-3">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center">
                                    <div className="text-warning mb-2">
                                        <FaClipboardList size={30} />
                                    </div>
                                    <h4 className="mb-1">{stats.totalOrders || 0}</h4>
                                    <small className="text-muted">Total Orders</small>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center">
                                    <div className="text-info mb-2">
                                        <FaCalendarAlt size={30} />
                                    </div>
                                    <h4 className="mb-1">{stats.todayOrders || 0}</h4>
                                    <small className="text-muted">Today's Orders</small>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center">
                                    <div className="text-success mb-2">
                                        <FaRupeeSign size={30} />
                                    </div>
                                    <h4 className="mb-1">₹{stats.todayRevenue || 0}</h4>
                                    <small className="text-muted">Today's Revenue</small>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={3} className="mb-3">
                            <Card className="border-0 shadow-sm h-100">
                                <Card.Body className="text-center">
                                    <div className="text-warning mb-2">
                                        <FaHourglass size={30} />
                                    </div>
                                    <h4 className="mb-1">{stats.pendingOrders || 0}</h4>
                                    <small className="text-muted">Pending Orders</small>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <Row>
                        <Col>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-white border-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">
                                            <FaClipboardList className="me-2 text-warning" />
                                            Orders Management
                                        </h4>
                                        <div className="d-flex gap-2">
                                            <Form.Select
                                                size="sm"
                                                value={selectedStatus}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                                style={{ width: '150px' }}
                                            >
                                                <option value="all">All Orders</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Preparing">Preparing</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </Form.Select>
                                            <Button variant="warning" size="sm" onClick={fetchOrders}>
                                                Refresh
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="p-0">
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
                                            <Table hover className="mb-0">
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
                                                                    <Badge bg={statusColors[order.status]} className="d-flex align-items-center gap-1">
                                                                        <StatusIcon size={12} />
                                                                        {order.status}
                                                                    </Badge>
                                                                </td>
                                                                <td>
                                                                    <div className="small">
                                                                        <div>
                                                                            <FaCalendarAlt className="me-1" />
                                                                            {formatDate(order.createdAt)}
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className="d-flex gap-1">
                                                                        <Button
                                                                            variant="outline-info"
                                                                            size="sm"
                                                                            onClick={() => setSelectedOrder(order)}
                                                                            title="View Details"
                                                                        >
                                                                            <FaEye />
                                                                        </Button>
                                                                        {nextStatus && (
                                                                            <Button
                                                                                variant="success"
                                                                                size="sm"
                                                                                onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                                                                disabled={updating}
                                                                                title={`Mark as ${nextStatus}`}
                                                                            >
                                                                                {updating ? '...' : <FaCheck />}
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </Table>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                {/* Menu Tab */}
                {activeTab === 'menu' && (
                    <Row>
                        <Col>
                            <Card className="border-0 shadow-sm">
                                <Card.Header className="bg-white border-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h4 className="mb-0">
                                            <FaUtensils className="me-2 text-warning" />
                                            Menu Management
                                        </h4>
                                        <Button
                                            variant="warning"
                                            onClick={() => setShowAddMenuItem(true)}
                                            className="d-flex align-items-center"
                                        >
                                            <FaPlus className="me-1" />
                                            Add Menu Item
                                        </Button>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {menuItems.length === 0 ? (
                                        <div className="text-center py-5">
                                            <FaBox size={50} className="text-muted mb-3" />
                                            <h5 className="text-muted">No menu items found</h5>
                                            <p className="text-muted">Add your first menu item to get started</p>
                                        </div>
                                    ) : (
                                        <Row>
                                            {menuItems.map((item) => (
                                                <Col md={4} className="mb-3" key={item._id}>
                                                    <Card className="h-100">
                                                        {item.image && (
                                                            <Card.Img
                                                                variant="top"
                                                                src={`${API_URL}/uploads/${item.image}`}
                                                                style={{ height: '200px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                        <Card.Body>
                                                            <Card.Title>{item.name}</Card.Title>
                                                            <Card.Text>{item.description}</Card.Text>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <span className="h5 text-warning mb-0">₹{item.price}</span>
                                                                <Badge bg="secondary">{item.category || 'Main Course'}</Badge>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Container>

            {/* Create Restaurant Modal */}
            <Modal show={showCreateRestaurant} onHide={() => setShowCreateRestaurant(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Create Your Restaurant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Restaurant Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={restaurantForm.name}
                                        onChange={(e) => setRestaurantForm({ ...restaurantForm, name: e.target.value })}
                                        placeholder="Enter restaurant name"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={restaurantForm.location}
                                        onChange={(e) => setRestaurantForm({ ...restaurantForm, location: e.target.value })}
                                        placeholder="Enter location"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cuisine Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={restaurantForm.cuisine}
                                        onChange={(e) => setRestaurantForm({ ...restaurantForm, cuisine: e.target.value })}
                                        placeholder="e.g., Indian, Chinese, Italian"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        type="tel"
                                        value={restaurantForm.phone}
                                        onChange={(e) => setRestaurantForm({ ...restaurantForm, phone: e.target.value })}
                                        placeholder="Enter phone number"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={restaurantForm.description}
                                onChange={(e) => setRestaurantForm({ ...restaurantForm, description: e.target.value })}
                                placeholder="Brief description of your restaurant"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCreateRestaurant(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="warning"
                        onClick={createRestaurant}
                        disabled={!restaurantForm.name || !restaurantForm.location || loading}
                    >
                        {loading ? 'Creating...' : 'Create Restaurant'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Add Menu Item Modal */}
            <Modal show={showAddMenuItem} onHide={() => setShowAddMenuItem(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Menu Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={menuForm.name}
                                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                                placeholder="Enter item name"
                                required
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Price (₹)</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={menuForm.price}
                                        onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                                        placeholder="Enter price"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select
                                        value={menuForm.category}
                                        onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                                    >
                                        <option value="Main Course">Main Course</option>
                                        <option value="Appetizer">Appetizer</option>
                                        <option value="Dessert">Dessert</option>
                                        <option value="Beverage">Beverage</option>
                                        <option value="Snacks">Snacks</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={menuForm.description}
                                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                                placeholder="Describe the item"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setMenuForm({ ...menuForm, image: e.target.files[0] })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddMenuItem(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="warning"
                        onClick={addMenuItem}
                        disabled={!menuForm.name || !menuForm.price || loading}
                    >
                        {loading ? 'Adding...' : 'Add Item'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Order Details Modal */}
            {selectedOrder && (
                <Modal show={true} onHide={() => setSelectedOrder(null)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Order Details - #{selectedOrder.orderId}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
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
                            </Col>
                            <Col md={6}>
                                <h6>Order Information</h6>
                                <div className="mb-3">
                                    <p><strong>Status:</strong>
                                        <Badge bg={statusColors[selectedOrder.status]} className="ms-2">
                                            {selectedOrder.status}
                                        </Badge>
                                    </p>
                                    <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
                                    <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                                </div>
                            </Col>
                        </Row>

                        <h6>Order Items</h6>
                        <div className="table-responsive">
                            <Table size="sm">
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
                            </Table>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {getNextStatus(selectedOrder.status) && (
                            <Button
                                variant="success"
                                onClick={() => handleStatusUpdate(selectedOrder._id, getNextStatus(selectedOrder.status))}
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : `Mark as ${getNextStatus(selectedOrder.status)}`}
                            </Button>
                        )}
                        <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default RestaurantOwnerDashboard;
