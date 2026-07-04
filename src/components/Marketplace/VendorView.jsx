import React, { useState, useCallback } from 'react';
import './VendorView.css';
import SearchBar from './SearchBar';
import SummaryCards from './SummaryCards';
import VendorTransactionHistory from './VendorTransactionHistory';

// ============================================================================
// REALISTIC DUMMY DATA FOR THE VENDOR DESK
// ============================================================================

const INITIAL_FARMER_LISTINGS = [
  {
    id: 'fl-1',
    farmerName: 'Om Bhudhara',
    farmerAvatar: 'OB',
    farmerVerified: true,
    farmerRating: 4.9,
    farmerReviews: 124,
    cropName: 'Premium Bt Cotton',
    cropImage: '☁️',
    category: 'Cotton',
    stock: 850,
    unit: 'Quintal',
    price: 6500,
    location: 'Rajkot, Gujarat',
    harvestDate: '2026-11-15',
    organic: true,
    delivery: true,
    phone: '+91 98765 43210'
  },
  {
    id: 'fl-2',
    farmerName: 'Raj Patel',
    farmerAvatar: 'RP',
    farmerVerified: true,
    farmerRating: 4.8,
    farmerReviews: 96,
    cropName: 'Sharbati Wheat',
    cropImage: '🌾',
    category: 'Wheat',
    stock: 620,
    unit: 'Quintal',
    price: 2350,
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-04-10',
    organic: false,
    delivery: true,
    phone: '+91 87654 32109'
  },
  {
    id: 'fl-3',
    farmerName: 'Mahesh Chauhan',
    farmerAvatar: 'MC',
    farmerVerified: true,
    farmerRating: 4.7,
    farmerReviews: 82,
    cropName: 'Organic Basmati Rice',
    cropImage: '🍚',
    category: 'Rice',
    stock: 300,
    unit: 'Quintal',
    price: 4800,
    location: 'Karnal, Haryana',
    harvestDate: '2026-10-05',
    organic: true,
    delivery: true,
    phone: '+91 76543 21098'
  },
  {
    id: 'fl-4',
    farmerName: 'Ramesh Solanki',
    farmerAvatar: 'RS',
    farmerVerified: false,
    farmerRating: 4.4,
    farmerReviews: 38,
    cropName: 'Kharif Groundnut Bold',
    cropImage: '🥜',
    category: 'Groundnut',
    stock: 450,
    unit: 'Quintal',
    price: 5200,
    location: 'Junagadh, Gujarat',
    harvestDate: '2026-09-20',
    organic: false,
    delivery: false,
    phone: '+91 65432 10987'
  },
  {
    id: 'fl-5',
    farmerName: 'Raj Patel',
    farmerAvatar: 'RP',
    farmerVerified: true,
    farmerRating: 4.8,
    farmerReviews: 96,
    cropName: 'Yellow Maize Dent',
    cropImage: '🌽',
    category: 'Maize',
    stock: 550,
    unit: 'Quintal',
    price: 1900,
    location: 'Nashik, Maharashtra',
    harvestDate: '2026-12-01',
    organic: false,
    delivery: true,
    phone: '+91 87654 32109'
  }
];

const INITIAL_INVENTORY = [
  {
    id: 'inv-1',
    cropImage: '🌾',
    cropName: 'Sharbati Wheat',
    purchasedQty: 300,
    remainingStock: 180,
    purchasePrice: 2200,
    sellingPrice: 2600,
    supplierName: 'Raj Patel',
    purchaseDate: '2026-06-15'
  },
  {
    id: 'inv-2',
    cropImage: '🍚',
    cropName: 'Basmati Rice',
    purchasedQty: 150,
    remainingStock: 120,
    purchasePrice: 4500,
    sellingPrice: 5200,
    supplierName: 'Mahesh Chauhan',
    purchaseDate: '2026-06-20'
  },
  {
    id: 'inv-3',
    cropImage: '☁️',
    cropName: 'Bt Cotton',
    purchasedQty: 400,
    remainingStock: 400,
    purchasePrice: 6200,
    sellingPrice: 7100,
    supplierName: 'Om Bhudhara',
    purchaseDate: '2026-06-28'
  }
];

