import React from 'react';

const SummaryCards = ({ cards = [] }) => {
  return (
    <div className="skm-grid" style={{ marginBottom: '24px' }}>
      {cards.map((card, idx) => (
        <div key={idx} className="skm-stat-card" style={{ borderTop: `4px solid ${card.color || '#2E7D32'}` }}>
          <div className="skm-stat-header">
            <span className="skm-stat-label">{card.label}</span>
            <span className="skm-stat-icon" style={{ background: '#F5F5F5', color: card.color || '#2E7D32' }}>{card.icon}</span>
          </div>
          <div className="skm-stat-value">{card.value}</div>
          {card.sub && (
            <div className="skm-stat-footer">
              <span className="skm-stat-desc">{card.sub}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
