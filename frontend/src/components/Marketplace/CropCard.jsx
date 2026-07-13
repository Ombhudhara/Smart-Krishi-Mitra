import React from 'react';

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
    <div className="skm-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: isSoldOut ? 0.7 : 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '32px' }}>
          {crop.emoji || crop.image || '🌾'}
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {crop.organic && <span className="skm-badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>🌿 Organic</span>}
          {crop.delivery && <span className="skm-badge" style={{ background: '#E3F2FD', color: '#1565C0' }}>🚚 Delivery</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className={`skm-status-badge ${isSoldOut ? 'danger' : 'success'}`}>
            {isSoldOut ? 'Sold Out' : 'Active'}
          </span>
          {onLike && (
            <button
              onClick={() => onLike(crop.id)}
              style={{ color: crop.liked ? '#E91E63' : '#ccc', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}
            >
              ❤️
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="skm-card-title" style={{ margin: 0, fontSize: '16px' }}>{crop.name}</h3>
        <span className="skm-text-muted" style={{ fontSize: '12px' }}>{crop.category}</span>
      </div>

      {/* Farmer details for buyers */}
      {role !== 'Farmer' && (crop.farmerName || crop.farmerRating) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span>{crop.farmerAvatar || '👨‍🌾'}</span>
          <span style={{ fontWeight: 600 }}>{crop.farmerName || 'Farmer'}</span>
          {crop.farmerVerified && <span style={{ color: '#2E7D32' }}>✓</span>}
          <span className="skm-text-muted">⭐ {crop.farmerRating || '4.5'}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--skm-primary)' }}>₹{(crop.price || 0).toLocaleString()}</span>
        <span className="skm-text-muted" style={{ fontSize: '12px' }}>/{crop.unit || 'Quintal'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', background: 'var(--skm-bg)', padding: '10px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}><span>📦</span><span style={{ fontWeight: 600 }}>{crop.stock > 0 ? `${crop.stock} Q` : 'Sold Out'}</span></div>
        <div style={{ display: 'flex', gap: '6px' }}><span>⭐</span><span style={{ fontWeight: 600 }}>{crop.quality || 'Grade A'}</span></div>
        <div style={{ display: 'flex', gap: '6px' }}><span>🗓️</span><span style={{ fontWeight: 600 }}>{crop.harvestDate || 'Fresh'}</span></div>
        <div style={{ display: 'flex', gap: '6px' }}><span>📍</span><span style={{ fontWeight: 600 }}>{crop.location || 'Maharashtra'}</span></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--skm-text-muted)' }}>
        <span>👁️ {crop.views || 0} views</span>
        <span>❤️ {crop.likes || 0} likes</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: 'auto' }}>
        {role === 'Farmer' ? (
          <>
            <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px', background: 'transparent', color: 'var(--skm-text-main)', border: '1px solid var(--skm-border)' }} onClick={() => onEdit && onEdit(crop)}>✏️ Edit</button>
            <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px', background: '#ffebee', color: '#c62828' }} onClick={() => onDelete && onDelete(crop.id)}>🗑️ Delete</button>
            <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px' }} onClick={() => onView && onView(crop)}>👁️ Details</button>
          </>
        ) : (
          <>
            <button 
              className="skm-action-btn"
              style={{ flex: '1 1 100%' }}
              onClick={() => onBuy && onBuy(crop)}
              disabled={isSoldOut}
            >
              🛒 Buy Now
            </button>
            <button 
              className="skm-action-btn"
              style={{ flex: 1, padding: '6px', fontSize: '12px', background: isWishlisted ? '#ffebee' : 'transparent', color: isWishlisted ? '#c62828' : 'var(--skm-text-main)', border: '1px solid var(--skm-border)' }}
              onClick={() => onWishlist && onWishlist(crop)}
            >
              ❤️ {isWishlisted ? 'Wishlisted' : 'Wishlist'}
            </button>
            <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px', background: 'transparent', color: 'var(--skm-text-main)', border: '1px solid var(--skm-border)' }} onClick={() => onMessage && onMessage(crop)}>💬 Message</button>
            {onReview && (
              <button className="skm-action-btn" style={{ flex: 1, padding: '6px', fontSize: '12px', background: 'transparent', color: 'var(--skm-text-main)', border: '1px solid var(--skm-border)' }} onClick={() => onReview(crop)}>⭐ Review</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CropCard;
