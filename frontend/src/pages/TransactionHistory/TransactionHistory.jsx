import React, { useState, useEffect, useCallback } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

import { useAuth } from '../../context/AuthContext';

import VendorTransactionHistory from '../../components/Marketplace/VendorTransactionHistory';
import { getTransactions as getTransactionsApi, downloadInvoice } from '../../services/transactionService';
import './TransactionHistory.css';


/* Filter & sort option lists */
const CROPS_FILTER_OPTIONS    = ['All', 'Wheat', 'Rice', 'Cotton', 'Soybean', 'Tomato', 'Potato', 'Onion'];
const PAYMENT_STATUS_OPTIONS  = ['All', 'Completed', 'Pending', 'Cancelled'];
const DELIVERY_STATUS_OPTIONS = ['All', 'Delivered', 'Shipped', 'Processing', 'Cancelled'];
const SORT_OPTIONS            = ['Newest First', 'Oldest First', 'Highest Amount', 'Lowest Amount'];

/* Table column definitions */
const TABLE_HEADERS = [
  'TXN ID', 'Crop', 'Quantity', 'Unit Price', 'Total Amount', 'Counterparty', 'Date', 'Payment', 'Delivery', 'Action',
];

/* ═══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */


// ── Notes block inside modal ─────────────────────────────────────────────────
function TransactionNotes({ notes }) {
  if (!notes) return null;
  return (
    <div className="tx-details-notes">
      <div className="tx-notes-title">📝 Farmer Order Notes</div>
      <p className="tx-notes-text">{notes}</p>
    </div>
  );
}

