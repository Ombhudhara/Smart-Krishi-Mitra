import React, { useState, useEffect, useMemo } from 'react';
import SearchBar from './SearchBar';
import SummaryCards from './SummaryCards';
import CropCard from './CropCard';
import { getListings } from '../../services/marketplaceService';
import { createTransaction as createTransactionApi } from '../../services/transactionService';

const DUMMY_ORDER_HISTORY = [
  { id: 'TXN-O-10029', cropName: 'Premium Bt Cotton', sellerName: 'Om Bhudhara', sellerType: 'Farmer', quantity: 10, totalPrice: 72000, date: '2026-06-28', paymentStatus: 'Paid', deliveryStatus: 'Delivered' },
  { id: 'TXN-O-10030', cropName: 'Basmati Rice', sellerName: 'AgroMart Gujarat', sellerType: 'Vendor', quantity: 5, totalPrice: 24500, date: '2026-06-25', paymentStatus: 'Paid', deliveryStatus: 'Shipped' }
];

const CATEGORIES = ['All', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize', 'Vegetables'];
const SORT_OPTIONS = ['Latest', 'Lowest Price', 'Highest Rating', 'Nearest Seller'];

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

  const [buyModal, setBuyModal] = useState(null);
  const [buyForm, setBuyForm] = useState({ quantity: '', address: '' });

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const fetchAllListings = async () => {
    try {
      const res = await getListings();
      if (res.data?.success) {
        const mapped = res.data.listings.map((l) => ({
          id: l._id, _id: l._id, cropImage: l.category === 'Rice' ? '🍚' : (l.category === 'Cotton' ? '☁️' : '🌾'),
          cropName: l.title || l.cropName, farmerName: l.seller?.fullName || 'Seller', vendorName: l.seller?.fullName,
          farmerAvatar: l.seller?.fullName ? l.seller.fullName.split(' ').map((n) => n[0]).join('') : 'OB',
          farmerVerified: true, verified: true, rating: 4.8, reviews: 42, likes: l.likes || 0,
          location: l.location || '', stock: l.quantity || 0, price: l.price || 0,
          organic: l.isOrganic || false, delivery: l.deliveryAvailable || false, phone: l.seller?.phone || '',
          seller: l.seller, sellerId: l.seller?._id,
        }));
        setFarmersList(mapped.filter((m) => m.seller?.role === 'Farmer'));
        setVendorsList(mapped.filter((m) => m.seller?.role === 'Vendor'));
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchAllListings(); }, []);

  const handleWishlistToggle = (item, type) => {
    if (wishlist.some(w => w.id === item.id)) { setWishlist(p => p.filter(w => w.id !== item.id)); showToast('Removed from Wishlist', 'error'); }
    else { setWishlist(p => [...p, { ...item, savedType: type }]); showToast('Added to Wishlist!'); }
  };

  const handleBuyClick = (item, type) => { setBuyModal({ ...item, type }); setBuyForm({ quantity: '', address: '' }); };
  
  const handleBuySubmit = async () => {
    if (!buyForm.quantity || Number(buyForm.quantity) <= 0) return showToast('Invalid quantity', 'error');
    if (!buyForm.address.trim()) return showToast('Enter address', 'error');
    try {
      const res = await createTransactionApi({ sellerId: buyModal.seller?._id || buyModal.sellerId, cropName: buyModal.cropName, quantity: Number(buyForm.quantity), price: Number(buyModal.price), listingId: buyModal._id || buyModal.id });
      if (res.data?.success) { showToast('Purchase successful!'); setBuyModal(null); fetchAllListings(); }
    } catch (err) { showToast('Purchase failed', 'error'); }
  };

  const comparisonPairs = useMemo(() => {
    const pairs = [];
    farmersList.forEach(farmer => {
      const vendor = vendorsList.find(v => v.cropName.toLowerCase().replace(/\s+/g, '') === farmer.cropName.toLowerCase().replace(/\s+/g, '').replace('premium', ''));
      if (vendor) pairs.push({ crop: farmer.cropName.replace('Premium ', ''), farmer, vendor });
    });
    return pairs;
  }, [farmersList, vendorsList]);

  const filteredFarmers = farmersList.filter(i => (i.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || i.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) || i.location.toLowerCase().includes(searchTerm.toLowerCase())) && (activeCategory === 'All' || i.category === activeCategory) && (!locationFilter || i.location.toLowerCase().includes(locationFilter.toLowerCase())) && (!organicFilter || i.organic) && (!verifiedFilter || i.farmerVerified) && (!deliveryFilter || i.delivery)).sort((a, b) => sortBy === 'Lowest Price' ? a.price - b.price : sortBy === 'Highest Rating' ? b.rating - a.rating : b.id.localeCompare(a.id));
  const filteredVendors = vendorsList.filter(i => (i.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || i.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) || i.location.toLowerCase().includes(searchTerm.toLowerCase())) && (!locationFilter || i.location.toLowerCase().includes(locationFilter.toLowerCase())) && (!verifiedFilter || i.verified) && (!deliveryFilter || i.delivery)).sort((a, b) => sortBy === 'Lowest Price' ? a.price - b.price : sortBy === 'Highest Rating' ? b.rating - a.rating : b.id.localeCompare(a.id));

  const statCardsData = [
    { icon: '🌾', label: 'Available Crops', value: farmersList.length + vendorsList.length, color: '#2E7D32', sub: 'Active trading listings' },
    { icon: '🏪', label: 'Available Vendors', value: vendorsList.length, color: '#1565C0', sub: 'Verified bulk merchants' },
    { icon: '❤️', label: 'Wishlist', value: wishlist.length, color: '#E91E63', sub: 'Saved for later buys' },
    { icon: '📦', label: 'My Orders', value: orders.length, color: '#E65100', sub: 'Tracked purchases' }
  ];

  return (
    <div>
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? '#f44336' : '#4CAF50', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 9999 }}>{toast.msg}</div>}

      {/* HERO */}
      <section className="skm-welcome-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>👤 Customer Portal</span>
          <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>Customer Marketplace</h1>
          <p className="skm-text-muted" style={{ margin: '8px 0', fontSize: '13px' }}>Buy fresh crops directly from farmers or trusted vendors.<br/>Compare prices, quality, stock, ratings, and delivery options before purchasing.</p>
        </div>
      </section>

      <SummaryCards cards={statCardsData} />

      {/* TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1.5px solid var(--skm-border)', marginBottom: '20px', paddingBottom: '10px', overflowX: 'auto' }}>
        {[
          { id: 'browse', label: '🌾 Browse Crop Marketplace' },
          { id: 'compare', label: '⚖️ Compare Farmer vs Vendor' },
          { id: 'wishlist', label: `❤️ Saved Wishlist (${wishlist.length})` },
          { id: 'orders', label: `📦 My Order History (${orders.length})` }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? '#E8F5E9' : 'transparent', color: activeTab === t.id ? '#2E7D32' : 'var(--skm-text-muted)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'browse' && (
        <div style={{ background: 'var(--skm-bg)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search crops, farmers or vendors..." />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <input style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} placeholder="Location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
            <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={priceRangeFilter} onChange={e => setPriceRangeFilter(e.target.value)}><option value="All">All Prices</option><option value="Under 2500">Under ₹2500</option><option value="2500-5000">₹2500 - ₹5000</option></select>
            <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>{SORT_OPTIONS.map(o=><option key={o}>{o}</option>)}</select>
            <label><input type="checkbox" checked={organicFilter} onChange={e=>setOrganicFilter(e.target.checked)}/> 🌿 Organic</label>
            <label><input type="checkbox" checked={verifiedFilter} onChange={e=>setVerifiedFilter(e.target.checked)}/> ✓ Verified</label>
            <label><input type="checkbox" checked={deliveryFilter} onChange={e=>setDeliveryFilter(e.target.checked)}/> 🚚 Delivery</label>
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {CATEGORIES.map(c => <button key={c} onClick={() => setActiveCategory(c)} style={{ padding: '4px 12px', borderRadius: '16px', border: '1px solid var(--skm-border)', background: activeCategory === c ? '#2E7D32' : '#fff', color: activeCategory === c ? '#fff' : '#333' }}>{c}</button>)}
          </div>
        </div>
      )}

      <div>
        {activeTab === 'browse' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <div>
              <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                <h2 className="skm-section-title">🌾 Buy Directly From Farmers</h2>
              </div>
              <div className="skm-grid">
                {filteredFarmers.map(item => <CropCard key={item.id} crop={item} role="Customer" onBuy={() => handleBuyClick(item, 'farmer')} onWishlist={() => handleWishlistToggle(item, 'farmer')} isWishlisted={wishlist.some(w => w.id === item.id)} />)}
              </div>
            </div>
            <div>
              <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                <h2 className="skm-section-title">🏪 Buy From Agricultural Vendors</h2>
              </div>
              <div className="skm-grid">
                {filteredVendors.map(item => <CropCard key={item.id} crop={item} role="Customer" onBuy={() => handleBuyClick(item, 'vendor')} onWishlist={() => handleWishlistToggle(item, 'vendor')} isWishlisted={wishlist.some(w => w.id === item.id)} />)}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">⚖️ Mandi Price Comparison Desk</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {comparisonPairs.map((pair, idx) => {
                const bType = pair.farmer.price < pair.vendor.price ? 'farmer' : 'vendor';
                return (
                  <div key={idx} className="skm-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 className="skm-card-title">{pair.crop} Compare</h3>
                    <div className="skm-dual-row">
                      <div className="skm-stat-card" style={{ border: bType === 'farmer' ? '2px solid #2E7D32' : '1px solid var(--skm-border)' }}>
                        <div style={{ fontWeight: 'bold' }}>Farmer: {pair.farmer.farmerName}</div>
                        <div style={{ fontSize: '20px', color: 'var(--skm-primary)' }}>₹{pair.farmer.price} / Q</div>
                        <div className="skm-text-muted">Stock: {pair.farmer.stock} Q</div>
                        <button className="skm-action-btn" style={{ marginTop: '10px' }} onClick={() => handleBuyClick(pair.farmer, 'farmer')}>Buy from Farmer</button>
                      </div>
                      <div className="skm-stat-card" style={{ border: bType === 'vendor' ? '2px solid #2E7D32' : '1px solid var(--skm-border)' }}>
                        <div style={{ fontWeight: 'bold' }}>Vendor: {pair.vendor.vendorName}</div>
                        <div style={{ fontSize: '20px', color: 'var(--skm-primary)' }}>₹{pair.vendor.price} / Q</div>
                        <div className="skm-text-muted">Stock: {pair.vendor.stock} Q</div>
                        <button className="skm-action-btn" style={{ marginTop: '10px' }} onClick={() => handleBuyClick(pair.vendor, 'vendor')}>Buy from Vendor</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">❤️ My Saved Wishlist Items</h2>
            </div>
            <div className="skm-grid">
              {wishlist.map(item => <CropCard key={item.id} crop={item} role="Customer" onBuy={() => handleBuyClick(item, item.savedType)} onWishlist={() => handleWishlistToggle(item, item.savedType)} isWishlisted={true} />)}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">📦 Previous Order Fulfillment History</h2>
            </div>
            <div className="skm-table-card">
              <table className="skm-table">
                <thead><tr><th>Order ID</th><th>Crop</th><th>Seller</th><th>Qty</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px' }} className="skm-text-muted">{o.id}</td>
                      <td style={{ fontWeight: 700 }}>{o.cropName}</td>
                      <td>{o.sellerName} <span className="skm-badge">{o.sellerType}</span></td>
                      <td>{o.quantity} Q</td>
                      <td style={{ fontWeight: 800, color: 'var(--skm-primary)' }}>₹{o.totalPrice}</td>
                      <td><span className={`skm-status-badge ${o.deliveryStatus === 'Delivered' ? 'success' : 'warning'}`}>{o.deliveryStatus}</span></td>
                      <td className="skm-text-muted">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {buyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="skm-card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 className="skm-card-title">🛒 Checkout</h3>
            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>{buyModal.cropName}</strong> (₹{buyModal.price}/Q)</div>
              <input type="number" placeholder="Quantity" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={buyForm.quantity} onChange={e=>setBuyForm(p=>({...p, quantity: e.target.value}))}/>
              <textarea placeholder="Address" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={buyForm.address} onChange={e=>setBuyForm(p=>({...p, address: e.target.value}))}/>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="skm-action-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={() => setBuyModal(null)}>Cancel</button>
              <button className="skm-action-btn" style={{ flex: 1 }} onClick={handleBuySubmit}>Confirm Purchase</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
