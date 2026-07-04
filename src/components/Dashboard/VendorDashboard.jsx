import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VendorDashboard.css';

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
  { crop: 'Sharbati Wheat', stock: '500 Q', value: '₹12,00,000', price: '₹2,400/Q' },
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
    <div className="vd-container">
      {/* Welcome Section */}
      <section className="vd-welcome-section">
        <div className="vd-welcome-left">
          <span className="vd-time-greeting">Commercial Partner Desk</span>
          <h1 className="vd-welcome-title">Vendor Dashboard 👋</h1>
          <div className="vd-header-metadata">
            <span className="vd-meta-badge">Role: Partner Vendor</span>
            <span className="vd-meta-divider">|</span>
            <span className="vd-meta-time">{currentTime}</span>
            <span className="vd-meta-divider">|</span>
            <span className="vd-meta-date">{currentDate}</span>
          </div>
        </div>
        <div className="vd-welcome-right">
          <div className="vd-welcome-stats-summary">
            🏪 <strong>Krishna Agro Traders</strong>
          </div>
        </div>
      </section>

      {/* Quick Statistics */}
      <section className="vd-stats-section">
        <div className="vd-section-header">
          <h2 className="vd-section-title">📊 Key Metrics</h2>
        </div>
        <div className="vd-stats-grid">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="vd-stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <div className="vd-stat-card-header">
                <span className="vd-stat-label">{stat.label}</span>
                <span className="vd-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </span>
              </div>
              <div className="vd-stat-value">{stat.value}</div>
              <div className="vd-stat-card-footer">
                <span className="vd-stat-desc">{stat.desc}</span>
                <span className={`vd-stat-trend trend-${stat.trendType}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="vd-quick-section">
        <div className="vd-section-header">
          <h2 className="vd-section-title">⚡ Quick Actions</h2>
        </div>
        <div className="vd-quick-grid">
          {QUICK_ACTIONS.map((action) => (
            <div key={action.id} className="vd-quick-card" onClick={() => navigate(action.path)}>
              <div className="vd-quick-icon-wrap">{action.icon}</div>
              <h3 className="vd-quick-title">{action.title}</h3>
              <p className="vd-quick-desc">{action.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inventory & Sales Analytics */}
      <section className="vd-dual-row">
        {/* Inventory Overview */}
        <div className="vd-widget-card">
          <h3 className="vd-widget-title">📦 Inventory Stock Reserves</h3>
          <div className="vd-inventory-list">
            {INVENTORY_SUMMARY.map((item, idx) => (
              <div key={idx} className="vd-inventory-item">
                <div className="vd-inv-meta">
                  <strong>{item.crop}</strong>
                  <span>Selling price: {item.price}</span>
                </div>
                <div className="vd-inv-stock-val">
                  <strong>{item.stock}</strong>
                  <span>Valued: {item.value}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="vd-widget-action-btn" onClick={() => navigate('/marketplace')}>
            Update Stock Rates
          </button>
        </div>

        {/* Sales Analytics Chart Mock */}
        <div className="vd-widget-card">
          <h3 className="vd-widget-title">📈 Sales Revenue Growth</h3>
          <div className="vd-analytics-chart-mock">
            <div className="bar-chart-container">
              <div className="chart-bar" style={{ height: '40%' }}><span className="bar-label">Apr</span></div>
              <div className="chart-bar" style={{ height: '65%' }}><span className="bar-label">May</span></div>
              <div className="chart-bar" style={{ height: '90%' }}><span className="bar-label">Jun</span></div>
            </div>
            <div className="chart-info-box">
              <strong>₹4.99 Lakhs Sales</strong>
              <p>Highest demand observed on Cotton procurement fulfillment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Procurement Requests vs Customer Orders */}
      <section className="vd-dual-row">
        {/* Farmer purchase requests */}
        <div className="vd-widget-card">
          <div className="vd-widget-header-row">
            <h3 className="vd-widget-title">⏳ Farmer Purchase Requests</h3>
            <button className="vd-text-link-btn" onClick={() => navigate('/marketplace')}>
              View Bids
            </button>
          </div>
          <div className="vd-requests-list">
            {FARMER_PURCHASE_REQUESTS.map((req) => (
              <div key={req.id} className="vd-request-card">
                <div className="vd-req-top">
                  <strong>{req.crop}</strong>
                  <span className={`req-status status-${req.status.toLowerCase()}`}>{req.status}</span>
                </div>
                <div className="vd-req-body">
                  <div>Farmer: {req.farmer}</div>
                  <div>Qty requested: {req.qty} · Rate: {req.proposedPrice}</div>
                  <div className="amount">Total: {req.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Orders */}
        <div className="vd-widget-card">
          <div className="vd-widget-header-row">
            <h3 className="vd-widget-title">🛍️ Customer Orders</h3>
            <button className="vd-text-link-btn" onClick={() => navigate('/marketplace')}>
              View Sales
            </button>
          </div>
          <div className="vd-requests-list">
            {CUSTOMER_ORDERS.map((ord) => (
              <div key={ord.id} className="vd-request-card">
                <div className="vd-req-top">
                  <strong>{ord.crop}</strong>
                  <span className={`req-status status-${ord.status.toLowerCase()}`}>{ord.status}</span>
                </div>
                <div className="vd-req-body">
                  <div>Customer: {ord.customer}</div>
                  <div>Qty sold: {ord.qty} · Rate: {ord.price}</div>
                  <div className="amount">Total: {ord.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notifications & Gov Schemes */}
      <section className="vd-dual-row">
        {/* Notifications */}
        <div className="vd-widget-card">
          <h3 className="vd-widget-title">🔔 Notifications</h3>
          <div className="vd-notif-list">
            {NOTIFICATIONS.map((notif) => (
              <div key={notif.id} className="vd-notif-item">
                <span className="bullet">🔵</span>
                <div className="info">
                  <p>{notif.text}</p>
                  <span className="time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gov Schemes */}
        <div className="vd-widget-card">
          <h3 className="vd-widget-title">🏛️ Government Post-Harvest Schemes</h3>
          <div className="vd-schemes-list">
            {SCHEMES.map((scheme, idx) => (
              <div key={idx} className="vd-scheme-card">
                <strong>{scheme.name}</strong>
                <p>{scheme.benefits}</p>
                <span className="deadline">Ends: {scheme.deadline}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="vd-transactions-section">
        <div className="vd-widget-header-row">
          <h2 className="vd-section-title">📜 Recent Transactions</h2>
          <button className="vd-text-link-btn" onClick={() => navigate('/transactions')}>
            View All Ledger Logs &rarr;
          </button>
        </div>
        <div className="vd-table-card">
          <table className="vd-transactions-table">
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
              ].map((txn) => (
                <tr key={txn.id}>
                  <td className="mono">{txn.id}</td>
                  <td className="vd-table-cell-bold">{txn.crop}</td>
                  <td>{txn.partner}</td>
                  <td>
                    <span className={`txn-type-badge type-${txn.type.toLowerCase()}`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="vd-table-cell-amount">{txn.amount}</td>
                  <td>
                    <span className={`vd-table-status-badge status-${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="vd-table-cell-date">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
