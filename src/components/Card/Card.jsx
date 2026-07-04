import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

const Card = ({
  title,
  subtitle,
  image,
  icon,
  children,
  footer,
  hover = true,
  shadow = true,
  rounded = true,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    'skm-card',
    `skm-card--${variant}`,
    hover ? 'skm-card--hover' : '',
    shadow ? 'skm-card--shadow' : '',
    rounded ? 'skm-card--rounded' : '',
    onClick ? 'skm-card--clickable' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {/* Cover Image */}
      {image && (
        <div className="skm-card-cover">
          <img src={image} alt={title || 'Card Cover'} loading="lazy" />
        </div>
      )}

      {/* Card Header */}
      {(title || subtitle || icon) && (
        <div className="skm-card-header">
          {icon && <span className="skm-card-header-icon">{icon}</span>}
          <div className="skm-card-header-text">
            {title && <h3 className="skm-card-title">{title}</h3>}
            {subtitle && <p className="skm-card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Card Body */}
      {children && <div className="skm-card-body">{children}</div>}

      {/* Card Footer */}
      {footer && <div className="skm-card-footer">{footer}</div>}
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  image: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.node,
  footer: PropTypes.node,
  hover: PropTypes.bool,
  shadow: PropTypes.bool,
  rounded: PropTypes.bool,
  variant: PropTypes.oneOf([
    'default',
    'crop',
    'farmer',
    'vendor',
    'weather',
    'statistics',
    'news',
    'profile',
    'transaction'
  ]),
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default Card;