// ── Transaction detail modal ─────────────────────────────────────────────────
function TransactionDetailModal({ txn, onClose, currentUser }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!txn) return null;

  const isBuyer = txn.buyer?._id === currentUser?._id;
  const partner = isBuyer ? txn.seller : txn.buyer;

  const detailRows = [
    { label: 'Crop Name',      value: txn.cropName },
    { label: 'Quantity',       value: `${txn.quantity} kg` },
    { label: 'Price Per Unit', value: `₹${txn.price}/kg` },
    { label: 'Total Amount',   value: `₹${txn.totalAmount.toLocaleString('en-IN')}`, highlight: true },
    { label: 'Seller (Farmer)', value: txn.seller?.fullName,          labelBadge: txn.seller?.role },
    { label: 'Buyer',          value: txn.buyer?.fullName,            labelBadge: txn.buyer?.role },
    { label: 'Payment Method', value: 'UPI (Auto-processed)' },
    { label: 'Payment Status', value: txn.paymentStatus,    status: 'payment' },
    { label: 'Delivery Status',value: txn.deliveryStatus,   status: 'delivery' },
    { label: 'Location Yard',  value: partner?.district ? `${partner.district}, ${partner.state}` : 'Punjab Mandi' },
  ];

  const activityLog = txn.activityLog || [
    { status: 'Order Placed', time: new Date(txn.createdAt).toLocaleString(), desc: `Order created. Buyer: ${txn.buyer?.fullName}, Seller: ${txn.seller?.fullName}` },
    { status: 'Payment Received', time: new Date(txn.createdAt).toLocaleString(), desc: `Payment of ₹${txn.totalAmount.toLocaleString()} completed.` },
    { status: txn.deliveryStatus, time: new Date(txn.updatedAt || txn.createdAt).toLocaleString(), desc: `Delivery status is: ${txn.deliveryStatus}` }
  ];

  const handleDownloadInvoice = async () => {
    try {
      const response = await downloadInvoice(txn._id);
      const blob = new Blob([response.data], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${txn.invoiceNumber}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert('Failed to download invoice.');
    }
  };

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div className="tx-modal" onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className="tx-modal-header">
          <div className="tx-modal-title-row">
            <div>
              <span className="tx-modal-id-badge">{txn.invoiceNumber}</span>
              <h2 className="tx-modal-title">🌾 {txn.cropName} Sale</h2>
            </div>
            <button className="tx-modal-close-btn" onClick={onClose}>✕</button>
          </div>
          <p className="tx-modal-subtitle">Transaction processed on {new Date(txn.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Modal body: two-column grid */}
        <div className="tx-modal-body">
          <div className="tx-modal-grid">

            {/* Left: Details */}
            <div className="tx-modal-details-col">
              <h3 className="tx-modal-sec-title">📦 Transaction Details</h3>
              <div className="tx-details-list">
                {detailRows.map((item, i) => (
                  <div key={i} className="tx-details-item">
                    <span className="tx-details-label">{item.label}</span>
                    <div className="tx-details-value-wrapper">
                      {item.labelBadge && (
                        <span className={`tx-role-badge tx-role--${item.labelBadge.toLowerCase()}`}>
                          {item.labelBadge}
                        </span>
                      )}
                      {item.status ? (
                        <span className={`tx-status-pill tx-status--${item.status === 'payment' ? txn.paymentStatus.toLowerCase() : txn.deliveryStatus.toLowerCase()}`}>
                          {item.value}
                        </span>
                      ) : (
                        <span className={`tx-details-value${item.highlight ? ' tx-details-value--highlight' : ''}`}>
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <TransactionNotes notes={txn.notes || "No special instructions."} />
            </div>

            {/* Right: Activity timeline */}
            <div className="tx-modal-timeline-col">
              <h3 className="tx-modal-sec-title">⏱️ Shipment &amp; Activity Log</h3>
              <div className="tx-timeline">
                {activityLog.map((log, i) => (
                  <div key={i} className="tx-timeline-step">
                    <div className="tx-timeline-marker">
                      <div className="tx-timeline-dot" />
                      {i < activityLog.length - 1 && <div className="tx-timeline-line" />}
                    </div>
                    <div className="tx-timeline-content">
                      <div className="tx-timeline-status-row">
                        <span className="tx-timeline-status">{log.status}</span>
                        <span className="tx-timeline-time">{log.time}</span>
                      </div>
                      <p className="tx-timeline-desc">{log.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Modal footer */}
        <div className="tx-modal-footer">
          <button
            className="tx-modal-btn tx-modal-btn--secondary"
            onClick={handleDownloadInvoice}
          >
            📄 Download Invoice
          </button>
          <button className="tx-modal-btn tx-modal-btn--primary" onClick={onClose}>
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
}


// ── Table row ────────────────────────────────────────────────────────────────
function TransactionRow({ t, onView, currentUser }) {
  const isBuyer = t.buyer?._id === currentUser?._id;
  const counterpartyObj = isBuyer ? t.seller : t.buyer;
  const counterparty = counterpartyObj?.fullName || 'Unknown';
  const counterRole  = counterpartyObj?.role || 'User';
  return (
    <tr className="tx-row">
      <td className="tx-cell-id">{t.invoiceNumber}</td>
      <td>
        <div className="tx-crop-cell">
          <span className="tx-crop-emoji">🌾</span>
          <span className="tx-crop-name">{t.cropName}</span>
        </div>
      </td>
      <td>{t.quantity} kg</td>
      <td>₹{t.price}/kg</td>
      <td className="tx-cell-amount">₹{t.totalAmount.toLocaleString('en-IN')}</td>
      <td>
        <div className="tx-party-cell">
          <span className="tx-party-name">{counterparty}</span>
          <span className={`tx-role-badge tx-role--${counterRole.toLowerCase()}`}>{counterRole}</span>
        </div>
      </td>
      <td className="tx-cell-date">{new Date(t.createdAt).toLocaleDateString()}</td>
      <td><span className={`tx-status-pill tx-status--${t.paymentStatus.toLowerCase()}`}>{t.paymentStatus}</span></td>
      <td><span className={`tx-status-pill tx-status--${t.deliveryStatus.toLowerCase()}`}>{t.deliveryStatus}</span></td>
      <td className="tx-text-center">
        <button className="tx-action-view" onClick={() => onView(t)}>View Info →</button>
      </td>
    </tr>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function TransactionHistory() {

  /* ── State ── */
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [cropFilter,     setCropFilter]     = useState('All');
  const [paymentFilter,  setPaymentFilter]  = useState('All');
  const [deliveryFilter, setDeliveryFilter] = useState('All');
  const [sortBy,         setSortBy]         = useState('Newest First');
  const [selectedDate,   setSelectedDate]   = useState('');
  const [selectedTxn,    setSelectedTxn]    = useState(null);
  const [isLoading,      setIsLoading]      = useState(true);
  const [notification,   setNotification]   = useState(null);
  const [transactions,   setTransactions]   = useState([]);

  /* ── Toast helper ── */
  const triggerToast = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  /* ── Fetch transactions on mount ── */
  useEffect(() => {
    const fetchTx = async () => {
      setIsLoading(true);
      try {
        const response = await getTransactionsApi();
        if (response.data?.success) {
          setTransactions(response.data.transactions);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        triggerToast("Failed to load transaction history.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTx();
  }, [triggerToast]);

  /* ── Filter reset ── */
  const handleResetFilters = () => {
    setSearchQuery('');
    setCropFilter('All');
    setPaymentFilter('All');
    setDeliveryFilter('All');
    setSortBy('Newest First');
    setSelectedDate('');
    triggerToast('All filters have been reset.', 'info');
  };

  /* ── Export handler ── */
  const handleExport = (type) => {
    triggerToast(`Exporting transactions as ${type}... (UI Mockup)`, 'success');
  };

  /* ── Filter & sort ── */
  const filteredTxns = transactions
    .filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const bName = t.buyer?.fullName || '';
        const sName = t.seller?.fullName || '';
        if (!t.invoiceNumber.toLowerCase().includes(q) &&
            !t.cropName.toLowerCase().includes(q) &&
            !bName.toLowerCase().includes(q) &&
            !sName.toLowerCase().includes(q)) return false;
      }
      if (cropFilter     !== 'All' && t.cropName        !== cropFilter)     return false;
      if (paymentFilter  !== 'All' && t.paymentStatus   !== paymentFilter)  return false;
      if (deliveryFilter !== 'All' && t.deliveryStatus  !== deliveryFilter) return false;
      if (selectedDate) {
        const tDate = new Date(t.createdAt).toISOString().split('T')[0];
        if (tDate !== selectedDate) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (sortBy === 'Newest First')   return dateB - dateA;
      if (sortBy === 'Oldest First')   return dateA - dateB;
      if (sortBy === 'Highest Amount') return b.totalAmount - a.totalAmount;
      if (sortBy === 'Lowest Amount')  return a.totalAmount - b.totalAmount;
      return 0;
    });

  /* ── Summary statistics ── */
  const statsSummary = transactions.reduce(
    (acc, t) => {
      if (t.paymentStatus === 'Completed') {
        acc.totalRevenue       += t.totalAmount;
        acc.completedPayments  += t.totalAmount;
      } else if (t.paymentStatus === 'Pending') {
        acc.pendingPayments    += t.totalAmount;
      } else if (t.paymentStatus === 'Cancelled') {
        acc.cancelledPayments  += t.totalAmount;
      }
      if (t.deliveryStatus === 'Delivered') acc.completedOrders += 1;
      if (t.deliveryStatus !== 'Cancelled') acc.totalCropsSold  += parseFloat(t.quantity) || 0;
      return acc;
    },
    { totalRevenue: 0, totalCropsSold: 0, totalTxns: transactions.length,
      completedOrders: 0, pendingPayments: 0, completedPayments: 0, cancelledPayments: 0 }
  );

  /* ── Stat cards data ── */
  const STAT_CARDS = [
    { icon: '💰', label: 'Total Revenue',       value: `₹${statsSummary.totalRevenue.toLocaleString('en-IN')}`, trend: '+15.2% YoY' },
    { icon: '🌾', label: 'Crops Sold',           value: `${statsSummary.totalCropsSold} Q`,                      trend: '+8.4% this season' },
    { icon: '📦', label: 'Transactions',         value: statsSummary.totalTxns,                                   trend: 'All logs synced' },
    { icon: '🟢', label: 'Completed Deliveries', value: statsSummary.completedOrders,                             trend: '94% success rate' },
  ];

  /* ── Payment breakdown data ── */
  const PAYMENT_BREAKDOWN = [
    { label: 'Total Earnings',       value: `₹${statsSummary.totalRevenue.toLocaleString('en-IN')}`,       color: '#E8F5E9', text: '#2E7D32' },
    { label: 'Completed Payments',   value: `₹${statsSummary.completedPayments.toLocaleString('en-IN')}`,  color: '#E1F5FE', text: '#0288D1' },
    { label: 'Pending Clearances',   value: `₹${statsSummary.pendingPayments.toLocaleString('en-IN')}`,    color: '#FFF8E1', text: '#F57F17' },
    { label: 'Cancelled Orders',     value: `₹${statsSummary.cancelledPayments.toLocaleString('en-IN')}`,  color: '#FFEBEE', text: '#C62828' },
  ];

  /* ── Filter field definitions ── */
  const FILTER_FIELDS = [
    { label: 'Filter by Date',   type: 'date',   value: selectedDate,   onChange: setSelectedDate },
    { label: 'Crop Type',        type: 'select', value: cropFilter,     onChange: setCropFilter,     options: CROPS_FILTER_OPTIONS },
    { label: 'Payment Status',   type: 'select', value: paymentFilter,  onChange: setPaymentFilter,  options: PAYMENT_STATUS_OPTIONS },
    { label: 'Delivery Status',  type: 'select', value: deliveryFilter, onChange: setDeliveryFilter, options: DELIVERY_STATUS_OPTIONS },
    { label: 'Sort Records',     type: 'select', value: sortBy,         onChange: setSortBy,         options: SORT_OPTIONS },
  ];

  const { user } = useAuth();
  const role = user?.role || 'Customer';
  const currentUser = { name: user?.name || 'OM', role };

  /* ── Vendor view ── */
  if (role === 'Vendor') {
    return (
      <div className="skm-root">
        {notification && <ToastNotification notification={notification} />}
        <Navbar user={currentUser} onToggleSidebar={() => setSidebarOpen(o => !o)} notificationSlot={<NotificationBell notifications={[]} />} />
        <div className="skm-layout">
          <Sidebar collapsed={!sidebarOpen} onToggleCollapse={() => setSidebarOpen(o => !o)} activeItem="transactions" />
          <main className="skm-main">
            <div className="skm-content-area">
              <div className="skm-welcome-card" style={{ marginBottom: '24px' }}>
                <div>
                  <span className="skm-text-muted" style={{ fontSize: '12px' }}>💳 Financial Log</span>
                  <h1 className="skm-title" style={{ margin: '4px 0' }}>📜 Vendor Transaction History</h1>
                  <p className="skm-text-muted" style={{ fontSize: '13px', margin: '8px 0 0' }}>Manage and audit your commercial purchases from farmers and fulfillment sales to customers.</p>
                </div>
              </div>
              <VendorTransactionHistory />
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* ── Farmer / Customer view ── */
  return (
    <div className="skm-root">
      {notification && <ToastNotification notification={notification} />}

      {selectedTxn && (
        <TransactionDetailModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} currentUser={user} />
      )}

      <Navbar user={currentUser} onToggleSidebar={() => setSidebarOpen(o => !o)} notificationSlot={<NotificationBell notifications={[]} />} />

      <div className="skm-layout">
        <Sidebar collapsed={!sidebarOpen} onToggleCollapse={() => setSidebarOpen(o => !o)} activeItem="transactions" />

        <main className="skm-main">
          <div className="skm-content-area">

            {/* Page Header */}
            <div className="skm-welcome-card" style={{ marginBottom: '24px' }}>
              <div>
                <span className="skm-text-muted" style={{ fontSize: '12px' }}>💳 Financial Log</span>
                <h1 className="skm-title" style={{ margin: '4px 0' }}>Transaction History</h1>
                <p className="skm-text-muted" style={{ fontSize: '13px', margin: '8px 0 0' }}>Track all crop buying and selling transactions, invoice details, payments, and delivery log records.</p>
              </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="skm-grid" style={{ marginBottom: '24px' }}>
              {STAT_CARDS.map((card, i) => (
                <div key={i} className="skm-stat-card">
                  <div className="skm-stat-header">
                    <span className="skm-stat-label">{card.label}</span>
                    <span className="skm-stat-icon" style={{ fontSize: '20px', background: '#F5F5F5' }}>{card.icon}</span>
                  </div>
                  <div className="skm-stat-value" style={{ fontSize: '22px' }}>{card.value}</div>
                  <div className="skm-stat-footer">
                    <span className="skm-text-muted" style={{ fontSize: '11px' }}>{card.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Summary + Actions */}
            <div className="skm-dual-row" style={{ marginBottom: '24px' }}>
              <div className="skm-card">
                <h2 className="skm-section-title" style={{ marginBottom: '12px' }}>💵 Payment Summary</h2>
                <p className="skm-text-muted" style={{ fontSize: '12px', marginBottom: '16px' }}>Current financial breakdowns for your farm accounts</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {PAYMENT_BREAKDOWN.map((p, i) => (
                    <div key={i} style={{ background: p.color, padding: '14px 16px', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 900, fontSize: '16px', color: p.text }}>{p.value}</div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{p.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="skm-card">
                <h2 className="skm-section-title" style={{ marginBottom: '12px' }}>⚡ Actions & Reporting</h2>
                <p className="skm-text-muted" style={{ fontSize: '12px', marginBottom: '16px' }}>Download financial log sheets and statements</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: '📄 Download PDF Invoice', type: 'PDF' },
                    { label: '📊 Download Excel Sheet', type: 'Excel' },
                    { label: '📈 Export CSV Report', type: 'CSV' },
                  ].map((btn) => (
                    <button key={btn.type} className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={() => handleExport(btn.type)}>{btn.label}</button>
                  ))}
                  <button className="skm-action-btn" onClick={() => window.print()}>🖨️ Print Statement</button>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="skm-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px', padding: '8px 12px' }}>
                  <span>🔍</span>
                  <input type="text" placeholder="Search by ID, crop name, buyer or seller..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px' }} />
                  {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>}
                </div>
                <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={handleResetFilters}>🔄 Clear</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                {FILTER_FIELDS.map((field) => (
                  <div key={field.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--skm-text-muted)' }}>{field.label}</label>
                    {field.type === 'date' ? (
                      <input type="date" value={field.value} onChange={(e) => field.onChange(e.target.value)} style={{ padding: '7px', border: '1px solid var(--skm-border)', borderRadius: '8px', fontSize: '12px' }} />
                    ) : (
                      <select value={field.value} onChange={(e) => field.onChange(e.target.value)} style={{ padding: '7px', border: '1px solid var(--skm-border)', borderRadius: '8px', fontSize: '12px' }}>
                        {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Table */}
            <div className="skm-table-card">
              <div className="skm-section-header" style={{ padding: '16px 20px' }}>
                <h2 className="skm-section-title">📜 Transaction Log</h2>
                <span className="skm-badge">{filteredTxns.length} records</span>
              </div>

              {isLoading && (
                <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[...Array(5)].map((_, i) => <div key={i} style={{ height: '40px', background: '#F5F5F5', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />)}
                </div>
              )}

              {!isLoading && filteredTxns.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <span style={{ fontSize: '48px' }}>🔍</span>
                  <h3>No records found</h3>
                  <p className="skm-text-muted">Try modifying your search or reset the filters.</p>
                  <button className="skm-action-btn" onClick={handleResetFilters}>Reset All Filters</button>
                </div>
              )}

              {!isLoading && filteredTxns.length > 0 && (
                <table className="skm-table">
                  <thead>
                    <tr>{TABLE_HEADERS.map((h) => <th key={h}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((t) => <TransactionRow key={t._id} t={t} onView={setSelectedTxn} currentUser={user} />)}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPER: Toast notification
───────────────────────────────────────────────────────────────────────────── */
function ToastNotification({ notification }) {
  return (
    <div className={`tx-toast tx-toast--${notification.type}`}>
      <span className="tx-toast-icon">
        {notification.type === 'success' ? '✅' : 'ℹ️'}
      </span>
      {notification.msg}
    </div>
  );
}
