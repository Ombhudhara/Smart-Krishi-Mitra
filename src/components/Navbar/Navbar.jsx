import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Navbar.css';

const Navbar = ({
  user,
  onSearch,
  onNotification,
  onProfile,
  onToggleSidebar,
  // Optional render prop: pass <NotificationBell /> from parent
  notificationSlot,
  languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'gu', label: 'ગુજરાતી' },
    { code: 'mr', label: 'मराठी' }
  ],
  defaultLanguage = 'en',
  logoText = 'Smart Krishi Mitra',
  logoIcon = '🌿'
}) => {
  const [selectedLang, setSelectedLang] = useState(defaultLanguage);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchVal(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleLangChange = (e) => {
    setSelectedLang(e.target.value);
  };

  const getInitials = () => {
    if (user?.name) {
      return user.name.slice(0, 2).toUpperCase();
    }
    return 'OB';
  };

  return (
    <nav className="skm-navbar">
      {/* Left Area: Hamburger + Logo */}
      <div className="skm-navbar-left">
        {onToggleSidebar && (
          <button
            className="skm-navbar-hamburger"
            onClick={onToggleSidebar}
            aria-label="Toggle Sidebar Navigation"
          >
            <span />
            <span />
            <span />
          </button>
        )}
        <div className="skm-navbar-brand">
          <span className="skm-navbar-logo-icon">{logoIcon}</span>
          <div>
            <h1 className="skm-navbar-logo-text">{logoText}</h1>
            {user?.role && <span className="skm-navbar-role-indicator">{user.role} Portal</span>}
          </div>
        </div>
      </div>

      {/* Center Area: Search Bar */}
      <div className="skm-navbar-center">
        <div className="skm-navbar-search-wrap">
          <span className="skm-navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search crops, prices, alerts..."
            value={searchVal}
            onChange={handleSearchChange}
            className="skm-navbar-search-input"
          />
        </div>
      </div>

      {/* Right Area: Language Selector + Notifications + Avatar */}
      <div className="skm-navbar-right">
        {/* Language Selector */}
        <div className="skm-navbar-lang-select-wrap">
          <span className="skm-navbar-lang-icon">🌐</span>
          <select
            value={selectedLang}
            onChange={handleLangChange}
            className="skm-navbar-lang-select"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Bell — inject NotificationBell component or use fallback */}
        {notificationSlot ? (
          notificationSlot
        ) : (
          <button
            className="skm-navbar-icon-btn"
            title="Notification Center"
            onClick={onNotification}
          >
            🔔
            {user?.unreadNotifications && <span className="skm-navbar-notif-dot" />}
          </button>
        )}

        {/* Profile Avatar */}
        <div
          className="skm-navbar-avatar"
          onClick={onProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onProfile && onProfile()}
        >
          {user?.avatarImg ? (
            <img src={user.avatarImg} alt={user.name || 'User Avatar'} className="skm-navbar-avatar-img" />
          ) : (
            <span>{getInitials()}</span>
          )}
          <div className="skm-navbar-avatar-status" />
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    role: PropTypes.string,
    avatarImg: PropTypes.string,
    unreadNotifications: PropTypes.bool
  }),
  onSearch: PropTypes.func,
  onNotification: PropTypes.func,
  onProfile: PropTypes.func,
  onToggleSidebar: PropTypes.func,
  notificationSlot: PropTypes.node,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  defaultLanguage: PropTypes.string,
  logoText: PropTypes.string,
  logoIcon: PropTypes.string
};

export default Navbar;
