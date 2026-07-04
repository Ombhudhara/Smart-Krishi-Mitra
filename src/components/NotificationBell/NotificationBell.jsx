import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { IoMdNotifications, IoMdNotificationsOutline } from 'react-icons/io';
import { MdCheckCircle, MdCircle } from 'react-icons/md';
import './NotificationBell.css';

const NotificationBell = ({ 
  notifications = [], 
  onMarkAllRead, 
  onNotificationClick,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className={`skm-notification-bell-wrapper ${className}`} ref={dropdownRef}>
      
      {/* Bell Button */}
      <button 
        className={`skm-notification-bell-btn ${isOpen ? 'active-dropdown' : ''}`} 
        onClick={toggleDropdown}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        {unreadCount > 0 ? (
          <>
            <IoMdNotifications className="skm-bell-icon active" />
            <span className="skm-notification-badge skm-pulse-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </>
        ) : (
          <IoMdNotificationsOutline className="skm-bell-icon" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="skm-notification-dropdown">
          
          {/* Header */}
          <div className="skm-notification-header">
            <h3 className="skm-notification-title-header">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="skm-mark-all-read" 
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllRead && onMarkAllRead();
                }}
              >
                <MdCheckCircle className="skm-mark-icon" /> Mark all read
              </button>
            )}
          </div>
          
          {/* List */}
          <div className="skm-notification-list">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`skm-notification-item ${!notification.read ? 'unread' : 'read'}`}
                  onClick={() => {
                    onNotificationClick && onNotificationClick(notification);
                    setIsOpen(false);
                  }}
                >
                  <div className="skm-notification-indicator">
                    {!notification.read && <MdCircle className="skm-unread-dot" />}
                  </div>
                  <div className="skm-notification-content">
                    <p className="skm-notification-message">{notification.message}</p>
                    <p className="skm-notification-time">{notification.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="skm-notification-empty">
                <IoMdNotificationsOutline className="skm-empty-icon" />
                <p>You're all caught up!</p>
              </div>
            )}
          </div>
          
          <div className="skm-notification-footer">
            <button 
              className="skm-view-all-btn" 
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
            >
              View All Notifications
            </button>
          </div>
          
        </div>
      )}
    </div>
  );
};

NotificationBell.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      read: PropTypes.bool.isRequired,
    })
  ),
  onMarkAllRead: PropTypes.func,
  onNotificationClick: PropTypes.func,
  className: PropTypes.string
};

export default NotificationBell;
