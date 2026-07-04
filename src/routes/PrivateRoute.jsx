import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// =============================================================================
// PRIVATE ROUTE — Smart Krishi Mitra
// =============================================================================
// Protects authenticated routes. Redirects to /login if not logged in.
//
// DUMMY AUTH (current):  const isAuthenticated = true;
// FUTURE (JWT + MERN):   Replace with token check from AuthContext
//   → const { isAuthenticated, user } = useAuth();
//
// ROLE READY (not active yet):
//   Supports future roles: Farmer | Vendor | Customer | Admin
//   Pass `allowedRoles` prop when role-based access is needed.
// =============================================================================

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  // ── Dummy authentication (replace with JWT later) ──────────────
  const isAuthenticated = true;

  // ── Future: Role from JWT / AuthContext ─────────────────────────
  // const user = { role: 'Farmer' };  // Farmer | Vendor | Customer | Admin
  // const hasRole = !allowedRoles || allowedRoles.includes(user.role);

  // 1. Not authenticated → redirect to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Future: Unauthorized role → redirect to /dashboard
  // if (!hasRole) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  // 3. Authorized → render children or nested routes via Outlet
  return children ? children : <Outlet />;
};

export default PrivateRoute;
