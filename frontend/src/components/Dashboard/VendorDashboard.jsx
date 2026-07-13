import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// =============================================================================
// REALISTIC DUMMY DATA FOR THE VENDOR DASHBOARD DESK
// =============================================================================

const STATS_DATA = [
  { id: 'v-purchases', icon: '🛒', value: '₹7,80,000', label: 'Procurements', desc: 'Raw buys from farmers', trend: '+14% this month', trendType: 'up', color: '#2E7D32', bg: '#E8F5E9' },
  { id: 'v-sales', icon: '🛍️', value: '₹4,99,250', label: 'Fulfillment Sales', desc: 'Sales to retail customers', trend: '+8.2% vs last cycle', trendType: 'up', color: '#1565C0', bg: '#E3F2FD' },
  { id: 'v-inventory', icon: '📦', value: '1,500 Q', label: 'Stock Reserves', desc: 'In commercial warehouses', trend: 'Adequate capacity', trendType: 'neutral', color: '#E65100', bg: '#FFF3E0' },
  { id: 'v-requests', icon: '⏳', value: '12', label: 'Farmer Requests', desc: 'Awaiting procurement approval', trend: '4 urgent bids', trendType: 'danger', color: '#6A1B9A', bg: '#F3E5F5' }
];

const INVENTORY_SUMMARY = [
  { crop: 'Bt Cotton', stock: '600 Q', value: '₹43,80,000', price: '₹7,300/Q' },
  { crop: 'Sharbati Wheat', stock: '500 Q', value: '₹12,0,000', price: '₹2,400/Q' },
  { crop: 'Basmati Rice', stock: '400 Q', value: '₹19,60,000', price: '₹4,900/Q' }
];

const FARMER_PURCHASE_REQUESTS = [
  { id: 'req-1', crop: 'Cotton Bales', farmer: 'Om Bhudhara', qty: '120 Q', proposedPrice: '₹6,500/Q', total: '₹7,80,000', status: 'Pending' },
  { id: 'req-2', crop: 'Sharbati Wheat', farmer: 'Raj Patel', qty: '80 Q', proposedPrice: '₹2,350/Q', total: '₹1,88,000', status: 'Approved' }
];

const CUSTOMER_ORDERS = [
  { id: 'ord-1', crop: 'Bt Cotton', customer: 'Rahul Shah', qty: '50 Q', price: '₹7,100/Q', total: '₹3,55,000', status: 'Shipped' },
  { id: 'ord-2', crop: 'Wheat Flour Grade', customer: 'Neha Patel', qty: '25 Q', price: '₹2,650/Q', total: '₹66,250', status: 'Processing' }
];

const QUICK_ACTIONS = [
  { id: 'buy', icon: '🤝', title: 'Buy Crops', desc: 'Procure raw stock from local farmers.', path: '/marketplace' },
  { id: 'inventory', icon: '🏬', title: 'Manage Inventory', desc: 'Refine selling rates & stock levels.', path: '/marketplace' },
  { id: 'marketplace', icon: '📊', title: 'Marketplace View', desc: 'Open general agricultural mandi board.', path: '/marketplace' },
  { id: 'messages', icon: '💬', title: 'Negotiation Room', desc: 'Discuss logistics with farmers.', path: '/messages' }
];

const NOTIFICATIONS = [
  { id: 1, text: 'Payment settlement completed for invoice INV-2026-P01 (₹7,80,000).', time: '1 hour ago' },
  { id: 2, text: 'New crop listing matching your cotton requirement listed in Rajkot.', time: '3 hours ago' }
];

const SCHEMES = [
  { name: 'Kisan Sampada Yojana', benefits: 'Subsidies up to 35% for establishing cold chain warehouses and processing units.', deadline: 'Rolling' },
  { name: 'Agriculture Infrastructure Fund (AIF)', benefits: 'Interest subvention of 3% per annum for post-harvest management infrastructure loans.', deadline: 'Dec 31, 2026' }
];

