import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Card from '../../components/Card/Card';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import VendorTransactionHistory from '../../components/Marketplace/VendorTransactionHistory';
import './TransactionHistory.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   STATIC DATA — Realistic Agricultural Transaction Records
   Replace with API call: GET /api/transactions (Node/Express/MongoDB)
   ═══════════════════════════════════════════════════════════════════════════════ */

const TRANSACTION_RECORDS = [
  {
    id: 'TXN-84920-IND', crop: 'Wheat', emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200&h=150&fit=crop',
    quantity: '50 Quintals', price: '₹2,350/Q', totalAmount: 117500,
    buyer: 'AgroMart Store', buyerRole: 'Vendor', seller: 'Raj Patel (You)', sellerRole: 'Farmer',
    date: '2026-06-28', paymentStatus: 'Completed', paymentMethod: 'UPI (PhonePe)',
    deliveryStatus: 'Delivered', location: 'Pune Mandi Yard, Maharashtra',
    notes: 'Premium HD-3226 organic variety wheat. Packed in 50kg double-lined gunny bags.',
    activityLog: [
      { status: 'Order Placed',     time: '2026-06-28 10:15 AM', desc: 'Farmer Raj Patel listed 50Q Wheat and Vendor AgroMart accepted the quote.' },
      { status: 'Payment Received', time: '2026-06-28 10:20 AM', desc: 'Payment of ₹1,17,500 successfully processed via UPI.' },
      { status: 'Dispatched',       time: '2026-06-28 01:30 PM', desc: 'Goods picked up by AgroMart logistics truck MH-12-PQ-4589.' },
      { status: 'Delivered',        time: '2026-06-28 05:45 PM', desc: 'Delivered to Pune Warehouse. Quality check approved (Moisture: 11.2%).' },
    ],
  },
  {
    id: 'TXN-90210-IND', crop: 'Rice', emoji: '🍚',
    image: 'https://images.unsplash.com/photo-1536304993881-460e03fa5160?w=200&h=150&fit=crop',
    quantity: '30 Quintals', price: '₹2,200/Q', totalAmount: 66000,
    buyer: 'Amit Sharma', buyerRole: 'Customer', seller: 'Raj Patel (You)', sellerRole: 'Farmer',
    date: '2026-06-27', paymentStatus: 'Completed', paymentMethod: 'Net Banking (SBI)',
    deliveryStatus: 'Shipped', location: 'Andheri West, Mumbai, 400058',
    notes: 'Pusa Basmati 1847 long grain rice. Aged for 12 months.',
    activityLog: [
      { status: 'Order Placed',     time: '2026-06-27 11:30 AM', desc: 'Customer Amit Sharma placed order for 30Q Basmati Rice.' },
      { status: 'Payment Received', time: '2026-06-27 11:45 AM', desc: 'Payment verified and credited to farmer account.' },
      { status: 'Dispatched',       time: '2026-06-28 09:00 AM', desc: 'Shipped via Krishi Express Cargo. Tracking ID: KX-9804.' },
    ],
  },
  {
    id: 'TXN-71842-IND', crop: 'Cotton', emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=200&h=150&fit=crop',
    quantity: '15 Quintals', price: '₹6,800/Q', totalAmount: 102000,
    buyer: 'TextileCo Industries', buyerRole: 'Vendor', seller: 'Priya Devi', sellerRole: 'Farmer',
    date: '2026-06-26', paymentStatus: 'Pending', paymentMethod: 'Bank Transfer (NEFT)',
    deliveryStatus: 'Processing', location: 'Indore Mandi, Madhya Pradesh',
    notes: 'Long-staple Bt Cotton. Cleaned and baled (10 bales).',
    activityLog: [
      { status: 'Order Placed', time: '2026-06-26 03:00 PM', desc: 'Contract signed for 15Q cotton at market MSP premium.' },
      { status: 'Processing',   time: '2026-06-27 10:00 AM', desc: 'Cotton bales currently being weighed and certified at local mandi lab.' },
    ],
  },
  {
    id: 'TXN-65109-IND', crop: 'Soybean', emoji: '🫘',
    image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=200&h=150&fit=crop',
    quantity: '40 Quintals', price: '₹4,500/Q', totalAmount: 180000,
    buyer: 'Jalgaon Oil Millers', buyerRole: 'Vendor', seller: 'Raj Patel (You)', sellerRole: 'Farmer',
    date: '2026-06-25', paymentStatus: 'Completed', paymentMethod: 'UPI (GPay)',
    deliveryStatus: 'Delivered', location: 'Jalgaon Processing Hub, Maharashtra',
    notes: 'JS 20-34 oilseed variety. High oil content grade.',
    activityLog: [
      { status: 'Order Placed',     time: '2026-06-25 09:30 AM', desc: 'Bulk purchase order accepted by Farmer Raj Patel.' },
      { status: 'Payment Received', time: '2026-06-25 09:40 AM', desc: 'Instant UPI settlement done. Amount ₹1,80,000 received.' },
      { status: 'Dispatched',       time: '2026-06-25 11:00 AM', desc: 'Soybeans loaded into transport truck.' },
      { status: 'Delivered',        time: '2026-06-25 04:30 PM', desc: 'Delivered, unloaded, and weight slips exchanged.' },
    ],
  },
  {
    id: 'TXN-54890-IND', crop: 'Tomato', emoji: '🍅',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&h=150&fit=crop',
    quantity: '10 Quintals', price: '₹1,500/Q', totalAmount: 15000,
    buyer: 'Fresh Veggies Ltd', buyerRole: 'Vendor', seller: 'Suresh Kumar', sellerRole: 'Farmer',
    date: '2026-06-24', paymentStatus: 'Cancelled', paymentMethod: 'Cash on Delivery',
    deliveryStatus: 'Cancelled', location: 'Lucknow Mandi, Uttar Pradesh',
    notes: 'Hybrid red tomatoes. Cancelled due to transport logistics disruption.',
    activityLog: [
      { status: 'Order Placed', time: '2026-06-24 08:00 AM', desc: 'Farmer Suresh listed fresh tomatoes.' },
      { status: 'Cancelled',    time: '2026-06-24 12:00 PM', desc: 'Order cancelled. Freight truck met with road delays, perishable items could not be sent in time.' },
    ],
  },
  {
    id: 'TXN-43180-IND', crop: 'Potato', emoji: '🥔',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82ber633?w=200&h=150&fit=crop',
    quantity: '100 Quintals', price: '₹1,100/Q', totalAmount: 110000,
    buyer: 'SnackBites Crisps', buyerRole: 'Vendor', seller: 'Raj Patel (You)', sellerRole: 'Farmer',
    date: '2026-06-22', paymentStatus: 'Completed', paymentMethod: 'Bank Transfer (RTGS)',
    deliveryStatus: 'Delivered', location: 'Gujarat Cold Storage, Deesa',
    notes: 'Kufri Chipsona variety. Large size, low sugar, ideal for chips.',
    activityLog: [
      { status: 'Order Placed',     time: '2026-06-22 10:00 AM', desc: 'Order placed by SnackBites procurement agent.' },
      { status: 'Payment Received', time: '2026-06-22 11:30 AM', desc: 'RTGS transfer of ₹1,10,000 confirmed by bank.' },
      { status: 'Dispatched',       time: '2026-06-22 04:00 PM', desc: 'Dispatched to cold chain transit.' },
      { status: 'Delivered',        time: '2026-06-23 09:30 AM', desc: 'Delivered at Deesa plant. Quality inspection approved.' },
    ],
  },
  {
    id: 'TXN-32984-IND', crop: 'Onion', emoji: '🧅',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200&h=150&fit=crop',
    quantity: '60 Quintals', price: '₹1,800/Q', totalAmount: 108000,
    buyer: 'Metro Supermarket', buyerRole: 'Vendor', seller: 'Raj Patel (You)', sellerRole: 'Farmer',
    date: '2026-06-20', paymentStatus: 'Pending', paymentMethod: 'Bank Transfer (NEFT)',
    deliveryStatus: 'Processing', location: 'Lasalgaon Mandi, Nashik',
    notes: 'Light red summer onion. Sorted and cured properly.',
    activityLog: [
      { status: 'Order Placed', time: '2026-06-20 12:00 PM', desc: 'Metro Supermarket procurement confirmed order.' },
      { status: 'Processing',   time: '2026-06-21 08:00 AM', desc: 'Sorting and quality separation underway.' },
    ],
  },
];

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

