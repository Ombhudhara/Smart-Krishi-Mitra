import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getNewsById } from '../../services/newsService';
import './NewsDetailModal.css';

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

const truncate = (str, n) =>
  str && str.length > n ? str.substring(0, n) + '…' : (str || '');

const generateInsights = (article) => {
  const cat   = article?.category || 'Agriculture';
  const title = article?.title    || '';

  const takeaways = [
    `${title.split(' ').slice(0, 6).join(' ')}… is a key development for Indian farmers.`,
    `${cat} sector update with direct implications on farm productivity and income.`,
    'Government and private stakeholders are actively engaging to improve outcomes.',
    'Farmers in affected regions should monitor official announcements closely.',
    'Adopting recommended practices can lead to measurable yield improvements.',
  ];
  const schemeMap = {
    Government:        ['PM-KISAN Samman Nidhi', 'Pradhan Mantri Fasal Bima Yojana', 'eNAM'],
    Weather:           ['National Disaster Relief Fund', 'Pradhan Mantri Fasal Bima Yojana'],
    Technology:        ['Digital Agriculture Mission', 'PM-KISAN', 'Kisan Credit Card'],
    'Market Prices':   ['eNAM', 'Price Stabilisation Fund', 'PM-KISAN'],
    'Organic Farming': ['PKVY Paramparagat Krishi Vikas Yojana', 'NMO-OP'],
  };
  const cropMap = {
    Weather:           ['Kharif crops', 'Rice', 'Cotton', 'Soybean'],
    Government:        ['Wheat', 'Rice', 'Pulses', 'Oilseeds'],
    Technology:        ['All crops', 'Horticulture', 'Vegetables'],
    'Market Prices':   ['Cotton', 'Onion', 'Potato', 'Wheat'],
    'Organic Farming': ['Vegetables', 'Fruits', 'Spices'],
  };
  return {
    takeaways: takeaways.slice(0, 4),
    impact: `This update directly affects small and marginal farmers in the ${cat.toLowerCase()} domain. Timely awareness can help farmers benefit from upcoming policies and avoid losses.`,
    actions: [
      'Stay updated with official government portals for announcements.',
      'Consult your local Krishi Vigyan Kendra (KVK) for personalized advice.',
      'Register or renew PM-KISAN and Fasal Bima Yojana enrollment.',
      'Connect with fellow farmers through Farmer Producer Organizations (FPOs).',
    ],
    schemes:       schemeMap[cat] || ['PM-KISAN Samman Nidhi', 'Pradhan Mantri Fasal Bima Yojana'],
    crops:         cropMap[cat]   || ['All major crops'],
    weatherImpact: cat === 'Weather'
      ? 'Monitor IMD advisories. Delay irrigation and field operations during heavy rainfall. Use soil moisture conservation techniques.'
      : null,
  };
};

