import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Reusable Layout Components
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

// Role-based Dashboard Views
import FarmerDashboard from '../../components/Dashboard/FarmerDashboard';
import VendorDashboard from '../../components/Dashboard/VendorDashboard';
import CustomerDashboard from '../../components/Dashboard/CustomerDashboard';

import './Dashboard.css';

// ─────────────────────────────────────────────────────────────────────────────
// Dummy notifications
// TODO: Replace with real API call: GET /api/notifications (JWT protected)
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_NOTIFICATIONS = [
  { id: 1, message: 'Heavy rainfall expected tomorrow in your sub-district.', time: '10 mins ago', read: false },
  { id: 2, message: 'Raj Patel sent a new message regarding Cotton pricing.', time: '25 mins ago', read: false },
  { id: 3, message: 'Payment of ₹14,200 received for Onion sale.', time: '2 hours ago', read: true },
  { id: 4, message: 'AI: Delay pesticide spraying until wind speed drops.', time: '3 hours ago', read: true },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  // Role detection
  // TODO: Decode from JWT token when backend is integrated
  const role = user?.role || 'Farmer';

  // ── Notification Handlers ──────────────────────────────────────────────────
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => n.id === notification.id ? { ...n, read: true } : n)
    );
  };

  // ── Role-based View ────────────────────────────────────────────────────────
  const renderDashboardView = () => {
    switch (role) {
      case 'Farmer':   return <FarmerDashboard />;
      case 'Vendor':   return <VendorDashboard />;
      case 'Customer': return <CustomerDashboard />;
      default:         return <FarmerDashboard />;
    }
  };

  return (
    <div className="db-root">
      {/* ── REUSABLE NAVBAR ── */}
      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        onSearch={(query) => console.log('Search:', query)}
        onProfile={() => navigate('/profile')}
        notificationSlot={
          <NotificationBell
            notifications={notifications}
            onMarkAllRead={handleMarkAllRead}
            onNotificationClick={handleNotificationClick}
          />
        }
      />

      {/* ── LAYOUT BODY ── */}
      <div className="db-layout">
        {/* ── REUSABLE SIDEBAR ── */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          activeItem="dashboard"
          onNavigate={(item) => navigate(item.path)}
          onLogout={() => navigate('/login')}
        />

        {/* ── MAIN CONTENT ── */}
        <main className="db-main">
          <div className="db-content-area">
            {renderDashboardView()}
          </div>

          {/* ── REUSABLE FOOTER ── */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
