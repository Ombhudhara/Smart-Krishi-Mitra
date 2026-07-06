import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load real notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        if (response.data?.success) {
          const mapped = response.data.notifications.map((n) => ({
            id: n._id,
            message: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: n.isRead,
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
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
      console.error("Error marking all read:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => n.id === notification.id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error("Error marking read:", err);
    }
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
