import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  MapPin,
  Store,
  ChefHat,
  DollarSign,
  AlertCircle,
  CheckCircle,
  User,
  LogOut,
  Eye,
  Edit,
  Upload
} from "lucide-react";

// Add CSS for animations
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { transform: translateX(-10px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }
  
  .slideIn {
    animation: slideIn 0.5s ease forwards;
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
`;

// Add custom styles
const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    color: 'white',
    padding: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  card: {
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    },
    borderRadius: '12px',
    overflow: 'hidden',
    border: 'none',
  },
  tab: {
    transition: 'all 0.3s ease',
    fontWeight: '500',
  },
  button: {
    transition: 'all 0.2s ease',
    borderRadius: '50px',
    padding: '8px 18px',
  },
  gradientBg: {
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  },
  warningHeader: {
    background: 'linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)',
    borderRadius: '12px 12px 0 0',
    border: 'none',
  },
  successHeader: {
    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
    borderRadius: '12px 12px 0 0',
    border: 'none',
  },
  primaryHeader: {
    background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
    borderRadius: '12px 12px 0 0',
    border: 'none',
  }
};

const RestaurantManagement = () => {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  // Auth Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Restaurant State
  const [restaurantName, setRestaurantName] = useState("");
  const [location, setLocation] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");

  // Menu Item State
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuImage, setMenuImage] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // Edit Menu Item State
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMenuName, setEditMenuName] = useState("");
  const [editMenuPrice, setEditMenuPrice] = useState("");
  const [editMenuDescription, setEditMenuDescription] = useState("");
  const [editMenuImage, setEditMenuImage] = useState(null);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState(null);

  // UI State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("restaurants");

  // Navigation hook
  const navigate = useNavigate();

  // Check for existing auth on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserType = localStorage.getItem("usertype");
    if (storedToken && storedUserType) {
      setToken(storedToken);
      setUserType(storedUserType);
      setIsLoggedIn(true);
      fetchUserDetails(storedToken);
    }
  }, []);

  // API Base URL
  const API_BASE = "http://localhost:7000/api";

  // Utility Functions
  const showMessage = (message, type = "error") => {
    if (type === "error") {
      setError(message);
      setTimeout(() => setError(""), 3000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Function to get image URL or return default image
  const getImageUrl = (imageName) => {
    if (!imageName) return "/assets/cutlery.ico"; // Default image
    return `${API_BASE}/uploads/${imageName}`;
  };

  // Auth Functions
  // eslint-disable-next-line no-unused-vars
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/Register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      showMessage("Registration successful! Please login.", "success");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      // Make sure admin role is set correctly
      const userRole = data.user.role === "admin" ? "admin" : "customer";
      localStorage.setItem("usertype", userRole);

      setToken(data.token);
      setUserType(userRole);
      setUser(data.user);
      setIsLoggedIn(true);

      showMessage("Login successful!", "success");
      setEmail("");
      setPassword("");
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (authToken) => {
    try {
      const response = await fetch(`${API_BASE}/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("usertype");

    // Reset state
    setToken("");
    setUserType("");
    setIsLoggedIn(false);
    setUser(null);

    // Navigate to login page
    navigate("/login");
  };

  // Restaurant Functions
  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (userType !== "admin") {
      showMessage("Admin access required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: restaurantName,
          location: location,
          role: "admin" // Add role to ensure proper authorization
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add restaurant");
      }

      showMessage("Restaurant added successfully!", "success");
      setRestaurantName("");
      setLocation("");
      setRestaurants([...restaurants, data.restaurant]);
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Menu Item Functions
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (userType !== "admin") {
      showMessage("Admin access required");
      setLoading(false);
      return;
    }

    if (!selectedRestaurant) {
      showMessage("Please select a restaurant first");
      setLoading(false);
      return;
    }

    try {
      // Use FormData to upload image file
      const formData = new FormData();
      formData.append("name", menuName);
      formData.append("price", parseFloat(menuPrice));
      formData.append("description", menuDescription);

      // Add image file if selected
      if (menuImage) {
        formData.append("image", menuImage);
      }

      const response = await fetch(`${API_BASE}/${selectedRestaurant}/menu`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type here as FormData will set it automatically with the boundary
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add menu item");
      }

      showMessage("Menu item added successfully!", "success");
      setMenuName("");
      setMenuPrice("");
      setMenuDescription("");
      setMenuImage(null);
      fetchMenuItems(selectedRestaurant); // Refresh menu items for the selected restaurant
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditMenuItem = (menuItem) => {
    setEditingMenuItem(menuItem);
    setEditMenuName(menuItem.name);
    setEditMenuPrice(menuItem.price.toString());
    setEditMenuDescription(menuItem.description || "");
    setEditMenuImage(null);
    setShowEditModal(true);
  };

  const handleUpdateMenuItem = async (e) => {
    e.preventDefault();
    if (!editingMenuItem) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", editMenuName);
      formData.append("price", parseFloat(editMenuPrice));
      formData.append("description", editMenuDescription);

      if (editMenuImage) {
        formData.append("image", editMenuImage);
      }

      const response = await fetch(`${API_BASE}/menu/${editingMenuItem._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update menu item");
      }

      showMessage("Menu item updated successfully!", "success");
      setShowEditModal(false);
      setEditingMenuItem(null);
      setEditMenuName("");
      setEditMenuPrice("");
      setEditMenuDescription("");
      setEditMenuImage(null);

      // Refresh menu items
      fetchMenuItems(selectedRestaurant);
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenuItem = (menuItem) => {
    setMenuItemToDelete(menuItem);
    setShowDeleteModal(true);
  };

  const confirmDeleteMenuItem = async () => {
    if (!menuItemToDelete) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/menu/${menuItemToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete menu item");
      }

      showMessage("Menu item deleted successfully!", "success");
      setShowDeleteModal(false);
      setMenuItemToDelete(null);

      // Refresh menu items
      fetchMenuItems(selectedRestaurant);
    } catch (err) {
      showMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuImage(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditMenuImage(file);
    }
  };

  // Fetch all restaurants
  const fetchRestaurants = async () => {
    if (userType !== "admin") return;
    try {
      const response = await fetch(`${API_BASE}/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setRestaurants(data);
      }
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  // Fetch menu items
  const fetchMenuItems = async (restaurantId = null) => {
    if (userType !== "admin") return;

    try {
      let url = `${API_BASE}/allmenu`;

      // If a specific restaurant is selected, fetch menu items for that restaurant
      if (restaurantId) {
        url = `${API_BASE}/getmenu/${restaurantId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        console.error("Failed to fetch menu items:", response.statusText);
        setMenuItems([]);
      }
    } catch (err) {
      console.error("Error fetching menu items:", err);
      setMenuItems([]);
    }
  };

  // Fetch restaurants when admin logs in or when switching to restaurants tab
  useEffect(() => {
    if (isLoggedIn && userType === "admin" && activeTab === "restaurants") {
      fetchRestaurants();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, userType, activeTab]);

  // Fetch menu items when restaurant is selected or when switching to menu tab
  useEffect(() => {
    if (isLoggedIn && userType === "admin" && activeTab === "menu") {
      if (selectedRestaurant) {
        fetchMenuItems(selectedRestaurant);
      } else {
        fetchMenuItems(); // Fetch all menu items if no restaurant is selected
      }
    }
    // eslint-disable-next-line
  }, [isLoggedIn, userType, activeTab, selectedRestaurant]);

  // Initial data fetch
  useEffect(() => {
    if (isLoggedIn && userType === "admin") {
      fetchRestaurants();
      fetchMenuItems();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, userType]);



  // Main Dashboard UI
  return (
    <>
      {/* Add animation styles */}
      <style>{animationStyles}</style>
      <div className="min-vh-100" style={{ background: '#f0f2f5' }}>
        {/* Header */}
        <nav className="navbar navbar-expand-lg" style={styles.navbar}>
          <div className="container">
            <span className="navbar-brand h1 mb-0 text-white d-flex align-items-center">
              <Store className="me-2" size={24} />
              Restaurant Management
            </span>
            <div className="navbar-nav ms-auto">
              <div className="nav-item d-flex align-items-center me-3 bg-white bg-opacity-25 px-3 py-1 rounded-pill">
                <User className="me-2" size={16} />
                <span className="text-white small">{user?.name}
                  <span className="ms-1 badge bg-white text-primary">{userType}</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-light btn-sm d-flex align-items-center"
                style={styles.button}
              >
                <LogOut className="me-1" size={16} />
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="container py-4">
          {error && (
            <div className="alert alert-danger d-flex align-items-center shadow-sm border-0 rounded-3"
              style={{ animation: 'fadeIn 0.5s' }} role="alert">
              <div className="bg-danger bg-opacity-25 p-2 rounded-circle me-3">
                <AlertCircle className="text-danger" size={24} />
              </div>
              <div>{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center shadow-sm border-0 rounded-3"
              style={{ animation: 'fadeIn 0.5s' }} role="alert">
              <div className="bg-success bg-opacity-25 p-2 rounded-circle me-3">
                <CheckCircle className="text-success" size={24} />
              </div>
              <div>{success}</div>
            </div>
          )}

          {userType === "admin" ? (
            <div>
              {/* Tab Navigation */}
              <div className="bg-white rounded-4 shadow-sm p-2 mb-4 d-inline-flex fadeIn">
                <button
                  onClick={() => setActiveTab("restaurants")}
                  className={`btn d-flex align-items-center me-1 ${activeTab === "restaurants" ? "text-white" : "text-primary"}`}
                  style={{
                    ...styles.tab,
                    backgroundColor: activeTab === "restaurants" ? '#1e3c72' : 'transparent',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: activeTab === "restaurants" ? '600' : '500',
                    boxShadow: activeTab === "restaurants" ? '0 4px 10px rgba(30, 60, 114, 0.3)' : 'none',
                  }}
                >
                  <Store className="me-2" size={18} />
                  Restaurants
                </button>
                <button
                  onClick={() => setActiveTab("menu")}
                  className={`btn d-flex align-items-center ${activeTab === "menu" ? "text-white" : "text-primary"}`}
                  style={{
                    ...styles.tab,
                    backgroundColor: activeTab === "menu" ? '#1e3c72' : 'transparent',
                    borderRadius: '50px',
                    padding: '10px 20px',
                    fontSize: '0.95rem',
                    fontWeight: activeTab === "menu" ? '600' : '500',
                    boxShadow: activeTab === "menu" ? '0 4px 10px rgba(30, 60, 114, 0.3)' : 'none',
                  }}
                >
                  <ChefHat className="me-2" size={18} />
                  Menu Items
                </button>
              </div>

              {/* Restaurant Management Tab */}
              {activeTab === "restaurants" && (
                <div className="row">
                  <div className="col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                      <div className="card-header text-white" style={styles.warningHeader}>
                        <h5 className="card-title mb-0 d-flex align-items-center">
                          <div className="bg-white rounded-circle p-1 me-2">
                            <Plus className="text-warning" size={20} />
                          </div>
                          Add Restaurant
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        <div className="mb-4">
                          <label className="form-label fw-bold small text-uppercase text-muted">Restaurant Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                              <Store size={18} />
                            </span>
                            <input
                              type="text"
                              className="form-control ps-2 border-0 bg-light"
                              placeholder="Enter restaurant name"
                              style={{ height: '48px' }}
                              value={restaurantName}
                              onChange={(e) => setRestaurantName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="form-label fw-bold small text-uppercase text-muted">Location</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                              <MapPin size={18} />
                            </span>
                            <input
                              type="text"
                              className="form-control ps-2 border-0 bg-light"
                              placeholder="Enter location"
                              style={{ height: '48px' }}
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleAddRestaurant}
                          disabled={loading}
                          className="btn w-100"
                          style={{
                            background: 'linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)',
                            color: 'white',
                            height: '50px',
                            borderRadius: '50px',
                            fontWeight: '600',
                            boxShadow: '0 4px 10px rgba(255, 154, 0, 0.3)',
                          }}
                        >
                          {loading ? (
                            <span className="d-flex align-items-center justify-content-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Adding...
                            </span>
                          ) : (
                            <span className="d-flex align-items-center justify-content-center">
                              <Plus className="me-2" size={20} />
                              Add Restaurant
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6 mb-4">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                      <div className="card-header text-white" style={styles.primaryHeader}>
                        <h5 className="card-title mb-0 d-flex align-items-center">
                          <div className="bg-white rounded-circle p-1 me-2">
                            <Store className="text-primary" size={20} />
                          </div>
                          Recent Restaurants
                        </h5>
                      </div>
                      <div className="card-body p-4">
                        {restaurants.length > 0 ? (
                          <div className="list-group list-group-flush">
                            {restaurants.slice(-5).map((restaurant, index) => (<div
                              key={index}
                              className="list-group-item px-4 py-3 border-0 mb-3 shadow-sm slideIn"
                              style={{
                                backgroundColor: 'white',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease',
                                animationDelay: `${index * 0.1}s`,
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-2 fw-bold d-flex align-items-center">
                                    <span
                                      className="me-2 p-2 rounded-circle"
                                      style={{
                                        background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}>
                                      <Store className="text-white" size={16} />
                                    </span>
                                    {restaurant.name}
                                  </h6>
                                  <p className="mb-0 text-muted small d-flex align-items-center ps-4">
                                    <MapPin className="me-1" size={14} />
                                    {restaurant.location}
                                  </p>
                                </div>
                                <div className="d-flex gap-1">
                                  <button className="btn btn-light btn-sm rounded-circle" title="View details">
                                    <Eye size={14} />
                                  </button>
                                  <button className="btn btn-light btn-sm rounded-circle" title="Edit restaurant">
                                    <Edit size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-5">
                            <div
                              className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                              style={{
                                background: 'rgba(78, 115, 223, 0.1)',
                                width: '80px',
                                height: '80px'
                              }}>
                              <Store size={40} className="text-primary opacity-75" />
                            </div>
                            <h6 className="fw-bold text-muted">No restaurants added yet</h6>
                            <p className="text-muted small">Add your first restaurant to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Items Management Tab */}
              {activeTab === "menu" && (
                <div>
                  <div className="card mb-4 border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    <div className="card-header text-white" style={styles.successHeader}>
                      <h5 className="card-title mb-0 d-flex align-items-center">
                        <div className="bg-white rounded-circle p-1 me-2">
                          <ChefHat className="text-success" size={20} />
                        </div>
                        Add Menu Item
                      </h5>
                    </div>
                    <div className="card-body p-4">
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-uppercase text-muted">Restaurant</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                              <Store size={18} />
                            </span>
                            <select
                              value={selectedRestaurant}
                              onChange={(e) => setSelectedRestaurant(e.target.value)}
                              className="form-select ps-2 border-0 bg-light"
                              style={{ height: '48px' }}
                            >
                              <option value="">Select Restaurant</option>
                              {restaurants.map((restaurant, index) => (
                                <option key={index} value={restaurant._id || restaurant.id}>
                                  {restaurant.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-uppercase text-muted">Item Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                              <ChefHat size={18} />
                            </span>
                            <input
                              type="text"
                              className="form-control ps-2 border-0 bg-light"
                              placeholder="Enter menu item name"
                              style={{ height: '48px' }}
                              value={menuName}
                              onChange={(e) => setMenuName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row g-4 mt-1">
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-uppercase text-muted">Price</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                              <DollarSign size={18} />
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              className="form-control ps-2 border-0 bg-light"
                              placeholder="0.00"
                              style={{ height: '48px' }}
                              value={menuPrice}
                              onChange={(e) => setMenuPrice(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-bold small text-uppercase text-muted">Image</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-0">
                              <Upload size={18} />
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="form-control ps-2 border-0 bg-light"
                              onChange={handleImageChange}
                              style={{ height: '48px' }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
                        <div className="input-group">
                          <textarea
                            className="form-control ps-2 border-0 bg-light"
                            rows="3"
                            placeholder="Enter dish description"
                            value={menuDescription}
                            onChange={(e) => setMenuDescription(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          onClick={handleAddMenuItem}
                          disabled={loading}
                          className="btn w-100"
                          style={{
                            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            color: 'white',
                            height: '50px',
                            borderRadius: '50px',
                            fontWeight: '600',
                            boxShadow: '0 4px 10px rgba(40, 167, 69, 0.3)',
                          }}
                        >
                          {loading ? (
                            <span className="d-flex align-items-center justify-content-center">
                              <div className="spinner-border spinner-border-sm me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                              </div>
                              Adding Menu Item...
                            </span>
                          ) : (
                            <span className="d-flex align-items-center justify-content-center">
                              <Plus className="me-2" size={20} />
                              Add Menu Item
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items List */}
                  <div className="card border-0 shadow-sm" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                    <div className="card-header bg-white d-flex justify-content-between align-items-center p-4">
                      <div>
                        <h5 className="card-title mb-1 d-flex align-items-center">
                          <div
                            className="rounded-circle p-2 me-2"
                            style={{ background: 'rgba(78, 115, 223, 0.1)' }}>
                            <ChefHat className="text-primary" size={18} />
                          </div>
                          Menu Items Collection
                        </h5>
                        {selectedRestaurant && (
                          <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                            <Store className="me-1" size={12} />
                            {restaurants.find(r => r._id === selectedRestaurant || r.id === selectedRestaurant)?.name || 'Selected Restaurant'}
                          </div>
                        )}
                        {!selectedRestaurant && (
                          <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                            <Store className="me-1" size={12} />
                            All Restaurants
                          </div>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        {selectedRestaurant && (
                          <button
                            onClick={() => setSelectedRestaurant("")}
                            className="btn btn-light d-flex align-items-center"
                            style={{ borderRadius: '50px', padding: '8px 16px' }}
                          >
                            <Eye className="me-2" size={16} />
                            Show All
                          </button>
                        )}
                        <button
                          onClick={() => fetchMenuItems(selectedRestaurant)}
                          className="btn btn-primary d-flex align-items-center"
                          style={{
                            borderRadius: '50px',
                            padding: '8px 16px',
                            background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                            border: 'none',
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-repeat me-2" viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
                            <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
                          </svg>
                          Refresh
                        </button>
                      </div>
                    </div>
                    <div className="card-body p-4">
                      {menuItems.length > 0 ? (
                        <div className="row g-4">
                          {menuItems.map((item, index) => (
                            <div key={item._id} className="col-md-4 mb-2">
                              <div
                                className="card h-100 border-0 shadow-sm fadeIn"
                                style={{
                                  borderRadius: '15px',
                                  overflow: 'hidden',
                                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                  cursor: 'pointer',
                                  animationDelay: `${index * 0.1}s`,
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.transform = 'translateY(-5px)';
                                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.transform = 'translateY(0)';
                                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.08)';
                                }}
                              >
                                <div className="position-relative">
                                  <img
                                    src={getImageUrl(item.image)}
                                    className="card-img-top"
                                    alt={item.name}
                                    style={{ height: '180px', objectFit: 'cover' }}
                                    onError={(e) => {
                                      e.target.src = '/assets/cutlery.ico'; // Fallback image
                                      e.target.onerror = null;
                                    }}
                                  />
                                  <div
                                    className="position-absolute top-0 end-0 m-2 px-3 py-2 rounded-pill"
                                    style={{
                                      background: 'rgba(40, 167, 69, 0.9)',
                                      backdropFilter: 'blur(5px)',
                                    }}>
                                    <span className="text-white fw-bold">
                                      ${parseFloat(item.price).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <h6 className="card-title fw-bold mb-2">{item.name}</h6>
                                  {item.description && (
                                    <p className="card-text text-muted small mb-3"
                                      style={{
                                        height: '40px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: '2',
                                        WebkitBoxOrient: 'vertical',
                                      }}>
                                      {item.description}
                                    </p>
                                  )}
                                  <div className="d-flex gap-2 mt-2">
                                    <button className="btn btn-sm btn-light flex-grow-1 d-flex align-items-center justify-content-center"
                                      onClick={() => handleEditMenuItem(item)}>
                                      <Edit size={14} className="me-1" />
                                      Edit
                                    </button>
                                    <button className="btn btn-sm btn-danger flex-grow-1 d-flex align-items-center justify-content-center"
                                      onClick={() => handleDeleteMenuItem(item)}>
                                      <Trash2 size={14} className="me-1" />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <div
                            className="mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center"
                            style={{
                              background: 'rgba(40, 167, 69, 0.1)',
                              width: '80px',
                              height: '80px'
                            }}>
                            <ChefHat size={40} className="text-success opacity-75" />
                          </div>
                          <h6 className="fw-bold text-muted">No menu items found</h6>
                          <p className="text-muted small">Select a restaurant and add menu items</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Edit Menu Item Modal */}
                  {showEditModal && (
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content border-0 rounded-4 shadow-sm">
                          <div className="modal-header">
                            <h5 className="modal-title fw-bold">Edit Menu Item</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowEditModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="mb-4">
                              <label className="form-label fw-bold small text-uppercase text-muted">Item Name</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-0">
                                  <ChefHat size={18} />
                                </span>
                                <input
                                  type="text"
                                  className="form-control ps-2 border-0 bg-light"
                                  placeholder="Enter menu item name"
                                  style={{ height: '48px' }}
                                  value={editMenuName}
                                  onChange={(e) => setEditMenuName(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="form-label fw-bold small text-uppercase text-muted">Price</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-0">
                                  <DollarSign size={18} />
                                </span>
                                <input
                                  type="number"
                                  step="0.01"
                                  className="form-control ps-2 border-0 bg-light"
                                  placeholder="0.00"
                                  style={{ height: '48px' }}
                                  value={editMenuPrice}
                                  onChange={(e) => setEditMenuPrice(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="form-label fw-bold small text-uppercase text-muted">Image</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-0">
                                  <Upload size={18} />
                                </span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="form-control ps-2 border-0 bg-light"
                                  onChange={handleEditImageChange}
                                  style={{ height: '48px' }}
                                />
                              </div>
                            </div>

                            <div className="mt-4">
                              <label className="form-label fw-bold small text-uppercase text-muted">Description</label>
                              <div className="input-group">
                                <textarea
                                  className="form-control ps-2 border-0 bg-light"
                                  rows="3"
                                  placeholder="Enter dish description"
                                  value={editMenuDescription}
                                  onChange={(e) => setEditMenuDescription(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowEditModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn"
                              style={{
                                background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                                color: 'white',
                              }}
                              onClick={handleUpdateMenuItem}
                            >
                              {loading ? (
                                <span className="d-flex align-items-center justify-content-center">
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Saving...
                                </span>
                              ) : (
                                <span className="d-flex align-items-center justify-content-center">
                                  <CheckCircle className="me-2" size={20} />
                                  Save Changes
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delete Confirmation Modal */}
                  {showDeleteModal && (
                    <div className="modal fade show" tabIndex="-1" style={{ display: 'block' }}>
                      <div className="modal-dialog">
                        <div className="modal-content border-0 rounded-4 shadow-sm">
                          <div className="modal-header">
                            <h5 className="modal-title fw-bold">Confirm Deletion</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowDeleteModal(false)}
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p className="mb-0 text-muted">
                              Are you sure you want to delete this menu item? This action cannot be undone.
                            </p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowDeleteModal(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={confirmDeleteMenuItem}
                            >
                              {loading ? (
                                <span className="d-flex align-items-center justify-content-center">
                                  <div className="spinner-border spinner-border-sm me-2" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                  </div>
                                  Deleting...
                                </span>
                              ) : (
                                <span className="d-flex align-items-center justify-content-center">
                                  <Trash2 className="me-2" size={20} />
                                  Delete Menu Item
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
              <div className="card-body p-0">
                <div className="row g-0">
                  <div className="col-lg-5 position-relative" style={{
                    background: 'linear-gradient(135deg, rgba(30, 60, 114, 0.9) 0%, rgba(42, 82, 152, 0.9) 100%), url(/assets/homepage.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '400px'
                  }}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white p-5">
                      <div
                        className="rounded-circle mb-4 d-flex align-items-center justify-content-center"
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(5px)',
                          width: '100px',
                          height: '100px'
                        }}>
                        <User size={48} className="text-white" />
                      </div>
                      <h2 className="h3 mb-3 fw-bold">Welcome Back!</h2>
                      <h3 className="h5 mb-4 text-white-50">{user?.name}</h3>
                      <div className="badge bg-white text-primary px-4 py-2 rounded-pill fw-bold">
                        Customer Account
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="p-5 h-100 d-flex flex-column justify-content-center">
                      <h2 className="mb-4 fw-bold">Limited Access Area</h2>
                      <div className="alert alert-warning border-0" role="alert">
                        <div className="d-flex">
                          <AlertCircle className="me-2" size={20} />
                          <div>
                            <h6 className="fw-bold mb-1">Admin Access Required</h6>
                            <p className="mb-0">
                              You are currently logged in as a regular user. Restaurant management features are only available to administrators.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h6 className="fw-bold mb-3">What you can do:</h6>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                              <CheckCircle className="text-success" size={16} />
                            </div>
                            <span>Browse the menu and place orders</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                              <CheckCircle className="text-success" size={16} />
                            </div>
                            <span>View your order history</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <div className="rounded-circle bg-success bg-opacity-10 p-2 me-3">
                              <CheckCircle className="text-success" size={16} />
                            </div>
                            <span>Update your profile settings</span>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex gap-3 mt-4">
                        <button className="btn btn-primary px-4 py-2"
                          onClick={() => navigate('/')}
                          style={{
                            background: 'linear-gradient(135deg, #4e73df 0%, #224abe 100%)',
                            border: 'none',
                            borderRadius: '50px'
                          }}>
                          Go to Homepage
                        </button>
                        <button className="btn btn-outline-secondary px-4 py-2"
                          onClick={handleLogout}
                          style={{ borderRadius: '50px' }}>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RestaurantManagement;