const TRANSLATIONS = {
  en: { label: '🇬🇧 English',  prefix: '' },
  hi: { label: '🇮🇳 Hindi',    prefix: '[हिंदी अनुवाद उपलब्ध नहीं — मूल लेख देखें] ' },
  gu: { label: '🇮🇳 Gujarati', prefix: '[ગુજરાતી અનુવાદ ઉપલબ્ધ નથી — મૂળ લેખ જુઓ] ' },
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function ModalSkeleton() {
  return (
    <div className="ndm-skeleton">
      <div className="ndm-sk-img" />
      <div className="ndm-sk-body">
        <div className="ndm-sk-line ndm-sk-short" />
        <div className="ndm-sk-line ndm-sk-long"  />
        <div className="ndm-sk-line ndm-sk-long"  />
        <div className="ndm-sk-line ndm-sk-mid"   />
        <div className="ndm-sk-line ndm-sk-long"  />
        <div className="ndm-sk-line ndm-sk-short" />
      </div>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────────────
export default function NewsDetailModal({
  newsId,
  newsList,
  onClose,
  onBookmark,
  bookmarks,
}) {
  const [article,   setArticle]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [lang,      setLang]      = useState('en');
  const [showAI,    setShowAI]    = useState(false);
  const [aiLoading, setAILoading] = useState(false);
  const [insights,  setInsights]  = useState(null);
  const [langOpen,  setLangOpen]  = useState(false);
  const [imgError,  setImgError]  = useState(false);
  const [toast,     setToast]     = useState('');
  const bodyRef  = useRef(null);
  const langRef  = useRef(null);
  const fetchRef = useRef(0);

  // ── Fetch article ──────────────────────────────────────────────────────────
  const fetchArticle = useCallback((id) => {
    const token = ++fetchRef.current;
    setLoading(true);
    setError(null);
    setArticle(null);
    setShowAI(false);
    setInsights(null);
    setImgError(false);
    setLang('en');
    setLangOpen(false);
    if (bodyRef.current) bodyRef.current.scrollTop = 0;

    getNewsById(id)
      .then(res => {
        if (token !== fetchRef.current) return;
        if (res.data?.success && res.data?.news) {
          setArticle(res.data.news);
        } else {
          const found = newsList.find(n => n.id === id);
          found ? setArticle(found) : setError('Article not found.');
        }
      })
      .catch(() => {
        if (token !== fetchRef.current) return;
        const found = newsList.find(n => n.id === id);
        found ? setArticle(found) : setError('Unable to load article. Please try again.');
      })
      .finally(() => { if (token === fetchRef.current) setLoading(false); });
  }, [newsList]);

  useEffect(() => { fetchArticle(newsId); }, [newsId, fetchArticle]);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (langOpen) { if (e.key === 'Escape') setLangOpen(false); return; }
      if (e.key === 'Escape') { onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [langOpen, onClose]);

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ── Close lang dropdown on outside click ───────────────────────────────────
  useEffect(() => {
    if (!langOpen) return;
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [langOpen]);

  // ── Toast ──────────────────────────────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  // ── Share ──────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    const url   = article?.url   || window.location.href;
    const title = article?.title || 'Agriculture News';
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        showToast('✅ Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          try { await navigator.clipboard.writeText(url); showToast('📋 Link copied!'); }
          catch { showToast('❌ Could not share. Try copying the URL manually.'); }
        }
      }
    } else {
      try { await navigator.clipboard.writeText(url); showToast('📋 Link copied to clipboard!'); }
      catch { showToast('❌ Could not copy. URL: ' + url); }
    }
  };

  // ── AI Summarize ───────────────────────────────────────────────────────────
  const handleAISummarize = () => {
    if (!article) return;
    // Already shown → toggle off
    if (showAI && insights) { setShowAI(false); return; }
    // Generate for first time
    if (!insights) {
      setAILoading(true);
      setShowAI(true);
      setTimeout(() => {
        setInsights(generateInsights(article));
        setAILoading(false);
        setTimeout(() => {
          bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
      }, 1000);
    } else {
      // Toggle back on
      setShowAI(true);
    }
  };

  // ── Bookmark ───────────────────────────────────────────────────────────────
  const handleBookmark = () => {
    if (!article) return;
    onBookmark(article.id, 'news');
    showToast(bookmarks.includes(article.id) ? '🗑️ Bookmark removed.' : '🔖 Bookmarked!');
  };

  // ── Translate ──────────────────────────────────────────────────────────────
  const handleLangSelect = (code) => {
    setLang(code);
    setLangOpen(false);
    if (code !== 'en') {
      showToast('🌐 Showing language prefix. Click "Original Article" for browser translation.');
    }
  };

  // ── Computed ───────────────────────────────────────────────────────────────
  const isBookmarked   = article ? bookmarks.includes(article.id) : false;
  const catStyle       = getCatStyle(article?.category);
  const displayContent = () => {
    const base   = article?.content || article?.description || '';
    const prefix = TRANSLATIONS[lang]?.prefix || '';
    return prefix + base;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="ndm-backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="ndm-modal">

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <div className="ndm-header">
          <div className="ndm-header-left">
            <span className="ndm-logo-dot">🌾</span>
            <span className="ndm-header-title">Smart Krishi Mitra · News</span>
            {article && (
              <span
                className="ndm-header-cat"
                style={{ background: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
              >
                {article.category || 'Agriculture'}
              </span>
            )}
          </div>
          <div className="ndm-header-actions">
            <button
              className="ndm-icon-btn ndm-close-btn"
              title="Close (Esc)"
              onClick={onClose}
            >✕</button>
          </div>
        </div>

        {/* ── BODY ───────────────────────────────────────────────────────────── */}
        <div className="ndm-body" ref={bodyRef}>

          {loading ? (
            <ModalSkeleton />

          ) : error ? (
            <div className="ndm-error">
              <span className="ndm-error-icon">⚠️</span>
              <p>{error}</p>
              <button className="ndm-retry-btn" onClick={() => fetchArticle(newsId)}>
                🔄 Retry
              </button>
            </div>

          ) : article ? (
            <>
              {/* Hero Image */}
              <div className="ndm-hero-wrap">
                <img
                  className="ndm-hero-img"
                  src={imgError
                    ? 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=500&fit=crop'
                    : (article.image || article.imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=500&fit=crop')
                  }
                  alt={article.title}
                  onError={() => setImgError(true)}
                />
                <div className="ndm-hero-overlay">
                  <span className="ndm-hero-cat" style={{ background: catStyle.bg, color: catStyle.text }}>
                    {article.category || 'Agriculture'}
                  </span>
                  {article.trending && <span className="ndm-hero-fire">🔥 Trending</span>}
                </div>
              </div>

              {/* Meta */}
              <div className="ndm-article-meta">
                <div className="ndm-meta-row">
                  <span className="ndm-meta-item">📰 {article.source || 'Agriculture News'}</span>
                  {article.author && <span className="ndm-meta-item">✍️ {article.author}</span>}
                  <span className="ndm-meta-item">🕐 {formatDate(article.publishedAt)}</span>
                  <span className="ndm-meta-item ndm-reading-time">
                    📖 {readingTime(article.content || article.description)} min read
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="ndm-article-title">{article.title}</h1>

              {/* ── Toolbar ─────────────────────────────────────────────────── */}
              <div className="ndm-toolbar">

                {/* 🔖 Bookmark */}
                <button
                  className={`ndm-tool-btn ndm-tool-bookmark${isBookmarked ? ' active' : ''}`}
                  onClick={handleBookmark}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
                >
                  {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
                </button>

                {/* 📤 Share */}
                <button className="ndm-tool-btn" onClick={handleShare} title="Share this article">
                  📤 Share
                </button>

                {/* 🤖 AI Summary */}
                <button
                  className={`ndm-tool-btn ndm-tool-ai${showAI ? ' active' : ''}`}
                  onClick={handleAISummarize}
                  title="Toggle AI insights"
                >
                  🤖 {showAI && insights ? 'Hide AI Insights' : 'AI Summary'}
                </button>

                {/* 🌐 Translate */}
                <div className="ndm-lang-wrap" ref={langRef}>
                  <button
                    className={`ndm-tool-btn${lang !== 'en' ? ' active' : ''}`}
                    onClick={() => setLangOpen(v => !v)}
                    title="Select language"
                  >
                    🌐 {TRANSLATIONS[lang]?.label || 'English'}
                  </button>
                  {langOpen && (
                    <div className="ndm-lang-dropdown">
                      {Object.entries(TRANSLATIONS).map(([code, val]) => (
                        <button
                          key={code}
                          className={`ndm-lang-opt${lang === code ? ' ndm-lang-opt--active' : ''}`}
                          onClick={() => handleLangSelect(code)}
                        >
                          {val.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🔗 Original Article */}
                <a
                  href={article.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ndm-tool-btn ndm-tool-orig"
                  onClick={(e) => {
                    if (!article.url || article.url === '#') {
                      e.preventDefault();
                      showToast('❌ Original URL not available for this article.');
                    }
                  }}
                >
                  🔗 Original Article ↗
                </a>
              </div>

              {/* Toast */}
              {toast && <div className="ndm-share-toast">{toast}</div>}

              {/* Content */}
              <div className="ndm-content">
                {lang !== 'en' && (
                  <div className="ndm-translate-note">
                    ℹ️ Full translation is not available in-app. Click <strong>Original Article ↗</strong> and use your browser's built-in translate feature.
                  </div>
                )}
                <p className="ndm-content-text">{displayContent()}</p>
              </div>

              {/* Tags */}
              <div className="ndm-tags">
                <span className="ndm-tag-label">Tags:</span>
                {[article.category, article.source, 'India', 'Farming', 'Agriculture']
                  .filter((t, i, arr) => t && arr.indexOf(t) === i)
                  .slice(0, 6)
                  .map((tag, i) => (
                    <span key={i} className="ndm-tag">{tag}</span>
                  ))}
              </div>

              {/* ── AI Insights ──────────────────────────────────────────────── */}
              {showAI && (
                <div className="ndm-ai-section">
                  <div className="ndm-ai-header">
                    <span className="ndm-ai-icon">🤖</span>
                    <h3 className="ndm-ai-title">AI Insights for Farmers</h3>
                    <span className="ndm-ai-badge">Smart Krishi AI</span>
                    <button className="ndm-ai-close" onClick={() => setShowAI(false)} title="Close">✕</button>
                  </div>

                  {aiLoading ? (
                    <div className="ndm-ai-loading">
                      <div className="ndm-ai-spinner" />
                      <span>Analysing article and generating insights…</span>
                    </div>
                  ) : insights ? (
                    <div className="ndm-ai-grid">
                      <div className="ndm-ai-card ndm-ai-card--green">
                        <h4 className="ndm-ai-card-title">📋 Key Takeaways</h4>
                        <ul className="ndm-ai-list">
                          {insights.takeaways.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                      <div className="ndm-ai-card ndm-ai-card--blue">
                        <h4 className="ndm-ai-card-title">👨‍🌾 Farmer Impact</h4>
                        <p className="ndm-ai-text">{insights.impact}</p>
                      </div>
                      <div className="ndm-ai-card ndm-ai-card--orange">
                        <h4 className="ndm-ai-card-title">✅ Recommended Actions</h4>
                        <ul className="ndm-ai-list">
                          {insights.actions.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                      <div className="ndm-ai-card ndm-ai-card--purple">
                        <h4 className="ndm-ai-card-title">🏛️ Related Government Schemes</h4>
                        <div className="ndm-ai-chips">
                          {insights.schemes.map((s, i) => (
                            <span key={i} className="ndm-ai-chip ndm-ai-chip--purple">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="ndm-ai-card ndm-ai-card--teal">
                        <h4 className="ndm-ai-card-title">🌾 Related Crops</h4>
                        <div className="ndm-ai-chips">
                          {insights.crops.map((c, i) => (
                            <span key={i} className="ndm-ai-chip ndm-ai-chip--teal">{c}</span>
                          ))}
                        </div>
                      </div>
                      {insights.weatherImpact && (
                        <div className="ndm-ai-card ndm-ai-card--blue ndm-ai-card--full">
                          <h4 className="ndm-ai-card-title">🌧️ Weather Impact Advisory</h4>
                          <p className="ndm-ai-text">{insights.weatherImpact}</p>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </>
          ) : null}
        </div>


      </div>
    </div>
  );
}
