import React from 'react';
import './CropCard.css';

const CropCard = ({ 
  crop, 
  role = 'Customer', 
  onEdit, 
  onDelete, 
  onView, 
  onBuy, 
  onWishlist, 
  onMessage, 
  onReview,
  onLike,
  isWishlisted = false
}) => {
  const isSoldOut = crop.stock === 0 || crop.status === 'Sold Out';

  return (
    <div className={`mkt-crop-card ${isSoldOut ? 'mkt-crop-card--soldout' : ''}`}>
      <div className="mkt-crop-card-top">
        <div className="mkt-crop-emoji-wrap">
          <span className="mkt-crop-emoji">{crop.emoji || crop.image || '🌾'}</span>
        </div>
        <div className="mkt-crop-badges">
          {crop.organic && <span className="mkt-badge mkt-badge--organic">🌿 Organic</span>}
          {crop.delivery && <span className="mkt-badge mkt-badge--delivery">🚚 Delivery</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`mkt-crop-status-pill ${isSoldOut ? 'mkt-status--soldout' : 'mkt-status--active'}`}>
            {isSoldOut ? '🔴 Sold Out' : '🟢 Active'}
          </span>
          {onLike && (
            <button
              className="mkt-like-btn"
              onClick={() => onLike(crop.id)}
              style={{ color: crop.liked ? '#E91E63' : '#ccc', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
            >
              ❤️
            </button>
          )}
        </div>
      </div>

      <h3 className="mkt-crop-name">{crop.name}</h3>
      <span className="mkt-crop-category-chip">{crop.category}</span>

      {/* Farmer details for buyers */}
      {role !== 'Farmer' && (crop.farmerName || crop.farmerRating) && (
        <div className="mkt-crop-farmer-row">
          <span className="mkt-farmer-avatar-sm">{crop.farmerAvatar || '👨‍🌾'}</span>
          <span className="mkt-farmer-name">{crop.farmerName || 'Farmer'}</span>
          {crop.farmerVerified && <span className="mkt-verified-sm">✓</span>}
          <span className="mkt-farmer-rating">⭐ {crop.farmerRating || '4.5'}</span>
        </div>
      )}

      <div className="mkt-crop-price-row">
        <span className="mkt-crop-price">₹{(crop.price || 0).toLocaleString()}</span>
        <span className="mkt-crop-unit">/{crop.unit || 'Quintal'}</span>
      </div>

      <div className="mkt-crop-info-grid">
        <div className="mkt-crop-info-item"><span>📦</span>{crop.stock > 0 ? `${crop.stock} Q` : 'Sold Out'}</div>
        <div className="mkt-crop-info-item"><span>⭐</span>{crop.quality || 'Grade A'}</div>
        <div className="mkt-crop-info-item"><span>🗓️</span>{crop.harvestDate || 'Fresh'}</div>
        <div className="mkt-crop-info-item"><span>📍</span>{crop.location || 'Maharashtra'}</div>
      </div>

      <div className="mkt-crop-engagement">
        <span>👁️ {crop.views || 0} views</span>
        <span>❤️ {crop.likes || 0} likes</span>
      </div>

      <div className="mkt-crop-actions">
        {role === 'Farmer' ? (
          <>
            <button className="mkt-btn mkt-btn--outline mkt-btn--sm" onClick={() => onEdit && onEdit(crop)}>✏️ Edit</button>
            <button className="mkt-btn mkt-btn--danger mkt-btn--sm" onClick={() => onDelete && onDelete(crop.id)}>🗑️ Delete</button>
            <button className="mkt-btn mkt-btn--primary mkt-btn--sm" onClick={() => onView && onView(crop)}>👁️ Details</button>
          </>
        ) : (
          <>
            <button 
              className="mkt-btn mkt-btn--primary mkt-btn--sm" 
              onClick={() => onBuy && onBuy(crop)}
              disabled={isSoldOut}
            >
              🛒 Buy Now
            </button>
            <button 
              className={`mkt-btn mkt-btn--sm ${isWishlisted ? 'mkt-btn--danger' : 'mkt-btn--outline'}`}
              onClick={() => onWishlist && onWishlist(crop)}
            >
              ❤️ {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button className="mkt-btn mkt-btn--outline mkt-btn--sm" onClick={() => onMessage && onMessage(crop)}>💬 Message</button>
            {onReview && (
              <button className="mkt-btn mkt-btn--outline mkt-btn--sm" onClick={() => onReview(crop)}>⭐ Review</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CropCard;
