import React, { useState, useMemo } from 'react';
import './VendorTransactionHistory.css';

// ============================================================================
// DUMMY DATA FOR VENDOR TRANSACTIONS
// ============================================================================

const DUMMY_PURCHASE_HISTORY = [
  {
    id: 'TXN-P-98401',
    invoiceNumber: 'INV-2026-P01',
    cropName: 'Premium Bt Cotton',
    cropImage: '☁️',
    farmerName: 'Om Bhudhara',
    farmerVerified: true,
    location: 'Rajkot, Gujarat',
    quantity: 120,
    price: 6500, // per Q
    totalAmount: 780000,
    date: '2026-06-28',
    paymentStatus: 'Completed',
    paymentMethod: 'RTGS (SBI)',
    deliveryStatus: 'Delivered',
    notes: 'Premium BT Cotton bales. Quality inspection approved (Grade A).',
    timeline: [
      { status: 'Order Confirmed', date: '2026-06-28 09:30 AM', desc: 'Vendor accepted procurement quote from farmer Om Bhudhara.' },
      { status: 'Payment Completed', date: '2026-06-28 10:15 AM', desc: 'RTGS transfer of ₹7,80,000 processed.' },
      { status: 'Dispatched', date: '2026-06-28 02:00 PM', desc: 'Loaded into vendor container truck GJ-03-XX-4512.' },
      { status: 'Delivered', date: '2026-06-28 07:30 PM', desc: 'Delivered to Ahmedabad main warehouse.' }
    ]
  },
  {
    id: 'TXN-P-98402',
    invoiceNumber: 'INV-2026-P02',
    cropName: 'Sharbati Wheat',
    cropImage: '🌾',
    farmerName: 'Raj Patel',
    farmerVerified: true,
    location: 'Nashik, Maharashtra',
    quantity: 80,
    price: 2350,
    totalAmount: 188000,
    date: '2026-06-15',
    paymentStatus: 'Pending',
    paymentMethod: 'NEFT Transfer',
    deliveryStatus: 'Processing',
    notes: 'Grade A Sharbati Wheat. Sorted and bagged in 50kg gunny bags.',
    timeline: [
      { status: 'Order Confirmed', date: '2026-06-15 11:00 AM', desc: 'Procurement order placed with Raj Patel.' },
      { status: 'Processing', date: '2026-06-16 09:00 AM', desc: 'Curing and sorting underway at farmer storage facility.' }
    ]
  },
  {
    id: 'TXN-P-98403',
    invoiceNumber: 'INV-2026-P03',
    cropName: 'Organic Basmati Rice',
    cropImage: '🍚',
    farmerName: 'Mahesh Chauhan',
    farmerVerified: true,
    location: 'Karnal, Haryana',
    quantity: 50,
    price: 4800,
    totalAmount: 240000,
    date: '2026-06-20',
    paymentStatus: 'Completed',
    paymentMethod: 'UPI (GPay)',
    deliveryStatus: 'Delivered',
    notes: 'Certified organic basmati rice (long grain, aged 12 months).',
    timeline: [
      { status: 'Order Confirmed', date: '2026-06-20 02:30 PM', desc: 'Order approved by Mahesh Chauhan.' },
      { status: 'Payment Completed', date: '2026-06-20 02:45 PM', desc: 'Instant UPI payment completed successfully.' },
      { status: 'Delivered', date: '2026-06-21 04:00 PM', desc: 'Arrived at distribution hub.' }
    ]
  },
  {
    id: 'TXN-P-98404',
    invoiceNumber: 'INV-2026-P04',
    cropName: 'Kharif Groundnut',
    cropImage: '🥜',
    farmerName: 'Ramesh Solanki',
    farmerVerified: false,
    location: 'Junagadh, Gujarat',
    quantity: 60,
    price: 5200,
    totalAmount: 312000,
    date: '2026-06-22',
    paymentStatus: 'Cancelled',
    paymentMethod: 'Cash on Delivery',
    deliveryStatus: 'Cancelled',
    notes: 'High-oil Kharif Groundnuts. Cancelled due to heavy rain logistical delays.',
    timeline: [
      { status: 'Order Placed', date: '2026-06-22 10:00 AM', desc: 'Order created.' },
      { status: 'Cancelled', date: '2026-06-22 04:00 PM', desc: 'Cancelled due to severe weather conditions blocking state highways.' }
    ]
  }
];

