import React from 'react';
import './FarmerCard.css';

const FarmerCard = ({
  farmer,
  onBuy,
  onMessage,
  onProfile,
  onLike
}) => {
  return (
    <div className="mkt-farmer-card">
      <div className="mkt-farmer-header">
        <div className="mkt-farmer-avatar">{farmer.avatar || '👨‍🌾'}</div>
        <div className="mkt-farmer-meta">
          <div className="mkt-farmer-name-row">
            <span className="mkt-farmer-name">{farmer.name}</span>
            {farmer.verified && <span className="mkt-verified-badge">✓ Verified</span>}
          </div>
          <div className="mkt-farmer-location">📍 {farmer.location}</div>
        </div>
        <button
          className="mkt-like-btn"
          onClick={() => onLike && onLike(farmer.id)}
          style={{ color: farmer.liked ? '#E91E63' : '#ccc' }}
        >
          ❤️
        </button>
      </div>

      <div className="mkt-farmer-rating">
        ⭐ {farmer.rating || '4.5'} · {farmer.reviews || '0'} reviews · {farmer.completedTrades || '0'} trades
      </div>

      <div className="mkt-farmer-crops">
        {(farmer.crops || []).map((crop, i) => (
          <span key={i} className="mkt-crop-chip">{crop}</span>
        ))}
      </div>

      <div className="mkt-farmer-details">
        <div>📦 Stock: <strong>{farmer.availableStock}</strong></div>
        <div>💰 Price Range: <strong>{farmer.priceRange}</strong></div>
        <div>🛒 Min Order: {farmer.minOrder || '10 Q'}</div>
        <div>⚡ Response Time: {farmer.responseTime || '< 4 hrs'}</div>
      </div>

      <div className="mkt-farmer-actions">
        <button className="mkt-farmer-btn mkt-farmer-btn--primary" onClick={() => onBuy && onBuy(farmer)}>
          🛒 Buy Crops
        </button>
        <button className="mkt-farmer-btn mkt-farmer-btn--outline" onClick={() => onMessage && onMessage(farmer)}>
          💬 Message
        </button>
        <button className="mkt-farmer-btn mkt-farmer-btn--ghost" onClick={() => onProfile && onProfile(farmer)}>
          👤 Profile
        </button>
      </div>
    </div>
  );
};

export default FarmerCard;
