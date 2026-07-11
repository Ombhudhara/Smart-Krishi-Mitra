import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { getNews } from '../../services/newsService';
import { getGovSchemes } from '../../services/governmentService';
import './News_Schemes.css';

// =============================================================================
// DUMMY DATA
// =============================================================================

const POPULAR_SCHEMES = [
  { id: 1, name: 'PM-KISAN Samman Nidhi', desc: 'Direct income support of ₹6,000/year to farmer families.', status: 'Active', beneficiaries: '11.8 Cr' },
  { id: 2, name: 'Fasal Bima Yojana', desc: 'Crop insurance for farmers against natural calamities.', status: 'Active', beneficiaries: '5.5 Cr' },
  { id: 3, name: 'Soil Health Card Scheme', desc: 'Nutrient-based soil testing and recommendations.', status: 'Active', beneficiaries: '23 Cr' },
  { id: 4, name: 'eNAM (National Agriculture Market)', desc: 'Online trading platform for agricultural commodities.', status: 'Active', beneficiaries: '1.7 Cr' },
];

const AI_RECOMMENDATIONS = [
  { id: 1, icon: '🌾', title: 'Optimal Sowing Window', desc: 'Based on current soil moisture and forecast, the ideal sowing window for Rabi wheat in your region is November 15–30.', action: 'View Details', priority: 'high' },
  { id: 2, icon: '🧪', title: 'Soil Health Advisory', desc: 'Your soil reports indicate low nitrogen levels. Apply urea at 60 kg/acre before the next irrigation cycle.', action: 'View Plan', priority: 'medium' },
  { id: 3, icon: '📈', title: 'Market Price Prediction', desc: 'Cotton prices are expected to rise by 12% in the next 3 weeks due to reduced supply from Maharashtra.', action: 'View Forecast', priority: 'high' },
  { id: 4, icon: '🐛', title: 'Pest Alert – Bollworm', desc: 'Increased bollworm activity detected in your district. Consider biological control methods or neem-based sprays.', action: 'View Advisory', priority: 'critical' },
  { id: 5, icon: '💧', title: 'Irrigation Scheduling', desc: 'Reduce irrigation frequency by 20% this week — soil moisture is above optimal due to recent rainfall.', action: 'View Schedule', priority: 'low' },
];

const WEATHER_ALERTS = [
  { id: 1, type: 'Heavy Rain Alert', icon: '\uD83C\uDF27\uFE0F', severity: 'High', color: '#0277BD', bg: '#E3F2FD',
    desc: 'Heavy to very heavy rainfall expected in Vidarbha, Konkan, and Coastal Karnataka. Avoid field operations for the next 48 hours.',
    district: 'Nagpur, Pune, Mangaluru' },
  { id: 2, type: 'Heat Wave', icon: '\uD83C\uDF21\uFE0F', severity: 'Moderate', color: '#E65100', bg: '#FFF3E0',
    desc: 'Day temperature may touch 44 degrees C in Rajasthan and Madhya Pradesh. Irrigate crops only during morning or evening hours.',
    district: 'Jaipur, Jodhpur, Bhopal' },
  { id: 3, type: 'Cyclone Warning', icon: '\uD83C\uDF00', severity: 'Severe', color: '#880E4F', bg: '#FCE4EC',
    desc: 'Low pressure system in Bay of Bengal may intensify into a cyclone. Coastal Odisha and Andhra farmers should take precautions.',
    district: 'Bhubaneswar, Visakhapatnam' },
  { id: 4, type: 'Low Temperature', icon: '\uD83C\uDF28\uFE0F', severity: 'Low', color: '#01579B', bg: '#E1F5FE',
    desc: 'Night temperatures may drop to 5-7 degrees C in Punjab and Haryana. Protect rabi crops with irrigation or mulching techniques.',
    district: 'Amritsar, Hisar, Karnal' },
];

const STATS_DATA = [
  { id: 1, icon: '\uD83D\uDCF0', label: 'News Published Today',        value: '18',   color: '#2E7D32', bg: '#E8F5E9' },
  { id: 2, icon: '\uD83D\uDCE2', label: 'Active Government Schemes',   value: '46',   color: '#1565C0', bg: '#E3F2FD' },
  { id: 3, icon: '\uD83C\uDF3E', label: 'Agriculture Updates (Month)', value: '120',  color: '#E65100', bg: '#FFF3E0' },
  { id: 4, icon: '\uD83D\uDC68\u200D\uD83C\uDF3E', label: 'Farmers Benefited', value: '2.5M', color: '#6A1B9A', bg: '#F3E5F5' },
];

