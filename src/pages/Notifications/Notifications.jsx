import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService';
import './Notifications.css';

/* ─────────────────────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────────────────────── */



const CATEGORY_META = {
  Weather:     { icon: '🌧', color: '#1976D2' },
  Messages:    { icon: '💬', color: '#7B1FA2' },
  Marketplace: { icon: '🏪', color: '#E65100' },
  Government:  { icon: '📢', color: '#0277BD' },
  AI:          { icon: '🤖', color: '#2E7D32' },
  Transactions:{ icon: '💰', color: '#558B2F' },
};

const PRIORITY_META = {
  critical: { label: 'Critical', color: '#D32F2F' },
  high:     { label: 'High',     color: '#FB8C00' },
  normal:   { label: 'Normal',   color: '#2E7D32' },
  info:     { label: 'Info',     color: '#1976D2' },
};

const FILTER_CHIPS = [
  { label: 'All',         value: 'all' },
  { label: 'Unread',      value: 'unread' },
  { label: 'Messages',    value: 'Messages' },
  { label: 'Marketplace', value: 'Marketplace' },
  { label: 'Weather',     value: 'Weather' },
  { label: 'Government',  value: 'Government' },
  { label: 'AI',          value: 'AI' },
];

const TIMELINE_GROUPS = ['Today', 'Yesterday', 'This Week', 'Older'];

const QUICK_ACTIONS = ['Open', 'Mark Read', 'Archive', 'Delete', 'Mute Similar'];

/* ─────────────────────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */

/** Summary stat card */
function SummaryCard({ icon, count, label, color }) {
  return (
    <div className="nc-summary-card" style={{ '--card-accent': color }}>
      <div className="nc-summary-icon-wrap" style={{ background: `${color}18` }}>
        <span className="nc-summary-icon">{icon}</span>
      </div>
      <div className="nc-summary-body">
        <span className="nc-summary-count">{count}</span>
        <span className="nc-summary-label">{label}</span>
      </div>
    </div>
  );
}

