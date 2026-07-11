import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal/Modal';
import './FarmerView.css';
import SearchBar from './SearchBar';
import FilterBar from './FilterBar';
import SummaryCards from './SummaryCards';
import CropCard from './CropCard';
import { getMyListings, createListing, updateListing, deleteListing } from '../../services/mylistingService';

// ============================================================================
// DUMMY DATA — Replace with API calls when Node.js + MongoDB backend is ready
// JWT token will provide farmer identity; Socket.IO for real-time updates
// ============================================================================

// CROP_LISTINGS removed — listings now loaded from API via getMyListings()

const VENDOR_REQUESTS = [
  {
    id: 1, vendorName: 'Krishna Agro Traders', logo: 'KA', verified: true,
    location: 'Ahmedabad, Gujarat', crop: '☁️ Cotton', quantity: '200 Q',
    buyingPrice: 6400, rating: 4.8, reviews: 156,
    phone: '+91 98765 43210', status: 'Pending',
    message: 'Need 200 quintals of Bt cotton immediately for spinning mill.',
    date: 'Jun 30, 2026',
  },
  {
    id: 2, vendorName: 'Green Harvest Agro', logo: 'GH', verified: true,
    location: 'Rajkot, Gujarat', crop: '🌾 Wheat',
    quantity: '100 Q', buyingPrice: 2300, rating: 4.6, reviews: 89,
    phone: '+91 87654 32109', status: 'Pending',
    message: 'Regular wheat supply needed for flour processing unit.',
    date: 'Jun 29, 2026',
  },
  {
    id: 3, vendorName: 'AgroMart Gujarat', logo: 'AG', verified: true,
    location: 'Surat, Gujarat', crop: '🍚 Basmati Rice',
    quantity: '50 Q', buyingPrice: 4700, rating: 4.9, reviews: 210,
    phone: '+91 76543 21098', status: 'Accepted',
    message: 'Export-quality Basmati for overseas shipment next month.',
    date: 'Jun 27, 2026',
  },
];

const CUSTOMER_REQUESTS = [
  {
    id: 1, customerName: 'Rahul Shah', avatar: 'RS',
    location: 'Surat, Gujarat', crop: '🌾 Wheat',
    quantity: '10 Q', budget: 2400, rating: 4.5,
    phone: '+91 98700 11223', status: 'Pending',
    message: 'Need wheat for my bakery. Looking for Grade A quality.',
    date: 'Jun 30, 2026',
  },
  {
    id: 2, customerName: 'Amit Sharma', avatar: 'AS',
    location: 'Mumbai, Maharashtra', crop: '🍚 Basmati Rice',
    quantity: '5 Q', budget: 4800, rating: 4.7,
    phone: '+91 87600 22334', status: 'Pending',
    message: 'Organic Basmati for restaurant chain supply.',
    date: 'Jun 28, 2026',
  },
  {
    id: 3, customerName: 'Neha Patel', avatar: 'NP',
    location: 'Vadodara, Gujarat', crop: '☁️ Cotton',
    quantity: '20 Q', budget: 6300, rating: 4.3,
    phone: '+91 76500 33445', status: 'Accepted',
    message: 'Need desi cotton for handloom textile unit.',
    date: 'Jun 26, 2026',
  },
];

const TRANSACTIONS = [
  { id: 'TXN-84920', crop: '🌾 Wheat', buyer: 'AgroMart Gujarat', buyerType: 'Vendor', qty: '50 Q', price: '₹1,17,500', status: 'Completed', date: 'Jun 28, 2026' },
  { id: 'TXN-90210', crop: '🍚 Basmati Rice', buyer: 'Amit Sharma', buyerType: 'Customer', qty: '30 Q', price: '₹1,44,000', status: 'Shipped', date: 'Jun 27, 2026' },
  { id: 'TXN-65109', crop: '☁️ Cotton', buyer: 'Krishna Agro Traders', buyerType: 'Vendor', qty: '100 Q', price: '₹6,50,000', status: 'Completed', date: 'Jun 25, 2026' },
  { id: 'TXN-43180', crop: '🌽 Maize', buyer: 'Green Harvest Agro', buyerType: 'Vendor', qty: '80 Q', price: '₹1,52,000', status: 'Completed', date: 'Jun 22, 2026' },
  { id: 'TXN-32984', crop: '🥜 Groundnut', buyer: 'Rahul Shah', buyerType: 'Customer', qty: '5 Q', price: '₹26,000', status: 'Pending', date: 'Jun 20, 2026' },
];

