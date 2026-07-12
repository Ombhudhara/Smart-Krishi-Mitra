import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { getNewsById, getNews, bookmarkItem, getBookmarks } from '../../services/newsService';
import './NewsDetails.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  Weather:           { bg: '#E3F2FD', text: '#0D47A1', border: '#90CAF9' },
  Government:        { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  Technology:        { bg: '#EDE7F6', text: '#4527A0', border: '#B39DDB' },
  'Organic Farming': { bg: '#F1F8E9', text: '#558B2F', border: '#AED581' },
  'Market Prices':   { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  Agriculture:       { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  Business:          { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' },
  Environment:       { bg: '#E0F2F1', text: '#00695C', border: '#80CBC4' },
};

const getCatStyle = (cat) =>
  CATEGORY_COLORS[cat] || { bg: '#F5F5F5', text: '#424242', border: '#BDBDBD' };

const readingTime = (text = '') => {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );
};


const TRANSLATIONS = {
  en: { label: '🇬🇧 English',  prefix: '' },
  hi: { label: '🇮🇳 Hindi',    prefix: '[हिंदी अनुवाद उपलब्ध नहीं — मूल लेख देखें] ' },
  gu: { label: '🇮🇳 Gujarati', prefix: '[ગુજરાતી અનુવાદ ઉપલબ્ધ નથી — મૂળ લેખ જુઓ] ' },
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="ndp-skeleton">
      <div className="ndp-sk-img" />
      <div className="ndp-sk-body">
        <div className="ndp-sk-line ndp-sk-short" />
        <div className="ndp-sk-line ndp-sk-long" />
        <div className="ndp-sk-line ndp-sk-long" />
        <div className="ndp-sk-line ndp-sk-mid" />
        <div className="ndp-sk-line ndp-sk-long" />
      </div>
    </div>
  );
}

// ─── Main Details Page ─────────────────────────────────────────────────────────
export default function NewsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sidebarOpen,   setSidebarOpen]   = useState(true);
  const [article,       setArticle]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [lang,          setLang]          = useState('en');
  const [langOpen,      setLangOpen]      = useState(false);
  const [imgError,      setImgError]      = useState(false);
  const [notification,  setNotification]  = useState(null);
  const [bookmarks,     setBookmarks]     = useState([]);
  const [relatedNews,   setRelatedNews]   = useState([]);

  // Toast Notification
  const showNotify = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 2500);
  }, []);

  // Fetch article, bookmarks & related news on ID change
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setArticle(null);

    setImgError(false);
    setLang('en');
    setLangOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Fetch Bookmarks
    getBookmarks()
      .then(res => {
        if (res.data?.success) {
          setBookmarks(res.data.bookmarks || []);
        }
      })
      .catch(err => console.error("Error fetching bookmarks:", err));

    // 2. Fetch Article details
    getNewsById(id)
      .then(res => {
        if (res.data?.success && res.data?.news) {
          setArticle(res.data.news);
          // Fetch related news in same category
          fetchRelated(res.data.news.category, id);
        } else {
          setError('Article not found.');
        }
      })
      .catch(() => {
        setError('Unable to load article. Please check your network connection.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch related news
  const fetchRelated = (category, currentId) => {
    getNews(category)
      .then(res => {
        if (res.data?.success && res.data?.news) {
          const list = res.data.news
            .filter(n => (n.id || n._id) !== currentId)
            .slice(0, 3)
            .map(n => ({
              id: n.id || n._id,
              title: n.title,
              source: n.source || 'News Source',
              date: new Date(n.publishedAt || n.createdAt || Date.now()).toLocaleDateString(),
              image: n.image || n.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=380&fit=crop',
            }));
          setRelatedNews(list);
        }
      })
      .catch(err => console.error("Error fetching related news:", err));
  };

  // Bookmark Toggle
  const handleBookmark = () => {
    if (!article) return;
    const itemId = article.id || article._id;
    bookmarkItem(itemId, 'news')
      .then(res => {
        if (res.data?.success) {
          setBookmarks(res.data.bookmarks || []);
          showNotify(res.data.message, 'success');
        }
      })
      .catch(() => showNotify('Failed to update bookmark.', 'info'));
  };

  // Share
  const handleShare = async () => {
    const url   = article?.url   || window.location.href;
    const title = article?.title || 'Agriculture News';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        showNotify('✅ Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') {
          try {
            await navigator.clipboard.writeText(url);
            showNotify('📋 Link copied to clipboard!', 'success');
          } catch {
            showNotify('❌ Unable to share.', 'info');
          }
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showNotify('📋 Link copied to clipboard!', 'success');
      } catch {
        showNotify('❌ Copy link: ' + url, 'info');
      }
    }
  };


  // Translation
  const handleLangSelect = (code) => {
    setLang(code);
    setLangOpen(false);
    if (code !== 'en') {
      showNotify('🌐 Showing translation prefix. Use Original Article for full translation.', 'info');
    }
  };

  const isBookmarked   = article ? bookmarks.includes(`news:${article.id || article._id}`) : false;
  const catStyle       = getCatStyle(article?.category);
  const displayContent = () => {
    const base   = article?.content || article?.description || '';
    const prefix = TRANSLATIONS[lang]?.prefix || '';
    return prefix + base;
  };

  return (
    <div className="ns-root">
      {/* Notification Toast */}
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

      {/* ---- LAYOUT ──── */}
      <div className="ns-layout">
        {/* Sidebar */}
        <Sidebar
          collapsed={!sidebarOpen}
          onToggleCollapse={() => setSidebarOpen(o => !o)}
          activeItem="news"
          onNavigate={(item) => navigate(item.path)}
          onLogout={() => navigate('/login')}
        />

        {/* ---- MAIN CONTENT ---- */}
        <main className="ns-main">
          {/* Breadcrumbs & Back Navigation */}
          <div className="ndp-breadcrumb-row">
            <div className="ns-breadcrumb">
              Dashboard / News &amp; Schemes / <span>Details</span>
            </div>
            <button className="ndp-back-btn" onClick={() => navigate('/news-schemes')}>
              ⬅ Back to News
            </button>
          </div>

          <div className="ndp-card">
            {loading ? (
              <PageSkeleton />
            ) : error ? (
              <div className="ndp-error-box">
                <span className="ndp-error-icon">⚠️</span>
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <Button text="Retry" variant="primary" onClick={() => navigate(0)} />
              </div>
            ) : article ? (
              <>
                {/* Hero featured image with overlay */}
                <div className="ndp-hero">
                  <img
                    className="ndp-hero-img"
                    src={imgError
                      ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=500&fit=crop'
                      : (article.image || article.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=500&fit=crop')
                    }
                    alt={article.title}
                    onError={() => setImgError(true)}
                  />
                  <div className="ndp-hero-overlay">
                    <span className="ndp-hero-badge" style={{ background: catStyle.bg, color: catStyle.text }}>
                      {article.category || 'Agriculture'}
                    </span>
                    {article.trending && <span className="ndp-hero-badge-fire">🔥 Trending</span>}
                  </div>
                </div>

                {/* Metadata row */}
                <div className="ndp-meta">
                  <span className="ndp-meta-item">📰 {article.source || 'Agriculture News'}</span>
                  {article.author && <span className="ndp-meta-item">✍️ {article.author}</span>}
                  <span className="ndp-meta-item">🕐 {formatDate(article.publishedAt)}</span>
                  <span className="ndp-meta-item ndp-readtime">
                    📖 {readingTime(article.content || article.description)} min read
                  </span>
                </div>

                {/* Title */}
                <h1 className="ndp-title">{article.title}</h1>

                {/* Action Buttons Toolbar */}
                <div className="ndp-toolbar">
                  {/* Bookmark */}
                  <button
                    className={`ndp-tool-btn ndp-tool-bookmark${isBookmarked ? ' active' : ''}`}
                    onClick={handleBookmark}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
                  >
                    {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
                  </button>

                  {/* Share */}
                  <button className="ndp-tool-btn" onClick={handleShare} title="Share this article">
                    📤 Share
                  </button>


                  {/* Translate dropdown */}
                  <div className="ndp-lang-wrap">
                    <button className="ndp-tool-btn" onClick={() => setLangOpen(v => !v)}>
                      🌐 {TRANSLATIONS[lang]?.label || 'English'}
                    </button>
                    {langOpen && (
                      <div className="ndp-lang-dropdown">
                        {Object.entries(TRANSLATIONS).map(([code, val]) => (
                          <button
                            key={code}
                            className={`ndp-lang-opt${lang === code ? ' active' : ''}`}
                            onClick={() => handleLangSelect(code)}
                          >
                            {val.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Original Article redirection */}
                  <a
                    href={article.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ndp-tool-btn ndp-tool-orig"
                    onClick={(e) => {
                      if (!article.url || article.url === '#') {
                        e.preventDefault();
                        showNotify('❌ Original URL not available for this article.');
                      }
                    }}
                  >
                    🔗 Original Article ↗
                  </a>
                </div>

                {/* Full Article Description content */}
                <div className="ndp-content">
                  {lang !== 'en' && (
                    <div className="ndp-translate-note">
                      ℹ️ In-app full translation is a preview. Click <strong>Original Article ↗</strong> and use your browser translator for full localization.
                    </div>
                  )}
                  <p className="ndp-content-text">{displayContent()}</p>
                </div>

                {/* Tags row */}
                <div className="ndp-tags">
                  <span className="ndp-tag-label">Tags:</span>
                  {[article.category, article.source, 'India', 'Farming', 'Agriculture']
                    .filter((t, i, arr) => t && arr.indexOf(t) === i)
                    .slice(0, 5)
                    .map((tag, i) => (
                      <span key={i} className="ndp-tag">{tag}</span>
                    ))}
                </div>

              </>
            ) : null}
          </div>

          {/* Related news articles section */}
          {!loading && !error && relatedNews.length > 0 && (
            <section className="ndp-related-section">
              <h2 className="ndp-related-title">Related Agriculture News</h2>
              <div className="ndp-related-grid">
                {relatedNews.map((news) => (
                  <div key={news.id} className="ndp-related-card">
                    <div className="ndp-related-img-wrap">
                      <img src={news.image} alt={news.title} className="ndp-related-img" />
                    </div>
                    <div className="ndp-related-body">
                      <span className="ndp-related-meta">{news.source} · {news.date}</span>
                      <h4 className="ndp-related-headline">{news.title}</h4>
                      <Button
                        text="Read More"
                        variant="outline"
                        size="small"
                        className="ndp-related-btn"
                        onClick={() => navigate(`/news/${news.id}`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <Footer />
        </main>
      </div>
    </div>
  );
}
