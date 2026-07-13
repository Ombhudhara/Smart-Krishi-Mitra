import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from './SearchBar';
import SummaryCards from './SummaryCards';
import VendorTransactionHistory from './VendorTransactionHistory';
import CropCard from './CropCard';
import { getListings } from '../../services/marketplaceService';
import { createTransaction as createTransactionApi } from '../../services/transactionService';

const INITIAL_INVENTORY = [
  { id: 'inv-1', cropImage: '🌾', cropName: 'Sharbati Wheat', purchasedQty: 300, remainingStock: 180, purchasePrice: 2200, sellingPrice: 2600, supplierName: 'Raj Patel', purchaseDate: '2026-06-15' },
  { id: 'inv-2', cropImage: '🍚', cropName: 'Basmati Rice', purchasedQty: 150, remainingStock: 120, purchasePrice: 4500, sellingPrice: 5200, supplierName: 'Mahesh Chauhan', purchaseDate: '2026-06-20' },
  { id: 'inv-3', cropImage: '☁️', cropName: 'Bt Cotton', purchasedQty: 400, remainingStock: 400, purchasePrice: 6200, sellingPrice: 7100, supplierName: 'Om Bhudhara', purchaseDate: '2026-06-28' }
];

const INITIAL_PURCHASE_REQUESTS = [
  { id: 'req-1', cropName: 'Sharbati Wheat', cropImage: '🌾', qty: 150, price: 2300, farmerName: 'Raj Patel', status: 'Pending' },
  { id: 'req-2', cropName: 'Kharif Groundnut', cropImage: '🥜', qty: 100, price: 5100, farmerName: 'Ramesh Solanki', status: 'Approved' }
];

const RECENT_PURCHASES = [
  { id: 'txn-001', cropName: 'Bt Cotton', farmerName: 'Om Bhudhara', quantity: '100 Q', price: '₹6,50,000', date: '2026-06-28', paymentStatus: 'Paid' },
  { id: 'txn-002', cropName: 'Basmati Rice', farmerName: 'Mahesh Chauhan', quantity: '50 Q', price: '₹2,40,000', date: '2026-06-20', paymentStatus: 'Paid' },
  { id: 'txn-003', cropName: 'Sharbati Wheat', farmerName: 'Raj Patel', quantity: '80 Q', price: '₹1,88,000', date: '2026-06-15', paymentStatus: 'Pending' }
];

const ACTIVITIES = [
  { id: 1, text: 'Purchased 100 Q Bt Cotton from Om Bhudhara.', time: '2 hours ago', type: 'purchase', icon: '🛒' },
  { id: 2, text: 'Farmer Ramesh Solanki listed a new Groundnut batch.', time: '4 hours ago', type: 'listing', icon: '🌾' },
  { id: 3, text: 'Inventory stock for Basmati Rice updated by system.', time: '1 day ago', type: 'system', icon: '⚙️' },
  { id: 4, text: 'Customer Neha Patel bought 10 Q Sharbati Wheat from your stock.', time: '2 days ago', type: 'sale', icon: '✅' }
];

const CATEGORIES = ['All', 'Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize'];
const SORT_OPTIONS = ['Latest', 'Lowest Price', 'Highest Rating', 'Most Stock'];