const ACTIVITIES = [
  { id: 1, icon: '👁️', text: 'Rahul Shah viewed your Premium Bt Cotton listing', time: '10 minutes ago', type: 'view' },
  { id: 2, icon: '📩', text: 'Krishna Agro Traders sent a purchase request for Cotton', time: '45 minutes ago', type: 'request' },
  { id: 3, icon: '✅', text: 'Cotton shipment to AgroMart Gujarat confirmed successful', time: '2 hours ago', type: 'sale' },
  { id: 4, icon: '✏️', text: 'You updated your Basmati Rice listing price to ₹4,800/Q', time: '5 hours ago', type: 'update' },
  { id: 5, icon: '❤️', text: 'Neha Patel liked your Desi Cotton listing', time: 'Yesterday, 4:30 PM', type: 'like' },
  { id: 6, icon: '💬', text: 'New message from Amit Sharma about Basmati Rice supply', time: 'Yesterday, 2:00 PM', type: 'message' },
  { id: 7, icon: '🌾', text: 'Sharbati Wheat listing crossed 200 views milestone', time: '2 days ago', type: 'milestone' },
  { id: 8, icon: '📦', text: 'Maize order from Green Harvest Agro marked as delivered', time: '2 days ago', type: 'delivery' },
];

const CATEGORIES = ['All', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize'];
const SORT_OPTIONS = ['Latest', 'Highest Price', 'Lowest Price', 'Most Viewed'];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const VendorRequestCard = ({ req, onAccept, onReject, onMessage }) => (
  <div className="fv-request-card">
    <div className="fv-req-avatar fv-req-avatar--vendor">{req.logo}</div>
    <div className="fv-req-body">
      <div className="fv-req-top-row">
        <div className="fv-req-name-block">
          <span className="fv-req-name">{req.vendorName}</span>
          {req.verified && <span className="fv-verified-badge">✔ Verified</span>}
          <span className="fv-req-location">📍 {req.location}</span>
        </div>
        <span className={`fv-req-status-badge fv-req-status--${req.status.toLowerCase()}`}>{req.status}</span>
      </div>
      <div className="fv-req-details">
        <span>{req.crop}</span>
        <span>📦 {req.quantity}</span>
        <span>💰 ₹{req.buyingPrice}/Q</span>
        <span>⭐ {req.rating} ({req.reviews} reviews)</span>
        <span>📅 {req.date}</span>
      </div>
      <p className="fv-req-message">"{req.message}"</p>
      <div className="fv-req-actions">
        {req.status === 'Pending' && (
          <>
            <button className="fv-btn fv-btn--success fv-btn--sm" onClick={() => onAccept(req.id, 'vendor')}>✅ Accept</button>
            <button className="fv-btn fv-btn--danger fv-btn--sm" onClick={() => onReject(req.id, 'vendor')}>❌ Reject</button>
          </>
        )}
        <button className="fv-btn fv-btn--outline fv-btn--sm" onClick={() => onMessage(req)}>💬 Message</button>
        <button className="fv-btn fv-btn--outline fv-btn--sm" onClick={() => onMessage(req)}>📞 Contact</button>
        <button className="fv-btn fv-btn--ghost fv-btn--sm" onClick={() => onMessage(req)}>👤 Profile</button>
      </div>
    </div>
  </div>
);

const CustomerRequestCard = ({ req, onAccept, onReject, onMessage }) => (
  <div className="fv-request-card">
    <div className="fv-req-avatar fv-req-avatar--customer">{req.avatar}</div>
    <div className="fv-req-body">
      <div className="fv-req-top-row">
        <div className="fv-req-name-block">
          <span className="fv-req-name">{req.customerName}</span>
          <span className="fv-req-location">📍 {req.location}</span>
        </div>
        <span className={`fv-req-status-badge fv-req-status--${req.status.toLowerCase()}`}>{req.status}</span>
      </div>
      <div className="fv-req-details">
        <span>{req.crop}</span>
        <span>📦 {req.quantity}</span>
        <span>💰 Budget: ₹{req.budget}/Q</span>
        <span>⭐ {req.rating}</span>
        <span>📅 {req.date}</span>
      </div>
      <p className="fv-req-message">"{req.message}"</p>
      <div className="fv-req-actions">
        {req.status === 'Pending' && (
          <>
            <button className="fv-btn fv-btn--success fv-btn--sm" onClick={() => onAccept(req.id, 'customer')}>✅ Accept Order</button>
            <button className="fv-btn fv-btn--danger fv-btn--sm" onClick={() => onReject(req.id, 'customer')}>❌ Reject</button>
          </>
        )}
        <button className="fv-btn fv-btn--outline fv-btn--sm" onClick={() => onMessage(req)}>💬 Message</button>
        <button className="fv-btn fv-btn--outline fv-btn--sm" onClick={() => onMessage(req)}>📞 Contact</button>
        <button className="fv-btn fv-btn--ghost fv-btn--sm" onClick={() => onMessage(req)}>👤 Profile</button>
      </div>
    </div>
  </div>
);

// ============================================================================
// MODALS
// ============================================================================

const AddEditCropModal = ({ crop, onClose, onSave }) => {
  const [form, setForm] = useState(crop || {
    name: '', category: 'Cotton', stock: '', price: '', unit: 'Quintal',
    harvestDate: '', quality: 'Grade A', organic: false, delivery: true,
    location: '', desc: '', emoji: '🌾',
  });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Modal
      isOpen={true}
      title={crop ? 'Edit Crop Listing' : 'Add New Crop'}
      onClose={onClose}
      variant={crop ? 'default' : 'buy'}
      size="lg"
      actions={
        <>
          <button className="fv-btn fv-btn--outline" onClick={onClose}>Cancel</button>
          <button className="fv-btn fv-btn--primary" onClick={() => onSave(form)}>
            {crop ? '💾 Save Changes' : '✅ Add Listing'}
          </button>
        </>
      }
    >
      <div className="fv-modal-grid">
        <div className="fv-field">
          <label>Crop Name *</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Premium Bt Cotton" />
        </div>
        <div className="fv-field">
          <label>Category *</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}>
            {['Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize', 'Vegetables', 'Fruits', 'Pulses', 'Spices'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="fv-field">
          <label>Available Stock (Quintals) *</label>
          <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="e.g. 500" />
        </div>
        <div className="fv-field">
          <label>Price per Quintal (₹) *</label>
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 6500" />
        </div>
        <div className="fv-field">
          <label>Harvest Date</label>
          <input type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} />
        </div>
        <div className="fv-field">
          <label>Quality Grade</label>
          <select value={form.quality} onChange={e => set('quality', e.target.value)}>
            {['Grade A', 'Grade B', 'Premium', 'Export Quality'].map(q => <option key={q}>{q}</option>)}
          </select>
        </div>
        <div className="fv-field">
          <label>Location</label>
          <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Rajkot, Gujarat" />
        </div>
        <div className="fv-field fv-field--checkboxes">
          <label className="fv-checkbox-label">
            <input type="checkbox" checked={form.organic} onChange={e => set('organic', e.target.checked)} />
            🌿 Organic Certified
          </label>
          <label className="fv-checkbox-label">
            <input type="checkbox" checked={form.delivery} onChange={e => set('delivery', e.target.checked)} />
            🚚 Delivery Available
          </label>
        </div>
        <div className="fv-field fv-field--full">
          <label>Description</label>
          <textarea rows={3} value={form.desc} onChange={e => set('desc', e.target.value)} placeholder="Describe your crop quality, farming method..." />
        </div>
      </div>
    </Modal>
  );
};

