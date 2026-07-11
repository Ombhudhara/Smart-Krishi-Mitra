import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CustomerDashboard.css';

// =============================================================================
// REALISTIC DUMMY DATA FOR THE CUSTOMER DASHBOARD DESK
// =============================================================================

const STATS_DATA = [
  { id: 'c-orders', icon: '📦', value: '4 Active', label: 'My Orders', desc: 'In-transit tracking deals', trend: '+1 vs last week', trendType: 'up', color: '#2E7D32', bg: '#E8F5E9' },
  { id: 'c-wishlist', icon: '❤️', value: '6 Items', label: 'My Wishlist', desc: 'Saved crop listings', trend: 'Saved for later buys', trendType: 'neutral', color: '#E91E63', bg: '#FCE4EC' },
  { id: 'c-spent', icon: '💰', value: '₹96,500', label: 'Total Purchases', desc: 'Direct sourcing spend', trend: '+18% vs last month', trendType: 'up', color: '#1565C0', bg: '#E3F2FD' },
  { id: 'c-vendors', icon: '🏪', value: '8 Partners', label: 'Saved Vendors', desc: 'Trusted agro suppliers', trend: 'Active connections', trendType: 'neutral', color: '#6A1B9A', bg: '#F3E5F5' }
];

const RECOMMENDED_CROPS = [
  { crop: 'Premium Sharbati Wheat', seller: 'Om Bhudhara (Farme\r)', price: '₹2,350/Q', rating: 4.9, bg: '🌾' },
  { crop: 'Basmati Rice (aged)', seller: 'AgroMart Gujarat (Vendor)', price: '₹4,900/Q', rating: 4.7, bg: '🍚' },
  { crop: 'Organic Bt Cotton', seller: 'Raj Patel (Farmer)', price: '₹7,200/Q', rating: 4.9, bg: '☁️' }
];

const FARMER_MARKET_PREVIEW = [
  { id: 'f-1', name: 'Premium Bt Cotton', seller: 'Om Bhudhara', price: '₹7,200/Q', location: 'Rajkot, GJ' },
  { id: 'f-2', name: 'Sharbati Wheat', seller: 'Raj Patel', price: '₹2,350/Q', location: 'Nashik, MH' }
];

const VENDOR_MARKET_PREVIEW = [
  { id: 'v-1', name: 'Bt Cotton', vendor: 'Krishna Agro Traders', price: '₹7,300/Q', location: 'Ahmedabad, GJ' },
  { id: 'v-2', name: 'Sharbati Wheat', vendor: 'Green Harvest Agro', price: '₹2,400/Q', location: 'Rajkot, GJ' }
];

const QUICK_ACTIONS = [
  { id: 'market', icon: '🌾', title: 'Crop Marketplace', desc: 'Browse direct-farmer and vendor crops.', path: '/marketplace' },
  { id: 'orders', icon: '📦', title: 'Track Orders', desc: 'View delivery coordinates & invoices.', path: '/marketplace' },
  { id: 'chat', icon: '💬', title: 'Open Chats', desc: 'Send text inquiries to farm growers.', path: '/messages' }
];

