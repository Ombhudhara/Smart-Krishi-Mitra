import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

// =============================================================================
// PRIVATE ROUTE — Smart Krishi Mitra
// =============================================================================
// Protects authenticated routes. Redirects to /login if not logged in.
// Supports role-based authorization restrictions.
// =============================================================================

const PrivateRoute = ({ children, allowedRoles, requiredRole }) => {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();

  // 1. If authentication status is still loading, render Loader component
  if (loading) {
    return <Loader variant="page" text="Verifying session..." />;
  }

  // 2. Not authenticated → redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role authorization check
  const userRole = user?.role;

  // Handle single requiredRole (string)
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle multiple allowedRoles (array of strings)
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Authorized → render children or nested routes via Outlet
  return children ? children : <Outlet />;
};

export default PrivateRoute;
