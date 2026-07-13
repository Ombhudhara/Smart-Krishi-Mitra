import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../Modal/Modal';
import SummaryCards from './SummaryCards';
import CropCard from './CropCard';
import { getMyListings, createListing, updateListing, deleteListing } from '../../services/mylistingService';

const VENDOR_REQUESTS = [
  { id: 1, vendorName: 'Krishna Agro Traders', logo: 'KA', verified: true, location: 'Ahmedabad, Gujarat', crop: '☁️ Cotton', quantity: '200 Q', buyingPrice: 6400, rating: 4.8, reviews: 156, phone: '+91 98765 43210', status: 'Pending', message: 'Need 200 quintals of Bt cotton immediately for spinning mill.', date: 'Jun 30, 2026' },
  { id: 2, vendorName: 'Green Harvest Agro', logo: 'GH', verified: true, location: 'Rajkot, Gujarat', crop: '🌾 Wheat', quantity: '100 Q', buyingPrice: 2300, rating: 4.6, reviews: 89, phone: '+91 87654 32109', status: 'Pending', message: 'Regular wheat supply needed for flour processing unit.', date: 'Jun 29, 2026' },
  { id: 3, vendorName: 'AgroMart Gujarat', logo: 'AG', verified: true, location: 'Surat, Gujarat', crop: '🍚 Basmati Rice', quantity: '50 Q', buyingPrice: 4700, rating: 4.9, reviews: 210, phone: '+91 76543 21098', status: 'Accepted', message: 'Export-quality Basmati for overseas shipment next month.', date: 'Jun 27, 2026' },
];

const CUSTOMER_REQUESTS = [
  { id: 1, customerName: 'Rahul Shah', avatar: 'RS', location: 'Surat, Gujarat', crop: '🌾 Wheat', quantity: '10 Q', budget: 2400, rating: 4.5, phone: '+91 98700 11223', status: 'Pending', message: 'Need wheat for my bakery. Looking for Grade A quality.', date: 'Jun 30, 2026' },
  { id: 2, customerName: 'Amit Sharma', avatar: 'AS', location: 'Mumbai, Maharashtra', crop: '🍚 Basmati Rice', quantity: '5 Q', budget: 4800, rating: 4.7, phone: '+91 87600 22334', status: 'Pending', message: 'Organic Basmati for restaurant chain supply.', date: 'Jun 28, 2026' },
  { id: 3, customerName: 'Neha Patel', avatar: 'NP', location: 'Vadodara, Gujarat', crop: '☁️ Cotton', quantity: '20 Q', budget: 6300, rating: 4.3, phone: '+91 76500 33445', status: 'Accepted', message: 'Need desi cotton for handloom textile unit.', date: 'Jun 26, 2026' },
];

const TRANSACTIONS = [
  { id: 'TXN-84920', crop: '🌾 Wheat', buyer: 'AgroMart Gujarat', buyerType: 'Vendor', qty: '50 Q', price: '₹1,17,500', status: 'Completed', date: 'Jun 28, 2026' },
  { id: 'TXN-90210', crop: '🍚 Basmati Rice', buyer: 'Amit Sharma', buyerType: 'Customer', qty: '30 Q', price: '₹1,44,000', status: 'Shipped', date: 'Jun 27, 2026' },
  { id: 'TXN-65109', crop: '☁️ Cotton', buyer: 'Krishna Agro Traders', buyerType: 'Vendor', qty: '100 Q', price: '₹6,50,000', status: 'Completed', date: 'Jun 25, 2026' },
];

const ACTIVITIES = [
  { id: 1, icon: '👁️', text: 'Rahul Shah viewed your Premium Bt Cotton listing', time: '10 minutes ago', type: 'view' },
  { id: 2, icon: '📩', text: 'Krishna Agro Traders sent a purchase request for Cotton', time: '45 minutes ago', type: 'request' },
  { id: 3, icon: '✅', text: 'Cotton shipment to AgroMart Gujarat confirmed successful', time: '2 hours ago', type: 'sale' },
];



