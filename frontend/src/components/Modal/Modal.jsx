import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MdClose, MdCheckCircle, MdWarning, MdShoppingCart, MdRateReview, MdEmail } from 'react-icons/md';
import './Modal.css';

const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  actions,
  variant = 'default', // 'default', 'buy', 'delete', 'review', 'contact', 'success'
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) => {
  // ESC key support & disable body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Only close if clicked exactly on the overlay background
    if (e.target.classList.contains('skm-modal-overlay')) {
      onClose();
    }
  };

  const renderVariantIcon = () => {
    switch (variant) {
      case 'success':
        return <MdCheckCircle className="skm-modal-icon skm-modal-icon--success" />;
      case 'delete':
        return <MdWarning className="skm-modal-icon skm-modal-icon--danger" />;
      case 'buy':
        return <MdShoppingCart className="skm-modal-icon skm-modal-icon--primary" />;
      case 'review':
        return <MdRateReview className="skm-modal-icon skm-modal-icon--accent" />;
      case 'contact':
        return <MdEmail className="skm-modal-icon skm-modal-icon--primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="skm-modal-overlay" onClick={handleBackdropClick}>
      <div 
        className={`skm-modal-container skm-modal-size--${size} skm-modal-variant--${variant} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skm-modal-title"
      >
        <div className="skm-modal-header">
          <div className="skm-modal-title-wrap">
            {renderVariantIcon()}
            <h2 id="skm-modal-title" className="skm-modal-title">{title}</h2>
          </div>
          <button 
            className="skm-modal-close-btn" 
            onClick={onClose}
            aria-label="Close Modal"
            title="Close (ESC)"
          >
            <MdClose />
          </button>
        </div>

        <div className="skm-modal-body">
          {children}
        </div>

        {actions && (
          <div className="skm-modal-footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'buy', 'delete', 'review', 'contact', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default Modal;