const INITIAL_PURCHASE_REQUESTS = [
  {
    id: 'req-1',
    cropName: 'Sharbati Wheat',
    cropImage: '🌾',
    qty: 150,
    price: 2300,
    farmerName: 'Raj Patel',
    status: 'Pending'
  },
  {
    id: 'req-2',
    cropName: 'Kharif Groundnut',
    cropImage: '🥜',
    qty: 100,
    price: 5100,
    farmerName: 'Ramesh Solanki',
    status: 'Approved'
  }
];

const RECENT_PURCHASES = [
  { id: 'txn-001', cropName: 'Bt Cotton', farmerName: 'Om Bhudhara', quantity: '100 Q', price: '₹6,50,000', date: '2026-06-28', paymentStatus: 'Paid' },
  { id: 'txn-002', cropName: 'Basmati Rice', farmerName: 'Mahesh Chauhan', quantity: '50 Q', price: '₹2,40,000', date: '2026-06-20', paymentStatus: 'Paid' },
  { id: 'txn-003', cropName: 'Sharbati Wheat', farmerName: 'Raj Patel', quantity: '80 Q', price: '₹1,88,000', date: '2026-06-15', paymentStatus: 'Pending' }
];

const ACTIVITIES = [
  { id: 1, text: 'Purchased 100 Q Bt Cotton from Om Bhudhara.', time: '2 hours ago', type: 'purchase' },
  { id: 2, text: 'Farmer Ramesh Solanki listed a new Groundnut batch.', time: '4 hours ago', type: 'listing' },
  { id: 3, text: 'Inventory stock for Basmati Rice updated by system.', time: '1 day ago', type: 'system' },
  { id: 4, text: 'Customer Neha Patel bought 10 Q Sharbati Wheat from your stock.', time: '2 days ago', type: 'sale' }
];

