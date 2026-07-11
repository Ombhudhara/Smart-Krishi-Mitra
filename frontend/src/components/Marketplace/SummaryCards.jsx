import React from 'react';
import './SummaryCards.css';

const SummaryCards = ({ cards = [] }) => {
  return (
    <div className="mkt-summary-row">
      {cards.map((card, idx) => (
        <div key={idx} className="mkt-stat-card" style={{ borderTop: `4px solid ${card.color || '#2E7D32'}` }}>
          <div className="mkt-stat-icon">{card.icon}</div>
          <div className="mkt-stat-value">{card.value}</div>
          <div className="mkt-stat-label">{card.label}</div>
          {card.sub && <div className="mkt-stat-sub">{card.sub}</div>}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