export default function VendorDashboard() {
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
          <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Commercial Partner Desk</span>
          <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>{user?.fullName || "Vendor"} 👋</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 500 }} className="skm-text-muted">
            <span className="skm-badge" style={{ background: '#E3F2FD', color: '#1565C0', fontSize: '12px' }}>Role: {user?.role || "Vendor"}</span>
            <span>|</span>
            <span>{currentTime}</span>
            <span>|</span>
            <span>{currentDate}</span>
          </div>
        </div>
        <div>
          <div style={{ background: 'var(--skm-bg)', border: '1.5px solid var(--skm-border)', padding: '10px 18px', borderRadius: '16px', fontSize: '13px' }}>
            🏪 <strong>Krishna Agro Traders</strong>
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

      {/* Inventory & Sales Analytics */}
      <section className="skm-dual-row">
        {/* Inventory Overview */}
        <div className="skm-card">
          <h3 className="skm-card-title">📦 Inventory Stock Reserves</h3>
          <div className="skm-preview-list">
            {INVENTORY_SUMMARY.map((item, idx) => (
              <div key={idx} className="skm-preview-item">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '13px' }}>{item.crop}</strong>
                  <span className="skm-text-muted" style={{ fontSize: '11px' }}>Selling price: {item.price}</span>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <strong style={{ fontSize: '14px', color: 'var(--skm-primary)' }}>{item.stock}</strong>
                  <span className="skm-text-muted" style={{ fontSize: '11px' }}>Valued: {item.value}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="skm-action-btn" onClick={() => navigate('/marketplace')}>
            Update Stock Rates
          </button>
        </div>

        {/* Sales Analytics Chart Mock */}
        <div className="skm-card">
          <h3 className="skm-card-title">📈 Sales Revenue Growth</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '120px', padding: '10px 0', borderBottom: '1.5px solid var(--skm-border)' }}>
              <div style={{ width: '40px', background: '#90CAF9', height: '40%', borderRadius: '4px 4px 0 0', position: 'relative' }}><span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--skm-text-muted)' }}>Apr</span></div>
              <div style={{ width: '40px', background: '#42A5F5', height: '65%', borderRadius: '4px 4px 0 0', position: 'relative' }}><span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--skm-text-muted)' }}>May</span></div>
              <div style={{ width: '40px', background: '#1565C0', height: '90%', borderRadius: '4px 4px 0 0', position: 'relative' }}><span style={{ position: 'absolute', bottom: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', color: 'var(--skm-text-muted)' }}>Jun</span></div>
            </div>
            <div style={{ background: 'var(--skm-bg)', padding: '12px', borderRadius: '12px' }}>
              <strong style={{ color: '#1565C0', fontSize: '14px' }}>₹4.99 Lakhs Sales</strong>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: 'var(--skm-text-muted)' }}>Highest demand observed on Cotton procurement fulfillment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Procurement Requests vs Customer Orders */}
      <section className="skm-dual-row">
        {/* Farmer purchase requests */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">⏳ Farmer Purchase Requests</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/marketplace')}>
              View Bids
            </button>
          </div>
          <div className="skm-preview-list">
            {FARMER_PURCHASE_REQUESTS.map((req) => {
               let statusClass = "warning";
               if (req.status === 'Approved') statusClass = "success";
               return (
                <div key={req.id} className="skm-preview-item" style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px' }}>{req.crop}</strong>
                    <span className={`skm-status-badge ${statusClass}`}>{req.status}</span>
                  </div>
                  <div className="skm-text-muted" style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Farmer: {req.farmer}</div>
                    <div>Qty requested: {req.qty} · Rate: {req.proposedPrice}</div>
                    <div style={{ color: 'var(--skm-primary)', fontWeight: 700 }}>Total: {req.total}</div>
                  </div>
                </div>
               );
            })}
          </div>
        </div>

        {/* Customer Orders */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">🛍️ Customer Orders</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/marketplace')}>
              View Sales
            </button>
          </div>
          <div className="skm-preview-list">
            {CUSTOMER_ORDERS.map((ord) => {
               let statusClass = "warning";
               if (ord.status === 'Shipped') statusClass = "success";
               return (
                <div key={ord.id} className="skm-preview-item" style={{ flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '13px' }}>{ord.crop}</strong>
                    <span className={`skm-status-badge ${statusClass}`}>{ord.status}</span>
                  </div>
                  <div className="skm-text-muted" style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Customer: {ord.customer}</div>
                    <div>Qty sold: {ord.qty} · Rate: {ord.price}</div>
                    <div style={{ color: 'var(--skm-primary)', fontWeight: 700 }}>Total: {ord.total}</div>
                  </div>
                </div>
               );
            })}
          </div>
        </div>
      </section>

      {/* Notifications & Gov Schemes */}
      <section className="skm-dual-row">
        {/* Notifications */}
        <div className="skm-card">
          <h3 className="skm-card-title">🔔 Notifications</h3>
          <div className="skm-preview-list">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="skm-preview-item" style={{ alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ fontSize: '8px', marginTop: '4px' }}>🔵</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <p style={{ margin: '0', color: 'var(--skm-text-main)', fontWeight: 500, fontSize: '12px' }}>{notif.text}</p>
                  <span className="skm-text-muted" style={{ fontSize: '10px' }}>{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gov Schemes */}
        <div className="skm-card">
          <h3 className="skm-card-title">🏛️ Government Post-Harvest Schemes</h3>
          <div className="skm-preview-list">
            {SCHEMES.map((scheme, idx) => (
              <div key={idx} className="skm-preview-item" style={{ flexDirection: 'column', gap: '4px', alignItems: 'stretch' }}>
                <strong style={{ fontSize: '12px' }}>{scheme.name}</strong>
                <p style={{ margin: 0, fontSize: '11px', color: '#555', lineHeight: 1.4 }}>{scheme.benefits}</p>
                <span className="skm-text-muted" style={{ fontSize: '9px' }}>Ends: {scheme.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="skm-section">
        <div className="skm-section-header">
          <h2 className="skm-section-title">📜 Recent Transactions</h2>
          <button className="skm-text-link-btn" onClick={() => navigate('/transactions')}>
            View All Ledger Logs &rarr;
          </button>
        </div>
        <div className="skm-table-card">
          <table className="skm-table">
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Crop</th>
                <th>Partner</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TXN-P-98401', crop: 'Premium Cotton', partner: 'Om Bhudhara (Farmer)', type: 'Purchase', amount: '₹7,80,000', status: 'Completed', date: 'Jun 28, 2026' },
                { id: 'TXN-S-55201', crop: 'Cotton Bales', partner: 'Rahul Shah (Customer)', type: 'Sale', amount: '₹3,55,000', status: 'Completed', date: 'Jun 29, 2026' },
                { id: 'TXN-P-98402', crop: 'Sharbati Wheat', partner: 'Raj Patel (Farmer)', type: 'Purchase', amount: '₹1,88,000', status: 'Pending', date: 'Jun 15, 2026' },
                { id: 'TXN-S-55202', crop: 'Wheat Flour Grade', partner: 'Neha Patel (Customer)', type: 'Sale', amount: '₹66,250', status: 'Completed', date: 'Jun 30, 2026' }
              ].map((txn) => {
                 let statusClass = "warning";
                 if (txn.status === 'Completed') statusClass = "success";
                 return (
                  <tr key={txn.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '11px' }} className="skm-text-muted">{txn.id}</td>
                    <td style={{ fontWeight: 700 }}>{txn.crop}</td>
                    <td>{txn.partner}</td>
                    <td>
                      <span className="skm-badge" style={txn.type === 'Sale' ? { background: '#E3F2FD', color: '#1565C0' } : {}}>
                        {txn.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--skm-primary)' }}>{txn.amount}</td>
                    <td>
                      <span className={`skm-status-badge ${statusClass}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="skm-text-muted">{txn.date}</td>
                  </tr>
                 );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
