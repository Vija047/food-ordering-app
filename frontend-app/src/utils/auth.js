export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  console.log("Retrieved Token:", token); // Debugging
  return token;
};

export const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => Boolean(getAuthToken()); // Check if token exists

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
};

// Validate token by making a request to a protected endpoint
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:7000/api/user', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      removeAuthToken();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    removeAuthToken();
    return false;
  }
};

// Check if error is related to authentication
export const isAuthError = (error) => {
  return error.message.includes('401') ||
    error.message.includes('403') ||
    error.message.includes('Unauthorized') ||
    error.message.includes('Invalid token');
};