export default function VendorView() {
  const [farmersList, setFarmersList] = useState([]);
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

  const [buyModal, setBuyModal] = useState(null);
  const [buyForm, setBuyForm] = useState({ quantity: '', message: '' });
  const [editInventoryModal, setEditInventoryModal] = useState(null);
  const [editInventoryForm, setEditInventoryForm] = useState({ remainingStock: '', sellingPrice: '' });
  const [viewDetailsModal, setViewDetailsModal] = useState(null);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, reviewText: '' });

  const showToast = useCallback((msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); }, []);

  const fetchFarmersList = async () => {
    try {
      const res = await getListings();
      if (res.data?.success) {
        const mapped = res.data.listings
          .filter((l) => l.seller?.role === 'Farmer')
          .map((l) => ({
            id: l._id, _id: l._id, farmerName: l.seller?.fullName || 'Farmer',
            farmerAvatar: l.seller?.fullName ? l.seller.fullName.split(' ').map((n) => n[0]).join('') : 'OB',
            farmerVerified: true, farmerRating: 4.8, farmerReviews: 64,
            cropName: l.title || l.cropName, name: l.title || l.cropName,
            cropImage: l.category === 'Rice' ? '🍚' : (l.category === 'Cotton' ? '☁️' : '🌾'), emoji: l.category === 'Rice' ? '🍚' : (l.category === 'Cotton' ? '☁️' : '🌾'),
            category: l.category || 'Wheat', stock: l.quantity || 0, unit: l.unit || 'Quintal', price: l.price || 0,
            location: l.location || '', harvestDate: l.harvestDate ? new Date(l.harvestDate).toISOString().split('T')[0] : '',
            organic: l.isOrganic || false, delivery: l.deliveryAvailable || false, phone: l.seller?.phone || '',
            seller: l.seller, sellerId: l.seller?._id,
          }));
        setFarmersList(mapped);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchFarmersList(); }, []);

  const handleBuyClick = (listing) => { setBuyModal(listing); setBuyForm({ quantity: '', message: '' }); };
  
  const handleBuySubmit = async () => {
    if (!buyForm.quantity || Number(buyForm.quantity) <= 0) return showToast('Please enter a valid quantity.', 'error');
    if (Number(buyForm.quantity) > buyModal.stock) return showToast('Requested quantity exceeds available stock.', 'error');
    try {
      const res = await createTransactionApi({ sellerId: buyModal.seller?._id || buyModal.sellerId, cropName: buyModal.cropName, quantity: Number(buyForm.quantity), price: Number(buyModal.price), listingId: buyModal._id || buyModal.id });
      if (res.data?.success) {
        showToast(`Purchase request for ${buyForm.quantity} Q of ${buyModal.cropName} sent!`);
        setFarmersList(prev => prev.map(f => f.id === buyModal.id ? { ...f, stock: f.stock - Number(buyForm.quantity) } : f));
        setBuyModal(null);
        fetchFarmersList();
      }
    } catch (err) { showToast('Failed to submit purchase request.', 'error'); }
  };

  const handleCancelRequest = (reqId) => { setPurchaseRequests(prev => prev.filter(r => r.id !== reqId)); showToast('Purchase request cancelled.', 'error'); };

  const handleEditInventoryClick = (item) => { setEditInventoryModal(item); setEditInventoryForm({ remainingStock: item.remainingStock, sellingPrice: item.sellingPrice }); };
  const handleEditInventorySubmit = () => {
    if (Number(editInventoryForm.remainingStock) < 0 || Number(editInventoryForm.sellingPrice) <= 0) return showToast('Please enter valid details.', 'error');
    setInventory(prev => prev.map(item => item.id === editInventoryModal.id ? { ...item, remainingStock: Number(editInventoryForm.remainingStock), sellingPrice: Number(editInventoryForm.sellingPrice) } : item));
    setEditInventoryModal(null); showToast('Inventory updated successfully!');
  };
  const handleRemoveInventory = (itemId) => { setInventory(prev => prev.filter(item => item.id !== itemId)); showToast('Inventory item removed.', 'error'); };

  const handleReviewClick = (listing) => { setReviewModal(listing); setReviewForm({ rating: 5, reviewText: '' }); };
  const handleReviewSubmit = () => { if (!reviewForm.reviewText.trim()) return showToast('Please write a review.', 'error'); showToast(`Review submitted!`); setReviewModal(null); };

  const filteredListings = farmersList.filter(l => {
    const q = searchTerm.toLowerCase();
    return (l.cropName.toLowerCase().includes(q) || l.farmerName.toLowerCase().includes(q) || l.location.toLowerCase().includes(q)) &&
           (activeCategory === 'All' || l.category === activeCategory) &&
           (!locationFilter || l.location.toLowerCase().includes(locationFilter.toLowerCase())) &&
           (!organicFilter || l.organic) && (!deliveryFilter || l.delivery) && (!verifiedFilter || l.farmerVerified);
  }).sort((a, b) => {
    if (sortBy === 'Lowest Price') return a.price - b.price;
    if (sortBy === 'Highest Rating') return b.farmerRating - a.farmerRating;
    if (sortBy === 'Most Stock') return b.stock - a.stock;
    return b.id.localeCompare(a.id);
  });

  const totalPurchasesAmount = RECENT_PURCHASES.reduce((acc, curr) => acc + parseInt(curr.price.replace(/[^\d]/g, ''), 10), 0);
  const inventoryValue = inventory.reduce((acc, curr) => acc + (curr.remainingStock * curr.sellingPrice), 0);

  const summaryCardsData = [
    { icon: '🌾', label: 'Farmer Listings', value: filteredListings.length, color: '#2E7D32', sub: 'Verified growers nearby' },
    { icon: '📦', label: 'My Inventory', value: `${inventory.reduce((a,b)=>a+b.remainingStock,0)} Q`, color: '#1565C0', sub: 'In commercial stock' },
    { icon: '💰', label: 'Total Purchases', value: `₹${(totalPurchasesAmount / 100000).toFixed(1)}L`, color: '#E65100', sub: 'Procurement ledger' },
    { icon: '💬', label: 'New Messages', value: '4', color: '#6A1B9A', sub: 'Farmer negotiations' }
  ];

  return (
    <div>
      {toast && <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? '#f44336' : '#4CAF50', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 9999 }}>{toast.msg}</div>}

      {/* HERO */}
      <section className="skm-welcome-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>🏪 Partner Portal</span>
          <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>Vendor Marketplace</h1>
          <p className="skm-text-muted" style={{ margin: '8px 0', fontSize: '13px' }}>Purchase crops directly from farmers, manage your agricultural inventory, fulfill customer demand, and grow your business.</p>
        </div>
      </section>

      <SummaryCards cards={summaryCardsData} />

      {/* TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1.5px solid var(--skm-border)', marginBottom: '20px', paddingBottom: '10px', overflowX: 'auto' }}>
        {[
          { id: 'farmers', label: `🌾 Farmer Crop Listings` },
          { id: 'inventory', label: `📦 My Inventory` },
          { id: 'requests', label: `⏳ Purchase Requests (${purchaseRequests.length})` },
          { id: 'recent', label: `📜 Transaction History` },
          { id: 'activity', label: `⚡ Activity Center` }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? '#E8F5E9' : 'transparent', color: activeTab === t.id ? '#2E7D32' : 'var(--skm-text-muted)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>{t.label}</button>
        ))}
      </div>

      {activeTab === 'farmers' && (
        <div style={{ background: 'var(--skm-bg)', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Search crops, farmers or locations..." />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            <input style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} placeholder="Location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
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

      {/* CONTENT */}
      <div>
        {activeTab === 'farmers' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">🌾 Farmer Crop Listings</h2>
            </div>
            <div className="skm-grid">
              {filteredListings.map(item => (
                <CropCard key={item.id} crop={item} role="Customer" onBuy={() => handleBuyClick(item)} onReview={() => handleReviewClick(item)} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">📦 Vendor Inventory Management</h2>
            </div>
            <div className="skm-grid">
              {inventory.map(item => (
                <div key={item.id} className="skm-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '32px' }}>{item.cropImage}</span>
                    <h3 className="skm-card-title">{item.cropName}</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: 'var(--skm-bg)', padding: '10px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span className="skm-text-muted">Remaining Stock</span><strong>{item.remainingStock} Q</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span className="skm-text-muted">Procured Quantity</span><strong>{item.purchasedQty} Q</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span className="skm-text-muted">Buy Cost</span><strong>₹{item.purchasePrice}/Q</strong></div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}><span className="skm-text-muted">Sell Price</span><strong style={{ color: 'var(--skm-primary)' }}>₹{item.sellingPrice}/Q</strong></div>
                  </div>
                  <div className="skm-text-muted" style={{ fontSize: '12px' }}>
                    <div>👤 Supplier: {item.supplierName}</div>
                    <div>📅 Bought on: {item.purchaseDate}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px', background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={() => handleEditInventoryClick(item)}>✏️ Edit</button>
                    <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px', background: '#ffebee', color: '#c62828' }} onClick={() => handleRemoveInventory(item.id)}>🗑️ Remove</button>
                    <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => setViewDetailsModal(item)}>👁️ Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">⏳ Procurement Requests</h2>
            </div>
            <div className="skm-preview-list">
              {purchaseRequests.map(req => (
                <div key={req.id} className="skm-preview-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '24px' }}>{req.cropImage}</span>
                    <div>
                      <h4 style={{ margin: 0 }}>{req.cropName}</h4>
                      <div className="skm-text-muted" style={{ fontSize: '12px' }}>Offer: <strong>₹{req.price}/Q</strong> for <strong>{req.qty} Q</strong> | Farmer: {req.farmerName}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`skm-status-badge ${req.status === 'Approved' ? 'success' : 'warning'}`}>{req.status}</span>
                    <button className="skm-action-btn" style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px' }} onClick={() => handleCancelRequest(req.id)}>Cancel Request</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recent' && <VendorTransactionHistory />}

        {activeTab === 'activity' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">⚡ System Activity Log</h2>
            </div>
            <div className="skm-preview-list">
              {ACTIVITIES.map(act => (
                <div key={act.id} className="skm-preview-item" style={{ gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{act.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{act.text}</div>
                    <div className="skm-text-muted" style={{ fontSize: '11px' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="skm-card" style={{ marginTop: '24px' }}>
              <h3 className="skm-card-title">📊 Quick Performance Stats</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
                <div className="skm-stat-card"><span className="skm-stat-label">Today's Purchases</span><span className="skm-stat-value">120 Q</span></div>
                <div className="skm-stat-card"><span className="skm-stat-label">Total Inventory Value</span><span className="skm-stat-value">₹{inventoryValue.toLocaleString()}</span></div>
                <div className="skm-stat-card"><span className="skm-stat-label">Pending Requests</span><span className="skm-stat-value">{purchaseRequests.filter(r=>r.status==='Pending').length}</span></div>
                <div className="skm-stat-card"><span className="skm-stat-label">Completed Deals</span><span className="skm-stat-value">28</span></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {buyModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="skm-card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 className="skm-card-title">🛒 Order Crop Procurement</h3>
            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>{buyModal.cropImage} <strong>{buyModal.cropName}</strong> (₹{buyModal.price}/Q) - {buyModal.farmerName}</div>
              <input type="number" placeholder="Quantity (Q)" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={buyForm.quantity} onChange={e=>setBuyForm(p=>({...p, quantity: e.target.value}))}/>
              <span className="skm-text-muted" style={{ fontSize: '11px' }}>Available: {buyModal.stock} Q</span>
              <textarea placeholder="Negotiation Message (Optional)" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={buyForm.message} onChange={e=>setBuyForm(p=>({...p, message: e.target.value}))}/>
              {buyForm.quantity && <div>Estimated Total: <strong>₹{(buyModal.price * Number(buyForm.quantity)).toLocaleString()}</strong></div>}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="skm-action-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={() => setBuyModal(null)}>Cancel</button>
              <button className="skm-action-btn" style={{ flex: 1 }} onClick={handleBuySubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {editInventoryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="skm-card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 className="skm-card-title">✏️ Edit Inventory</h3>
            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>{editInventoryModal.cropImage} <strong>{editInventoryModal.cropName}</strong> (Buy Cost: ₹{editInventoryModal.purchasePrice}/Q)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label>Remaining Stock (Q)</label><input type="number" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={editInventoryForm.remainingStock} onChange={e=>setEditInventoryForm(p=>({...p, remainingStock: e.target.value}))}/></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label>Selling Price (₹)</label><input type="number" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={editInventoryForm.sellingPrice} onChange={e=>setEditInventoryForm(p=>({...p, sellingPrice: e.target.value}))}/></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="skm-action-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={() => setEditInventoryModal(null)}>Cancel</button>
              <button className="skm-action-btn" style={{ flex: 1 }} onClick={handleEditInventorySubmit}>Save</button>
            </div>
          </div>
        </div>
      )}

      {viewDetailsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="skm-card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 className="skm-card-title">👁️ Details</h3>
            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Crop</span><strong>{viewDetailsModal.cropImage} {viewDetailsModal.cropName}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Supplier Farmer</span><strong>{viewDetailsModal.supplierName}</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Purchase Quantity</span><strong>{viewDetailsModal.purchasedQty} Q</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Remaining Stock</span><strong>{viewDetailsModal.remainingStock} Q</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Procurement Cost</span><strong>₹{viewDetailsModal.purchasePrice}/Q</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Retail Selling Price</span><strong>₹{viewDetailsModal.sellingPrice}/Q</strong></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="skm-text-muted">Purchase Date</span><strong>{viewDetailsModal.purchaseDate}</strong></div>
            </div>
            <button className="skm-action-btn" style={{ width: '100%' }} onClick={() => setViewDetailsModal(null)}>Close</button>
          </div>
        </div>
      )}

      {reviewModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="skm-card" style={{ width: '400px', maxWidth: '90%' }}>
            <h3 className="skm-card-title">⭐ Rate Farmer Supplier</h3>
            <div style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>How was your procurement experience with <strong>{reviewModal.farmerName}</strong>?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label>Rating</label><select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={reviewForm.rating} onChange={e=>setReviewForm(p=>({...p, rating: Number(e.target.value)}))}><option value={5}>⭐⭐⭐⭐⭐ (5/5)</option><option value={4}>⭐⭐⭐⭐ (4/5)</option><option value={3}>⭐⭐⭐ (3/5)</option><option value={2}>⭐⭐ (2/5)</option><option value={1}>⭐ (1/5)</option></select></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label>Review Remarks</label><textarea style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} rows={3} value={reviewForm.reviewText} onChange={e=>setReviewForm(p=>({...p, reviewText: e.target.value}))}/></div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="skm-action-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="skm-action-btn" style={{ flex: 1 }} onClick={handleReviewSubmit}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
