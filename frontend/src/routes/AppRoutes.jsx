import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// =============================================================================
// ROUTE GUARDS
// =============================================================================
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

// =============================================================================
// PUBLIC PAGES — No authentication required
// =============================================================================
import Landing from '../pages/Landing/Landing';
import LoginSignup from '../pages/LoginSignup/LoginSignup';

// =============================================================================
// PRIVATE PAGES — Authenticated users only
// =============================================================================
import Dashboard from '../pages/Dashboard/Dashboard';
import Marketplace from '../pages/Marketplace/Marketplace';
import CropKnowledge from '../pages/CropKnowledge/CropKnowledge';
import Weather from '../pages/Weather/Weather';
import Messages from '../pages/Messages/Messages';
import Notifications from '../pages/Notifications/Notifications';
import TransactionHistory from '../pages/TransactionHistory/TransactionHistory';
import Profile from '../pages/Profile/Profile';
import CostCalculator from '../pages/CostCalculator/CostCalculator';
import NewsSchemes from '../pages/News_Schemes/News_Schemes';

// =============================================================================
// ADMIN PAGES — Admin role required
// =============================================================================
// import AdminDashboard from '../pages/AdminDashboard/AdminDashboard';
// Future admin modules will be imported here.

// =============================================================================
// 404 PAGE — Catch-all for unknown routes
// =============================================================================
const NotFound = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    fontFamily: "'Poppins', sans-serif",
    background: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 50%, #C8E6C9 100%)',
    color: '#1A2B1A',
    textAlign: 'center',
    padding: '24px',
  }}>
    <div style={{
      fontSize: '96px',
      lineHeight: 1,
      marginBottom: '8px',
    }}>
      🌾
    </div>
    <h1 style={{
      fontSize: '72px',
      fontWeight: 800,
      margin: '0 0 8px',
      background: 'linear-gradient(135deg, #2E7D32, #43A047)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    }}>
      404
    </h1>
    <h2 style={{
      fontSize: '24px',
      fontWeight: 600,
      margin: '0 0 12px',
      color: '#2E7D32',
    }}>
      Page Not Found
    </h2>
    <p style={{
      fontSize: '16px',
      color: '#6B8C6B',
      maxWidth: '440px',
      margin: '0 0 28px',
      lineHeight: 1.6,
    }}>
      The page you're looking for doesn't exist or has been moved.
      Let's get you back to the farm!
    </p>
    <a
      href="/dashboard"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 28px',
        background: 'linear-gradient(135deg, #2E7D32, #43A047)',
        color: '#fff',
        fontSize: '15px',
        fontWeight: 600,
        borderRadius: '12px',
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      🏠 Back to Dashboard
    </a>
  </div>
);

// =============================================================================
// APP ROUTES — Central Routing Configuration
// =============================================================================
//
// This is the SINGLE source of truth for all application routes.
// Do NOT define routes anywhere else in the application.
//
// Route Structure:
//   ┌─ Public Routes    → Landing, Login, Signup (redirect if authenticated)
//   ├─ Private Routes   → All dashboard/authenticated pages
//   ├─ Admin Routes     → Admin-only pages (role: 'Admin')
//   └─ Catch-All (404)  → Unknown routes
//
// FUTURE (MERN / JWT):
//   • Replace MockAuthProvider with real JWT AuthProvider
//   • PrivateRoute will check token validity + expiry
//   • Add role-based route guards (Admin, Farmer, Vendor, Customer)
//   • Connect to Node.js + Express.js + MongoDB backend
//
// =============================================================================

const AppRoutes = () => {
  return (
    <Routes>

      {/* ═══════════════════════════════════════════════════════════════════
          PUBLIC ROUTES — Accessible without authentication
          If user is already logged in, PublicRoute redirects to /dashboard
          ═══════════════════════════════════════════════════════════════════ */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginSignup initialIsLogin={true} />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <LoginSignup initialIsLogin={false} />
          </PublicRoute>
        }
      />

      {/* Future: Forgot Password
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      */}

      {/* ═══════════════════════════════════════════════════════════════════
          PRIVATE ROUTES — Authenticated users only
          PrivateRoute redirects to /login if not authenticated
          ═══════════════════════════════════════════════════════════════════ */}

      {/* ── Dashboard ─────────────────────────────────────────────────── */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* ── Marketplace ───────────────────────────────────────────────── */}
      <Route
        path="/marketplace"
        element={
          <PrivateRoute>
            <Marketplace />
          </PrivateRoute>
        }
      />

      {/* Alias: /market → /marketplace */}
      <Route path="/market" element={<Navigate to="/marketplace" replace />} />

      {/* ── Crop Knowledge ────────────────────────────────────────────── */}
      <Route
        path="/crop-knowledge"
        element={
          <PrivateRoute>
            <CropKnowledge />
          </PrivateRoute>
        }
      />

      {/* ── Weather ───────────────────────────────────────────────────── */}
      <Route
        path="/weather"
        element={
          <PrivateRoute>
            <Weather />
          </PrivateRoute>
        }
      />

      {/* ── Messages ──────────────────────────────────────────────────── */}
      <Route
        path="/messages"
        element={
          <PrivateRoute>
            <Messages />
          </PrivateRoute>
        }
      />

      {/* ── Notifications ─────────────────────────────────────────────── */}
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        }
      />

      {/* ── Transaction History ────────────────────────────────────────── */}
      <Route
        path="/transactions"
        element={
          <PrivateRoute>
            <TransactionHistory />
          </PrivateRoute>
        }
      />

      {/* ── Profile ───────────────────────────────────────────────────── */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* ── Cost Calculator ───────────────────────────────────────────── */}
      <Route
        path="/calculator"
        element={
          <PrivateRoute>
            <CostCalculator />
          </PrivateRoute>
        }
      />

      {/* ── News & Schemes ────────────────────────────────────────────── */}
      <Route
        path="/news-schemes"
        element={
          <PrivateRoute>
            <NewsSchemes />
          </PrivateRoute>
        }
      />

      {/* ═══════════════════════════════════════════════════════════════════
          ADMIN ROUTES — Admin role required
          PrivateRoute + requiredRole="Admin" for double protection
          ═══════════════════════════════════════════════════════════════════ */}

      {/* Future: Admin Dashboard
      <Route
        path="/admin"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      */}

      {/* Future: Admin User Management
      <Route
        path="/admin/users"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminUsers />
          </PrivateRoute>
        }
      />
      */}

      {/* Future: Admin Reports
      <Route
        path="/admin/reports"
        element={
          <PrivateRoute requiredRole="Admin">
            <AdminReports />
          </PrivateRoute>
        }
      />
      */}

      {/* ═══════════════════════════════════════════════════════════════════
          CATCH-ALL — 404 Page Not Found
          ═══════════════════════════════════════════════════════════════════ */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;