const DUMMY_SALES_HISTORY = [
  {
    id: 'TXN-S-55201',
    invoiceNumber: 'INV-2026-S01',
    cropName: 'Bt Cotton',
    cropImage: '☁️',
    customerName: 'Rahul Shah',
    location: 'Surat, Gujarat',
    quantity: 50,
    price: 7100, // selling price per Q
    totalAmount: 355000,
    date: '2026-06-29',
    paymentStatus: 'Completed',
    deliveryStatus: 'Delivered',
    paymentMethod: 'Net Banking',
    notes: 'Premium commercial cotton bale batch delivered to textile unit.',
    timeline: [
      { status: 'Order Received', date: '2026-06-29 08:00 AM', desc: 'Rahul Shah purchased 50Q Bt Cotton from vendor stock.' },
      { status: 'Payment Verified', date: '2026-06-29 09:30 AM', desc: 'Net Banking payment received.' },
      { status: 'Delivered', date: '2026-06-29 05:00 PM', desc: 'Consignment unloaded at Surat Handloom Mill.' }
    ]
  },
  {
    id: 'TXN-S-55202',
    invoiceNumber: 'INV-2026-S02',
    cropName: 'Sharbati Wheat',
    cropImage: '🌾',
    customerName: 'Neha Patel',
    location: 'Vadodara, Gujarat',
    quantity: 25,
    price: 2650,
    totalAmount: 66250,
    date: '2026-06-30',
    paymentStatus: 'Completed',
    deliveryStatus: 'Shipped',
    paymentMethod: 'UPI',
    notes: 'Organic flour grade wheat batch.',
    timeline: [
      { status: 'Order Received', date: '2026-06-30 10:00 AM', desc: 'Order placed by Neha Patel.' },
      { status: 'Payment Verified', date: '2026-06-30 10:05 AM', desc: 'UPI payment cleared.' },
      { status: 'Shipped', date: '2026-06-30 02:00 PM', desc: 'Dispatched via KrishiExpress MH-15-GG-9921.' }
    ]
  },
  {
    id: 'TXN-S-55203',
    invoiceNumber: 'INV-2026-S03',
    cropName: 'Organic Basmati Rice',
    cropImage: '🍚',
    customerName: 'Amit Sharma',
    location: 'Mumbai, MH',
    quantity: 15,
    price: 5200,
    totalAmount: 78000,
    date: '2026-06-27',
    paymentStatus: 'Pending',
    deliveryStatus: 'Processing',
    paymentMethod: 'Bank Transfer (NEFT)',
    notes: 'Aged long-grain basmati rice.',
    timeline: [
      { status: 'Order Received', date: '2026-06-27 04:00 PM', desc: 'Wholesale order received for restaurant supplier distribution.' }
    ]
  }
];

const ACTIVITIES = [
  { id: 1, text: 'Purchased 120 Quintals of Cotton from Om Bhudhara.', time: '2 hours ago', type: 'purchase' },
  { id: 2, text: 'Sold 50 Quintals of Cotton to Rahul Shah.', time: '5 hours ago', type: 'sales' },
  { id: 3, text: 'Payment of ₹3,55,000 received successfully from Surat.', time: '1 day ago', type: 'payment' },
  { id: 4, text: 'New customer order of 25 Quintals Sharbati Wheat received from Neha Patel.', time: '2 days ago', type: 'order' }
];

// ============================================================================
// MAIN VENDOR TRANSACTION HISTORY COMPONENT
// ============================================================================

