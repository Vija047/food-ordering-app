// API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7000/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
};

// Menu Items API
export const menuAPI = {
    // Get all menu items
    getAllMenuItems: () => apiRequest('/allmenu'),

    // Get menu items for a specific restaurant
    getMenuItemsByRestaurant: (restaurantId) => apiRequest(`/getmenu/${restaurantId}`),

    // Add menu item (admin only)
    addMenuItem: (restaurantId, menuItemData, token) => apiRequest(`/${restaurantId}/menu`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(menuItemData),
    }),

    // Update menu item (admin only)
    updateMenuItem: (menuItemId, menuItemData, token) => apiRequest(`/menu/${menuItemId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(menuItemData),
    }),

    // Delete menu item (admin only)
    deleteMenuItem: (menuItemId, token) => apiRequest(`/menu/${menuItemId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }),
};

// Restaurant API
export const restaurantAPI = {
    // Get all restaurants
    getAllRestaurants: () => apiRequest('/restaurants'),

    // Get restaurants for admin
    getAdminRestaurants: (token) => apiRequest('/admin/restaurants', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }),

    // Add restaurant (admin only)
    addRestaurant: (restaurantData, token) => apiRequest('/admin', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(restaurantData),
    }),

    // Get admin dashboard stats
    getAdminStats: (token) => apiRequest('/admin/dashboard/stats', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }),
};

// User API
export const userAPI = {
    // Register user
    register: (userData) => apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
    }),

    // Login user
    login: (credentials) => apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    }),

    // Update admin profile
    updateAdminProfile: (profileData, token) => apiRequest('/admin/profile', {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    }),
};

// Orders API
export const ordersAPI = {
    // Create order
    createOrder: (orderData, token) => apiRequest('/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    }),

    // Get user orders
    getUserOrders: (token) => apiRequest('/orders', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    }),

    // Update order status (admin only)
    updateOrderStatus: (orderId, status, token) => apiRequest(`/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    }),
};

export default apiRequest;