const VendorRequestCard = ({ req, onAccept, onReject, onMessage }) => (
  <div className="skm-preview-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#E3F2FD', color: '#1565C0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{req.logo}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{req.vendorName} {req.verified && <span style={{ color: '#2E7D32' }}>✔</span>}</div>
          <div className="skm-text-muted" style={{ fontSize: '11px' }}>📍 {req.location}</div>
        </div>
      </div>
      <span className={`skm-status-badge ${req.status === 'Accepted' ? 'success' : 'warning'}`}>{req.status}</span>
    </div>
    <div className="skm-text-muted" style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
      <span>{req.crop}</span><span>📦 {req.quantity}</span><span>💰 ₹{req.buyingPrice}/Q</span>
    </div>
    <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#555' }}>"{req.message}"</p>
    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
      {req.status === 'Pending' && (
        <>
          <button className="skm-action-btn" style={{ background: '#E8F5E9', color: '#2E7D32', border: 'none', padding: '6px 12px' }} onClick={() => onAccept(req.id, 'vendor')}>✅ Accept</button>
          <button className="skm-action-btn" style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px' }} onClick={() => onReject(req.id, 'vendor')}>❌ Reject</button>
        </>
      )}
      <button className="skm-action-btn" style={{ border: '1px solid var(--skm-border)', background: 'transparent', padding: '6px 12px' }} onClick={() => onMessage(req)}>💬 Message</button>
    </div>
  </div>
);

const CustomerRequestCard = ({ req, onAccept, onReject, onMessage }) => (
  <div className="skm-preview-item" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F3E5F5', color: '#6A1B9A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{req.avatar}</div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{req.customerName}</div>
          <div className="skm-text-muted" style={{ fontSize: '11px' }}>📍 {req.location}</div>
        </div>
      </div>
      <span className={`skm-status-badge ${req.status === 'Accepted' ? 'success' : 'warning'}`}>{req.status}</span>
    </div>
    <div className="skm-text-muted" style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
      <span>{req.crop}</span><span>📦 {req.quantity}</span><span>💰 Budget: ₹{req.budget}/Q</span>
    </div>
    <p style={{ margin: 0, fontSize: '12px', fontStyle: 'italic', color: '#555' }}>"{req.message}"</p>
    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
      {req.status === 'Pending' && (
        <>
          <button className="skm-action-btn" style={{ background: '#E8F5E9', color: '#2E7D32', border: 'none', padding: '6px 12px' }} onClick={() => onAccept(req.id, 'customer')}>✅ Accept Order</button>
          <button className="skm-action-btn" style={{ background: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px' }} onClick={() => onReject(req.id, 'customer')}>❌ Reject</button>
        </>
      )}
      <button className="skm-action-btn" style={{ border: '1px solid var(--skm-border)', background: 'transparent', padding: '6px 12px' }} onClick={() => onMessage(req)}>💬 Message</button>
    </div>
  </div>
);

const AddEditCropModal = ({ crop, onClose, onSave }) => {
  const [form, setForm] = useState(crop || { name: '', category: 'Cotton', stock: '', price: '', unit: 'Quintal', harvestDate: '', quality: 'Grade A', organic: false, delivery: true, location: '', desc: '', emoji: '🌾' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Modal isOpen={true} title={crop ? 'Edit Crop Listing' : 'Add New Crop'} onClose={onClose} variant="default" size="lg" actions={<><button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={onClose}>Cancel</button><button className="skm-action-btn" onClick={() => onSave(form)}>{crop ? '💾 Save Changes' : '✅ Add Listing'}</button></>}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Crop Name *</label><input style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--skm-border)' }} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Premium Bt Cotton" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Category *</label><select style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--skm-border)' }} value={form.category} onChange={e => set('category', e.target.value)}>{['Cotton', 'Wheat', 'Rice', 'Groundnut', 'Maize', 'Vegetables', 'Fruits', 'Pulses', 'Spices'].map(c => <option key={c}>{c}</option>)}</select></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Available Stock (Quintals) *</label><input style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--skm-border)' }} type="number" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="e.g. 500" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Price per Quintal (₹) *</label><input style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--skm-border)' }} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 6500" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Harvest Date</label><input style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--skm-border)' }} type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}><label style={{ fontSize: '12px', fontWeight: 'bold' }}>Location</label><input style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--skm-border)' }} value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Rajkot, Gujarat" /></div>
      </div>
    </Modal>
  );
};