const CATEGORIES = ['All', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize'];
const SORT_OPTIONS = ['Latest', 'Lowest Price', 'Highest Rating', 'Most Stock'];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function VendorView() {
  // States
  const [farmersList, setFarmersList] = useState(INITIAL_FARMER_LISTINGS);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [purchaseRequests, setPurchaseRequests] = useState(INITIAL_PURCHASE_REQUESTS);
  const [activeTab, setActiveTab] = useState('farmers');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [organicFilter, setOrganicFilter] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState(false);
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('Latest');
  const [toast, setToast] = useState(null);

  // Modals
  const [buyModal, setBuyModal] = useState(null);
  const [buyForm, setBuyForm] = useState({ quantity: '', message: '' });
  const [editInventoryModal, setEditInventoryModal] = useState(null);
  const [editInventoryForm, setEditInventoryForm] = useState({ remainingStock: '', sellingPrice: '' });
  const [viewDetailsModal, setViewDetailsModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handlers
  const handleBuyClick = (listing) => {
    setBuyModal(listing);
    setBuyForm({ quantity: '', message: '' });
  };

  const handleBuySubmit = () => {
    if (!buyForm.quantity || Number(buyForm.quantity) <= 0) {
      showToast('Please enter a valid quantity.', 'error');
      return;
    }
    if (Number(buyForm.quantity) > buyModal.stock) {
      showToast('Requested quantity exceeds available stock.', 'error');
      return;
    }

    // Add to Purchase Requests
    const newRequest = {
      id: `req-${Date.now()}`,
      cropName: buyModal.cropName,
      cropImage: buyModal.cropImage,
      qty: Number(buyForm.quantity),
      price: buyModal.price,
      farmerName: buyModal.farmerName,
      status: 'Pending'
    };
    setPurchaseRequests(prev => [newRequest, ...prev]);

    // System deduct simulation
    setFarmersList(prev => prev.map(f => f.id === buyModal.id ? { ...f, stock: f.stock - Number(buyForm.quantity) } : f));

    setBuyModal(null);
    showToast(`Purchase request for ${buyForm.quantity} Q of ${buyModal.cropName} sent!`);
  };

  const handleCancelRequest = (reqId) => {
    setPurchaseRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Purchase request cancelled.', 'error');
  };

  const handleEditInventoryClick = (item) => {
    setEditInventoryModal(item);
    setEditInventoryForm({
      remainingStock: item.remainingStock,
      sellingPrice: item.sellingPrice
    });
  };

  const handleEditInventorySubmit = () => {
    if (Number(editInventoryForm.remainingStock) < 0 || Number(editInventoryForm.sellingPrice) <= 0) {
      showToast('Please enter valid stock and price details.', 'error');
      return;
    }
    setInventory(prev => prev.map(item => item.id === editInventoryModal.id ? {
      ...item,
      remainingStock: Number(editInventoryForm.remainingStock),
      sellingPrice: Number(editInventoryForm.sellingPrice)
    } : item));
    setEditInventoryModal(null);
    showToast('Inventory updated successfully!');
  };

  const handleRemoveInventory = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    showToast('Inventory item removed.', 'error');
  };

  const handleReviewClick = (listing) => {
    setReviewModal(listing);
    setReviewForm({ rating: 5, reviewText: '' });
  };

  const handleReviewSubmit = () => {
    if (!reviewForm.reviewText.trim()) {
      showToast('Please write a review.', 'error');
      return;
    }
    showToast(`Review submitted to ${reviewModal.farmerName}!`);
    setReviewModal(null);
  };

  // Filter / Sort logic
  const filteredListings = farmersList
    .filter(listing => {
      const query = searchTerm.toLowerCase();
      const matchesSearch = 
        listing.cropName.toLowerCase().includes(query) ||
        listing.farmerName.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query);

      const matchesCategory = activeCategory === 'All' || listing.category === activeCategory;
      const matchesLocation = !locationFilter || listing.location.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesOrganic = !organicFilter || listing.organic;
      const matchesDelivery = !deliveryFilter || listing.delivery;
      const matchesVerified = !verifiedFilter || listing.farmerVerified;

      return matchesSearch && matchesCategory && matchesLocation && matchesOrganic && matchesDelivery && matchesVerified;
    })
    .sort((a, b) => {
      if (sortBy === 'Lowest Price') return a.price - b.price;
      if (sortBy === 'Highest Rating') return b.farmerRating - a.farmerRating;
      if (sortBy === 'Most Stock') return b.stock - a.stock;
      return b.id.localeCompare(a.id); // Latest
    });

  // Totals calculations
  const totalPurchasesAmount = RECENT_PURCHASES.reduce((acc, curr) => {
    const val = parseInt(curr.price.replace(/[^\d]/g, ''), 10);
    return acc + val;
  }, 0);

  const inventoryValue = inventory.reduce((acc, curr) => acc + (curr.remainingStock * curr.sellingPrice), 0);

  const summaryCardsData = [
    { icon: '🌾', label: 'Farmer Listings', value: filteredListings.length, color: '#2E7D32', sub: 'Verified growers nearby' },
    { icon: '📦', label: 'My Inventory', value: `${inventory.reduce((a,b)=>a+b.remainingStock,0)} Q`, color: '#1565C0', sub: 'In commercial stock' },
    { icon: '💰', label: 'Total Purchases', value: `₹${(totalPurchasesAmount / 100000).toFixed(1)}L`, color: '#E65100', sub: 'Procurement ledger' },
    { icon: '💬', label: 'New Messages', value: '4', color: '#6A1B9A', sub: 'Farmer negotiations' }
  ];

  return (
    <div className="vv-root">
      {/* Toast Alert */}
      {toast && (
        <div className={`vv-toast vv-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Page Header Area */}
      <div className="vv-hero-section">
        <div className="vv-hero-content">
          <div className="vv-hero-text">
            <div className="vv-hero-tag">🏪 Partner Portal</div>
            <h1 className="vv-hero-title">Vendor Marketplace</h1>
            <p className="vv-hero-subtitle">
              Purchase crops directly from farmers, manage your agricultural inventory, fulfill customer demand, and grow your business.
            </p>
          </div>
          <div className="vv-hero-illustration">
            <div className="vv-illus-scene">
              <span className="vv-illus-sun">☀️</span>
              <span className="vv-illus-cloud">☁️</span>
              <span className="vv-illus-barn">🏪</span>
              <span className="vv-illus-truck">🚚</span>
              <span className="vv-illus-plant">🌱</span>
            </div>
          </div>
        </div>
        <div className="vv-hero-wave" />
      </div>

      {/* Statistics Block */}
      <SummaryCards cards={summaryCardsData} />

      {/* Tabs */}
      <div className="vv-tabs-bar">
        <button className={`vv-tab-btn ${activeTab === 'farmers' ? 'active' : ''}`} onClick={() => setActiveTab('farmers')}>
          🌾 Farmer Crop Listings
        </button>
        <button className={`vv-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>
          📦 My Inventory
        </button>
        <button className={`vv-tab-btn ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
          ⏳ Purchase Requests ({purchaseRequests.length})
        </button>
        <button className={`vv-tab-btn ${activeTab === 'recent' ? 'active' : ''}`} onClick={() => setActiveTab('recent')}>
          📜 Transaction History
        </button>
        <button className={`vv-tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
          ⚡ Activity Center
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      {activeTab === 'farmers' && (
        <div className="vv-filters-wrapper">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search crops, farmers or locations..." 
          />

          <div className="vv-additional-filters">
            <input 
              type="text" 
              placeholder="Filter by Location..." 
              className="vv-input-filter"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            />

            <select className="vv-select-filter" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <label className="vv-checkbox-filter">
              <input type="checkbox" checked={organicFilter} onChange={e => setOrganicFilter(e.target.checked)} />
              🌿 Organic
            </label>

            <label className="vv-checkbox-filter">
              <input type="checkbox" checked={deliveryFilter} onChange={e => setDeliveryFilter(e.target.checked)} />
              🚚 Delivery
            </label>

            <label className="vv-checkbox-filter">
              <input type="checkbox" checked={verifiedFilter} onChange={e => setVerifiedFilter(e.target.checked)} />
              ✓ Verified Only
            </label>
          </div>

          <div className="vv-category-row">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`vv-cat-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB SUBSECTIONS */}
      <div className="vv-tab-content-area">
        {activeTab === 'farmers' && (
          <div>
            <div className="vv-section-info">
              <h2>🌾 Farmer Crop Listings</h2>
              <p>{filteredListings.length} matching lists available</p>
            </div>

            {filteredListings.length === 0 ? (
              <div className="vv-empty-container">
                <span>🌾</span>
                <p>No agricultural listings found matching your search.</p>
              </div>
            ) : (
              <div className="vv-farmers-listings-grid">
                {filteredListings.map(listing => (
                  <div key={listing.id} className="vv-farmer-listing-card">
                    <div className="vv-farmer-card-top">
                      <div className="vv-farmer-avatar-circle">{listing.farmerAvatar}</div>
                      <div className="vv-farmer-desc-block">
                        <div className="vv-farmer-row-name">
                          <span className="vv-farmer-name">{listing.farmerName}</span>
                          {listing.farmerVerified && <span className="vv-verified-stamp">✓ Verified</span>}
                        </div>
                        <div className="vv-farmer-stars">⭐ {listing.farmerRating} ({listing.farmerReviews} reviews)</div>
                      </div>
                      <span className="vv-crop-avatar-icon">{listing.cropImage}</span>
                    </div>

                    <h3 className="vv-crop-title-name">{listing.cropName}</h3>
                    <span className="vv-category-pill">{listing.category}</span>

                    <div className="vv-crop-numbers">
                      <div className="vv-crop-price-val">₹{listing.price.toLocaleString()}<span>/Quintal</span></div>
                      <div className="vv-crop-stock-val">Available: <strong>{listing.stock} Q</strong></div>
                    </div>

                    <div className="vv-crop-extra-details">
                      <div>📍 {listing.location}</div>
                      <div>🗓️ Harvest: {listing.harvestDate}</div>
                    </div>

                    <div className="vv-crop-card-badges">
                      {listing.organic && <span className="badge-org">🌿 Organic</span>}
                      {listing.delivery && <span className="badge-del">🚚 Delivery</span>}
                    </div>

                    <div className="vv-listing-action-buttons">
                      <button className="btn-buy" onClick={() => handleBuyClick(listing)}>🛒 Buy Crop</button>
                      <button className="btn-sub" onClick={() => showToast(`Negotiations opened with ${listing.farmerName}`)}>💬 Message</button>
                      <button className="btn-sub" onClick={() => showToast(`Call details: ${listing.phone}`)}>📞 Contact</button>
                      <button className="btn-sub" onClick={() => showToast('Opening farmer details... (Stub)')}>👤 Profile</button>
                      <button className="btn-sub" onClick={() => handleReviewClick(listing)}>⭐ Review</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === 'inventory' && (
          <div>
            <div className="vv-section-info">
              <h2>📦 Vendor Inventory Management</h2>
              <p>Commercial stock holdings & pricing matrix</p>
            </div>

            <div className="vv-farmers-listings-grid">
              {inventory.map(item => (
                <div key={item.id} className="vv-inventory-card">
                  <div className="vv-inventory-top">
                    <span className="vv-inventory-img">{item.cropImage}</span>
                    <h3>{item.cropName}</h3>
                  </div>

                  <div className="vv-inventory-stats">
                    <div className="vv-inv-stat">
                      <span className="label">Remaining Stock</span>
                      <span className="val">{item.remainingStock} Q</span>
                    </div>
                    <div className="vv-inv-stat">
                      <span className="label">Procured Quantity</span>
                      <span className="val">{item.purchasedQty} Q</span>
                    </div>
                    <div className="vv-inv-stat">
                      <span className="label">Buy Cost</span>
                      <span className="val">₹{item.purchasePrice}/Q</span>
                    </div>
                    <div className="vv-inv-stat">
                      <span className="label">Sell Price</span>
                      <span className="val highlight">₹{item.sellingPrice}/Q</span>
                    </div>
                  </div>

                  <div className="vv-inv-meta">
                    <div>👤 Supplier: {item.supplierName}</div>
                    <div>📅 Bought on: {item.purchaseDate}</div>
                  </div>

                  <div className="vv-inventory-actions">
                    <button className="btn-edit" onClick={() => handleEditInventoryClick(item)}>✏️ Edit Stock</button>
                    <button className="btn-remove" onClick={() => handleRemoveInventory(item.id)}>🗑️ Remove</button>
                    <button className="btn-details" onClick={() => setViewDetailsModal(item)}>👁️ View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REQUESTS */}
        {activeTab === 'requests' && (
          <div>
            <div className="vv-section-info">
              <h2>⏳ Procurement Requests</h2>
              <p>Outstanding procurement offers sent to growers</p>
            </div>

            <div className="vv-requests-grid-list">
              {purchaseRequests.map(req => (
                <div key={req.id} className="vv-request-row-card">
                  <span className="crop-img">{req.cropImage}</span>
                  <div className="req-core-info">
                    <h4>{req.cropName}</h4>
                    <p>Offer: <strong>₹{req.price}/Q</strong> for <strong>{req.qty} Quintals</strong></p>
                  </div>
                  <div className="req-party">
                    <span>Farmer:</span>
                    <strong>{req.farmerName}</strong>
                  </div>
                  <span className={`req-status-pill status-${req.status.toLowerCase()}`}>{req.status}</span>
                  <div className="req-row-actions">
                    <button className="btn-details" onClick={() => showToast('Opening details... (Stub)')}>View Details</button>
                    <button className="btn-cancel" onClick={() => handleCancelRequest(req.id)}>Cancel Request</button>
                  </div>
                </div>
              ))}
              {purchaseRequests.length === 0 && (
                <div className="vv-empty-container">
                  <span>⏳</span>
                  <p>No active purchase requests.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORIC PURCHASES */}
        {/* HISTORIC PURCHASES / SALES TRANSACTION DESK */}
        {activeTab === 'recent' && (
          <VendorTransactionHistory />
        )}

        {/* ACTIVITY FEED */}
        {activeTab === 'activity' && (
          <div>
            <div className="vv-section-info">
              <h2>⚡ System Activity Log</h2>
              <p>Real-time ecosystem updates & actions</p>
            </div>

            <div className="vv-activity-list-container">
              {ACTIVITIES.map(act => (
                <div key={act.id} className={`vv-activity-row-item type-${act.type}`}>
                  <span className="bullet">🔵</span>
                  <div className="info">
                    <p className="text">{act.text}</p>
                    <span className="time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick stats on the activity page */}
            <div className="vv-quick-stats-bottom">
              <h3>📊 Quick Performance Stats</h3>
              <div className="vv-quick-stats-grid">
                <div className="vv-quick-item">
                  <span className="label">Today's Purchases</span>
                  <span className="val">120 Q</span>
                </div>
                <div className="vv-quick-item">
                  <span className="label">Total Inventory Value</span>
                  <span className="val">₹{inventoryValue.toLocaleString()}</span>
                </div>
                <div className="vv-quick-item">
                  <span className="label">Pending Requests</span>
                  <span className="val">{purchaseRequests.filter(r=>r.status==='Pending').length}</span>
                </div>
                <div className="vv-quick-item">
                  <span className="label">Completed Deals</span>
                  <span className="val">28</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BUY MODAL */}
      {buyModal && (
        <div className="vv-modal-backdrop" onClick={() => setBuyModal(null)}>
          <div className="vv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="vv-modal-header-row">
              <h3>🛒 Order Crop Procurement</h3>
              <button className="close-btn" onClick={() => setBuyModal(null)}>✕</button>
            </div>
            <div className="vv-modal-body-section">
              <div className="vv-modal-item-preview">
                <span className="emoji">{buyModal.cropImage}</span>
                <div>
                  <h4>{buyModal.cropName}</h4>
                  <p>Listed by: <strong>{buyModal.farmerName}</strong></p>
                  <p>Rate: <strong>₹{buyModal.price}/Q</strong></p>
                </div>
              </div>

              <div className="modal-input-field">
                <label>Procurement Quantity (Quintals) *</label>
                <input 
                  type="number"
                  placeholder="e.g. 50"
                  value={buyForm.quantity}
                  onChange={e => setBuyForm(prev => ({ ...prev, quantity: e.target.value }))}
                />
                <span className="input-hint">Available: {buyModal.stock} Q</span>
              </div>

              <div className="modal-input-field">
                <label>Negotiation Message (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Ask for bulk discounts, logistics terms..."
                  value={buyForm.message}
                  onChange={e => setBuyForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              {buyForm.quantity && (
                <div className="total-calculation-box">
                  Estimated Total: <strong>₹{(buyModal.price * Number(buyForm.quantity)).toLocaleString()}</strong>
                </div>
              )}
            </div>
            <div className="vv-modal-footer-row">
              <button className="btn-cancel" onClick={() => setBuyModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleBuySubmit}>Place Procurement Order</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT INVENTORY MODAL */}
      {editInventoryModal && (
        <div className="vv-modal-backdrop" onClick={() => setEditInventoryModal(null)}>
          <div className="vv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="vv-modal-header-row">
              <h3>✏️ Edit Inventory Stock</h3>
              <button className="close-btn" onClick={() => setEditInventoryModal(null)}>✕</button>
            </div>
            <div className="vv-modal-body-section">
              <div className="vv-modal-item-preview">
                <span className="emoji">{editInventoryModal.cropImage}</span>
                <div>
                  <h4>{editInventoryModal.cropName}</h4>
                  <p>Procured Price: <strong>₹{editInventoryModal.purchasePrice}/Q</strong></p>
                </div>
              </div>

              <div className="modal-input-field">
                <label>Remaining Stock (Quintals) *</label>
                <input 
                  type="number"
                  value={editInventoryForm.remainingStock}
                  onChange={e => setEditInventoryForm(prev => ({ ...prev, remainingStock: e.target.value }))}
                />
              </div>

              <div className="modal-input-field">
                <label>Retail Selling Price per Quintal (₹) *</label>
                <input 
                  type="number"
                  value={editInventoryForm.sellingPrice}
                  onChange={e => setEditInventoryForm(prev => ({ ...prev, sellingPrice: e.target.value }))}
                />
              </div>
            </div>
            <div className="vv-modal-footer-row">
              <button className="btn-cancel" onClick={() => setEditInventoryModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleEditInventorySubmit}>Save Updates</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewDetailsModal && (
        <div className="vv-modal-backdrop" onClick={() => setViewDetailsModal(null)}>
          <div className="vv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="vv-modal-header-row">
              <h3>👁️ Inventory Details</h3>
              <button className="close-btn" onClick={() => setViewDetailsModal(null)}>✕</button>
            </div>
            <div className="vv-modal-body-section details-grid">
              <div className="detail-item"><span className="label">Crop</span><strong>{viewDetailsModal.cropImage} {viewDetailsModal.cropName}</strong></div>
              <div className="detail-item"><span className="label">Supplier Farmer</span><strong>{viewDetailsModal.supplierName}</strong></div>
              <div className="detail-item"><span className="label">Purchase Quantity</span><strong>{viewDetailsModal.purchasedQty} Q</strong></div>
              <div className="detail-item"><span className="label">Remaining Stock</span><strong>{viewDetailsModal.remainingStock} Q</strong></div>
              <div className="detail-item"><span className="label">Procurement Cost</span><strong>₹{viewDetailsModal.purchasePrice}/Q</strong></div>
              <div className="detail-item"><span className="label">Retail Selling Price</span><strong>₹{viewDetailsModal.sellingPrice}/Q</strong></div>
              <div className="detail-item"><span className="label">Purchase Date</span><strong>{viewDetailsModal.purchaseDate}</strong></div>
            </div>
            <div className="vv-modal-footer-row">
              <button className="btn-cancel" onClick={() => setViewDetailsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {reviewModal && (
        <div className="vv-modal-backdrop" onClick={() => setReviewModal(null)}>
          <div className="vv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="vv-modal-header-row">
              <h3>⭐ Rate Farmer Supplier</h3>
              <button className="close-btn" onClick={() => setReviewModal(null)}>✕</button>
            </div>
            <div className="vv-modal-body-section">
              <p>How was your procurement experience with <strong>{reviewModal.farmerName}</strong>?</p>
              
              <div className="modal-input-field">
                <label>Rating (1 to 5 Stars)</label>
                <select 
                  value={reviewForm.rating}
                  onChange={e => setReviewForm(prev => ({ ...prev, rating: Number(e.target.value) }))}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>

              <div className="modal-input-field">
                <label>Review Remarks *</label>
                <textarea 
                  rows={3}
                  placeholder="Share details about crop quality, sorting, and delivery timing..."
                  value={reviewForm.reviewText}
                  onChange={e => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
                />
              </div>
            </div>
            <div className="vv-modal-footer-row">
              <button className="btn-cancel" onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleReviewSubmit}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
