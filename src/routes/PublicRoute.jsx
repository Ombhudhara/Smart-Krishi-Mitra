import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// =============================================================================
// PUBLIC ROUTE — Smart Krishi Mitra
// =============================================================================
// Prevents logged-in users from accessing public pages (Landing, Login, Signup).
// If authenticated → redirect to /dashboard.
// If not authenticated → render public page.
//
// DUMMY AUTH (current):  const isAuthenticated = true;
// FUTURE (JWT + MERN):   Replace with token check from AuthContext
//   → const { isAuthenticated } = useAuth();
//
// Works with Node.js + Express.js + MongoDB + JWT when backend is ready.
// =============================================================================

const PublicRoute = ({ children }) => {
  // ── Dummy authentication (replace with JWT later) ──────────────
  const isAuthenticated = true;

  // Already logged in → redirect away from public pages
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not logged in → render public page
  return children ? children : <Outlet />;
};

export default PublicRoute;