// ── Skeleton loader row ──────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="tx-skel-row">
      {['sm', 'md', 'sm', 'sm', 'md', 'md', 'sm'].map((size, i) => (
        <div key={i} className={`tx-skel-cell tx-skel-cell--${size} tx-shimmer`} />
      ))}
    </div>
  );
}

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
function TransactionDetailModal({ txn, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!txn) return null;

  const detailRows = [
    { label: 'Crop Name',      value: `${txn.emoji} ${txn.crop}` },
    { label: 'Quantity',       value: txn.quantity },
    { label: 'Price Per Unit', value: txn.price },
    { label: 'Total Amount',   value: `₹${txn.totalAmount.toLocaleString('en-IN')}`, highlight: true },
    { label: 'Seller (Farmer)', value: txn.seller,          labelBadge: txn.sellerRole },
    { label: 'Buyer',          value: txn.buyer,            labelBadge: txn.buyerRole },
    { label: 'Payment Method', value: txn.paymentMethod },
    { label: 'Payment Status', value: txn.paymentStatus,    status: 'payment' },
    { label: 'Delivery Status',value: txn.deliveryStatus,   status: 'delivery' },
    { label: 'Location Yard',  value: txn.location },
  ];

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div className="tx-modal" onClick={(e) => e.stopPropagation()}>

        {/* Modal header */}
        <div className="tx-modal-header">
          <div className="tx-modal-title-row">
            <div>
              <span className="tx-modal-id-badge">{txn.id}</span>
              <h2 className="tx-modal-title">{txn.emoji} {txn.crop} Sale</h2>
            </div>
            <button className="tx-modal-close-btn" onClick={onClose}>✕</button>
          </div>
          <p className="tx-modal-subtitle">Transaction processed on {txn.date}</p>
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
              <TransactionNotes notes={txn.notes} />
            </div>

            {/* Right: Activity timeline */}
            <div className="tx-modal-timeline-col">
              <h3 className="tx-modal-sec-title">⏱️ Shipment &amp; Activity Log</h3>
              <div className="tx-timeline">
                {txn.activityLog.map((log, i) => (
                  <div key={i} className="tx-timeline-step">
                    <div className="tx-timeline-marker">
                      <div className="tx-timeline-dot" />
                      {i < txn.activityLog.length - 1 && <div className="tx-timeline-line" />}
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
            onClick={() => alert('Invoice PDF download triggered (UI Stub).')}
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

// ── Stats summary cards ──────────────────────────────────────────────────────
function StatCard({ icon, value, label, trend }) {
  return (
    <Card className="tx-stat-card">
      <div className="tx-stat-card-top">
        <span className="tx-stat-icon-wrap">{icon}</span>
        <span className="tx-stat-trend">{trend}</span>
      </div>
      <div className="tx-stat-value">{value}</div>
      <div className="tx-stat-label">{label}</div>
    </Card>
  );
}

// ── Page header illustration ─────────────────────────────────────────────────
function HeaderIllustration() {
  return (
    <svg viewBox="0 0 220 160" className="tx-illus-svg" aria-hidden="true">
      <defs>
        <linearGradient id="txSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8F5E9" />
          <stop offset="100%" stopColor="#C8E6C9" />
        </linearGradient>
        <linearGradient id="txField" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <rect width="220" height="160" fill="url(#txSky)" rx="16" />
      <circle cx="190" cy="36" r="18" fill="#FFD54F" opacity="0.9" />
      <ellipse cx="60" cy="30" rx="24" ry="10" fill="white" opacity="0.8" />
      <ellipse cx="120" cy="40" rx="20" ry="8" fill="white" opacity="0.65" />
      <rect x="0" y="110" width="220" height="50" fill="url(#txField)" />
      <g transform="translate(85,60)">
        <rect x="0" y="0" width="50" height="52" rx="6" fill="#ECEFF1" stroke="#CFD8DC" strokeWidth="2" />
        <rect x="5" y="5" width="40" height="42" rx="4" fill="#CFD8DC" />
        <circle cx="25" cy="26" r="12" fill="#FFD54F" stroke="#F9A825" strokeWidth="2.5" />
        <circle cx="25" cy="26" r="6" fill="#FFA000" />
        <line x1="25" y1="8" x2="25" y2="14" stroke="#F9A825" strokeWidth="2" />
        <line x1="25" y1="38" x2="25" y2="44" stroke="#F9A825" strokeWidth="2" />
        <line x1="7" y1="26" x2="13" y2="26" stroke="#F9A825" strokeWidth="2" />
        <line x1="37" y1="26" x2="43" y2="26" stroke="#F9A825" strokeWidth="2" />
      </g>
      {[12, 45, 160, 202].map((x, i) => (
        <g key={i} transform={`translate(${x},98)`}>
          <line x1="0" y1="14" x2="0" y2="2" stroke="#1B5E20" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="4" ry="7" fill="#43A047" />
        </g>
      ))}
      <rect x="145" y="105" width="62" height="34" rx="8" fill="white" opacity="0.95" />
      <text x="154" y="119" fontSize="7" fill="#2E7D32" fontWeight="700" fontFamily="Poppins,sans-serif">🛡️ SECURED</text>
      <text x="154" y="130" fontSize="6.5" fill="#78909C" fontFamily="Poppins,sans-serif">Transactions</text>
    </svg>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onReset }) {
  return (
    <div className="tx-empty-state">
      <span className="tx-empty-icon">🔍</span>
      <h3>No records found</h3>
      <p>Try modifying your search or reset the filters.</p>
      <button className="tx-btn tx-btn--primary" onClick={onReset}>Reset All Filters</button>
    </div>
  );
}

// ── Table row ────────────────────────────────────────────────────────────────
function TransactionRow({ t, onView }) {
  const counterparty = t.buyer.includes('You') ? t.seller     : t.buyer;
  const counterRole  = t.buyer.includes('You') ? t.sellerRole : t.buyerRole;
  return (
    <tr className="tx-row">
      <td className="tx-cell-id">{t.id}</td>
      <td>
        <div className="tx-crop-cell">
          <span className="tx-crop-emoji">{t.emoji}</span>
          <span className="tx-crop-name">{t.crop}</span>
        </div>
      </td>
      <td>{t.quantity}</td>
      <td>{t.price}</td>
      <td className="tx-cell-amount">₹{t.totalAmount.toLocaleString('en-IN')}</td>
      <td>
        <div className="tx-party-cell">
          <span className="tx-party-name">{counterparty}</span>
          <span className={`tx-role-badge tx-role--${counterRole.toLowerCase()}`}>{counterRole}</span>
        </div>
      </td>
      <td className="tx-cell-date">{t.date}</td>
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

  /* ── Loading simulation ── */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  /* ── Toast helper ── */
  const triggerToast = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

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
  const filteredTxns = TRANSACTION_RECORDS
    .filter((t) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!t.id.toLowerCase().includes(q) &&
            !t.crop.toLowerCase().includes(q) &&
            !t.buyer.toLowerCase().includes(q) &&
            !t.seller.toLowerCase().includes(q)) return false;
      }
      if (cropFilter     !== 'All' && t.crop            !== cropFilter)     return false;
      if (paymentFilter  !== 'All' && t.paymentStatus   !== paymentFilter)  return false;
      if (deliveryFilter !== 'All' && t.deliveryStatus  !== deliveryFilter) return false;
      if (selectedDate   && t.date !== selectedDate) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'Newest First')   return new Date(b.date) - new Date(a.date);
      if (sortBy === 'Oldest First')   return new Date(a.date) - new Date(b.date);
      if (sortBy === 'Highest Amount') return b.totalAmount - a.totalAmount;
      if (sortBy === 'Lowest Amount')  return a.totalAmount - b.totalAmount;
      return 0;
    });

  /* ── Summary statistics ── */
  const statsSummary = TRANSACTION_RECORDS.reduce(
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
    { totalRevenue: 0, totalCropsSold: 0, totalTxns: TRANSACTION_RECORDS.length,
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
      <div className="tx-root">
        {notification && <ToastNotification notification={notification} />}
        <Navbar
          user={currentUser}
          onToggleSidebar={() => setSidebarOpen(o => !o)}
          notificationSlot={<NotificationBell notifications={[]} />}
        />
        <div className="tx-layout">
          <Sidebar collapsed={!sidebarOpen} onToggleCollapse={() => setSidebarOpen(o => !o)} activeItem="transactions" />
          <main className="tx-main">
            <header className="tx-header" style={{ padding: '24px 32px 10px' }}>
              <h1 className="tx-header-title" style={{ margin: 0, fontSize: '26px', fontWeight: 800 }}>
                📜 Vendor Transaction History
              </h1>
              <p className="tx-header-subtitle" style={{ margin: '4px 0 0', color: '#6B8C6B', fontSize: '14px' }}>
                Manage and audit your commercial purchases from farmers and fulfillment sales to customers.
              </p>
            </header>
            <VendorTransactionHistory />
          </main>
        </div>
      </div>
    );
  }

  /* ── Farmer / Customer view ── */
  return (
    <div className="tx-root">

      {/* Toast */}
      {notification && <ToastNotification notification={notification} />}

      {/* Details Modal */}
      {selectedTxn && (
        <TransactionDetailModal txn={selectedTxn} onClose={() => setSelectedTxn(null)} />
      )}

      {/* Navbar */}
      <Navbar
        user={currentUser}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        notificationSlot={<NotificationBell notifications={[]} />}
      />

      {/* Layout */}
      <div className="tx-layout">

        {/* Sidebar */}
        <Sidebar
          collapsed={!sidebarOpen}
          onToggleCollapse={() => setSidebarOpen(o => !o)}
          activeItem="transactions"
        />

        {/* Main */}
        <main className="tx-main">

          {/* Page header banner */}
          <div className="tx-page-header">
            <div className="tx-header-content">
              <div className="tx-header-text">
                <div className="tx-breadcrumb">Marketplace / <span>Transaction History</span></div>
                <h1 className="tx-page-title">📜 Transaction History</h1>
                <p className="tx-page-subtitle">
                  Track all crop buying and selling transactions, invoice details, payments, and delivery log records.
                </p>
              </div>
              <div className="tx-header-illustration">
                <HeaderIllustration />
              </div>
            </div>
          </div>

          {/* Summary stat cards */}
          <div className="tx-stats-grid">
            {STAT_CARDS.map((card, i) => (
              <StatCard key={i} {...card} />
            ))}
          </div>

          {/* Payment summary + Actions row */}
          <div className="tx-summary-details-row">

            <Card className="tx-card tx-summary-card">
              <h2 className="tx-card-title">💵 Payment Summary</h2>
              <p className="tx-card-desc">Current financial breakdowns for your farm accounts</p>
              <div className="tx-payment-grid">
                {PAYMENT_BREAKDOWN.map((p, i) => (
                  <div key={i} className="tx-payment-item" style={{ background: p.color }}>
                    <span className="tx-payment-val" style={{ color: p.text }}>{p.value}</span>
                    <span className="tx-payment-lbl">{p.label}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="tx-card tx-action-card">
              <h2 className="tx-card-title">⚡ Actions &amp; Reporting</h2>
              <p className="tx-card-desc">Download financial log sheets and statements</p>
              <div className="tx-btn-group">
                {[
                  { label: '📄 Download PDF Invoice', type: 'PDF' },
                  { label: '📊 Download Excel Sheet', type: 'Excel' },
                  { label: '📈 Export CSV Report',    type: 'CSV' },
                ].map((btn) => (
                  <button key={btn.type} className="tx-btn tx-btn--outline" onClick={() => handleExport(btn.type)}>
                    {btn.label}
                  </button>
                ))}
                <button className="tx-btn tx-btn--primary" onClick={() => window.print()}>
                  🖨️ Print Statement
                </button>
              </div>
            </Card>

          </div>

          {/* Search & Filters */}
          <Card className="tx-card tx-filters-section">
            <div className="tx-filters-top">
              <div className="tx-search-bar">
                <span className="tx-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search by ID, crop name, buyer or seller..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="tx-search-input"
                />
                {searchQuery && (
                  <button className="tx-search-clear" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
              <button className="tx-reset-btn" onClick={handleResetFilters}>🔄 Clear Filters</button>
            </div>

            <div className="tx-filters-grid">
              {FILTER_FIELDS.map((field) => (
                <div key={field.label} className="tx-filter-field">
                  <label className="tx-filter-label">{field.label}</label>
                  {field.type === 'date' ? (
                    <input
                      type="date"
                      className="tx-input-date"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  ) : (
                    <select
                      className="tx-select"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Transaction Table */}
          <Card className="tx-card tx-table-card">
            <div className="tx-table-header">
              <h2 className="tx-card-title">📜 Transaction Log</h2>
              <span className="tx-results-badge">{filteredTxns.length} records found</span>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="tx-skeleton-table">
                {[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}
              </div>
            )}

            {/* Empty */}
            {!isLoading && filteredTxns.length === 0 && (
              <EmptyState onReset={handleResetFilters} />
            )}

            {/* Table */}
            {!isLoading && filteredTxns.length > 0 && (
              <div className="tx-table-responsive">
                <table className="tx-table">
                  <thead>
                    <tr>
                      {TABLE_HEADERS.map((h) => (
                        <th key={h} className={h === 'Action' ? 'tx-text-center' : ''}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTxns.map((t) => (
                      <TransactionRow key={t.id} t={t} onView={setSelectedTxn} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Footer */}
          <Footer />

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
