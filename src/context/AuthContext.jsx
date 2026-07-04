import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

// =============================================================================
// AUTH CONTEXT — Smart Krishi Mitra
// =============================================================================
// Centrally manages user authentication state, roles, and helper functions.
//
// Future MERN Integration:
//   - Replace initial dummy states with API requests to login/logout/profile endpoints.
//   - Store and retrieve JSON Web Tokens (JWT) in localStorage or HttpOnly Cookies.
//   - Add response/request interceptors for handling token refreshes.
// =============================================================================

const AuthContext = createContext(null);

// Dummy Initial Logged-in User (easy to test role-based components)
const initialDummyUser = {
  id: "USR001",
  name: "Om Bhudhara",
  email: "om@gmail.com",
  role: "Farmer", // Possible roles: "Farmer" | "Vendor" | "Customer" | "Admin"
  profileImage: "/assets/profile.png",
  language: "English",
  isAuthenticated: false
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialDummyUser);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  // login(): Simulates user authentication with user details
  const login = useCallback(async (userData) => {
    setLoading(true);
    try {
      // Future Integration: Make API call to POST /api/auth/login
      // const response = await api.post('/auth/login', credentials);
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // logout(): Resets user session state
  const logout = useCallback(() => {
    setLoading(true);
    // Future Integration: Make API call to POST /api/auth/logout, delete local token
    // localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, []);

  // updateProfile(): Updates specific user profile details
  const updateProfile = useCallback((updatedFields) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        ...updatedFields
      };
    });
  }, []);

  // changeRole(): Directly updates user's role to test role-based UI screens
  const changeRole = useCallback((newRole) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        role: newRole
      };
    });
  }, []);

  // hasRole(): Helper function to check if the current user possesses a specific role
  const hasRole = useCallback((roleName) => {
    return user?.role === roleName;
  }, [user]);

  // Specific role helper checks
  const isAdmin = useCallback(() => user?.role === 'Admin', [user]);
  const isFarmer = useCallback(() => user?.role === 'Farmer', [user]);
  const isVendor = useCallback(() => user?.role === 'Vendor', [user]);
  const isCustomer = useCallback(() => user?.role === 'Customer', [user]);

  // Memoized value definition to optimize rendering performance
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    changeRole,
    hasRole,
    isAdmin,
    isFarmer,
    isVendor,
    isCustomer
  }), [
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    changeRole,
    hasRole,
    isAdmin,
    isFarmer,
    isVendor,
    isCustomer
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Aliased export for compatibility with existing MockAuthProvider references
export const MockAuthProvider = AuthProvider;

// useAuth Hook: Provides access to AuthContext details
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default AuthContext;
