import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // Correct named import

// Create the AuthContext
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load the user from localStorage when the app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to extract user information
        const decodedToken = jwtDecode(token);
        setUser({ name: decodedToken.name, userId: decodedToken.id });

        // Optionally, check if the token is expired and clear it
        const isExpired = decodedToken.exp < Date.now() / 1000;  // Compare expiration time
        if (isExpired) {
          localStorage.removeItem('token');  // Clear expired token
          setUser(null);  // Reset user state
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        localStorage.removeItem('token');  // If the token is invalid, clear it
      }
    }
  }, []);

  // Handle login
  const login = (userData) => {
    setUser(userData);  // Update the user state
    localStorage.setItem('token', userData.token);  // Store the token in localStorage
  };

  // Handle logout
  const logout = () => {
    setUser(null);  // Clear user state
    localStorage.removeItem('token');  // Remove token from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
