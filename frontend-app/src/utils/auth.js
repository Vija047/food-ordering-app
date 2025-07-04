export const getAuthToken = () => {
  const token = localStorage.getItem("token");
  console.log("Retrieved Token:", token); // Debugging
  return token;
};


export const isAuthenticated = () => Boolean(getAuthToken()); // Check if token exists

export const requireAuth = (navigate) => {
  if (!isAuthenticated()) {
    navigate('/login');
    return false;
  }
  return true;
};
