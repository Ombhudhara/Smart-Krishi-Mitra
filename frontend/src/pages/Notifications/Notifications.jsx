import React, { useState, useEffect, useRef } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../../services/notificationService';

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

// ── Sub-Components ──────────────────────────────────────────────────────

function NotificationCard({ notif, activeMenuId, onToggleMenu, onToggleRead, onDelete }) {
  const meta = CATEGORY_META[notif.category] || { icon: '🔔', color: '#2E7D32' };
  const prio = PRIORITY_META[notif.priority] || PRIORITY_META.info;
  const isMenuOpen = activeMenuId === notif.id;

  return (
    <div style={{
      background: notif.unread ? '#F0FFF0' : '#fff',
      border: `1.5px solid ${notif.unread ? '#A5D6A7' : 'var(--skm-border)'}`,
      borderRadius: '12px', padding: '16px', display: 'flex', gap: '14px',
      alignItems: 'flex-start', position: 'relative', marginBottom: '10px',
      transition: 'all 0.2s',
    }}>
      {notif.unread && <span style={{ position: 'absolute', top: '10px', left: '10px', width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D32' }} />}
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${meta.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{meta.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: `${meta.color}18`, color: meta.color, fontWeight: 700 }}>{notif.category}</span>
          <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: `${prio.color}18`, color: prio.color, fontWeight: 700 }}>{prio.label}</span>
          <span className="skm-text-muted" style={{ fontSize: '11px', marginLeft: 'auto' }}>⏱ {notif.time}</span>
        </div>
        <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700 }}>{notif.title}</h4>
        <p className="skm-text-muted" style={{ margin: 0, fontSize: '12px', lineHeight: 1.5 }}>{notif.description}</p>
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={(e) => onToggleMenu(notif.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#999', padding: '4px' }}>⋮</button>
        {isMenuOpen && (
          <div style={{ position: 'absolute', right: 0, top: '28px', background: '#fff', border: '1px solid var(--skm-border)', borderRadius: '10px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, minWidth: '160px', overflow: 'hidden' }}>
            <button style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => onToggleRead(notif.id)}>
              {notif.unread ? '✔ Mark as Read' : '○ Mark as Unread'}
            </button>
            {QUICK_ACTIONS.filter(a => a !== 'Mark Read').map(action => (
              <button key={action} style={{ display: 'block', width: '100%', padding: '10px 16px', textAlign: 'left', border: 'none', background: action === 'Delete' ? '#FFF5F5' : 'none', cursor: 'pointer', fontSize: '13px', color: action === 'Delete' ? '#C62828' : 'inherit' }}
                onClick={() => action === 'Delete' ? onDelete(notif.id) : onToggleMenu(null)}>
                {action === 'Open' && '↗ '}{action === 'Archive' && '📁 '}{action === 'Delete' && '🗑 '}{action === 'Mute Similar' && '🔕 '}{action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onGoHome }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <span style={{ fontSize: '56px' }}>🔔</span>
      <h3>You're all caught up!</h3>
      <p className="skm-text-muted">No notifications matching your current filter.</p>
      <button className="skm-action-btn" onClick={onGoHome}>← Go to Dashboard</button>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────

export default function Notifications() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [notifications, setNotifications]   = useState([]);
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeMenuId, setActiveMenuId]     = useState(null);
  const [visibleCount, setVisibleCount]     = useState(10);
  const [isLoading, setIsLoading]           = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const close = () => setActiveMenuId(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    const fetchNotifs = async () => {
      setIsLoading(true);
      try {
        const response = await getNotifications();
        if (response.data?.success) {
          setNotifications(response.data.notifications.map(n => ({
            id: n._id,
            category: n.type === 'weather' ? 'Weather' : n.type === 'chat' ? 'Messages' : n.type === 'order' ? 'Marketplace' : n.type === 'scheme' ? 'Government' : 'AI',
            priority: n.priority || 'normal',
            title: n.message,
            description: n.description || n.message,
            time: new Date(n.createdAt).toLocaleDateString(),
            group: 'Today',
            unread: !n.read,
          })));
        }
      } catch (err) { console.error('Error loading notifications:', err); }
      finally { setIsLoading(false); }
    };
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => { try { await markAllAsRead(); setNotifications(prev => prev.map(n => ({ ...n, unread: false }))); } catch (err) { console.error(err); } };
  const handleClearAll = () => setNotifications([]);
  const handleDeleteNotification = async (id) => { try { await deleteNotification(id); setNotifications(prev => prev.filter(n => n.id !== id)); setActiveMenuId(null); } catch (err) { console.error(err); } };
  const handleToggleRead = async (id) => { try { await markAsRead(id); setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n)); setActiveMenuId(null); } catch (err) { console.error(err); } };
  const toggleMenu = (id, e) => { if (e) e.stopPropagation(); setActiveMenuId(prev => prev === id ? null : id); };
  const handleLoadMore = () => { setIsLoading(true); setTimeout(() => { setVisibleCount(c => c + 5); setIsLoading(false); }, 800); };

  const filtered = notifications.filter(n => {
    const matchFilter = selectedFilter === 'all' || (selectedFilter === 'unread' && n.unread) || n.category === selectedFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;
  const totalUnread   = notifications.filter(n => n.unread).length;
  const weatherAlerts = notifications.filter(n => n.category === 'Weather' && n.unread).length;
  const messageUnread = notifications.filter(n => n.category === 'Messages' && n.unread).length;
  const aiRecs        = notifications.filter(n => n.category === 'AI').length;
  const currentUser   = { name: 'OM', role: 'Farmer' };

  return (
    <div className="skm-root">
      <Navbar user={currentUser} onToggleSidebar={() => setSidebarOpen(o => !o)} notificationSlot={<NotificationBell notifications={notifications} />} />

      <div className="skm-layout">
        <Sidebar collapsed={!sidebarOpen} onToggleCollapse={() => setSidebarOpen(o => !o)} activeItem="notifications" />

        <main className="skm-main">
          <div className="skm-content-area">

            {/* Header */}
            <div className="skm-welcome-card" style={{ marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <span className="skm-text-muted" style={{ fontSize: '12px' }}>🔔 Alerts</span>
                <h1 className="skm-title" style={{ margin: '4px 0' }}>Notification Center</h1>
                <p className="skm-text-muted" style={{ fontSize: '13px', margin: '8px 0 0' }}>Stay updated with important farm activities and alerts.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="skm-action-btn" onClick={handleMarkAllRead}>✔ Mark All Read</button>
                <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={handleClearAll}>🗑 Clear All</button>
                <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }}>⚙</button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="skm-grid" style={{ marginBottom: '20px' }}>
              {[
                { icon: '📩', count: totalUnread,   label: 'Unread',              color: '#2E7D32' },
                { icon: '🌧', count: weatherAlerts, label: 'Weather Alerts',      color: '#1976D2' },
                { icon: '💬', count: messageUnread, label: 'Messages',            color: '#7B1FA2' },
                { icon: '🤖', count: aiRecs,        label: 'AI Recommendations',  color: '#E65100' },
              ].map((s, i) => (
                <div key={i} className="skm-stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
                  <div className="skm-stat-header">
                    <span className="skm-stat-label">{s.label}</span>
                    <span style={{ fontSize: '20px', background: `${s.color}18`, padding: '4px 8px', borderRadius: '8px' }}>{s.icon}</span>
                  </div>
                  <div className="skm-stat-value" style={{ color: s.color }}>{s.count}</div>
                </div>
              ))}
            </div>

            {/* Search Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--skm-border)', borderRadius: '10px', padding: '8px 16px', background: '#fff', marginBottom: '16px' }}>
              <span>🔍</span>
              <input ref={searchRef} type="text" placeholder="Search notifications..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px' }} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>}
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
              {FILTER_CHIPS.map(chip => (
                <button key={chip.value} onClick={() => { setSelectedFilter(chip.value); setVisibleCount(10); }}
                  style={{ padding: '5px 14px', borderRadius: '20px', border: '1px solid var(--skm-border)', background: selectedFilter === chip.value ? '#2E7D32' : '#fff', color: selectedFilter === chip.value ? '#fff' : '#555', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px', fontWeight: 600 }}>
                  {chip.label}{chip.value === 'unread' && totalUnread > 0 && <span style={{ marginLeft: '4px', background: '#fff', color: '#2E7D32', borderRadius: '10px', padding: '0 5px', fontSize: '10px', fontWeight: 'bold' }}>{totalUnread}</span>}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div>
              {filtered.length === 0 ? (
                <EmptyState onGoHome={() => navigate('/')} />
              ) : (
                <>
                  {TIMELINE_GROUPS.map(group => {
                    const groupItems = visible.filter(n => n.group === group);
                    if (!groupItems.length) return null;
                    return (
                      <div key={group} style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2E7D32', flexShrink: 0 }} />
                          <span style={{ fontWeight: 700, fontSize: '12px', color: '#666' }}>{group}</span>
                          <span style={{ flex: 1, height: '1px', background: '#E0E0E0' }} />
                        </div>
                        {groupItems.map(notif => (
                          <NotificationCard key={notif.id} notif={notif} activeMenuId={activeMenuId} onToggleMenu={toggleMenu} onToggleRead={handleToggleRead} onDelete={handleDeleteNotification} />
                        ))}
                      </div>
                    );
                  })}

                  {hasMore && (
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                      {isLoading ? <Loader size="small" /> : (
                        <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={handleLoadMore}>Load More Notifications</button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </main>
      </div>

      {/* Floating AI FAB */}
      <button onClick={() => navigate('/messages')} style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #2E7D32, #43A047)', color: '#fff', border: 'none', fontSize: '24px', cursor: 'pointer', zIndex: 999 }}>🤖</button>
    </div>
  );
}
