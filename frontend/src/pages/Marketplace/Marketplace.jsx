import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Reusable Layout Components
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

// Role-based Marketplace Views
import FarmerView from '../../components/Marketplace/FarmerView';
import VendorView from '../../components/Marketplace/VendorView';
import CustomerView from '../../components/Marketplace/CustomerView';

import './Marketplace.css';

// ─────────────────────────────────────────────────────────────────────────────
// Dummy notifications
// TODO: Replace with real API call: GET /api/notifications (JWT protected)
// ─────────────────────────────────────────────────────────────────────────────
const DUMMY_NOTIFICATIONS = [
  { id: 1, message: 'New purchase request for your Cotton listing.', time: '5 mins ago', read: false },
  { id: 2, message: 'Price alert: Wheat rates up by 8% today.', time: '1 hour ago', read: false },
  { id: 3, message: 'Order #TXN-84920 has been marked as delivered.', time: '3 hours ago', read: true },
];

const Marketplace = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Role detection
  // TODO: Decode from JWT token when backend is integrated
  const role = user?.role || 'Customer';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
  const renderActiveView = () => {
    switch (role) {
      case 'Farmer':   return <FarmerView />;
      case 'Vendor':   return <VendorView />;
      case 'Customer':
      default:         return <CustomerView />;
    }
  };

  return (
    <div className="skm-root">
      {/* ── REUSABLE NAVBAR ── */}
      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
        onSearch={(query) => console.log('Marketplace search:', query)}
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
      <div className="skm-layout">
        {/* ── REUSABLE SIDEBAR ── */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          activeItem="marketplace"
          onNavigate={(item) => navigate(item.path)}
          onLogout={() => navigate('/login')}
        />

        {/* ── MAIN CONTENT ── */}
        <main className="skm-main">
          <div className="skm-content-area" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Welcome Header */}
            <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Trading Desk &amp; Center</span>
                <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>Marketplace Center</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 500 }} className="skm-text-muted">
                  <span className="skm-badge" style={{ fontSize: '12px' }}>Role: {role}</span>
                  <span>|</span>
                  <span>{currentTime}</span>
                  <span>|</span>
                  <span>{currentDate}</span>
                </div>
              </div>
            </section>

            {/* ── ACTIVE VIEW RENDERING ── */}
            <div>
              {renderActiveView()}
            </div>
          </div>

          {/* ── REUSABLE FOOTER ── */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Marketplace;