const ViewDetailsModal = ({ crop, onClose }) => (
  <Modal
    isOpen={true}
    title={`${crop.emoji || '🌾'} ${crop.name}`}
    onClose={onClose}
    variant="default"
    size="lg"
    actions={
      <button className="fv-btn fv-btn--outline" onClick={onClose}>Close</button>
    }
  >
    <div className="fv-detail-grid">
      <div className="fv-detail-item"><span className="fv-detail-label">Category</span><span>{crop.category}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Price</span><span>₹{crop.price.toLocaleString()}/Q</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Stock</span><span>{crop.stock} Quintals</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Quality</span><span>{crop.quality}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Harvest Date</span><span>{crop.harvestDate}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Location</span><span>{crop.location}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Organic</span><span>{crop.organic ? '✅ Yes' : '❌ No'}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Delivery</span><span>{crop.delivery ? '✅ Available' : '❌ Pickup Only'}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Views</span><span>👁️ {crop.views}</span></div>
      <div className="fv-detail-item"><span className="fv-detail-label">Likes</span><span>❤️ {crop.likes}</span></div>
      <div className="fv-detail-item fv-detail-item--full"><span className="fv-detail-label">Description</span><span>{crop.desc}</span></div>
    </div>
  </Modal>
);

// ============================================================================
// MAIN FARMER VIEW COMPONENT
// ============================================================================

