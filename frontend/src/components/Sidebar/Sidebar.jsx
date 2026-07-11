import React from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  MdDashboard, 
  MdStorefront, 
  MdMessage, 
  MdLogout, 
  MdMenuOpen, 
  MdMenu 
} from 'react-icons/md';
import { GiPlantRoots } from 'react-icons/gi';
import { FaCalculator, FaNewspaper, FaExchangeAlt, FaUserCircle } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';
import { IoMdNotifications } from 'react-icons/io';

import './Sidebar.css';

const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: <MdDashboard /> },
  { id: 'marketplace', label: 'Marketplace', path: '/marketplace', icon: <MdStorefront /> },
  { id: 'crops', label: 'Crop Knowledge', path: '/crop-knowledge', icon: <GiPlantRoots /> },
  { id: 'calculator', label: 'Cost Calculator', path: '/calculator', icon: <FaCalculator /> },
  { id: 'weather', label: 'Weather', path: '/weather', icon: <WiDaySunny /> },
  { id: 'messages', label: 'Messages', path: '/messages', icon: <MdMessage /> },
  { id: 'news', label: 'News & Schemes', path: '/news-schemes', icon: <FaNewspaper /> },
  { id: 'notifications', label: 'Notifications', path: '/notifications', icon: <IoMdNotifications /> },
  { id: 'transactions', label: 'Transactions', path: '/transactions', icon: <FaExchangeAlt /> },
  { id: 'profile', label: 'Profile', path: '/profile', icon: <FaUserCircle /> },
];

const Sidebar = ({ 
  collapsed, 
  onToggleCollapse, 
  onNavigate, 
  activeItem,
  onLogout
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
    if (onLogout) {
      onLogout();
    } else {
      navigate('/login');
    }
  };

  // If no activeItem prop is provided, try to determine from current path
  const currentActive = activeItem || MENU_ITEMS.find(item => 
    item.path === location.pathname || 
    (item.path !== '/' && location.pathname.startsWith(item.path))
  )?.id || 'dashboard';

  const handleNavClick = (item) => {
    if (onNavigate) {
      onNavigate(item);
    } else {
      navigate(item.path);
    }
  };

  return (
    <aside className={`skm-sidebar ${collapsed ? 'skm-sidebar--collapsed' : 'skm-sidebar--expanded'}`}>
      
      {/* Sidebar Header / Toggle */}
      <div className="skm-sidebar-header">
        {!collapsed && <span className="skm-sidebar-label">NAVIGATION</span>}
        <button 
          className="skm-sidebar-toggle-btn" 
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <MdMenu /> : <MdMenuOpen />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="skm-sidebar-nav">
        {MENU_ITEMS.map((item) => {
          const isActive = currentActive === item.id;
          return (
            <div 
              key={item.id} 
              className={`skm-sidebar-item-wrapper ${isActive ? 'active' : ''}`}
              title={collapsed ? item.label : ''}
            >
              <button
                className="skm-sidebar-btn"
                onClick={() => handleNavClick(item)}
              >
                <div className="skm-sidebar-active-indicator" />
                <span className="skm-sidebar-icon">{item.icon}</span>
                {!collapsed && <span className="skm-sidebar-text">{item.label}</span>}
              </button>
              
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="skm-sidebar-tooltip">
                  {item.label}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer / Logout */}
      <div className="skm-sidebar-footer">
        <div className="skm-sidebar-item-wrapper" title={collapsed ? "Logout" : ""}>
          <button 
            className="skm-sidebar-btn skm-sidebar-btn--logout"
            onClick={handleLogout}
          >
            <span className="skm-sidebar-icon"><MdLogout /></span>
            {!collapsed && <span className="skm-sidebar-text">Logout</span>}
          </button>
          {collapsed && (
            <div className="skm-sidebar-tooltip skm-sidebar-tooltip--logout">
              Logout
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
  onNavigate: PropTypes.func,
  activeItem: PropTypes.string,
  onLogout: PropTypes.func
};

export default Sidebar;
