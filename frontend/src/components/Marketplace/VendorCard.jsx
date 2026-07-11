import React from 'react';
import './VendorCard.css';

const VendorCard = ({
  vendor,
  onBuy,
  onMessage,
  onContact,
  onProfile,
  onReview,
  onLike
}) => {
  return (
    <div className="mkt-vendor-card">
      <div className="mkt-vendor-header">
        <div className="mkt-vendor-logo">{vendor.logo || '🏪'}</div>
        <div className="mkt-vendor-meta">
          <div className="mkt-vendor-name-row">
            <span className="mkt-vendor-name">{vendor.vendorName}</span>
            {vendor.verified && <span className="mkt-vendor-verified">✔ Verified Vendor</span>}
          </div>
          <div className="mkt-vendor-location">📍 {vendor.location}</div>
          <div className="mkt-vendor-rating">
            ⭐ {vendor.rating || '4.5'} · {vendor.reviews || '0'} reviews · ❤️ {vendor.likes || '0'} likes
          </div>
        </div>
        <button
          className="mkt-like-btn"
          onClick={() => onLike && onLike(vendor.id)}
          style={{ color: vendor.liked ? '#E91E63' : '#ccc' }}
        >
          ❤️
        </button>
      </div>

      <div className="mkt-vendor-crops">
        {(vendor.availableCrops || []).map((c, i) => (
          <span key={i} className="mkt-crop-chip">{c}</span>
        ))}
      </div>

      <div className="mkt-vendor-details">
        <div>📦 Available Stock: <strong>{vendor.availableStock || 'In Stock'}</strong></div>
        <div>💰 Selling Price: <strong>{vendor.price || 'Market Price'}</strong></div>
        <div>🚚 {vendor.deliveryAvailable ? 'Delivery Available' : 'Self-Pickup Only'}</div>
        <div>🕒 Business Hours: {vendor.businessHours || '9 AM – 6 PM'}</div>
        <div>
          <span className={`mkt-availability-badge mkt-availability--${(vendor.availabilityStatus || 'In Stock').toLowerCase().replace(' ', '-')}`}>
            🟢 {vendor.availabilityStatus || 'In Stock'}
          </span>
        </div>
      </div>

      <div className="mkt-vendor-actions">
        <button 
          className="mkt-vendor-btn mkt-vendor-btn--primary" 
          onClick={() => onBuy && onBuy(vendor)}
          disabled={vendor.availabilityStatus === 'Out of Stock'}
        >
          🛒 Buy From Vendor
        </button>
        <button className="mkt-vendor-btn mkt-vendor-btn--outline" onClick={() => onMessage && onMessage(vendor)}>
          💬 Message Vendor
        </button>
        <button className="mkt-vendor-btn mkt-vendor-btn--outline" onClick={() => onContact && onContact(vendor)}>
          📞 Contact Vendor
        </button>
        <button className="mkt-vendor-btn mkt-vendor-btn--ghost" onClick={() => onProfile && onProfile(vendor)}>
          👤 View Vendor Profile
        </button>
        <button className="mkt-vendor-btn mkt-vendor-btn--ghost" onClick={() => onReview && onReview(vendor)}>
          ⭐ Write Review
        </button>
        <button className="mkt-vendor-btn mkt-vendor-btn--ghost" onClick={() => onLike && onLike(vendor.id)}>
          ❤️ Like Vendor
        </button>
      </div>
    </div>
  );
};

export default VendorCard;
