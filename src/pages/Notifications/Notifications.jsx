import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Loader from '../../components/Loader/Loader';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import './Notifications.css';

/* ─────────────────────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────────────────────── */

const DUMMY_NOTIFICATIONS = [
  { id: 1,  category: 'Weather',     priority: 'critical', title: 'Heavy rainfall expected tomorrow', description: 'IMD has forecast heavy downpour exceeding 60mm in your area. Secure harvested crops and ensure proper field drainage.', time: '10 mins ago', group: 'Today',     unread: true  },
  { id: 2,  category: 'Messages',    priority: 'normal',   title: 'Raj Patel sent you a message', description: '"Hi, I am interested in buying 20 kg of organic Cotton from your latest listing. What is your best price?"', time: '25 mins ago', group: 'Today',     unread: true  },
  { id: 3,  category: 'Marketplace', priority: 'high',     title: 'Buyer requested 20 kg Cotton', description: 'A new purchase request has been generated for your Cotton listing. Review the offer details in the marketplace panel.', time: '45 mins ago', group: 'Today',     unread: true  },
  { id: 4,  category: 'Marketplace', priority: 'info',     title: 'Cotton price increased by 8%', description: 'Market rates for premium cotton touched ₹8,200 per quintal in your local APMC mandi today. Highest this season.', time: '1 hour ago',  group: 'Today',     unread: true  },
  { id: 5,  category: 'Government',  priority: 'high',     title: 'New PM-KISAN Scheme announced', description: 'Government releases registration guidelines for the next instalment subsidy benefit. Check eligibility requirements now.', time: '2 hours ago', group: 'Today',     unread: true  },
  { id: 6,  category: 'AI',          priority: 'normal',   title: 'AI recommends delaying irrigation', description: 'Based on high soil moisture readings (72%) and the rain forecast for tomorrow, skip watering for the next 24 hours.', time: '3 hours ago', group: 'Today',     unread: true  },
  { id: 7,  category: 'Marketplace', priority: 'normal',   title: 'Order delivered successfully', description: 'Order #SKM-90234 containing 100 kg Potatoes has been successfully verified and delivered to the merchant hub.', time: '5 hours ago', group: 'Today',     unread: false },
  { id: 8,  category: 'Marketplace', priority: 'info',     title: 'Your crop listing received 12 new views', description: 'Your Mustard Seed listing is getting higher organic engagement today. Keep crop pictures updated.', time: '6 hours ago', group: 'Today',     unread: false },
  { id: 9,  category: 'Marketplace', priority: 'normal',   title: 'Payment received successfully', description: 'Payment of ₹14,200 for Order #SKM-88901 has been credited to your linked bank account via escrow.', time: '8 hours ago', group: 'Today',     unread: false },
  { id: 10, category: 'Weather',     priority: 'info',     title: "Today's weather is ideal for harvesting", description: 'Clear sunny sky with humidity below 45% is expected till evening. Perfect conditions to proceed with harvest.', time: 'Yesterday 4 PM', group: 'Yesterday', unread: false },
  { id: 11, category: 'Messages',    priority: 'normal',   title: 'New message from Advisor Amit', description: '"I reviewed your soil report. Please apply recommended organic manure quantity before sowing the next crop."', time: 'Yesterday 1 PM', group: 'Yesterday', unread: false },
  { id: 12, category: 'AI',          priority: 'high',     title: 'Pest risk warning issued by AI', description: 'Rising humidity levels indicate a moderate risk of Aphid infestation in mustard fields. Inspect leaf undersides.', time: '2 days ago',  group: 'This Week', unread: false },
  { id: 13, category: 'Government',  priority: 'info',     title: 'KCC Loan Interest Subvention extended', description: 'The interest subvention scheme on short-term crop loans via Kisan Credit Card is extended till end of financial year.', time: '2 days ago',  group: 'This Week', unread: false },
  { id: 14, category: 'Weather',     priority: 'critical', title: 'Thunderstorm warning for tomorrow', description: 'Light to moderate rain accompanied by lightning expected in isolated parts of the district tomorrow afternoon.', time: '3 days ago',  group: 'This Week', unread: false },
  { id: 15, category: 'Marketplace', priority: 'normal',   title: 'New buyer bid on Onion listing', description: 'A merchant from Pune APMC mandi has placed a bid of ₹2,200 per quintal on your Onion stock.', time: '3 days ago',  group: 'This Week', unread: false },
  { id: 16, category: 'Marketplace', priority: 'info',     title: 'Escrow payment initiated', description: 'Buyer has deposited ₹9,500 in escrow for your Tomato order #SKM-91022. Funds will release post delivery confirmation.', time: '4 days ago',  group: 'This Week', unread: false },
  { id: 17, category: 'AI',          priority: 'normal',   title: 'Soil moisture drop alert', description: 'Moisture level in Sector B has dropped to 38%. Sowing conditions will be optimal if irrigated today evening.', time: '4 days ago',  group: 'This Week', unread: false },
  { id: 18, category: 'Government',  priority: 'info',     title: 'Subsidized tractor scheme registration', description: 'State Agriculture Department is accepting subsidy applications for farm mechanization tools. Apply before standard deadline.', time: '5 days ago',  group: 'Older',     unread: false },
  { id: 19, category: 'Messages',    priority: 'normal',   title: 'Support representative replied', description: '"Your profile verification is complete. You can now list unlimited crop quantities on the Marketplace platform."', time: '1 week ago',  group: 'Older',     unread: false },
  { id: 20, category: 'Marketplace', priority: 'info',     title: 'Seed recommendation updated', description: 'Mandi pricing and weather models suggest higher profit yield margins for Gram rabi sowing this cycle.', time: '1 week ago',  group: 'Older',     unread: false },
];

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
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
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

  /* ── Handlers ── */
  const handleMarkAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const handleClearAll = () => setNotifications([]);

  const handleDeleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setActiveMenuId(null);
  };

  const handleToggleRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
    setActiveMenuId(null);
  };

  const toggleMenu = (id, e) => {
    if (e) e.stopPropagation();
    setActiveMenuId(prev => (prev === id ? null : id));
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(c => c + 5);
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
