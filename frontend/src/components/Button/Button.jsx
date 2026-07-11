import React from 'react';
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  text,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  size = 'medium',
  type = 'button',
  className = '',
  ...props
}) => {
  // Build class names dynamically based on configurations
  const classes = [
    'skm-btn',
    `skm-btn--${variant}`,
    `skm-btn--${size}`,
    loading ? 'skm-btn--loading' : '',
    disabled ? 'skm-btn--disabled' : '',
    !text && icon ? 'skm-btn--icon-only' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={loading || disabled ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="skm-btn-loader">
          <svg className="skm-btn-spinner" viewBox="0 0 24 24" fill="none">
            <circle
              className="skm-spinner-track"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="skm-spinner-head"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      {!loading && icon && <span className="skm-btn-icon">{icon}</span>}
      {text && <span className="skm-btn-text">{text}</span>}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string
};

export default Button;
