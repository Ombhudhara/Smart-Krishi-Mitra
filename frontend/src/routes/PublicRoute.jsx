import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

// =============================================================================
// PUBLIC ROUTE — Smart Krishi Mitra
// =============================================================================
// Prevents logged-in users from accessing public pages (Landing, Login, Signup).
// If authenticated → redirect to /dashboard.
// If not authenticated → render public page.
// =============================================================================

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // If session status is still loading, display Loader
  if (loading) {
    return <Loader variant="page" text="Verifying session..." />;
  }

  // Already logged in → redirect away from public pages
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → render public page
  return children ? children : <Outlet />;
};

export default PublicRoute;
