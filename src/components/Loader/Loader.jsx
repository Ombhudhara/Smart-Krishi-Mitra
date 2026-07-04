import React from 'react';
import PropTypes from 'prop-types';
import './Loader.css';

const Loader = ({ 
  variant = 'spinner', // 'spinner', 'page', 'card', 'table', 'button'
  text = 'Loading...',
  rows = 3, // For table skeleton
  color = 'primary', // 'primary', 'white'
  className = ''
}) => {
  if (variant === 'page') {
    return (
      <div className={`skm-loader-page ${className}`}>
        <div className="skm-loader-spinner skm-loader-spinner--lg"></div>
        {text && <p className="skm-loader-text">{text}</p>}
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={`skm-loader-button ${className}`}>
        <div className={`skm-loader-spinner skm-loader-spinner--sm skm-loader-spinner--${color}`}></div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`skm-skeleton-card ${className}`}>
        <div className="skm-skeleton-img"></div>
        <div className="skm-skeleton-content">
          <div className="skm-skeleton-title"></div>
          <div className="skm-skeleton-subtitle"></div>
          <div className="skm-skeleton-text"></div>
        </div>
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`skm-skeleton-table ${className}`}>
        <div className="skm-skeleton-table-header"></div>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="skm-skeleton-table-row">
            <div className="skm-skeleton-table-cell skm-skeleton-table-cell--sm"></div>
            <div className="skm-skeleton-table-cell skm-skeleton-table-cell--lg"></div>
            <div className="skm-skeleton-table-cell skm-skeleton-table-cell--md"></div>
          </div>
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`skm-loader-default ${className}`}>
      <div className={`skm-loader-spinner skm-loader-spinner--md skm-loader-spinner--${color}`}></div>
      {text && <p className="skm-loader-text">{text}</p>}
    </div>
  );
};

Loader.propTypes = {
  variant: PropTypes.oneOf(['spinner', 'page', 'card', 'table', 'button']),
  text: PropTypes.string,
  rows: PropTypes.number,
  color: PropTypes.oneOf(['primary', 'white']),
  className: PropTypes.string
};

export default Loader;
