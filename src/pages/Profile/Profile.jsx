import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';

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

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        if (response.data?.success) {
          setNotifications(response.data.notifications);
        }
      } catch (err) {
        console.error("Error loading notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // Role detection
  const role = user?.role || 'Farmer';

  // ── Notification Handlers ──────────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking notifications read:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification._id);
      setNotifications((prev) =>
        prev.map((n) => n._id === notification._id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Error clicking notification:", err);
    }
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
