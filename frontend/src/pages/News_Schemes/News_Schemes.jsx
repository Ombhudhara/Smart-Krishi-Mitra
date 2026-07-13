import React, { useState, useEffect, useRef, useCallback } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { useAuth } from '../../context/AuthContext';
import { getNews, getBookmarks, bookmarkItem } from '../../services/newsService';
import { getGovSchemes } from '../../services/governmentService';
import { getCurrentWeather } from '../../services/weatherService';

const POPULAR_SCHEMES = [
  { id: 1, name: 'PM-KISAN Samman Nidhi', desc: 'Direct income support of ₹6,000/year to farmer families.', status: 'Active', beneficiaries: '11.8 Cr', officialLink: 'https://pmkisan.gov.in' },
  { id: 2, name: 'Fasal Bima Yojana', desc: 'Crop insurance for farmers against natural calamities.', status: 'Active', beneficiaries: '5.5 Cr', officialLink: 'https://pmfby.gov.in' },
  { id: 3, name: 'Soil Health Card Scheme', desc: 'Nutrient-based soil testing and recommendations.', status: 'Active', beneficiaries: '23 Cr', officialLink: 'https://soilhealth.dac.gov.in' },
  { id: 4, name: 'eNAM (National Agriculture Market)', desc: 'Online trading platform for agricultural commodities.', status: 'Active', beneficiaries: '1.7 Cr', officialLink: 'https://www.enam.gov.in' },
];

const CATEGORIES_FILTER = [
  { id: 'all', label: 'All', value: 'all' },
  { id: 'agri', label: 'Agriculture', value: 'Agriculture' },
  { id: 'weather', label: 'Weather', value: 'Weather' },
  { id: 'govt', label: 'Government', value: 'Government' },
  { id: 'market', label: 'Market Prices', value: 'Market Prices' },
  { id: 'tech', label: 'Technology', value: 'Technology' },
  { id: 'organic', label: 'Organic Farming', value: 'Organic Farming' },
  { id: 'export', label: 'Export', value: 'Export' },
];

// ── Sub-Components ──────────────────────────────────────────────────

