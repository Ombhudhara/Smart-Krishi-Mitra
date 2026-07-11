import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authService from '../services/authService';

// =============================================================================
// AUTH CONTEXT — Smart Krishi Mitra
// =============================================================================
// Centrally manages user authentication state, roles, and helper functions.
// Interacts with Node.js backend using JWT authentication.
// =============================================================================

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(!!localStorage.getItem("token"));

  // Auto-login: on page refresh, if token exists, load user profile from backend
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        const response = await authService.getCurrentUser();
        if (response?.data?.success && response?.data?.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid profile response");
        }
      } catch (error) {
        console.error("Auto-login failed:", error.message || error);
        // Clear token since it's expired or invalid
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // login(): Authenticate user details with the backend APIs
  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      const { token: receivedToken, user: userData } = response.data;

      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(userData);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error("Login API call failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // register(): Create user account on backend and automatically log in
  const register = useCallback(async (signupData) => {
    setLoading(true);
    try {
      const response = await authService.register(signupData);
      const { token: receivedToken, user: userData } = response.data;

      localStorage.setItem("token", receivedToken);
      setToken(receivedToken);
      setUser(userData);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error("Registration API call failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // logout(): Resets user session state locally and calls logout endpoint
  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout API request failed:", error.message || error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  // updateProfile(): Updates specific user profile details locally
  const updateProfile = useCallback((updatedFields) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        ...updatedFields,
      };
    });
  }, []);

  // changeRole(): Directly updates user's role to test role-based UI screens
  const changeRole = useCallback((newRole) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        role: newRole,
      };
    });
  }, []);

  // hasRole(): Helper function to check if the current user possesses a specific role
  const hasRole = useCallback((roleName) => {
    return user?.role === roleName;
  }, [user]);

  // Derived role value
  const role = useMemo(() => user?.role || null, [user]);

  // Specific role helper checks
  const isAdmin = useCallback(() => user?.role === 'Admin', [user]);
  const isFarmer = useCallback(() => user?.role === 'Farmer', [user]);
  const isVendor = useCallback(() => user?.role === 'Vendor', [user]);
  const isCustomer = useCallback(() => user?.role === 'Customer', [user]);

  // Memoized value definition to optimize rendering performance
  const contextValue = useMemo(() => ({
    user,
    token,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateProfile,
    changeRole,
    hasRole,
    isAdmin,
    isFarmer,
    isVendor,
    isCustomer
  }), [
    user,
    token,
    role,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
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