const CATEGORIES_FILTER = [
  { id: 'all',     label: 'All',             value: 'all' },
  { id: 'agri',    label: 'Agriculture',     value: 'Agriculture' },
  { id: 'weather', label: 'Weather',         value: 'Weather' },
  { id: 'govt',    label: 'Government',      value: 'Government' },
  { id: 'market',  label: 'Market Prices',   value: 'Market Prices' },
  { id: 'tech',    label: 'Technology',      value: 'Technology' },
  { id: 'organic', label: 'Organic Farming', value: 'Organic Farming' },
  { id: 'export',  label: 'Export',          value: 'Export' },
];


// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// Loader will be used directly from components

// Individual news article card
function NewsCard({ item, bookmarks, onBookmark }) {
  const isBookmarked = bookmarks.includes(item.id);
  return (
    <Card className="ns-news-card">
      <div className="ns-news-img-wrap">
        <img src={item.image} alt={item.title} className="ns-news-img" loading="lazy" />
        {item.trending && <span className="ns-fire-badge">Trending</span>}
        <Button
          text={isBookmarked ? 'Saved' : 'Save'}
          className={`ns-bm-corner-btn${isBookmarked ? ' ns-bm-corner-btn--on' : ''}`}
          onClick={() => onBookmark(item.id, 'news')}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          variant="outline"
          size="small"
        />
      </div>
      <div className="ns-news-body">
        <span
          className="ns-cat-badge"
          style={{
            background: item.categoryColor + '18',
            color: item.categoryColor,
            border: '1px solid ' + item.categoryColor + '30',
          }}
        >
          {item.category}
        </span>
        <h3 className="ns-news-title">{item.title}</h3>
        <p className="ns-news-desc">{item.description}</p>
        <div className="ns-news-footer">
          <div className="ns-news-meta">
            <span className="ns-news-date">{item.date}</span>
            <span className="ns-meta-sep">|</span>
            <span className="ns-news-src">{item.source}</span>
          </div>
          <div className="ns-news-btns">
            <Button text="Share" className="ns-share-btn" variant="outline" size="small" />
            <Button text="Read More" className="ns-read-btn" />
          </div>
        </div>
      </div>
    </Card>
  );
}