const NOTIFICATIONS = [
  { id: 1, text: 'Order status updated to "Shipped" for Basmati Rice purchase.', time: '2 hours ago' },
  { id: 2, text: 'New price drop alert on Groundnut listings in Junagadh.', time: '5 hours ago' }
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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

  return (
    <div className="cd-container">
      {/* Welcome Section */}
      <section className="cd-welcome-section">
        <div className="cd-welcome-left">
          <span className="cd-time-greeting">Customer Procurement Desk</span>
          <h1 className="cd-welcome-title">{user?.fullName || "Buyer"} 👋</h1>
          <div className="cd-header-metadata">
            <span className="cd-meta-badge">Role: {user?.role || "Customer"}</span>
            <span className="cd-meta-divider">|</span>
            <span className="cd-meta-time">{currentTime}</span>
            <span className="cd-meta-divider">|</span>
            <span className="cd-meta-date">{currentDate}</span>
          </div>
        </div>
        <div className="cd-welcome-right">
          <div className="cd-welcome-stats-summary">
            🛒 <strong>Direct Agricultural Sourcing</strong>
          </div>
        </div>
      </section>

      {/* Quick Statistics */}
      <section className="cd-stats-section">
        <div className="cd-section-header">
          <h2 className="cd-section-title">📊 Key Metrics</h2>
        </div>
        <div className="cd-stats-grid">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="cd-stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <div className="cd-stat-card-header">
                <span className="cd-stat-label">{stat.label}</span>
                <span className="cd-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </span>
              </div>
              <div className="cd-stat-value">{stat.value}</div>
              <div className="cd-stat-card-footer">
                <span className="cd-stat-desc">{stat.desc}</span>
                <span className={`cd-stat-trend trend-${stat.trendType}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="cd-quick-section">
        <div className="cd-section-header">
          <h2 className="cd-section-title">⚡ Quick Actions</h2>
        </div>
        <div className="cd-quick-grid">
          {QUICK_ACTIONS.map((action) => (
            <div key={action.id} className="cd-quick-card" onClick={() => navigate(action.path)}>
              <div className="cd-quick-icon-wrap">{action.icon}</div>
              <h3 className="cd-quick-title">{action.title}</h3>
              <p className="cd-quick-desc">{action.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Crops Section */}
      <section className="cd-widget-card">
        <h3 className="cd-widget-title">🌟 Recommended Crops For You</h3>
        <div className="cd-rec-grid">
          {RECOMMENDED_CROPS.map((item, idx) => (
            <div key={idx} className="cd-rec-item">
              <span className="cd-rec-icon">{item.bg}</span>
              <div className="cd-rec-meta">
                <strong>{item.crop}</strong>
                <span>Seller: {item.seller}</span>
              </div>
              <div className="cd-rec-stats">
                <strong>{item.price}</strong>
                <span>⭐ {item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Farmer vs Vendor Previews */}
      <section className="cd-dual-row">
        {/* Farmer Marketplace Preview */}
        <div className="cd-widget-card">
          <div className="cd-widget-header-row">
            <h3 className="cd-widget-title">👨‍🌾 Farmer Mandi Listings</h3>
            <button className="cd-text-link-btn" onClick={() => navigate('/marketplace')}>
              Browse All
            </button>
          </div>
          <div className="cd-previews-list">
            {FARMER_MARKET_PREVIEW.map((item) => (
              <div key={item.id} className="cd-preview-item">
                <div className="cd-preview-info">
                  <strong>{item.name}</strong>
                  <span>Grower: {item.seller}</span>
                </div>
                <div className="cd-preview-price">
                  <strong>{item.price}</strong>
                  <span>📍 {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Marketplace Preview */}
        <div className="cd-widget-card">
          <div className="cd-widget-header-row">
            <h3 className="cd-widget-title">🏪 Vendor Wholesale Shops</h3>
            <button className="cd-text-link-btn" onClick={() => navigate('/marketplace')}>
              Browse All
            </button>
          </div>
          <div className="cd-previews-list">
            {VENDOR_MARKET_PREVIEW.map((item) => (
              <div key={item.id} className="cd-preview-item">
                <div className="cd-preview-info">
                  <strong>{item.name}</strong>
                  <span>Supplier: {item.vendor}</span>
                </div>
                <div className="cd-preview-price">
                  <strong>{item.price}</strong>
                  <span>📍 {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & AI Assistant */}
      <section className="cd-dual-row">
        {/* Weather Widget */}
        <div className="cd-widget-card">
          <h3 className="cd-widget-title">🌦️ Regional Weather Outlook</h3>
          <div className="cd-weather-outlook">
            <span className="weather-icon">🌤️</span>
            <div>
              <div className="temp">31°C</div>
              <div className="desc">Mostly Sunny · Wind: 14 km/h</div>
            </div>
          </div>
          <button className="cd-widget-action-btn" onClick={() => navigate('/weather')}>
            Check Forecast
          </button>
        </div>

        {/* AI Assistant */}
        <div className="cd-widget-card">
          <h3 className="cd-widget-title">🤖 Agri AI Assistant</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
            Ask our smart assistant for recommendation updates, pricing comparisons, crop freshness indices, and cargo details.
          </p>
          <button className="cd-widget-action-btn" onClick={() => navigate('/crop-knowledge')}>
            Consult AI
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="cd-widget-card">
        <h3 className="cd-widget-title">🔔 Notifications</h3>
        <div className="cd-notif-list">
          {NOTIFICATIONS.map((notif) => (
            <div key={notif.id} className="cd-notif-item">
              <span className="bullet">🔵</span>
              <div className="info">
                <p>{notif.text}</p>
                <span className="time">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="cd-transactions-section">
        <div className="cd-widget-header-row">
          <h2 className="cd-section-title">📜 Recent Transactions</h2>
          <button className="cd-text-link-btn" onClick={() => navigate('/transactions')}>
            View All Order Ledger &rarr;
          </button>
        </div>
        <div className="cd-table-card">
          <table className="cd-transactions-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Crop Product</th>
                <th>Supplier</th>
                <th>Supplier Type</th>
                <th>Total Paid</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TXN-O-10029', crop: 'Premium Bt Cotton', seller: 'Om Bhudhara', type: 'Farmer', amount: '₹72,000', status: 'Paid', date: '2026-06-28' },
                { id: 'TXN-O-10030', crop: 'Basmati Rice', seller: 'AgroMart Gujarat', type: 'Vendor', amount: '₹24,500', status: 'Paid', date: '2026-06-25' }
              ].map((txn) => (
                <tr key={txn.id}>
                  <td className="mono">{txn.id}</td>
                  <td className="cd-table-cell-bold">{txn.crop}</td>
                  <td>{txn.seller}</td>
                  <td>
                    <span className={`seller-type-badge type-${txn.type.toLowerCase()}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="cd-table-cell-amount">{txn.amount}</td>
                  <td>
                    <span className={`cd-table-status-badge status-${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="cd-table-cell-date">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