function NewsCard({ item, bookmarks, onBookmark, onReadMore }) {
  const isBookmarked = bookmarks.includes('news:' + item.id);
  const handleImageError = (e) => { e.target.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=380&fit=crop'; };

  return (
    <div className="skm-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, overflow: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        <img src={item.image} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} loading="lazy" onError={handleImageError} />
        {item.trending && <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#E65100', color: '#fff', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>Trending 🔥</span>}
        <button onClick={() => onBookmark('news:' + item.id)} style={{ position: 'absolute', top: '8px', right: '8px', background: isBookmarked ? '#E8F5E9' : 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '16px' }}>
          {isBookmarked ? '🔖' : '🔖'}
        </button>
      </div>
      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: (item.categoryColor || '#2E7D32') + '18', color: item.categoryColor || '#2E7D32', border: `1px solid ${(item.categoryColor || '#2E7D32')}30` }}>{item.category}</span>
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, lineHeight: 1.4 }}>{item.title}</h3>
        <p className="skm-text-muted" style={{ fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{item.description?.substring(0, 120)}{item.description?.length > 120 ? '...' : ''}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }} className="skm-text-muted">
            <span>{item.date}</span><span>|</span><span>{item.source}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{ border: '1px solid var(--skm-border)', background: 'transparent', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }} onClick={() => { if (navigator.share) navigator.share({ title: item.title, url: item.url }).catch(() => {}); else navigator.clipboard.writeText(item.url); }}>Share</button>
            <button className="skm-action-btn" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={() => onReadMore(item.id)}>Read More</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SchemeCard({ scheme, bookmarks, onBookmark }) {
  const [expanded, setExpanded] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const isBookmarked = bookmarks.includes('scheme:' + scheme.id);
  const officialLink = scheme.officialLink || scheme.link || null;

  return (
    <div className="skm-card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '32px', flexShrink: 0 }}>{scheme.emoji || '🏛️'}</span>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '15px' }}>{scheme.name || scheme.title}</h3>
          <p className="skm-text-muted" style={{ fontSize: '11px', margin: 0 }}>{scheme.department || scheme.ministry}</p>
        </div>
        <button onClick={() => onBookmark('scheme:' + scheme.id)} style={{ background: isBookmarked ? '#E8F5E9' : 'transparent', border: '1px solid var(--skm-border)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}>🔖</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: 'var(--skm-bg)', padding: '10px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span className="skm-text-muted" style={{ fontSize: '10px' }}>Beneficiaries</span><strong style={{ fontSize: '12px' }}>{scheme.beneficiaries || 'Varies'}</strong></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span className="skm-text-muted" style={{ fontSize: '10px' }}>Budget</span><strong style={{ fontSize: '12px' }}>{scheme.budget || 'Varies'}</strong></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}><span className="skm-text-muted" style={{ fontSize: '10px' }}>Status</span><span className="skm-status-badge success" style={{ fontSize: '10px', width: 'fit-content' }}>{scheme.status || 'Active'}</span></div>
      </div>

      <div style={{ fontSize: '13px' }}>
        <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '11px' }} className="skm-text-muted">Benefits</div>
        <p style={{ margin: 0, fontSize: '12px' }}>{scheme.benefits}</p>
      </div>
      <div style={{ fontSize: '13px' }}>
        <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '11px' }} className="skm-text-muted">Eligibility</div>
        <p style={{ margin: 0, fontSize: '12px' }}>{scheme.eligibility}</p>
      </div>
      <div style={{ fontSize: '13px' }}>
        <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '11px' }} className="skm-text-muted">Deadline</div>
        <p style={{ margin: 0, fontSize: '12px', color: '#c62828', fontWeight: 600 }}>{scheme.deadline || 'N/A'}</p>
      </div>

      {expanded && (
        <div style={{ borderTop: '1px solid var(--skm-border)', paddingTop: '12px' }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', fontSize: '12px' }}>Required Documents</div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(scheme.documents || []).map((doc, i) => <li key={i}>{doc}</li>)}
          </ul>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <button style={{ border: '1px solid var(--skm-border)', background: 'transparent', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }} onClick={() => setExpanded(!expanded)}>{expanded ? 'Hide Docs' : 'View Docs'}</button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: '1px solid var(--skm-border)', background: '#E3F2FD', color: '#1565C0', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }} onClick={() => setShowFlash(true)}>📋 Details</button>
          {officialLink && (
            <a href={officialLink} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', borderRadius: '8px', background: '#E8F5E9', color: '#2E7D32', fontSize: '12px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Apply ↗</a>
          )}
        </div>
      </div>

      {showFlash && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowFlash(false)}>
          <div className="skm-card" style={{ width: '500px', maxWidth: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '32px' }}>{scheme.emoji || '🏛️'}</span>
                <div>
                  <h3 style={{ margin: 0 }}>{scheme.name || scheme.title}</h3>
                  <p className="skm-text-muted" style={{ margin: 0, fontSize: '12px' }}>{scheme.department || scheme.ministry}</p>
                </div>
              </div>
              <button onClick={() => setShowFlash(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              {[{title: '📝 Description', content: scheme.description || scheme.benefits}, {title: '✅ Eligibility', content: scheme.eligibility}, {title: '🎁 Benefits', content: scheme.benefits}].map((s, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--skm-border)', paddingBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 8px' }}>{s.title}</h4>
                  <p style={{ margin: 0, color: 'var(--skm-text-muted)' }}>{s.content}</p>
                </div>
              ))}
              {scheme.documents?.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 8px' }}>📄 Required Documents</h4>
                  <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>{scheme.documents.map((doc, i) => <li key={i}>{doc}</li>)}</ul>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div><strong>Status:</strong> <span className="skm-status-badge success">{scheme.status || 'Active'}</span></div>
                <div><strong>Deadline:</strong> {scheme.deadline || 'Ongoing'}</div>
                <div><strong>Budget:</strong> {scheme.budget || 'Varies'}</div>
              </div>
            </div>
            {officialLink && (
              <a href={officialLink} target="_blank" rel="noopener noreferrer" className="skm-action-btn" style={{ marginTop: '16px', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                🌐 Open Official Portal & Apply ↗
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────

export default function NewsSchemes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const trendingRef = useRef(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('news');
  const [newsList, setNewsList] = useState([]);
  const [schemesList, setSchemesList] = useState([]);
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [visibleNewsCount, setVisibleNewsCount] = useState(9);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [newsRes, schemesRes, weatherRes, bookmarksRes] = await Promise.allSettled([
          getNews(), getGovSchemes(),
          getCurrentWeather(null, null, user?.district || 'Ahmedabad'),
          getBookmarks()
        ]);

        if (newsRes.status === 'fulfilled' && newsRes.value.data?.success) {
          setNewsList(newsRes.value.data.news.map(n => ({
            id: n.id || n._id, _id: n.id || n._id, title: n.title, description: n.description || n.content,
            category: n.category || 'Agriculture', categoryColor: n.category === 'Market Prices' ? '#1565C0' : (n.category === 'Weather' ? '#0277BD' : '#2E7D32'),
            date: new Date(n.publishedAt || n.createdAt || Date.now()).toLocaleDateString(),
            source: n.source || 'News Source',
            image: n.image || n.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=380&fit=crop',
            url: n.url || n.link || '#', trending: n.trending || n.featured || false, headline: n.title,
          })));
        }

        if (schemesRes.status === 'fulfilled' && schemesRes.value.data?.success) {
          setSchemesList(schemesRes.value.data.schemes.map(s => ({
            id: s.id || s._id, _id: s.id || s._id, title: s.title || s.name, name: s.title || s.name,
            description: s.description, ministry: s.ministry || 'Ministry of Agriculture',
            budget: s.budgetAllocated || 'Varies', status: s.active || s.status === 'Active' ? 'Active' : 'Closed',
            benefits: s.benefits || 'Financial assistance and support benefits.',
            eligibility: s.eligibility || 'Small and marginal farmers.',
            deadline: s.lastDate ? new Date(s.lastDate).toLocaleDateString() : 'N/A',
            documents: s.documentsRequired || ['Aadhaar Card', 'Land Records', 'Bank Passbook'],
            officialLink: s.officialLink || s.official_link || s.link || null,
            applicationProcess: s.applicationProcess || null,
          })));
        }

        if (weatherRes.status === 'fulfilled' && weatherRes.value.data?.success) {
          setWeatherAlerts(weatherRes.value.data.alerts || []);
        }

        if (bookmarksRes?.status === 'fulfilled' && bookmarksRes.value.data?.success) {
          setBookmarks(bookmarksRes.value.data.bookmarks || []);
        }
      } catch (err) { console.error(err); } finally { setIsLoading(false); }
    };
    fetchData();
  }, [user]);

  const showNotify = useCallback((msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); }, []);

  const handleBookmark = useCallback((key) => {
    const [type, id] = key.split(':');
    bookmarkItem(id, type).then(res => {
      if (res.data?.success) { setBookmarks(res.data.bookmarks || []); showNotify(res.data.message, 'success'); }
      else showNotify(res.data?.message || 'Failed to update bookmark', 'info');
    }).catch(() => showNotify('Error updating bookmark.', 'info'));
  }, [showNotify]);

  const filteredNews = newsList.filter(n => {
    const matchCat = activeCategory === 'all' || n.category === activeCategory;
    const matchSearch = !searchQuery || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || (n.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  useEffect(() => setVisibleNewsCount(9), [activeCategory, searchQuery]);
  const visibleNews = filteredNews.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < filteredNews.length;

  const scrollTrending = (dir) => { if (trendingRef.current) trendingRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' }); };

  return (
    <div className="skm-root">
      {notification && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: notification.type === 'error' ? '#f44336' : '#4CAF50', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 9999 }}>{notification.msg}</div>
      )}

      <Navbar user={user} onToggleSidebar={() => setSidebarOpen(o => !o)} notificationSlot={<NotificationBell notifications={[]} />} />

      <div className="skm-layout">
        <Sidebar collapsed={!sidebarOpen} onToggleCollapse={() => setSidebarOpen(o => !o)} activeItem="news" onNavigate={(item) => navigate(item.path)} onLogout={() => navigate('/login')} />

        <main className="skm-main">
          <div className="skm-content-area">
            {/* HERO */}
            <section className="skm-welcome-card" style={{ marginBottom: '24px' }}>
              <div>
                <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600 }}>📰 Information Center</span>
                <h1 className="skm-title" style={{ fontSize: '28px', margin: '4px 0' }}>News & Government Schemes</h1>
                <p className="skm-text-muted" style={{ margin: '8px 0', fontSize: '13px' }}>Stay updated with the latest agricultural news, government schemes, weather alerts, farming innovations, and AI-powered recommendations.</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  {['Agriculture', 'Gov Schemes', 'Market Prices'].map(t => <span key={t} className="skm-badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>{t}</span>)}
                </div>
              </div>
            </section>

            {/* STATS */}
            <div className="skm-grid" style={{ marginBottom: '24px' }}>
              {[
                { icon: '📰', label: 'News Articles', value: newsList.length, color: '#2E7D32' },
                { icon: '📢', label: 'Active Schemes', value: schemesList.length, color: '#1565C0' },
                { icon: '🌾', label: 'Agri Updates (Month)', value: '120', color: '#E65100' },
                { icon: '👨‍🌾', label: 'Farmers Benefited', value: '2.5M', color: '#6A1B9A' },
              ].map((s, i) => (
                <div key={i} className="skm-stat-card" style={{ borderTop: `4px solid ${s.color}` }}>
                  <div className="skm-stat-header"><span className="skm-stat-label">{s.label}</span><span className="skm-stat-icon">{s.icon}</span></div>
                  <div className="skm-stat-value" style={{ color: s.color }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* SEARCH & FILTERS */}
            <div className="skm-card" style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px', padding: '8px 12px' }}>
                <span>🔍</span>
                <input type="text" placeholder="Search news, schemes, crops or keywords..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '13px' }} />
                {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>}
              </div>
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {CATEGORIES_FILTER.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.value)} style={{ padding: '4px 14px', borderRadius: '20px', border: '1px solid var(--skm-border)', background: activeCategory === cat.value ? '#2E7D32' : '#fff', color: activeCategory === cat.value ? '#fff' : '#555', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '12px' }}>{cat.label}</button>
                ))}
              </div>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '12px', borderBottom: '1.5px solid var(--skm-border)', marginBottom: '20px', paddingBottom: '10px' }}>
              {[{ id: 'news', label: 'Latest News' }, { id: 'schemes', label: 'Gov Schemes' }, { id: 'bookmarks', label: `Bookmarks (${bookmarks.length})` }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: activeTab === tab.id ? '#E8F5E9' : 'transparent', color: activeTab === tab.id ? '#2E7D32' : 'var(--skm-text-muted)', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 600, cursor: 'pointer' }}>{tab.label}</button>
              ))}
            </div>

            {/* NEWS TAB */}
            {activeTab === 'news' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                    <h2 className="skm-section-title">Latest Agriculture News</h2>
                    <span className="skm-badge">{filteredNews.length} articles</span>
                  </div>
                  {isLoading ? (
                    <div className="skm-grid">{Array(6).fill(0).map((_, i) => <Loader key={i} variant="card" />)}</div>
                  ) : filteredNews.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <span style={{ fontSize: '48px' }}>🔍</span>
                      {activeCategory === 'Government' ? (
                        <p>No agriculture-related government news is available at the moment.</p>
                      ) : (
                        <p>No results found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                      )}
                      <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)' }} onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}>Clear Filters</button>
                    </div>
                  ) : (
                    <div className="skm-grid">
                      {visibleNews.map(item => <NewsCard key={item.id} item={item} bookmarks={bookmarks} onBookmark={handleBookmark} onReadMore={(id) => navigate(`/news/${id}`)} />)}
                    </div>
                  )}
                  {!isLoading && hasMoreNews && (
                    <div style={{ textAlign: 'center', marginTop: '24px' }}>
                      <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={() => setVisibleNewsCount(p => p + 9)}>
                        More News ({filteredNews.length - visibleNewsCount} remaining)
                      </button>
                    </div>
                  )}
                </div>

                {/* Trending Strip */}
                <div>
                  <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                    <h2 className="skm-section-title">Trending Agriculture News</h2>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => scrollTrending(-1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--skm-border)', background: '#fff', cursor: 'pointer' }}>←</button>
                      <button onClick={() => scrollTrending(1)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--skm-border)', background: '#fff', cursor: 'pointer' }}>→</button>
                    </div>
                  </div>
                  <div ref={trendingRef} style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {(() => {
                      const trending = newsList.filter(n => n.trending);
                      return (trending.length > 0 ? trending : newsList.slice(0, 4)).map(item => (
                        <div key={item.id} style={{ flexShrink: 0, width: '280px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--skm-border)', background: '#fff' }}>
                          <img src={item.image} alt={item.headline} style={{ width: '100%', height: '160px', objectFit: 'cover' }} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=380&fit=crop'; }} />
                          <div style={{ padding: '16px' }}>
                            <span className="skm-text-muted" style={{ fontSize: '10px' }}>{item.category}</span>
                            <p style={{ margin: '4px 0 8px', fontSize: '12px', fontWeight: 600, lineHeight: 1.4 }}>{(item.headline || item.title || '').substring(0, 60)}...</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span className="skm-text-muted" style={{ fontSize: '10px' }}>{item.date}</span>
                              <button style={{ border: '1px solid var(--skm-border)', background: 'transparent', padding: '3px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }} onClick={() => navigate(`/news/${item.id}`)}>Read</button>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Weather Alerts */}
                <div>
                  <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                    <h2 className="skm-section-title">⚠️ Weather Alerts</h2>
                  </div>
                  {weatherAlerts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', background: 'var(--skm-bg)', borderRadius: '12px' }}>
                      <span style={{ fontSize: '32px' }}>☀️</span>
                      <p className="skm-text-muted">No active weather warnings. Conditions are stable in your region.</p>
                    </div>
                  ) : (
                    <div className="skm-grid">
                      {weatherAlerts.map((alert, idx) => (
                        <div key={idx} className="skm-preview-item" style={{ background: alert.bg, borderLeft: `4px solid ${alert.color}`, gap: '12px' }}>
                          <span style={{ fontSize: '24px' }}>{alert.icon}</span>
                          <div>
                            <div style={{ color: alert.color, fontWeight: 700 }}>{alert.type}</div>
                            <span style={{ fontSize: '11px', background: alert.color + '22', color: alert.color, padding: '2px 8px', borderRadius: '4px' }}>{alert.severity} Alert</span>
                            <p style={{ margin: '8px 0 4px', fontSize: '12px' }}>{alert.desc}</p>
                            <span className="skm-text-muted" style={{ fontSize: '11px' }}>📍 {alert.district}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SCHEMES TAB */}
            {activeTab === 'schemes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                    <h2 className="skm-section-title">🏛️ Government Schemes</h2>
                    <span className="skm-badge">{schemesList.length} active</span>
                  </div>
                  {schemesList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 0' }}>
                      <span style={{ fontSize: '48px' }}>🔍</span>
                      <p>No agriculture-related government news is available at the moment.</p>
                    </div>
                  ) : (
                    <div className="skm-grid">
                      {schemesList.map(scheme => <SchemeCard key={scheme.id} scheme={scheme} bookmarks={bookmarks} onBookmark={handleBookmark} />)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                    <h2 className="skm-section-title">⭐ Popular Government Schemes</h2>
                  </div>
                  <div className="skm-grid">
                    {POPULAR_SCHEMES.map(s => (
                      <div key={s.id} className="skm-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <h4 style={{ margin: 0 }}>{s.name}</h4>
                            <p className="skm-text-muted" style={{ fontSize: '12px', margin: '4px 0 0' }}>{s.desc}</p>
                          </div>
                          <span className="skm-status-badge success">{s.status}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="skm-text-muted" style={{ fontSize: '11px' }}>{s.beneficiaries} benefited</span>
                          <a href={s.officialLink} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', border: '1px solid var(--skm-border)', borderRadius: '8px', textDecoration: 'none', color: '#2E7D32', fontSize: '12px', fontWeight: 600 }}>View Details ↗</a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BOOKMARKS TAB */}
            {activeTab === 'bookmarks' && (
              <div>
                <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                  <h2 className="skm-section-title">🔖 My Bookmarks</h2>
                  <span className="skm-badge">{bookmarks.length} saved</span>
                </div>
                {bookmarks.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <span style={{ fontSize: '48px' }}>📑</span>
                    <p className="skm-text-muted">No bookmarks yet. Start bookmarking news and schemes!</p>
                  </div>
                ) : (
                  <div className="skm-grid">
                    {bookmarks.map(id => {
                      const colonIdx = id.indexOf(':');
                      if (colonIdx === -1) return null;
                      const type = id.substring(0, colonIdx), realId = id.substring(colonIdx + 1);
                      if (type === 'news') {
                        const newsItem = newsList.find(n => String(n._id) === realId || String(n.id) === realId);
                        if (!newsItem) return null;
                        return <NewsCard key={id} item={newsItem} bookmarks={bookmarks} onBookmark={handleBookmark} onReadMore={(nid) => navigate(`/news/${nid}`)} />;
                      }
                      if (type === 'scheme') {
                        const schemeItem = schemesList.find(s => String(s.id) === realId || String(s._id) === realId);
                        if (!schemeItem) return <div key={id} className="skm-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', opacity: 0.6 }}>🔖 Government Scheme (ID: {realId})</div>;
                        return <SchemeCard key={id} scheme={schemeItem} bookmarks={bookmarks} onBookmark={handleBookmark} />;
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}