// Government scheme card with expandable documents section
function SchemeCard({ scheme, bookmarks, onBookmark }) {
  const [expanded, setExpanded] = useState(false);
  const isBookmarked = bookmarks.includes('scheme_' + scheme.id);
  return (
    <Card className="ns-scheme-card">
      <div className="ns-scheme-head">
        <div className="ns-scheme-emoji-wrap">
          <span className="ns-scheme-emoji">{scheme.emoji}</span>
        </div>
        <div className="ns-scheme-title-group">
          <h3 className="ns-scheme-name">{scheme.name}</h3>
          <p className="ns-scheme-dept">{scheme.department}</p>
        </div>
        <Button
          text={isBookmarked ? 'Saved' : 'Save'}
          className={`ns-bm-corner-btn${isBookmarked ? ' ns-bm-corner-btn--on' : ''}`}
          onClick={() => onBookmark('scheme_' + scheme.id, 'scheme')}
          variant="outline"
          size="small"
        />
      </div>

      <div className="ns-scheme-kpi-row">
        <div className="ns-scheme-kpi">
          <span className="ns-kpi-label">Beneficiaries</span>
          <span className="ns-kpi-val">{scheme.beneficiaries}</span>
        </div>
        <div className="ns-scheme-kpi">
          <span className="ns-kpi-label">Budget</span>
          <span className="ns-kpi-val">{scheme.budget}</span>
        </div>
        <div className="ns-scheme-kpi">
          <span className="ns-kpi-label">Status</span>
          <span className="ns-status-active">{scheme.status}</span>
        </div>
      </div>

      <div className="ns-scheme-detail-row">
        <div className="ns-detail-label">Benefits</div>
        <p className="ns-detail-text">{scheme.benefits}</p>
      </div>
      <div className="ns-scheme-detail-row">
        <div className="ns-detail-label">Eligibility</div>
        <p className="ns-detail-text">{scheme.eligibility}</p>
      </div>
      <div className="ns-scheme-detail-row">
        <div className="ns-detail-label">Deadline</div>
        <p className="ns-detail-text ns-deadline">{scheme.deadline}</p>
      </div>

      {expanded && (
        <div className="ns-scheme-docs ns-fade-in">
          <div className="ns-detail-label">Required Documents</div>
          <ul className="ns-docs-list">
            {scheme.documents.map((doc, i) => (
              <li key={i} className="ns-doc-item">
                <span className="ns-doc-dot" />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ns-scheme-foot">
        <Button
          text={expanded ? 'Hide Documents' : 'View Documents'}
          className="ns-expand-btn"
          onClick={() => setExpanded(!expanded)}
          variant="outline"
          size="small"
        />
        <div className="ns-scheme-cta">
          <Button text="Details" className="ns-view-det-btn" variant="secondary" size="small" />
          <Button text="Apply Now" className="ns-apply-btn" variant="primary" />
        </div>
      </div>
    </Card>
  );
}

// AI-powered recommendation card with priority badge
function AIRecommendationCard({ rec }) {
  const pMap = {
    urgent: { bg: '#FCE4EC', border: '#EF9A9A', text: '#C62828', label: 'Urgent' },
    high:   { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32', label: 'High Priority' },
    medium: { bg: '#FFF8E1', border: '#FFE082', text: '#F57F17', label: 'Recommended' },
  };
  const p = pMap[rec.priority];
  return (
    <Card className="ns-ai-card" style={{ borderLeftColor: p.border }}>
      <div className="ns-ai-card-inner">
        <div className="ns-ai-icon-bubble" style={{ background: p.bg }}>
          <span className="ns-ai-icon">{rec.icon}</span>
        </div>
        <div className="ns-ai-content">
          <div className="ns-ai-meta">
            <span
              className="ns-ai-priority"
              style={{ background: p.bg, color: p.text, borderColor: p.border }}
            >
              {p.label}
            </span>
            <span className="ns-ai-tag">AI Insight</span>
          </div>
          <h4 className="ns-ai-title">{rec.title}</h4>
          <p className="ns-ai-desc">{rec.desc}</p>
          <Button text={rec.action} className="ns-ai-action" variant="outline" size="small" />
        </div>
      </div>
    </Card>
  );
}

// Compact card for the horizontal trending news scroll
function TrendingCard({ item }) {
  return (
    <Card className="ns-trending-card">
      <img src={item.image} alt={item.headline} className="ns-trending-img" />
      <div className="ns-trending-body">
        <span className="ns-trending-cat">{item.category}</span>
        <p className="ns-trending-headline">{item.headline}</p>
        <div className="ns-trending-foot">
          <span className="ns-trending-date">{item.date}</span>
          <Button text="Read" className="ns-trending-read" variant="outline" size="small" />
        </div>
      </div>
    </Card>
  );
}

// Quick statistic card shown at the top of the page
function StatCard({ stat }) {
  return (
    <Card className="ns-stat-card" style={{ borderTopColor: stat.color }}>
      <div className="ns-stat-icon-bg" style={{ background: stat.bg }}>
        <span className="ns-stat-icon">{stat.icon}</span>
      </div>
      <div className="ns-stat-body">
        <div className="ns-stat-val" style={{ color: stat.color }}>{stat.value}</div>
        <div className="ns-stat-label">{stat.label}</div>
      </div>
    </Card>
  );
}

// Color-coded weather alert card
function WeatherAlertCard({ alert }) {
  return (
    <Card className="ns-weather-card" style={{ background: alert.bg, borderLeftColor: alert.color }}>
      <div className="ns-weather-top">
        <span className="ns-weather-icon">{alert.icon}</span>
        <div>
          <div className="ns-weather-type" style={{ color: alert.color }}>{alert.type}</div>
          <span
            className="ns-weather-sev"
            style={{ background: alert.color + '22', color: alert.color }}
          >
            {alert.severity} Alert
          </span>
        </div>
      </div>
      <p className="ns-weather-desc">{alert.desc}</p>
      <div className="ns-weather-dist">{alert.district}</div>
    </Card>
  );
}

// Single bookmarked item with remove action
function BookmarkItem({ id, onRemove, newsList, schemesList }) {
  const newsItem   = newsList.find((n) => n._id === id || n.id === id);
  const schemeItem = schemesList.find((s) => s._id === id || s.id === id);
  if (!newsItem && !schemeItem) return null;

  const label    = newsItem ? newsItem.title : schemeItem.name;
  const tag      = newsItem ? newsItem.category : 'Gov Scheme';
  const tagColor = newsItem ? newsItem.categoryColor : '#2E7D32';

  return (
    <div className="ns-bm-item">
      <span className="ns-bm-tag" style={{ background: tagColor + '18', color: tagColor }}>
        {tag}
      </span>
      <p className="ns-bm-title">{label}</p>
      <Button text="Remove" className="ns-bm-remove" onClick={() => onRemove(id)} variant="danger" size="small" />
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function NewsSchemes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const trendingRef = useRef(null);

  // UI state
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [bookmarks,      setBookmarks]      = useState([]);
  const [isLoading,      setIsLoading]      = useState(true);
  const [notification,   setNotification]   = useState(null);
  const [activeTab,      setActiveTab]      = useState('news');
  const [newsList,       setNewsList]       = useState([]);
  const [schemesList,    setSchemesList]    = useState([]);

  // Fetch news and schemes on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [newsRes, schemesRes] = await Promise.all([
          getNews(),
          getGovSchemes()
        ]);

        if (newsRes.data?.success) {
          const mappedNews = newsRes.data.news.map(n => ({
            id: n._id,
            _id: n._id,
            title: n.title,
            description: n.content || n.description,
            category: n.category || 'Agriculture',
            categoryColor: n.category === 'Market Prices' ? '#1565C0' : (n.category === 'Weather' ? '#0277BD' : '#2E7D32'),
            date: new Date(n.createdAt || Date.now()).toLocaleDateString(),
            source: n.source || 'News Source',
            image: n.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=380&fit=crop',
            trending: n.featured || false,
            headline: n.title,
          }));
          setNewsList(mappedNews);
        }

        if (schemesRes.data?.success) {
          const mappedSchemes = schemesRes.data.schemes.map(s => ({
            id: s._id,
            _id: s._id,
            title: s.title,
            name: s.title,
            description: s.description,
            ministry: s.ministry || 'Ministry of Agriculture',
            budget: s.budgetAllocated || 'Varies',
            status: s.active ? 'Active' : 'Closed',
            benefits: s.benefits || 'Financial assistance and support benefits.',
            eligibility: s.eligibility || 'Small and marginal farmers.',
            deadline: s.lastDate ? new Date(s.lastDate).toLocaleDateString() : 'N/A',
            documents: s.documentsRequired || ['Aadhaar Card', 'Land Records', 'Bank Passbook']
          }));
          setSchemesList(mappedSchemes);
        }
      } catch (err) {
        console.error("Error fetching news/schemes:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show a toast notification for 3 seconds
  const showNotify = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // Toggle bookmark for a news item or scheme
  const handleBookmark = useCallback((id) => {
    setBookmarks((prev) => {
      if (prev.includes(id)) {
        showNotify('Bookmark removed.', 'info');
        return prev.filter((b) => b !== id);
      }
      showNotify('Bookmarked successfully!', 'success');
      return [...prev, id];
    });
  }, [showNotify]);

  // Remove a bookmark from the bookmarks tab
  const handleRemoveBookmark = useCallback((id) => {
    setBookmarks((prev) => prev.filter((b) => b !== id));
    showNotify('Bookmark removed.', 'info');
  }, [showNotify]);

  const filteredNews = newsList.filter((n) => {
    const matchCat    = activeCategory === 'all' || n.category === activeCategory;
    const matchSearch = searchQuery === '' ||
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Scroll the trending news strip left or right
  const scrollTrending = (dir) => {
    if (trendingRef.current) {
      trendingRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  const TABS = [
    { id: 'news',      label: 'Latest News' },
    { id: 'schemes',   label: 'Gov Schemes' },
    { id: 'ai',        label: 'AI Insights' },
    { id: 'bookmarks', label: `Bookmarks (${bookmarks.length})` },
  ];

  return (
    <div className="ns-root">

      {/* Toast notification */}
      {notification && (
        <div className={`ns-toast ns-toast--${notification.type}`}>
          {notification.msg}
        </div>
      )}

      {/* ---- NAVBAR ---- */}
      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarOpen(o => !o)}
        notificationSlot={<NotificationBell notifications={[]} />}
      />

      {/* ---- LAYOUT (sidebar + main) ---- */}
      <div className="ns-layout">

        {/* ---- SIDEBAR ---- */}
        <Sidebar
          collapsed={!sidebarOpen}
          onToggleCollapse={() => setSidebarOpen(o => !o)}
          activeItem="news"
          onNavigate={(item) => navigate(item.path)}
          onLogout={() => navigate('/login')}
        />

        {/* ---- MAIN CONTENT ---- */}
        <main className="ns-main">

          {/* Page header with illustration */}
          <section className="ns-page-header">
            <div className="ns-header-inner">
              <div className="ns-header-text">
                <div className="ns-breadcrumb">Dashboard / <span>News &amp; Schemes</span></div>
                <h1 className="ns-page-title">News &amp; Government Schemes</h1>
                <p className="ns-page-subtitle">
                  Stay updated with the latest agricultural news, government schemes, weather alerts,
                  farming innovations, and AI-powered recommendations.
                </p>
                <div className="ns-header-tags">
                  <span className="ns-header-tag">Agriculture</span>
                  <span className="ns-header-tag">Gov Schemes</span>
                  <span className="ns-header-tag">Market Prices</span>
                  <span className="ns-header-tag">AI Insights</span>
                </div>
              </div>
              <div className="ns-header-illus" aria-hidden="true">
                <div className="ns-illus-circle">
                  <span className="ns-illus-main">{'\uD83D\uDCF0'}</span>
                </div>
                <div className="ns-illus-orbit ns-orbit-1"><span>{'\uD83C\uDF3E'}</span></div>
                <div className="ns-illus-orbit ns-orbit-2"><span>{'\uD83C\uDFDB\uFE0F'}</span></div>
                <div className="ns-illus-orbit ns-orbit-3"><span>{'\uD83E\uDD16'}</span></div>
              </div>
            </div>
          </section>

          {/* Quick statistics row */}
          <section className="ns-stats-row">
            {STATS_DATA.map((stat) => <StatCard key={stat.id} stat={stat} />)}
          </section>

          {/* Search bar and category filter chips */}
          <section className="ns-search-section">
            <div className="ns-search-bar">
              <span className="ns-search-icon">{'\uD83D\uDD0D'}</span>
              <input
                type="text"
                className="ns-search-input"
                placeholder="Search news, schemes, crops or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button text="x" className="ns-search-clear" onClick={() => setSearchQuery('')} variant="outline" size="small" />
              )}
            </div>
            <div className="ns-chips-row">
              {CATEGORIES_FILTER.map((cat) => (
                <Button
                  key={cat.id}
                  text={cat.label}
                  className={`ns-chip${activeCategory === cat.value ? ' ns-chip--active' : ''}`}
                  onClick={() => setActiveCategory(cat.value)}
                  variant="outline"
                  size="small"
                />
              ))}
            </div>
          </section>

          {/* Tab bar to switch between sections */}
          <div className="ns-tab-bar">
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                text={tab.label}
                className={`ns-tab${activeTab === tab.id ? ' ns-tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                variant="outline"
                size="small"
              />
            ))}
          </div>

          {/* ---- NEWS TAB ---- */}
          {activeTab === 'news' && (
            <>
              {/* Latest news grid */}
              <section className="ns-section">
                <div className="ns-section-header">
                  <h2 className="ns-section-title">Latest Agriculture News</h2>
                  <span className="ns-section-pill">{filteredNews.length} articles</span>
                </div>

                {isLoading ? (
                  <div className="ns-news-grid">
                    {Array(6).fill(0).map((_, i) => <Loader key={i} variant="card" />)}
                  </div>
                ) : filteredNews.length === 0 ? (
                  <div className="ns-empty-state">
                    <span className="ns-empty-icon">{'\uD83D\uDD0D'}</span>
                    <p>No results found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                    <Button
                      text="Clear Filters"
                      className="ns-clear-btn"
                      onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                      variant="outline"
                    />
                  </div>
                ) : (
                  <div className="ns-news-grid">
                    {filteredNews.map((item) => (
                      <NewsCard key={item.id} item={item} bookmarks={bookmarks} onBookmark={handleBookmark} />
                    ))}
                  </div>
                )}
              </section>

              {/* Horizontal scrolling trending news strip */}
              <section className="ns-section">
                <div className="ns-section-header">
                  <h2 className="ns-section-title">Trending Agriculture News</h2>
                  <div className="ns-scroll-controls">
                    <Button text="←" className="ns-scroll-btn" onClick={() => scrollTrending(-1)} variant="outline" size="small" />
                    <Button text="→" className="ns-scroll-btn" onClick={() => scrollTrending(1)} variant="outline" size="small" />
                  </div>
                </div>
                <div className="ns-trending-scroll" ref={trendingRef}>
                  {newsList.filter(n => n.trending).map((item) => <TrendingCard key={item.id} item={item} />)}
                </div>
              </section>

              {/* Weather alert cards */}
              <section className="ns-section">
                <div className="ns-section-header">
                  <h2 className="ns-section-title">Weather Alerts</h2>
                </div>
                <div className="ns-weather-grid">
                  {WEATHER_ALERTS.map((alert) => <WeatherAlertCard key={alert.id} alert={alert} />)}
                </div>
              </section>
            </>
          )}

          {/* ---- SCHEMES TAB ---- */}
          {activeTab === 'schemes' && (
            <>
              <section className="ns-section">
                <div className="ns-section-header">
                  <h2 className="ns-section-title">Government Schemes</h2>
                  <span className="ns-section-pill">{schemesList.length} active</span>
                </div>
                <div className="ns-schemes-grid">
                  {schemesList.map((scheme) => (
                    <SchemeCard
                      key={scheme.id}
                      scheme={scheme}
                      bookmarks={bookmarks}
                      onBookmark={handleBookmark}
                    />
                  ))}
                </div>
              </section>

              <section className="ns-section">
                <div className="ns-section-header">
                  <h2 className="ns-section-title">Popular Government Schemes</h2>
                </div>
                <div className="ns-popular-grid">
                  {POPULAR_SCHEMES.map((s) => (
                    <Card key={s.id} className="ns-popular-card">
                      <div className="ns-popular-top">
                        <div>
                          <h4 className="ns-popular-name">{s.name}</h4>
                          <p className="ns-popular-desc">{s.desc}</p>
                        </div>
                        <span className="ns-popular-badge">{s.status}</span>
                      </div>
                      <div className="ns-popular-foot">
                        <span className="ns-popular-bene">{s.beneficiaries} benefited</span>
                        <Button text="View Details" className="ns-popular-view" variant="outline" size="small" />
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* ---- AI INSIGHTS TAB ---- */}
          {activeTab === 'ai' && (
            <section className="ns-section">
              <div className="ns-section-header">
                <h2 className="ns-section-title">AI Recommendations</h2>
                <span className="ns-section-pill">Personalized for you</span>
              </div>

              {/* AI hero banner */}
              <div className="ns-ai-hero">
                <div className="ns-ai-hero-icon">{'\uD83E\uDD16'}</div>
                <div className="ns-ai-hero-content">
                  <h3 className="ns-ai-hero-title">Smart Krishi AI Assistant</h3>
                  <p className="ns-ai-hero-desc">
                    AI is analyzing your farm data, soil reports, weather patterns, and market trends
                    to give you personalized recommendations.
                  </p>
                </div>
                <Button text="Ask AI Assistant" className="ns-ai-chat-btn" variant="primary" />
              </div>

              {/* AI recommendation cards */}
              <div className="ns-ai-grid">
                {AI_RECOMMENDATIONS.map((rec) => <AIRecommendationCard key={rec.id} rec={rec} />)}
              </div>
            </section>
          )}

          {/* ---- BOOKMARKS TAB ---- */}
          {activeTab === 'bookmarks' && (
            <section className="ns-section">
              <div className="ns-section-header">
                <h2 className="ns-section-title">My Bookmarks</h2>
                <span className="ns-section-pill">{bookmarks.length} saved</span>
              </div>

              {bookmarks.length === 0 ? (
                <div className="ns-empty-state">
                  <span className="ns-empty-icon">{'\uD83D\uDCD1'}</span>
                  <p>No bookmarks yet. Start bookmarking news and schemes!</p>
                </div>
              ) : (
                <div className="ns-bm-grid">
                  {bookmarks.map((id) => (
                    <BookmarkItem key={id} id={id} onRemove={handleRemoveBookmark} newsList={newsList} schemesList={schemesList} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ---- FOOTER ---- */}
          <Footer />
        </main>
      </div>
    </div>
  );
}
