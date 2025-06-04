import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const RestaurantMenu = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState({});
  const [menuName, setMenuName] = useState('');
  const [menuPrice, setMenuPrice] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isAdmin = localStorage.getItem('usertype')?.trim() === 'admin';
  const token = localStorage.getItem('token')?.trim();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await axios.get('http://localhost:7000/api/get/admin');
      setRestaurants(response.data);
      if (response.data.length > 0) {
        fetchMenuItems(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      setError('Failed to load restaurants.');
    }
  };

  const fetchMenuItems = async (restaurantId) => {
    try {
      const response = await axios.get(`http://localhost:7000/api/${restaurantId}/menu`);
      setMenuItems((prev) => ({ ...prev, [restaurantId]: response.data }));
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setMenuItems((prev) => ({ ...prev, [restaurantId]: [] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token || !isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:7000/api/admin',
        { name, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(response.data.message);
      setName('');
      setLocation('');
      fetchRestaurants();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding restaurant');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!token || !isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }

    try {
      await axios.delete(`http://localhost:7000/api/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Restaurant deleted successfully');
      fetchRestaurants();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete restaurant.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token || !isAdmin) {
      setError('Unauthorized: Admin access required');
      return;
    }

    if (!selectedRestaurant) {
      setError('Please select a restaurant first.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:7000/api/${selectedRestaurant}/menu`,
        { name: menuName, price: menuPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(response.data.message);
      setMenuName('');
      setMenuPrice('');
      fetchMenuItems(selectedRestaurant);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding menu item');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4">Manage Restaurants & Menus</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add Restaurant */}
      {isAdmin && (
        <div className="card p-4 shadow-sm mt-3">
          <h4>Add a New Restaurant</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Restaurant Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Location</label>
              <input type="text" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-warning">Add Restaurant</button>
          </form>
        </div>
      )}

      {/* Restaurant List */}
      <h3 className="mt-4">Restaurant List</h3>
      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.length > 0 ? (
            restaurants.map((restaurant, index) => (
              <tr key={index}>
                <td>{restaurant.name}</td>
                <td>{restaurant.location}</td>
                <td>
                  {isAdmin && (
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(restaurant._id)}>
                      <FaTrash />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No restaurants available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Menu Item */}
      {isAdmin && (
        <div className="card p-4 shadow-sm mt-3">
          <h4>Add Menu Item</h4>
          <form onSubmit={handleAddMenuItem}>
            <div className="mb-3">
              <label className="form-label">Select Restaurant</label>
              <select className="form-control" onChange={(e) => setSelectedRestaurant(e.target.value)} required>
                <option value="">Choose...</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant._id} value={restaurant._id}>{restaurant.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Menu Item Name</label>
              <input type="text" className="form-control" value={menuName} onChange={(e) => setMenuName(e.target.value)} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <input type="number" className="form-control" value={menuPrice} onChange={(e) => setMenuPrice(e.target.value)} required />
            </div>

            <button type="submit" className="btn btn-success">Add Menu Item</button>
          </form>
        </div>
      )}

      {/* Display Menu Items */}
      {restaurants.map((restaurant) => (
        <div key={restaurant._id} className="mt-4">
          <h4>Menu for {restaurant.name}</h4>
          <ul>
            {menuItems[restaurant._id]?.length > 0 ? (
              menuItems[restaurant._id].map((item) => (
                <li key={item._id}>{item.name} - ₹{item.price}</li>
              ))
            ) : (
              <p>No menu items available</p>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default RestaurantMenu;
