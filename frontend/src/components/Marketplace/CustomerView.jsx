import React, { useState, useEffect, useMemo } from 'react';
import './CustomerView.css';
import SearchBar from './SearchBar';
import SummaryCards from './SummaryCards';
import { getListings } from '../../services/marketplaceService';
import { createTransaction as createTransactionApi } from '../../services/transactionService';

// ============================================================================
// DUMMY DATA FOR THE CUSTOMER MARKETPLACE
// ============================================================================
// DUMMY_FARMER_LISTINGS and DUMMY_VENDOR_LISTINGS removed — now loaded from API via getListings()



const DUMMY_ORDER_HISTORY = [
  {
    id: 'TXN-O-10029',
    cropName: 'Premium Bt Cotton',
    sellerName: 'Om Bhudhara',
    sellerType: 'Farmer',
    quantity: 10,
    totalPrice: 72000,
    date: '2026-06-28',
    paymentStatus: 'Paid',
    deliveryStatus: 'Delivered'
  },
  {
    id: 'TXN-O-10030',
    cropName: 'Basmati Rice',
    sellerName: 'AgroMart Gujarat',
    sellerType: 'Vendor',
    quantity: 5,
    totalPrice: 24500,
    date: '2026-06-25',
    paymentStatus: 'Paid',
    deliveryStatus: 'Shipped'
  }
];

const RECENTLY_VIEWED = [
  { id: 'f-list-1', cropImage: '🌾', cropName: 'Sharbati Wheat', price: 2350 },
  { id: 'f-list-2', cropImage: '☁️', cropName: 'Premium Bt Cotton', price: 7200 }
];

const POPULAR_CROPS = ['Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize', 'Vegetables'];

const ACTIVITIES = [
  { id: 1, text: 'New Farmer Om Bhudhara joined the marketplace.', time: '1 hour ago' },
  { id: 2, text: 'New Vendor Krishna Agro Traders listed organic fertiliser stock.', time: '3 hours ago' },
  { id: 3, text: 'Price drop alert: Sharbati Wheat rate dropped to ₹2,350/Q.', time: '5 hours ago' },
  { id: 4, text: 'New Crop listed: Basmati Rice by Mahesh Chauhan.', time: '1 day ago' }
];