/** Individual notification card */
function NotificationCard({ notif, activeMenuId, onToggleMenu, onToggleRead, onDelete }) {
  const meta = CATEGORY_META[notif.category] || { icon: '🔔', color: '#2E7D32' };
  const prio = PRIORITY_META[notif.priority] || PRIORITY_META.info;
  const isMenuOpen = activeMenuId === notif.id;

  return (
    <div className={`nc-notif-card${notif.unread ? ' nc-notif-card--unread' : ' nc-notif-card--read'}`}>
      {/* Unread pulse dot */}
      {notif.unread && <span className="nc-pulse-dot" />}

      {/* Category icon */}
      <div className="nc-notif-icon-wrap" style={{ background: `${meta.color}15` }}>
        <span className="nc-notif-icon">{meta.icon}</span>
      </div>

      {/* Body */}
      <div className="nc-notif-body">
        <div className="nc-notif-meta-row">
          <span className="nc-category-badge" style={{ background: `${meta.color}18`, color: meta.color }}>
            {notif.category}
          </span>
          <span className="nc-priority-badge" style={{ background: `${prio.color}18`, color: prio.color }}>
            {prio.label}
          </span>
          <span className="nc-notif-time">⏱ {notif.time}</span>
        </div>
        <h4 className="nc-notif-title">{notif.title}</h4>
        <p className="nc-notif-desc">{notif.description}</p>
      </div>

      {/* Three-dot menu */}
      <div className="nc-menu-wrap">
        <button
          className="nc-menu-btn"
          onClick={(e) => onToggleMenu(notif.id, e)}
          aria-label="Notification actions"
          aria-expanded={isMenuOpen}
        >
          ⋮
        </button>
        {isMenuOpen && (
          <div className="nc-menu-dropdown" role="menu">
            <button className="nc-menu-item" onClick={() => onToggleRead(notif.id)}>
              {notif.unread ? '✔ Mark as Read' : '○ Mark as Unread'}
            </button>
            {QUICK_ACTIONS.filter(a => a !== 'Mark Read').map(action => (
              <button
                key={action}
                className={`nc-menu-item${action === 'Delete' ? ' nc-menu-item--danger' : ''}`}
                onClick={() => action === 'Delete' ? onDelete(notif.id) : onToggleMenu(null)}
              >
                {action === 'Open'         && '↗ '}
                {action === 'Archive'      && '📁 '}
                {action === 'Delete'       && '🗑 '}
                {action === 'Mute Similar' && '🔕 '}
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Timeline section heading */
function TimelineGroup({ label }) {
  return (
    <div className="nc-timeline-group">
      <span className="nc-tl-dot" />
      <span className="nc-tl-label">{label}</span>
      <span className="nc-tl-line" />
    </div>
  );
}

/** Empty state */
function EmptyState({ onGoHome }) {
  return (
    <div className="nc-empty-state">
      <div className="nc-empty-illustration" aria-hidden="true">
        <svg viewBox="0 0 200 180" width="180" height="160">
          <defs>
            <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8F5E9" />
              <stop offset="100%" stopColor="#C8E6C9" />
            </linearGradient>
          </defs>
          <rect width="200" height="180" rx="24" fill="url(#eGrad)" />
          <circle cx="100" cy="75" r="36" fill="white" opacity="0.9" />
          <text x="100" y="83" textAnchor="middle" fontSize="30">🔔</text>
          <rect x="56" y="120" width="88" height="10" rx="5" fill="#A5D6A7" opacity="0.7" />
          <rect x="70" y="136" width="60" height="8" rx="4" fill="#C8E6C9" opacity="0.6" />
        </svg>
      </div>
      <h3 className="nc-empty-title">You're all caught up!</h3>
      <p className="nc-empty-sub">No notifications matching your current filter.</p>
      <Button className="nc-empty-btn" onClick={onGoHome}>← Go to Dashboard</Button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function Notifications() {
  const navigate = useNavigate();

  /* ── State ── */
  const [sidebarOpen, setSidebarOpen]     = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeMenuId, setActiveMenuId]   = useState(null);
  const [visibleCount, setVisibleCount]   = useState(10);
  const [isLoading, setIsLoading]         = useState(false);
  const searchRef = useRef(null);

  /* ── Close menus on outside click ── */
  useEffect(() => {
    const close = () => setActiveMenuId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  /* ── Fetch notifications from API ── */
  const fetchNotifs = async () => {
    setIsLoading(true);
    try {
      const response = await getNotifications();
      if (response.data?.success) {
        const normalized = response.data.notifications.map((n) => ({
          id: n._id,
          category: n.type === 'weather' ? 'Weather' : (n.type === 'chat' ? 'Messages' : (n.type === 'order' ? 'Marketplace' : (n.type === 'scheme' ? 'Government' : 'AI'))),
          priority: n.priority || 'normal',
          title: n.message,
          description: n.description || n.message,
          time: new Date(n.createdAt).toLocaleDateString(),
          group: 'Today',
          unread: !n.read,
        }));
        setNotifications(normalized);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  /* ── Handlers ── */
  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteNotification = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setActiveMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
      );
      setActiveMenuId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMenu = (id, e) => {
    if (e) e.stopPropagation();
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((c) => c + 5);
      setIsLoading(false);
    }, 800);
  };

  /* ── Filtered list ── */
  const filtered = notifications.filter(n => {
    const matchFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'unread' && n.unread) ||
      n.category === selectedFilter;

    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  /* ── Summary stats ── */
  const totalUnread     = notifications.filter(n => n.unread).length;
  const weatherAlerts   = notifications.filter(n => n.category === 'Weather' && n.unread).length;
  const messageUnread   = notifications.filter(n => n.category === 'Messages' && n.unread).length;
  const aiRecs          = notifications.filter(n => n.category === 'AI').length;

  const currentUser = { name: 'OM', role: 'Farmer' };

  return (
    <div className="nc-root">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <Navbar
        user={currentUser}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        notificationSlot={<NotificationBell notifications={notifications} />}
      />

      <div className="nc-page-wrap">

        {/* ── Sidebar ──────────────────────────────────────── */}
        <Sidebar
          collapsed={!sidebarOpen}
          onToggleCollapse={() => setSidebarOpen(o => !o)}
          activeItem="notifications"
        />

        {/* ── Main Content ─────────────────────────────────── */}
        <main className="nc-main">

          {/* Header */}
          <section className="nc-header">
            <div className="nc-header-left">
              <div className="nc-header-icon-wrap">🔔</div>
              <div>
                <h1 className="nc-page-title">Notification Center</h1>
                <p className="nc-page-subtitle">Stay updated with important farm activities and alerts.</p>
              </div>
            </div>
            <div className="nc-header-actions">
              <button className="nc-icon-btn nc-icon-btn--read" onClick={handleMarkAllRead} title="Mark all as read" aria-label="Mark all as read">
                ✔
              </button>
              <button className="nc-icon-btn nc-icon-btn--clear" onClick={handleClearAll} title="Clear all" aria-label="Clear all">
                🗑
              </button>
              <button className="nc-icon-btn" title="Notification Settings" aria-label="Settings">
                ⚙
              </button>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="nc-summary-row" aria-label="Notification summary">
            <SummaryCard icon="📩" count={totalUnread}   label="Unread"           color="#2E7D32" />
            <SummaryCard icon="🌧" count={weatherAlerts} label="Weather Alerts"   color="#1976D2" />
            <SummaryCard icon="💬" count={messageUnread} label="Messages"         color="#7B1FA2" />
            <SummaryCard icon="🤖" count={aiRecs}        label="AI Recommendations" color="#E65100" />
          </section>

          {/* Search Bar */}
          <div className="nc-search-wrap" role="search">
            <span className="nc-search-icon">🔍</span>
            <input
              ref={searchRef}
              type="text"
              className="nc-search-input"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search notifications"
            />
            {searchQuery && (
              <button className="nc-search-clear" onClick={() => setSearchQuery('')} aria-label="Clear search">✕</button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="nc-chips-wrap" role="group" aria-label="Filter notifications">
            {FILTER_CHIPS.map(chip => (
              <button
                key={chip.value}
                className={`nc-chip${selectedFilter === chip.value ? ' nc-chip--active' : ''}`}
                onClick={() => { setSelectedFilter(chip.value); setVisibleCount(10); }}
                aria-pressed={selectedFilter === chip.value}
              >
                {chip.label}
                {chip.value === 'unread' && totalUnread > 0 && (
                  <span className="nc-chip-count">{totalUnread}</span>
                )}
              </button>
            ))}
          </div>

          {/* Notification List */}
          <section className="nc-list-section" aria-label="Notification list">
            {filtered.length === 0 ? (
              <EmptyState onGoHome={() => navigate('/')} />
            ) : (
              <>
                {TIMELINE_GROUPS.map(group => {
                  const groupItems = visible.filter(n => n.group === group);
                  if (!groupItems.length) return null;
                  return (
                    <div key={group} className="nc-group-block">
                      <TimelineGroup label={group} />
                      {groupItems.map(notif => (
                        <NotificationCard
                          key={notif.id}
                          notif={notif}
                          activeMenuId={activeMenuId}
                          onToggleMenu={toggleMenu}
                          onToggleRead={handleToggleRead}
                          onDelete={handleDeleteNotification}
                        />
                      ))}
                    </div>
                  );
                })}

                {/* Load More */}
                {hasMore && (
                  <div className="nc-load-more-wrap">
                    {isLoading ? (
                      <Loader size="small" />
                    ) : (
                      <button className="nc-load-more-btn" onClick={handleLoadMore}>
                        Load More Notifications
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </section>

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Floating AI Assistant */}
      <button className="nc-ai-fab" title="AI Assistant" aria-label="Open AI Assistant">
        🤖
        <span className="nc-ai-fab-label">AI</span>
      </button>
    </div>
  );
}