export default function VendorTransactionHistory() {
  const [activeTab, setActiveTab] = useState('purchases');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const purchases = useMemo(() => DUMMY_PURCHASE_HISTORY, []);
  const sales = useMemo(() => DUMMY_SALES_HISTORY, []);

  // Summary statistics
  const stats = useMemo(() => {
    const totalPurchases = purchases.filter(p => p.status !== 'Cancelled').reduce((a, b) => a + b.totalAmount, 0);
    const totalSales = sales.filter(s => s.status !== 'Cancelled').reduce((a, b) => a + b.totalAmount, 0);
    const totalRevenue = totalSales; // Total sales is vendor business revenue
    const totalOrders = purchases.length + sales.length;

    return {
      totalPurchases,
      totalSales,
      totalRevenue,
      totalOrders
    };
  }, [purchases, sales]);

  // Combine lists for filtering if type="All" or keep separate depending on active Tab
  const processedList = useMemo(() => {
    const currentList = activeTab === 'purchases' ? purchases : sales;

    return currentList
      .filter(item => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
          item.id.toLowerCase().includes(query) ||
          item.cropName.toLowerCase().includes(query) ||
          (item.farmerName && item.farmerName.toLowerCase().includes(query)) ||
          (item.customerName && item.customerName.toLowerCase().includes(query)) ||
          item.location.toLowerCase().includes(query);

        const matchesStatus = statusFilter === 'All' || item.paymentStatus === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'Oldest') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'Highest Amount') return b.totalAmount - a.totalAmount;
        if (sortBy === 'Lowest Amount') return a.totalAmount - b.totalAmount;
        return new Date(b.date) - new Date(a.date); // Newest First
      });
  }, [activeTab, purchases, sales, searchTerm, statusFilter, sortBy]);

  return (
    <div className="vth-container">
      {notification && (
        <div className="vth-toast">
          ℹ️ {notification}
        </div>
      )}

      {/* Transaction Summary Cards */}
      <div className="vth-summary-grid">
        <div className="vth-summary-card card-purchase">
          <div className="card-icon">🛒</div>
          <div className="card-details">
            <span className="value">₹{stats.totalPurchases.toLocaleString('en-IN')}</span>
            <span className="label">Total Purchases</span>
          </div>
        </div>

        <div className="vth-summary-card card-sales">
          <div className="card-icon">🛍️</div>
          <div className="card-details">
            <span className="value">₹{stats.totalSales.toLocaleString('en-IN')}</span>
            <span className="label">Total Sales</span>
          </div>
        </div>

        <div className="vth-summary-card card-revenue">
          <div className="card-icon">💰</div>
          <div className="card-details">
            <span className="value">₹{stats.totalRevenue.toLocaleString('en-IN')}</span>
            <span className="label">Total Revenue</span>
          </div>
        </div>

        <div className="vth-summary-card card-orders">
          <div className="card-icon">📦</div>
          <div className="card-details">
            <span className="value">{stats.totalOrders}</span>
            <span className="label">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="vth-filter-panel">
        <div className="vth-search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search crop, counterparty or Txn ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="vth-filters-row">
          <div className="filter-item">
            <label>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="filter-item">
            <label>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="Newest">Newest First</option>
              <option value="Oldest">Oldest First</option>
              <option value="Highest Amount">Highest Amount</option>
              <option value="Lowest Amount">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="vth-tabs">
        <button
          className={`vth-tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
          onClick={() => { setActiveTab('purchases'); setSearchTerm(''); }}
        >
          🛒 Purchase History (Procurement)
        </button>
        <button
          className={`vth-tab-btn ${activeTab === 'sales' ? 'active' : ''}`}
          onClick={() => { setActiveTab('sales'); setSearchTerm(''); }}
        >
          🛍️ Sales History (Fulfillment)
        </button>
      </div>

      {/* Active Tab Listings */}
      <div className="vth-history-grid">
        {processedList.map(item => (
          <div key={item.id} className="vth-history-card">
            <div className="vth-card-top">
              <span className="vth-crop-icon">{item.cropImage}</span>
              <div className="vth-crop-meta">
                <h4 className="vth-crop-title">{item.cropName}</h4>
                <span className="vth-txn-id">{item.id}</span>
              </div>
              <span className={`status-pill status-${item.paymentStatus.toLowerCase()}`}>
                {item.paymentStatus}
              </span>
            </div>

            <div className="vth-card-body">
              {activeTab === 'purchases' ? (
                <div className="vth-meta-row">
                  <div>👨‍🌾 Farmer: <strong>{item.farmerName}</strong> {item.farmerVerified && <span className="verified-badge">✓ Verified</span>}</div>
                  <div>📍 Location: {item.location}</div>
                  <div>📦 Qty: <strong>{item.quantity} Q</strong></div>
                  <div>💰 Price: <strong>₹{item.price.toLocaleString('en-IN')}/Q</strong></div>
                </div>
              ) : (
                <div className="vth-meta-row">
                  <div>👤 Customer: <strong>{item.customerName}</strong></div>
                  <div>📍 Destination: {item.location}</div>
                  <div>📦 Qty Sold: <strong>{item.quantity} Q</strong></div>
                  <div>💰 Price: <strong>₹{item.price.toLocaleString('en-IN')}/Q</strong></div>
                </div>
              )}

              <div className="vth-card-financial">
                <div className="date">📅 {item.date}</div>
                <div className="amount">₹{item.totalAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="vth-card-actions">
              <button className="vth-btn btn-primary" onClick={() => setSelectedTxn(item)}>👁️ View Details</button>
              <button className="vth-btn btn-outline" onClick={() => showToast('Invoice PDF generated (UI stub).')}>🧾 Invoice</button>
              <button className="vth-btn btn-outline" onClick={() => showToast(`Negotiations opened...`)}>💬 Chat</button>
            </div>
          </div>
        ))}

        {processedList.length === 0 && (
          <div className="vth-empty">
            <span>📜</span>
            <p>No transaction history matches your search filters.</p>
          </div>
        )}
      </div>

      {/* Recent Activity Mini-Feed */}
      <div className="vth-activities-feed">
        <h3>⚡ Recent Activities</h3>
        <div className="vth-act-list">
          {ACTIVITIES.map(act => (
            <div key={act.id} className="vth-act-item">
              <span className="icon">🔵</span>
              <div className="act-details">
                <p>{act.text}</p>
                <span className="time">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {selectedTxn && (
        <div className="vth-modal-backdrop" onClick={() => setSelectedTxn(null)}>
          <div className="vth-modal-box" onClick={e => e.stopPropagation()}>
            <div className="vth-modal-header">
              <h3>🔍 Transaction Audit Details</h3>
              <button className="close-btn" onClick={() => setSelectedTxn(null)}>✕</button>
            </div>
            <div className="vth-modal-body">
              <div className="vth-modal-item">
                <span className="label">Transaction ID</span>
                <strong>{selectedTxn.id}</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Invoice Reference</span>
                <strong>{selectedTxn.invoiceNumber}</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">{activeTab === 'purchases' ? 'Seller (Farmer)' : 'Buyer (Customer)'}</span>
                <strong>{selectedTxn.farmerName || selectedTxn.customerName}</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Crop Product</span>
                <strong>{selectedTxn.cropImage} {selectedTxn.cropName}</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Quantity</span>
                <strong>{selectedTxn.quantity} Quintals</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Rate per Unit</span>
                <strong>₹{selectedTxn.price.toLocaleString('en-IN')}/Q</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Total Amount Paid</span>
                <strong className="text-success">₹{selectedTxn.totalAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Payment Method</span>
                <strong>{selectedTxn.paymentMethod || 'Online Settlement'}</strong>
              </div>
              <div className="vth-modal-item">
                <span className="label">Order / Shipment Status</span>
                <strong>{selectedTxn.deliveryStatus || 'Completed'}</strong>
              </div>
              <div className="vth-modal-item full-width">
                <span className="label">Delivery Address Location</span>
                <strong>{selectedTxn.location}</strong>
              </div>

              {/* Timeline */}
              <div className="vth-modal-timeline full-width">
                <span className="label">Audit Process Timeline</span>
                <div className="timeline-steps">
                  {(selectedTxn.timeline || []).map((step, idx) => (
                    <div key={idx} className="timeline-step">
                      <div className="step-bullet" />
                      <div className="step-info">
                        <strong>{step.status}</strong>
                        <span className="time">{step.date}</span>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="vth-modal-footer">
              <button className="vth-btn btn-outline" onClick={() => window.print()}>Print Invoice</button>
              <button className="vth-btn btn-primary" onClick={() => setSelectedTxn(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
