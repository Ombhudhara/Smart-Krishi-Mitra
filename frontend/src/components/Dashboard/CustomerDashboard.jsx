import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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
    <div className="skm-container">
      {/* Welcome Section */}
      <section className="skm-welcome-card" style={{ flexDirection: window.innerWidth < 768 ? 'column' : 'row', alignItems: window.innerWidth < 768 ? 'stretch' : 'center', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Customer Procurement Desk</span>
          <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>{user?.fullName || "Buyer"} 👋</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 500 }} className="skm-text-muted">
            <span className="skm-badge" style={{ background: '#FCE4EC', color: '#C2185B', fontSize: '12px' }}>Role: {user?.role || "Customer"}</span>
            <span>|</span>
            <span>{currentTime}</span>
            <span>|</span>
            <span>{currentDate}</span>
          </div>
        </div>
        <div>
          <div style={{ background: 'var(--skm-bg)', border: '1.5px solid var(--skm-border)', padding: '10px 18px', borderRadius: '16px', fontSize: '13px' }}>
            🛒 <strong>Direct Agricultural Sourcing</strong>
          </div>
        </div>
      </section>

      {/* Quick Statistics */}
      <section className="skm-section">
        <div className="skm-section-header">
          <h2 className="skm-section-title">📊 Key Metrics</h2>
        </div>
        <div className="skm-grid">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="skm-stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <div className="skm-stat-header">
                <span className="skm-stat-label">{stat.label}</span>
                <span className="skm-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </span>
              </div>
              <div className="skm-stat-value">{stat.value}</div>
              <div className="skm-stat-footer">
                <span className="skm-stat-desc">{stat.desc}</span>
                <span className={`skm-stat-trend ${stat.trendType}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="skm-section">
        <div className="skm-section-header">
          <h2 className="skm-section-title">⚡ Quick Actions</h2>
        </div>
        <div className="skm-grid">
          {QUICK_ACTIONS.map((action) => (
            <div key={action.id} className="skm-action-card" onClick={() => navigate(action.path)}>
              <div className="skm-action-icon">{action.icon}</div>
              <h3 className="skm-action-title">{action.title}</h3>
              <p className="skm-action-desc">{action.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Crops Section */}
      <section className="skm-card">
        <h3 className="skm-card-title">🌟 Recommended Crops For You</h3>
        <div className="skm-preview-list">
          {RECOMMENDED_CROPS.map((item, idx) => (
            <div key={idx} className="skm-preview-item">
              <span style={{ fontSize: '24px' }}>{item.bg}</span>
              <div style={{ flex: 1, marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '13px' }}>{item.crop}</strong>
                <span className="skm-text-muted" style={{ fontSize: '11px' }}>Seller: {item.seller}</span>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--skm-primary)' }}>{item.price}</strong>
                <span className="skm-text-muted" style={{ fontSize: '11px' }}>⭐ {item.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Farmer vs Vendor Previews */}
      <section className="skm-dual-row">
        {/* Farmer Marketplace Preview */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">👨‍🌾 Farmer Mandi Listings</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/marketplace')}>
              Browse All
            </button>
          </div>
          <div className="skm-preview-list">
            {FARMER_MARKET_PREVIEW.map((item) => (
              <div key={item.id} className="skm-preview-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '13px' }}>{item.name}</strong>
                  <span className="skm-text-muted" style={{ fontSize: '11px' }}>Grower: {item.seller}</span>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--skm-primary)' }}>{item.price}</strong>
                  <span className="skm-text-muted" style={{ fontSize: '10px' }}>📍 {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vendor Marketplace Preview */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">🏪 Vendor Wholesale Shops</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/marketplace')}>
              Browse All
            </button>
          </div>
          <div className="skm-preview-list">
            {VENDOR_MARKET_PREVIEW.map((item) => (
              <div key={item.id} className="skm-preview-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '13px' }}>{item.name}</strong>
                  <span className="skm-text-muted" style={{ fontSize: '11px' }}>Supplier: {item.vendor}</span>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--skm-primary)' }}>{item.price}</strong>
                  <span className="skm-text-muted" style={{ fontSize: '10px' }}>📍 {item.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & AI Assistant */}
      <section className="skm-dual-row">
        {/* Weather Widget */}
        <div className="skm-card">
          <h3 className="skm-card-title">🌦️ Regional Weather Outlook</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--skm-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--skm-border)' }}>
            <span style={{ fontSize: '28px' }}>🌤️</span>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>31°C</div>
              <div className="skm-text-muted" style={{ fontSize: '11px' }}>Mostly Sunny · Wind: 14 km/h</div>
            </div>
          </div>
          <button className="skm-action-btn" onClick={() => navigate('/weather')}>
            Check Forecast
          </button>
        </div>

        {/* AI Assistant */}
        <div className="skm-card">
          <h3 className="skm-card-title">🤖 Agri AI Assistant</h3>
          <p style={{ margin: 0, fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
            Ask our smart assistant for recommendation updates, pricing comparisons, crop freshness indices, and cargo details.
          </p>
          <button className="skm-action-btn" onClick={() => navigate('/crop-knowledge')}>
            Consult AI
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="skm-card">
        <h3 className="skm-card-title">🔔 Notifications</h3>
        <div className="skm-preview-list">
          {NOTIFICATIONS.map((notif) => (
            <div key={notif.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12px', background: 'var(--skm-bg)', border: '1px solid var(--skm-border)', padding: '12px 16px', borderRadius: '12px' }}>
              <span style={{ fontSize: '8px', marginTop: '4px' }}>🔵</span>
              <div>
                <p style={{ margin: '0 0 2px 0', color: 'var(--skm-text-main)', fontWeight: 500 }}>{notif.text}</p>
                <span className="skm-text-muted">{notif.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="skm-section" style={{ marginTop: '10px' }}>
        <div className="skm-section-header">
          <h2 className="skm-section-title">📜 Recent Transactions</h2>
          <button className="skm-text-link-btn" onClick={() => navigate('/transactions')}>
            View All Order Ledger &rarr;
          </button>
        </div>
        <div className="skm-table-card">
          <table className="skm-table">
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
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }} className="skm-text-muted">{txn.id}</td>
                  <td style={{ fontWeight: 700 }}>{txn.crop}</td>
                  <td>{txn.seller}</td>
                  <td>
                    <span className="skm-badge" style={txn.type === 'Farmer' ? {} : { background: '#E3F2FD', color: '#1565C0' }}>
                      {txn.type}
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--skm-primary)' }}>{txn.amount}</td>
                  <td>
                    <span className="skm-status-badge success">
                      {txn.status}
                    </span>
                  </td>
                  <td className="skm-text-muted">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