export default function FarmerView() {
  const [crops, setCrops] = useState([]);
  const [vendorReqs, setVendorReqs] = useState(VENDOR_REQUESTS);
  const [customerReqs, setCustomerReqs] = useState(CUSTOMER_REQUESTS);
  const [activeTab, setActiveTab] = useState('listings');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Latest');
  const [filterOrganic, setFilterOrganic] = useState(false);
  const [filterStock, setFilterStock] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCrop, setEditCrop] = useState(null);
  const [viewCrop, setViewCrop] = useState(null);
  const [toast, setToast] = useState(null);
  const [, setIsLoading] = useState(true);

  const totalStock = crops.reduce((s, c) => s + c.stock, 0);
  const totalRevenue = crops.reduce((s, c) => s + c.stock * c.price, 0);
  const totalViews = crops.reduce((s, c) => s + c.views, 0);
  const pendingVendor = vendorReqs.filter(r => r.status === 'Pending').length;
  const pendingCustomer = customerReqs.filter(r => r.status === 'Pending').length;

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const fetchCrops = async () => {
    try {
      const res = await getMyListings();
      if (res.data?.success) {
        const normalized = res.data.listings.map((l) => ({
          id: l._id,
          _id: l._id,
          name: l.title || l.cropName,
          cropName: l.cropName,
          title: l.title,
          category: l.category || 'Wheat',
          emoji: l.category === 'Rice' ? '🍚' : (l.category === 'Cotton' ? '☁️' : '🌾'),
          stock: l.quantity || 0,
          unit: l.unit || 'kg',
          price: l.price || 0,
          harvestDate: l.harvestDate ? new Date(l.harvestDate).toISOString().split('T')[0] : '',
          organic: l.isOrganic || false,
          delivery: l.deliveryAvailable || false,
          views: l.views || 0,
          likes: l.likes || 0,
          location: l.location || '',
          status: l.status || 'Active',
          farmerName: l.seller?.fullName || 'You',
          quality: l.quality || 'Grade A',
          desc: l.description || '',
        }));
        setCrops(normalized);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleSaveCrop = async (form) => {
    if (!form.name || !form.stock || !form.price) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    const payload = {
      title: form.name,
      cropName: form.name,
      category: form.category,
      quantity: Number(form.stock),
      unit: form.unit,
      price: Number(form.price),
      harvestDate: form.harvestDate,
      quality: form.quality,
      isOrganic: form.organic,
      deliveryAvailable: form.delivery,
      location: form.location,
      description: form.desc,
    };
    try {
      if (editCrop) {
        const res = await updateListing(editCrop._id, payload);
        if (res.data?.success) {
          showToast(`"${form.name}" updated successfully!`);
          fetchCrops();
        }
      } else {
        const res = await createListing(payload);
        if (res.data?.success) {
          showToast(`"${form.name}" listed successfully!`);
          fetchCrops();
        }
      }
      setShowAddModal(false);
      setEditCrop(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to save crop listing.', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteListing(id);
      if (res.data?.success) {
        setCrops((prev) => prev.filter((c) => c.id !== id));
        showToast('Crop listing removed.', 'error');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = (id, type) => {
    if (type === 'vendor') setVendorReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
    else setCustomerReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r));
    showToast('Request accepted! Buyer notified.');
  };

  const handleReject = (id, type) => {
    if (type === 'vendor') setVendorReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    else setCustomerReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    showToast('Request declined.', 'error');
  };

  const handleMessage = (item) => showToast(`Opening chat with ${item.vendorName || item.customerName}...`);

  // Filter + sort crops
  const filteredCrops = crops
    .filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = activeCategory === 'All' || c.category === activeCategory;
      const matchOrganic = !filterOrganic || c.organic;
      const matchStock = filterStock === 'All' || (filterStock === 'In Stock' ? c.stock > 0 : c.stock === 0);
      return matchSearch && matchCat && matchOrganic && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === 'Highest Price') return b.price - a.price;
      if (sortBy === 'Lowest Price') return a.price - b.price;
      if (sortBy === 'Most Viewed') return b.views - a.views;
      return b.id - a.id; // Latest
    });

  const TABS = [
    { id: 'listings', label: '🌾 My Listings', count: crops.length },
    { id: 'vendor-reqs', label: '🏪 Vendor Requests', count: vendorReqs.length },
    { id: 'customer-reqs', label: '👤 Customer Requests', count: customerReqs.length },
    { id: 'transactions', label: '📜 Transactions', count: TRANSACTIONS.length },
    { id: 'activity', label: '⚡ Activity', count: null },
  ];

  const statCardsData = [
    { icon: '🌾', value: crops.filter(c => c.status === 'Active').length, label: "Active Listings", color: "#2E7D32", sub: `${crops.length} total crops` },
    { icon: '📦', value: `${totalStock.toLocaleString()} Q`, label: "Available Stock", color: "#1565C0", sub: "Combined inventory" },
    { icon: '💰', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, label: "Expected Revenue", color: "#E65100", sub: "At current prices" },
    { icon: '💬', value: pendingVendor + pendingCustomer, label: "New Requests", color: "#6A1B9A", sub: `${pendingVendor} vendor · ${pendingCustomer} customer` }
  ];

  return (
    <div className="fv-root">

      {/* ── TOAST ── */}
      {toast && (
        <div className={`fv-toast fv-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* ── HERO HEADER ── */}
      <div className="fv-hero">
        <div className="fv-hero-content">
          <div className="fv-hero-text">
            <div className="fv-hero-eyebrow">🌾 Farmer Dashboard</div>
            <h1 className="fv-hero-title">Farmer Marketplace</h1>
            <p className="fv-hero-subtitle">
              Manage your crop listings, connect with customers and vendors,<br />
              and monitor your farming business — all in one place.
            </p>
            <div className="fv-hero-actions">
              <button className="fv-btn fv-btn--hero-primary" onClick={() => setShowAddModal(true)}>
                ➕ Add New Crop Listing
              </button>
              <button className="fv-btn fv-btn--hero-outline" onClick={() => setActiveTab('transactions')}>
                📜 View Transactions
              </button>
            </div>
          </div>
          <div className="fv-hero-illustration" aria-hidden>
            <div className="fv-illus-field">
              <div className="fv-illus-sun">☀️</div>
              <div className="fv-illus-cloud">☁️</div>
              <div className="fv-illus-crops">
                <span>🌾</span><span>🌿</span><span>🌾</span><span>🌻</span><span>🌾</span>
              </div>
              <div className="fv-illus-ground" />
              <div className="fv-illus-tractor">🚜</div>
            </div>
          </div>
        </div>
        {/* decorative blobs */}
        <div className="fv-hero-blob fv-hero-blob-1" />
        <div className="fv-hero-blob fv-hero-blob-2" />
      </div>

      {/* ── SUMMARY STAT CARDS ── */}
      <SummaryCards cards={statCardsData} />

      {/* ── QUICK STATS BAR ── */}
      <div className="fv-quick-stats">
        <div className="fv-quick-stat">
          <span className="fv-quick-stat-value">{totalViews}</span>
          <span className="fv-quick-stat-label">👁️ Total Views Today</span>
        </div>
        <div className="fv-quick-stat-divider" />
        <div className="fv-quick-stat">
          <span className="fv-quick-stat-value">{crops.reduce((s, c) => s + c.likes, 0)}</span>
          <span className="fv-quick-stat-label">❤️ Total Likes</span>
        </div>
        <div className="fv-quick-stat-divider" />
        <div className="fv-quick-stat">
          <span className="fv-quick-stat-value">{pendingVendor + pendingCustomer}</span>
          <span className="fv-quick-stat-label">⏳ Pending Orders</span>
        </div>
        <div className="fv-quick-stat-divider" />
        <div className="fv-quick-stat">
          <span className="fv-quick-stat-value">{TRANSACTIONS.filter(t => t.status === 'Completed').length}</span>
          <span className="fv-quick-stat-label">✅ Completed Orders</span>
        </div>
      </div>

      {/* ── SEARCH + FILTERS ── */}
      <div className="fv-search-filter-bar-row">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="Search my crops..." 
        />
        <FilterBar 
          categories={CATEGORIES}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={SORT_OPTIONS}
          filterOrganic={filterOrganic}
          setFilterOrganic={setFilterOrganic}
          filterStock={filterStock}
          setFilterStock={setFilterStock}
          showOrganicFilter={true}
          showStockFilter={true}
        />
      </div>

      {/* ── TABS ── */}
      <div className="fv-tabs-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`fv-tab ${activeTab === tab.id ? 'fv-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count !== null && (
              <span className="fv-tab-count">{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="fv-tab-content">

        {/* MY LISTINGS */}
        {activeTab === 'listings' && (
          <div>
            <div className="fv-section-header">
              <div>
                <h2 className="fv-section-title">🌾 My Crop Listings</h2>
                <p className="fv-section-sub">{filteredCrops.length} crops shown</p>
              </div>
              <button className="fv-btn fv-btn--primary" onClick={() => setShowAddModal(true)}>➕ Add Crop</button>
            </div>
            {filteredCrops.length === 0 ? (
              <div className="fv-empty-state">
                <span>🌾</span>
                <p>No crops match your search or filters.</p>
                <button className="fv-btn fv-btn--outline" onClick={() => { setSearchTerm(''); setActiveCategory('All'); setFilterOrganic(false); }}>Clear Filters</button>
              </div>
            ) : (
              <div className="fv-crop-grid">
                {filteredCrops.map(crop => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    role="Farmer"
                    onEdit={c => { setEditCrop(c); setShowAddModal(true); }}
                    onDelete={handleDelete}
                    onView={setViewCrop}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VENDOR REQUESTS */}
        {activeTab === 'vendor-reqs' && (
          <div>
            <div className="fv-section-header">
              <div>
                <h2 className="fv-section-title">🏪 Vendor Purchase Requests</h2>
                <p className="fv-section-sub">{vendorReqs.filter(r => r.status === 'Pending').length} pending requests</p>
              </div>
            </div>
            <div className="fv-request-list">
              {vendorReqs.map(req => (
                <VendorRequestCard key={req.id} req={req} onAccept={handleAccept} onReject={handleReject} onMessage={handleMessage} />
              ))}
            </div>
          </div>
        )}

        {/* CUSTOMER REQUESTS */}
        {activeTab === 'customer-reqs' && (
          <div>
            <div className="fv-section-header">
              <div>
                <h2 className="fv-section-title">👤 Customer Purchase Requests</h2>
                <p className="fv-section-sub">{customerReqs.filter(r => r.status === 'Pending').length} pending requests</p>
              </div>
            </div>
            <div className="fv-request-list">
              {customerReqs.map(req => (
                <CustomerRequestCard key={req.id} req={req} onAccept={handleAccept} onReject={handleReject} onMessage={handleMessage} />
              ))}
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div>
            <div className="fv-section-header">
              <h2 className="fv-section-title">📜 Recent Transactions</h2>
            </div>
            <div className="fv-table-wrap">
              <table className="fv-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Crop</th>
                    <th>Buyer</th>
                    <th>Type</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map(tx => (
                    <tr key={tx.id}>
                      <td className="fv-tx-id">{tx.id}</td>
                      <td>{tx.crop}</td>
                      <td className="fv-tx-buyer">{tx.buyer}</td>
                      <td><span className={`fv-buyer-type fv-buyer-type--${tx.buyerType.toLowerCase()}`}>{tx.buyerType}</span></td>
                      <td>{tx.qty}</td>
                      <td className="fv-tx-price">{tx.price}</td>
                      <td><span className={`fv-tx-status fv-tx-status--${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                      <td className="fv-tx-date">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ACTIVITY */}
        {activeTab === 'activity' && (
          <div>
            <div className="fv-section-header">
              <h2 className="fv-section-title">⚡ Marketplace Activity</h2>
            </div>
            <div className="fv-activity-feed">
              {ACTIVITIES.map(act => (
                <div key={act.id} className={`fv-activity-item fv-activity--${act.type}`}>
                  <div className="fv-activity-icon-wrap">
                    <span className="fv-activity-icon">{act.icon}</span>
                  </div>
                  <div className="fv-activity-body">
                    <p className="fv-activity-text">{act.text}</p>
                    <span className="fv-activity-time">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── MODALS ── */}
      {showAddModal && (
        <AddEditCropModal
          crop={editCrop}
          onClose={() => { setShowAddModal(false); setEditCrop(null); }}
          onSave={handleSaveCrop}
        />
      )}
      {viewCrop && (
        <ViewDetailsModal crop={viewCrop} onClose={() => setViewCrop(null)} />
      )}

    </div>
  );
}