const CATEGORIES = ['All', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize', 'Vegetables'];
const SORT_OPTIONS = ['Latest', 'Lowest Price', 'Highest Rating', 'Nearest Seller'];

// ============================================================================
// MAIN CUSTOMER VIEW COMPONENT
// ============================================================================

export default function CustomerView() {
  const [farmersList, setFarmersList] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders] = useState(DUMMY_ORDER_HISTORY);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('All');
  const [organicFilter, setOrganicFilter] = useState(false);
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [deliveryFilter, setDeliveryFilter] = useState(false);
  const [sortBy, setSortBy] = useState('Latest');
  const [toast, setToast] = useState(null);

  // Modals
  const [buyModal, setBuyModal] = useState(null);
  const [buyForm, setBuyForm] = useState({ quantity: '', address: '' });
  const [detailsModal, setDetailsModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, remarks: '' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAllListings = async () => {
    try {
      const res = await getListings();
      if (res.data?.success) {
        const mapped = res.data.listings.map((l) => ({
          id: l._id,
          _id: l._id,
          cropImage: l.category === 'Rice' ? '🍚' : (l.category === 'Cotton' ? '☁️' : '🌾'),
          cropName: l.title || l.cropName,
          farmerName: l.seller?.fullName || 'Seller',
          farmerAvatar: l.seller?.fullName ? l.seller.fullName.split(' ').map((n) => n[0]).join('') : 'OB',
          farmerVerified: true,
          rating: 4.8,
          reviews: 42,
          likes: l.likes || 0,
          location: l.location || '',
          stock: l.quantity || 0,
          price: l.price || 0,
          organic: l.isOrganic || false,
          delivery: l.deliveryAvailable || false,
          phone: l.seller?.phone || '',
          seller: l.seller,
          sellerId: l.seller?._id,
        }));

        const farmers = mapped.filter((m) => m.seller?.role === 'Farmer');
        const vendors = mapped.filter((m) => m.seller?.role === 'Vendor');

        setFarmersList(farmers);
        setVendorsList(vendors);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllListings();
  }, []);

  // Like & Wishlist Actions
  const handleWishlistToggle = (item, type) => {
    const isSaved = wishlist.some(w => w.id === item.id);
    if (isSaved) {
      setWishlist(prev => prev.filter(w => w.id !== item.id));
      showToast(`${item.cropName || item.vendorName} removed from Wishlist.`, 'error');
    } else {
      setWishlist(prev => [...prev, { ...item, savedType: type }]);
      showToast(`${item.cropName || item.vendorName} added to Wishlist!`);
    }
  };

  const handleBuyClick = (item, type) => {
    setBuyModal({ ...item, type });
    setBuyForm({ quantity: '', address: '' });
  };

  const handleBuySubmit = async () => {
    if (!buyForm.quantity || Number(buyForm.quantity) <= 0) {
      showToast('Please enter a valid quantity.', 'error');
      return;
    }
    if (!buyForm.address.trim()) {
      showToast('Please enter shipping address.', 'error');
      return;
    }

    try {
      const payload = {
        sellerId: buyModal.seller?._id || buyModal.sellerId,
        cropName: buyModal.cropName,
        quantity: Number(buyForm.quantity),
        price: Number(buyModal.price),
        listingId: buyModal._id || buyModal.id,
      };

      const res = await createTransactionApi(payload);
      if (res.data?.success) {
        showToast('Purchase completed successfully! Delivery dispatch scheduled.');
        if (buyModal.type === 'farmer') {
          setFarmersList(prev => prev.map(f => f.id === buyModal.id ? { ...f, stock: Math.max(0, f.stock - Number(buyForm.quantity)) } : f));
        } else {
          setVendorsList(prev => prev.map(v => v.id === buyModal.id ? { ...v, stock: Math.max(0, v.stock - Number(buyForm.quantity)) } : v));
        }
        setBuyModal(null);
        fetchAllListings();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to place order on backend.', 'error');
    }
  };

  const handleReviewClick = (item, type) => {
    setReviewModal({ ...item, type });
    setReviewForm({ rating: 5, remarks: '' });
  };

  const handleReviewSubmit = () => {
    if (!reviewForm.remarks.trim()) {
      showToast('Please provide review comments.', 'error');
      return;
    }
    showToast(`Feedback submitted to ${reviewModal.farmerName || reviewModal.vendorName}!`);
    setReviewModal(null);
  };

  // Compare listings helper logic
  const comparisonPairs = useMemo(() => {
    const pairs = [];
    farmersList.forEach(farmer => {
      // Find a matching crop vendor listing (case insensitive match on simplified names)
      const matchingVendor = vendorsList.find(vendor => 
        vendor.cropName.toLowerCase().replace(/\s+/g, '') === 
        farmer.cropName.toLowerCase().replace(/\s+/g, '').replace('premium', '')
      );
      if (matchingVendor) {
        pairs.push({
          crop: farmer.cropName.replace('Premium ', ''),
          farmer,
          vendor: matchingVendor
        });
      }
    });
    return pairs;
  }, [farmersList, vendorsList]);

  // Filters & Sorting logic for Farmers List
  const filteredFarmers = useMemo(() => {
    return farmersList
      .filter(item => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
          item.cropName.toLowerCase().includes(query) ||
          item.farmerName.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query);

        const matchesCat = activeCategory === 'All' || item.category === activeCategory;
        const matchesLoc = !locationFilter || item.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesOrganic = !organicFilter || item.organic;
        const matchesVerified = !verifiedFilter || item.farmerVerified;
        const matchesDelivery = !deliveryFilter || item.delivery;

        // Price filter
        let matchesPrice = true;
        if (priceRangeFilter === 'Under 2500') matchesPrice = item.price < 2500;
        else if (priceRangeFilter === '2500-5000') matchesPrice = item.price >= 2500 && item.price <= 5000;
        else if (priceRangeFilter === 'Over 5000') matchesPrice = item.price > 5000;

        return matchesSearch && matchesCat && matchesLoc && matchesOrganic && matchesVerified && matchesDelivery && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'Lowest Price') return a.price - b.price;
        if (sortBy === 'Highest Rating') return b.rating - a.rating;
        return b.id.localeCompare(a.id); // Latest first fallback
      });
  }, [farmersList, searchTerm, activeCategory, locationFilter, organicFilter, verifiedFilter, deliveryFilter, priceRangeFilter, sortBy]);

  // Filters & Sorting logic for Vendors List
  const filteredVendors = useMemo(() => {
    return vendorsList
      .filter(item => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
          item.cropName.toLowerCase().includes(query) ||
          item.vendorName.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query);

        const matchesLoc = !locationFilter || item.location.toLowerCase().includes(locationFilter.toLowerCase());
        const matchesVerified = !verifiedFilter || item.verified;
        const matchesDelivery = !deliveryFilter || item.delivery;

        return matchesSearch && matchesLoc && matchesVerified && matchesDelivery;
      })
      .sort((a, b) => {
        if (sortBy === 'Lowest Price') return a.price - b.price;
        if (sortBy === 'Highest Rating') return b.rating - a.rating;
        return b.id.localeCompare(a.id); // Latest first fallback
      });
  }, [vendorsList, searchTerm, locationFilter, verifiedFilter, deliveryFilter, sortBy]);

  // Quick statistics definitions
  const statCardsData = [
    { icon: '🌾', label: 'Available Crops', value: farmersList.length + vendorsList.length, color: '#2E7D32', sub: 'Active trading listings' },
    { icon: '🏪', label: 'Available Vendors', value: vendorsList.length, color: '#1565C0', sub: 'Verified bulk merchants' },
    { icon: '❤️', label: 'Wishlist', value: wishlist.length, color: '#E91E63', sub: 'Saved for later buys' },
    { icon: '📦', label: 'My Orders', value: orders.length, color: '#E65100', sub: 'Tracked purchases' }
  ];

  return (
    <div className="cv-root">
      {/* Toast Alert */}
      {toast && (
        <div className={`cv-toast cv-toast--${toast.type}`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

      {/* Hero Header Section */}
      <div className="cv-hero-banner">
        <div className="cv-hero-content">
          <div className="cv-hero-text">
            <div className="cv-hero-tag">👤 Customer Portal</div>
            <h1 className="cv-hero-title">Customer Marketplace</h1>
            <p className="cv-hero-subtitle">
              Buy fresh crops directly from farmers or trusted vendors.<br />
              Compare prices, quality, stock, ratings, and delivery options before purchasing.
            </p>
          </div>
          <div className="cv-hero-illustration">
            <div className="cv-illus-frame">
              <span className="illus-element sun">☀️</span>
              <span className="illus-element windmill">🌾</span>
              <span className="illus-element tractor">🚜</span>
              <span className="illus-element cloud">☁️</span>
            </div>
          </div>
        </div>
        <div className="cv-hero-wave" />
      </div>

      {/* Summary Stats Block */}
      <SummaryCards cards={statCardsData} />

      {/* Tab Controls */}
      <div className="cv-tabs-bar">
        <button className={`cv-tab-btn ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>
          🌾 Browse Crop Marketplace
        </button>
        <button className={`cv-tab-btn ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>
          ⚖️ Compare Farmer vs Vendor
        </button>
        <button className={`cv-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`} onClick={() => setActiveTab('wishlist')}>
          ❤️ Saved Wishlist ({wishlist.length})
        </button>
        <button className={`cv-tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
          📦 My Order History ({orders.length})
        </button>
        <button className={`cv-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
          📊 Market Activity &amp; Stats
        </button>
      </div>

      {/* SEARCH AND FILTERS (Only in browse) */}
      {activeTab === 'browse' && (
        <div className="cv-filters-panel">
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="Search crops, farmers or vendors..." 
          />

          <div className="cv-additional-filters">
            <input 
              type="text" 
              placeholder="Filter by Location..." 
              className="cv-input-filter"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            />

            <select className="cv-select-filter" value={priceRangeFilter} onChange={e => setPriceRangeFilter(e.target.value)}>
              <option value="All">All Price Ranges</option>
              <option value="Under 2500">Under ₹2,500/Q</option>
              <option value="2500-5000">₹2,500 - ₹5,000/Q</option>
              <option value="Over 5000">Over ₹5,000/Q</option>
            </select>

            <select className="cv-select-filter" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>

            <label className="cv-checkbox-filter">
              <input type="checkbox" checked={organicFilter} onChange={e => setOrganicFilter(e.target.checked)} />
              🌿 Organic
            </label>

            <label className="cv-checkbox-filter">
              <input type="checkbox" checked={verifiedFilter} onChange={e => setVerifiedFilter(e.target.checked)} />
              ✓ Verified Sellers
            </label>

            <label className="cv-checkbox-filter">
              <input type="checkbox" checked={deliveryFilter} onChange={e => setDeliveryFilter(e.target.checked)} />
              🚚 Delivery Available
            </label>
          </div>

          <div className="cv-category-chips">
            {CATEGORIES.map(cat => (
              <button 
                key={cat} 
                className={`cv-cat-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT AREA */}
      <div className="cv-tab-content">
        {activeTab === 'browse' && (
          <div>
            {/* FARMER SECTION */}
            <div className="cv-section-header">
              <h2>🌾 Buy Directly From Farmers</h2>
              <p>Compare raw prices straight from fields</p>
            </div>

            {filteredFarmers.length === 0 ? (
              <div className="cv-empty-box">
                <span>🌾</span>
                <p>No farmer listings match your search or filters.</p>
              </div>
            ) : (
              <div className="cv-grid-listings">
                {filteredFarmers.map(listing => (
                  <div key={listing.id} className="cv-crop-card-item">
                    <div className="cv-card-top-row">
                      <div className="cv-emoji-badge">{listing.cropImage}</div>
                      <div className="cv-farmer-badge">
                        <span className="avatar">{listing.farmerAvatar}</span>
                        <div>
                          <span className="name">{listing.farmerName}</span>
                          {listing.farmerVerified && <span className="verified">✓ Verified</span>}
                        </div>
                      </div>
                    </div>

                    <h3 className="cv-crop-title">{listing.cropName}</h3>
                    <div className="cv-card-reviews">⭐ {listing.rating} ({listing.reviews} reviews) · ❤️ {listing.likes} likes</div>

                    <div className="cv-card-financials">
                      <div className="price">₹{listing.price.toLocaleString()}<span>/Quintal</span></div>
                      <div className="stock">Stock: <strong>{listing.stock} Q</strong></div>
                    </div>

                    <div className="cv-card-location">📍 Location: {listing.location}</div>
                    <div className="cv-card-harvest">🗓️ Harvest Date: {listing.harvestDate}</div>

                    <div className="cv-card-tags">
                      {listing.organic && <span className="tag-organic">🌿 Organic</span>}
                      {listing.delivery && <span className="tag-delivery">🚚 Delivery</span>}
                    </div>

                    <div className="cv-card-buttons">
                      <button className="btn-buy" onClick={() => handleBuyClick(listing, 'farmer')}>🛒 Buy From Farmer</button>
                      <button className="btn-sub" onClick={() => showToast(`Negotiations opened with ${listing.farmerName}`)}>💬 Message</button>
                      <button className="btn-sub" onClick={() => showToast(`Phone: ${listing.phone}`)}>📞 Contact</button>
                      <button className="btn-sub" onClick={() => showToast('Opening farmer profile settings stub...')}>👤 Profile</button>
                      <button className="btn-sub" onClick={() => handleReviewClick(listing, 'farmer')}>⭐ Review</button>
                      <button className="btn-sub" onClick={() => handleWishlistToggle(listing, 'farmer')}>
                        {wishlist.some(w => w.id === listing.id) ? '❤️ Saved' : '🤍 Wishlist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VENDORS SECTION */}
            <div className="cv-section-header" style={{ marginTop: '40px' }}>
              <h2>🏪 Buy From Agricultural Vendors</h2>
              <p>Certified commercial seed, fertilizer, and bulk brokers</p>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="cv-empty-box">
                <span>🏪</span>
                <p>No vendor listings match your search or filters.</p>
              </div>
            ) : (
              <div className="cv-grid-listings">
                {filteredVendors.map(vendor => (
                  <div key={vendor.id} className="cv-crop-card-item cv-card--vendor">
                    <div className="cv-card-top-row">
                      <div className="cv-emoji-badge">{vendor.cropImage}</div>
                      <div className="cv-farmer-badge">
                        <span className="avatar avatar--vendor">{vendor.vendorLogo}</span>
                        <div>
                          <span className="name">{vendor.vendorName}</span>
                          {vendor.verified && <span className="verified">✓ Verified Vendor</span>}
                        </div>
                      </div>
                    </div>

                    <h3 className="cv-crop-title">{vendor.cropName}</h3>
                    <div className="cv-card-reviews">⭐ {vendor.rating} ({vendor.reviews} reviews) · ❤️ {vendor.likes} likes</div>

                    <div className="cv-card-financials">
                      <div className="price">₹{vendor.price.toLocaleString()}<span>/Quintal</span></div>
                      <div className="stock">Stock: <strong>{vendor.stock} Q</strong></div>
                    </div>

                    <div className="cv-card-location">📍 Location: {vendor.location}</div>
                    <div className="cv-card-hours">🕒 Hours: {vendor.businessHours}</div>

                    <div className="cv-card-tags">
                      {vendor.delivery && <span className="tag-delivery">🚚 Delivery</span>}
                    </div>

                    <div className="cv-card-buttons">
                      <button className="btn-buy" onClick={() => handleBuyClick(vendor, 'vendor')}>🛒 Buy From Vendor</button>
                      <button className="btn-sub" onClick={() => showToast(`Negotiations opened with ${vendor.vendorName}`)}>💬 Message</button>
                      <button className="btn-sub" onClick={() => showToast(`Phone: ${vendor.phone}`)}>📞 Contact</button>
                      <button className="btn-sub" onClick={() => showToast('Opening vendor profile settings stub...')}>👤 Profile</button>
                      <button className="btn-sub" onClick={() => handleReviewClick(vendor, 'vendor')}>⭐ Review</button>
                      <button className="btn-sub" onClick={() => handleWishlistToggle(vendor, 'vendor')}>
                        {wishlist.some(w => w.id === vendor.id) ? '❤️ Saved' : '🤍 Wishlist'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPARISON VIEW */}
        {activeTab === 'compare' && (
          <div>
            <div className="cv-section-header">
              <h2>⚖️ Mandi Price Comparison Desk</h2>
              <p>Compare active rates, delivery constraints, and stock reserves between growers and suppliers</p>
            </div>

            <div className="cv-compare-stack">
              {comparisonPairs.map((pair, idx) => {
                const bestPriceType = pair.farmer.price < pair.vendor.price ? 'farmer' : 'vendor';
                return (
                  <div key={idx} className="cv-compare-card">
                    <div className="compare-crop-header">
                      <span className="emoji">{pair.farmer.cropImage}</span>
                      <h3>{pair.crop} Compare</h3>
                    </div>

                    <div className="compare-cols">
                      {/* Farmer info */}
                      <div className={`compare-side ${bestPriceType === 'farmer' ? 'best-deal' : ''}`}>
                        {bestPriceType === 'farmer' && <span className="badge-best">💰 Best Price</span>}
                        <span className="badge-rec">⭐ Recommended</span>
                        <div className="seller-name">👨‍🌾 Farmer: {pair.farmer.farmerName}</div>
                        <div className="price-tag">₹{pair.farmer.price.toLocaleString()} / Q</div>
                        <div className="stock-tag">Stock: {pair.farmer.stock} Q</div>
                        <div className="rating-tag">⭐ {pair.farmer.rating} Rating</div>
                        <div className="del-tag">🚚 {pair.farmer.delivery ? 'Fast Delivery' : 'Self-Pickup'}</div>
                        <button className="btn-buy" onClick={() => handleBuyClick(pair.farmer, 'farmer')}>Buy from Farmer</button>
                      </div>

                      <div className="compare-vs">VS</div>

                      {/* Vendor info */}
                      <div className={`compare-side ${bestPriceType === 'vendor' ? 'best-deal' : ''}`}>
                        {bestPriceType === 'vendor' && <span className="badge-best">💰 Best Price</span>}
                        <div className="seller-name">🏪 Vendor: {pair.vendor.vendorName}</div>
                        <div className="price-tag">₹{pair.vendor.price.toLocaleString()} / Q</div>
                        <div className="stock-tag">Stock: {pair.vendor.stock} Q</div>
                        <div className="rating-tag">⭐ {pair.vendor.rating} Rating</div>
                        <div className="del-tag">🚚 {pair.vendor.delivery ? 'Fast Delivery' : 'Self-Pickup'}</div>
                        <button className="btn-buy" onClick={() => handleBuyClick(pair.vendor, 'vendor')}>Buy from Vendor</button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {comparisonPairs.length === 0 && (
                <div className="cv-empty-box">
                  <span>⚖️</span>
                  <p>No matching crop items exist from both farmers and vendors currently to compare.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            <div className="cv-section-header">
              <h2>❤️ My Saved Wishlist Items</h2>
              <p>Items saved for purchase decisions later</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="cv-empty-box">
                <span>❤️</span>
                <p>Your wishlist is empty. Add crops to your wishlist from the browse tab!</p>
              </div>
            ) : (
              <div className="cv-grid-listings">
                {wishlist.map(item => (
                  <div key={item.id} className={`cv-crop-card-item ${item.savedType === 'vendor' ? 'cv-card--vendor' : ''}`}>
                    <div className="cv-card-top-row">
                      <div className="cv-emoji-badge">{item.cropImage}</div>
                      <h4>{item.cropName}</h4>
                    </div>

                    <div className="cv-card-financials">
                      <div className="price">₹{item.price.toLocaleString()}<span>/Q</span></div>
                      <div className="stock">Stock: <strong>{item.stock} Q</strong></div>
                    </div>

                    <p style={{ fontSize: '12px', color: '#6B8C6B', margin: '4px 0 0 0' }}>
                      Seller: <strong>{item.farmerName || item.vendorName}</strong> ({item.savedType === 'vendor' ? 'Vendor' : 'Farmer'})
                    </p>

                    <div className="cv-card-buttons">
                      <button className="btn-buy" onClick={() => handleBuyClick(item, item.savedType)}>🛒 Buy Now</button>
                      <button className="btn-remove" onClick={() => handleWishlistToggle(item, item.savedType)}>🗑️ Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div>
            <div className="cv-section-header">
              <h2>📦 Previous Order Fulfillment History</h2>
              <p>Tracking direct crop purchases</p>
            </div>

            <div className="cv-orders-stack">
              {orders.map(order => (
                <div key={order.id} className="cv-order-row-card">
                  <div className="order-main-info">
                    <h4>{order.cropName}</h4>
                    <span className="order-id">{order.id}</span>
                  </div>
                  <div className="order-meta">
                    <div>Seller: <strong>{order.sellerName}</strong></div>
                    <div>Type: <span className="seller-type-badge">{order.sellerType}</span></div>
                    <div>Qty: <strong>{order.quantity} Q</strong></div>
                    <div>Total Paid: <strong>₹{order.totalPrice.toLocaleString()}</strong></div>
                  </div>
                  <div className="order-dates-status">
                    <div>Date: {order.date}</div>
                    <div>Payment: <span className="status-paid">{order.paymentStatus}</span></div>
                    <div>Delivery: <span className="status-delivery">{order.deliveryStatus}</span></div>
                  </div>
                  <div className="order-row-actions">
                    <button className="btn-view" onClick={() => setDetailsModal(order)}>👁️ View Details</button>
                    <button className="btn-msg" onClick={() => showToast(`Chat opened with ${order.sellerName}`)}>💬 Message Seller</button>
                    <button className="btn-review" onClick={() => handleReviewClick(order, order.sellerType.toLowerCase())}>⭐ Review</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MARKET ACTIVITY & STATS */}
        {activeTab === 'dashboard' && (
          <div className="cv-dashboard-layout">
            <div className="cv-dashboard-grid">
              {/* Recently viewed */}
              <div className="cv-dash-widget">
                <h3>👀 Recently Viewed Crops</h3>
                <div className="widget-viewed-list">
                  {RECENTLY_VIEWED.map(item => (
                    <div key={item.id} className="viewed-item">
                      <span className="emoji">{item.cropImage}</span>
                      <div className="meta">
                        <h4>{item.cropName}</h4>
                        <span>₹{item.price}/Quintal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Crops */}
              <div className="cv-dash-widget">
                <h3>🔥 Popular Crops This Season</h3>
                <div className="widget-crops-tags">
                  {POPULAR_CROPS.map(c => (
                    <span key={c} className="crop-tag">🌾 {c}</span>
                  ))}
                </div>
              </div>

              {/* Activity log */}
              <div className="cv-dash-widget full-width">
                <h3>⚡ Marketplace Live Updates</h3>
                <div className="widget-activity-list">
                  {ACTIVITIES.map(act => (
                    <div key={act.id} className="activity-item-row">
                      <span className="bullet">🔵</span>
                      <div className="info">
                        <p>{act.text}</p>
                        <span>{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick statistics */}
              <div className="cv-dash-widget full-width">
                <h3>📊 Performance Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-box">
                    <span className="lbl">Total Orders</span>
                    <span className="val">{orders.length}</span>
                  </div>
                  <div className="metric-box">
                    <span className="lbl">Completed Orders</span>
                    <span className="val">{orders.filter(o=>o.deliveryStatus==='Delivered').length}</span>
                  </div>
                  <div className="metric-box">
                    <span className="lbl">Pending Orders</span>
                    <span className="val">{orders.filter(o=>o.deliveryStatus==='Pending' || o.deliveryStatus==='Shipped').length}</span>
                  </div>
                  <div className="metric-box">
                    <span className="lbl">Wishlist Items</span>
                    <span className="val">{wishlist.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BUY MODAL */}
      {buyModal && (
        <div className="cv-modal-backdrop" onClick={() => setBuyModal(null)}>
          <div className="cv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-header">
              <h3>🛒 Complete Order Checkout</h3>
              <button className="close-btn" onClick={() => setBuyModal(null)}>✕</button>
            </div>
            <div className="cv-modal-body">
              <div className="modal-item-preview">
                <span className="emoji">{buyModal.cropImage}</span>
                <div>
                  <h4>{buyModal.cropName}</h4>
                  <p>Seller: <strong>{buyModal.farmerName || buyModal.vendorName}</strong> ({buyModal.type === 'vendor' ? 'Vendor' : 'Farmer'})</p>
                  <p>Rate: <strong>₹{buyModal.price}/Q</strong></p>
                </div>
              </div>

              <div className="modal-field">
                <label>Fulfillment Quantity (Quintals) *</label>
                <input 
                  type="number"
                  placeholder="e.g. 10"
                  value={buyForm.quantity}
                  onChange={e => setBuyForm(prev => ({ ...prev, quantity: e.target.value }))}
                />
                <span className="hint">Max Available: {buyModal.stock} Q</span>
              </div>

              <div className="modal-field">
                <label>Shipping / Delivery Address *</label>
                <textarea 
                  rows={2}
                  placeholder="Enter complete address..."
                  value={buyForm.address}
                  onChange={e => setBuyForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              {buyForm.quantity && (
                <div className="modal-total-calc">
                  Total Order Amount: <strong>₹{(buyModal.price * Number(buyForm.quantity)).toLocaleString()}</strong>
                </div>
              )}
            </div>
            <div className="cv-modal-footer">
              <button className="btn-cancel" onClick={() => setBuyModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleBuySubmit}>Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS MODAL */}
      {detailsModal && (
        <div className="cv-modal-backdrop" onClick={() => setDetailsModal(null)}>
          <div className="cv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-header">
              <h3>👁️ Order Audit details</h3>
              <button className="close-btn" onClick={() => setDetailsModal(null)}>✕</button>
            </div>
            <div className="cv-modal-body details-grid">
              <div className="dt-item"><span className="lbl">Crop</span><strong>{detailsModal.cropName}</strong></div>
              <div className="dt-item"><span className="lbl">Transaction ID</span><strong>{detailsModal.id}</strong></div>
              <div className="dt-item"><span className="lbl">Supplier</span><strong>{detailsModal.sellerName}</strong></div>
              <div className="dt-item"><span className="lbl">Seller Type</span><strong>{detailsModal.sellerType}</strong></div>
              <div className="dt-item"><span className="lbl">Quantity</span><strong>{detailsModal.quantity} Q</strong></div>
              <div className="dt-item"><span className="lbl">Total Price</span><strong>₹{detailsModal.totalPrice.toLocaleString()}</strong></div>
              <div className="dt-item"><span className="lbl">Purchase Date</span><strong>{detailsModal.date}</strong></div>
              <div className="dt-item"><span className="lbl">Payment</span><strong>{detailsModal.paymentStatus}</strong></div>
              <div className="dt-item"><span className="lbl">Delivery</span><strong>{detailsModal.deliveryStatus}</strong></div>
            </div>
            <div className="cv-modal-footer">
              <button className="btn-cancel" onClick={() => setDetailsModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {reviewModal && (
        <div className="cv-modal-backdrop" onClick={() => setReviewModal(null)}>
          <div className="cv-modal-box" onClick={e => e.stopPropagation()}>
            <div className="cv-modal-header">
              <h3>⭐ Rate Seller / Supplier</h3>
              <button className="close-btn" onClick={() => setReviewModal(null)}>✕</button>
            </div>
            <div className="cv-modal-body">
              <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#3D5A3D' }}>
                Reviewing supplier: <strong>{reviewModal.farmerName || reviewModal.vendorName || reviewModal.sellerName}</strong>
              </p>

              <div className="modal-field">
                <label>Stars Rating</label>
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

              <div className="modal-field">
                <label>Review comments *</label>
                <textarea 
                  rows={3}
                  placeholder="Share details of crop quality, packaging, and logistics..."
                  value={reviewForm.remarks}
                  onChange={e => setReviewForm(prev => ({ ...prev, remarks: e.target.value }))}
                />
              </div>
            </div>
            <div className="cv-modal-footer">
              <button className="btn-cancel" onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn-confirm" onClick={handleReviewSubmit}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
