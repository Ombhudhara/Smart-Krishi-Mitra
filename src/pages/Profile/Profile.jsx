import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Reusable Layout Components
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

// Role-based Profile Views
import FarmerProfile from '../../components/Profile/FarmerProfile';
import VendorProfile from '../../components/Profile/VendorProfile';
import CustomerProfile from '../../components/Profile/CustomerProfile';

import './Profile.css';

// ─────────────────────────────────────────────────────────────────────────────
// Dummy notifications
// TODO: Replace with real API call: GET /api/notifications (JWT protected)
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_NOTIFICATIONS = [
  { id: 1, message: 'Your profile details were updated successfully.', time: 'Just now', read: false },
  { id: 2, message: 'New security login detected on your account.', time: '1 day ago', read: true },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  // Role detection
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
  const renderProfileContent = () => {
    switch (role) {
      case 'Farmer':   return <FarmerProfile />;
      case 'Vendor':   return <VendorProfile />;
      case 'Customer': return <CustomerProfile />;
      default:         return <FarmerProfile />;
    }
  };

  return (
    <div className="pr-root">
      {/* ── REUSABLE NAVBAR ── */}
      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        onSearch={(query) => console.log('Profile search:', query)}
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
      <div className="pr-layout">
        {/* ── REUSABLE SIDEBAR ── */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          activeItem="profile"
          onNavigate={(item) => navigate(item.path)}
          onLogout={() => navigate('/login')}
        />

        {/* ── MAIN CONTENT ── */}
        <main className="pr-main">
          {renderProfileContent()}

          {/* ── REUSABLE FOOTER ── */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