export default function FarmerView() {
  const [crops, setCrops] = useState([]);
  const [vendorReqs, setVendorReqs] = useState(VENDOR_REQUESTS);
  const [customerReqs, setCustomerReqs] = useState(CUSTOMER_REQUESTS);
  const [activeTab, setActiveTab] = useState('listings');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCrop, setEditCrop] = useState(null);
  const [toast, setToast] = useState(null);

  const totalStock = crops.reduce((s, c) => s + c.stock, 0);
  const totalRevenue = crops.reduce((s, c) => s + c.stock * c.price, 0);
  const pendingVendor = vendorReqs.filter(r => r.status === 'Pending').length;
  const pendingCustomer = customerReqs.filter(r => r.status === 'Pending').length;

  const showToast = useCallback((msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); }, []);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await getMyListings();
        if (res.data?.success) {
          const normalized = res.data.listings.map((l) => ({
            id: l._id, _id: l._id, name: l.title || l.cropName, cropName: l.cropName, category: l.category || 'Wheat', emoji: l.category === 'Rice' ? '🍚' : (l.category === 'Cotton' ? '☁️' : '🌾'), stock: l.quantity || 0, unit: l.unit || 'kg', price: l.price || 0, harvestDate: l.harvestDate ? new Date(l.harvestDate).toISOString().split('T')[0] : '', organic: l.isOrganic || false, delivery: l.deliveryAvailable || false, views: l.views || 0, likes: l.likes || 0, location: l.location || '', status: l.status || 'Active', farmerName: l.seller?.fullName || 'You', quality: l.quality || 'Grade A', desc: l.description || '',
          }));
          setCrops(normalized);
        }
      } catch (err) { console.error(err); }
    };
    fetchCrops();
  }, []);

  const handleSaveCrop = async (form) => {
    const payload = { title: form.name, cropName: form.name, category: form.category, quantity: Number(form.stock), unit: form.unit, price: Number(form.price), harvestDate: form.harvestDate, quality: form.quality, isOrganic: form.organic, deliveryAvailable: form.delivery, location: form.location, description: form.desc };
    try {
      if (editCrop) { await updateListing(editCrop._id, payload); showToast(`"${form.name}" updated successfully!`); }
      else { await createListing(payload); showToast(`"${form.name}" listed successfully!`); }
      setShowAddModal(false); setEditCrop(null);
    } catch (err) { console.error(err); showToast('Failed to save crop listing.', 'error'); }
  };

  const filteredCrops = crops;

  const statCardsData = [
    { icon: '🌾', value: crops.filter(c => c.status === 'Active').length, label: "Active Listings", color: "#2E7D32", sub: `${crops.length} total crops` },
    { icon: '📦', value: `${totalStock.toLocaleString()} Q`, label: "Available Stock", color: "#1565C0", sub: "Combined inventory" },
    { icon: '💰', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, label: "Expected Revenue", color: "#E65100", sub: "At current prices" },
    { icon: '💬', value: pendingVendor + pendingCustomer, label: "New Requests", color: "#6A1B9A", sub: `${pendingVendor} vendor · ${pendingCustomer} customer` }
  ];

  return (
    <div>
      {toast && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: toast.type === 'error' ? '#f44336' : '#4CAF50', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 9999 }}>
          {toast.msg}
        </div>
      )}

      {/* HERO / WELCOME */}
      <section className="skm-welcome-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>🌾 Farmer Dashboard</span>
          <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>Farmer Marketplace</h1>
          <p className="skm-text-muted" style={{ margin: '8px 0', fontSize: '13px' }}>Manage your crop listings, connect with customers and vendors, and monitor your farming business.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button className="skm-action-btn" onClick={() => setShowAddModal(true)}>➕ Add New Crop Listing</button>
            <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={() => setActiveTab('transactions')}>📜 View Transactions</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <SummaryCards cards={statCardsData} />

      {/* TABS */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1.5px solid var(--skm-border)', marginBottom: '20px', paddingBottom: '10px', overflowX: 'auto' }}>
        {[
          { id: 'listings', label: `🌾 My Listings (${crops.length})` },
          { id: 'vendor-reqs', label: `🏪 Vendor Requests (${vendorReqs.length})` },
          { id: 'customer-reqs', label: `👤 Customer Requests (${customerReqs.length})` },
          { id: 'transactions', label: `📜 Transactions (${TRANSACTIONS.length})` },
          { id: 'activity', label: '⚡ Activity' }
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? '#E8F5E9' : 'transparent', color: activeTab === t.id ? '#2E7D32' : 'var(--skm-text-muted)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === 'listings' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">🌾 My Crop Listings</h2>
            </div>
            <div className="skm-grid">
              {filteredCrops.map(crop => (
                <CropCard key={crop.id} crop={crop} role="Farmer" onEdit={c => { setEditCrop(c); setShowAddModal(true); }} onDelete={async id => { await deleteListing(id); setCrops(prev => prev.filter(c => c.id !== id)); showToast('Crop removed'); }} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'vendor-reqs' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">🏪 Vendor Purchase Requests</h2>
            </div>
            <div className="skm-preview-list">
              {vendorReqs.map(req => <VendorRequestCard key={req.id} req={req} onAccept={id => setVendorReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r))} onReject={id => setVendorReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r))} onMessage={() => showToast('Opening chat')} />)}
            </div>
          </div>
        )}

        {activeTab === 'customer-reqs' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">👤 Customer Purchase Requests</h2>
            </div>
            <div className="skm-preview-list">
              {customerReqs.map(req => <CustomerRequestCard key={req.id} req={req} onAccept={id => setCustomerReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Accepted' } : r))} onReject={id => setCustomerReqs(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r))} onMessage={() => showToast('Opening chat')} />)}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">📜 Recent Transactions</h2>
            </div>
            <div className="skm-table-card">
              <table className="skm-table">
                <thead><tr><th>Transaction ID</th><th>Crop</th><th>Buyer</th><th>Quantity</th><th>Price</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {TRANSACTIONS.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ fontFamily: 'monospace', fontSize: '11px' }} className="skm-text-muted">{tx.id}</td>
                      <td style={{ fontWeight: 700 }}>{tx.crop}</td>
                      <td>{tx.buyer} <span className="skm-text-muted" style={{ fontSize: '10px' }}>({tx.buyerType})</span></td>
                      <td>{tx.qty}</td>
                      <td style={{ fontWeight: 800, color: 'var(--skm-primary)' }}>{tx.price}</td>
                      <td><span className={`skm-status-badge ${tx.status === 'Completed' ? 'success' : 'warning'}`}>{tx.status}</span></td>
                      <td className="skm-text-muted">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <div className="skm-section-header" style={{ marginBottom: '16px' }}>
              <h2 className="skm-section-title">⚡ Marketplace Activity</h2>
            </div>
            <div className="skm-preview-list">
              {ACTIVITIES.map(act => (
                <div key={act.id} className="skm-preview-item" style={{ gap: '12px' }}>
                  <span>{act.icon}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '13px' }}>{act.text}</div>
                    <div className="skm-text-muted" style={{ fontSize: '11px' }}>{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddEditCropModal crop={editCrop} onClose={() => { setShowAddModal(false); setEditCrop(null); }} onSave={handleSaveCrop} />}
    </div>
  );
}
