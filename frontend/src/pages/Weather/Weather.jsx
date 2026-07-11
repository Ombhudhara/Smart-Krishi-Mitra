import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { getCurrentWeather } from '../../services/weatherService';
import { getNews } from '../../services/newsService';
import './Weather.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   AGRICULTURAL WEATHER NEWS
   ═══════════════════════════════════════════════════════════════════════════════ */



const SEARCH_HISTORY_DEFAULT = ['Ahmedabad, Gujarat', 'Nashik, Maharashtra', 'Pune, Maharashtra'];
const CHART_LABELS = ['Now', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];

// ─── Compact SVG Chart ───────────────────────────────────────────────────────
function WeatherTrendChart({ data, type, color, label }) {
  const H = 100;
  const W = 340;
  const pad = { top: 16, bottom: 20, left: 28, right: 10 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;

  const chartData = Array.isArray(data) && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...chartData, 10);
  const minVal = Math.min(...chartData, 0);
  const range = maxVal - minVal || 1;

  const pts = chartData.map((val, idx) => {
    const x = chartData.length > 1
      ? pad.left + (idx * (iW / (chartData.length - 1)))
      : pad.left + iW / 2;
    const y = pad.top + iH - (((val - minVal) / range) * iH);
    return `${x},${y}`;
  }).join(' ');

  // Filled area
  const firstX = pad.left;
  const lastX = pad.left + iW;
  const baseY = pad.top + iH;
  const areaPoints = `${firstX},${baseY} ${pts} ${lastX},${baseY}`;

  return (
    <div className="wt2-chart-wrap">
      <div className="wt2-chart-header">
        <span className="wt2-chart-label">{label}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="wt2-svg-chart">
        <defs>
          <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.5, 1].map((r, i) => (
          <line key={i} x1={pad.left} y1={pad.top + iH * r} x2={pad.left + iW} y2={pad.top + iH * r}
            stroke="#E8F5E9" strokeWidth="1" strokeDasharray={r === 1 ? 'none' : '4 4'} />
        ))}
        {/* Y labels */}
        {[0, 0.5, 1].map((r, i) => {
          const val = Math.round(maxVal - r * range);
          return (
            <text key={i} x={pad.left - 4} y={pad.top + iH * r + 4}
              textAnchor="end" fontSize="8" fill="#9E9E9E">
              {type === 'temp' ? `${val}°` : `${val}%`}
            </text>
          );
        })}
        {/* Area fill */}
        <polygon points={areaPoints} fill={`url(#grad-${type})`} />
        {/* Line */}
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {data.map((val, idx) => {
          const x = pad.left + (idx * (iW / (data.length - 1)));
          const y = pad.top + iH - (((val - minVal) / range) * iH);
          return (
            <g key={idx}>
              <circle cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="1.5" />
            </g>
          );
        })}
        {/* X labels */}
        {CHART_LABELS.map((lbl, idx) => {
          const x = pad.left + (idx * (iW / (data.length - 1)));
          return (
            <text key={idx} x={x} y={H - 4} textAnchor="middle" fontSize="7.5" fill="#9E9E9E">{lbl}</text>
          );
        })}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN WEATHER DASHBOARD COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function Weather() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [recentLocations, setRecentLocations] = useState(SEARCH_HISTORY_DEFAULT);
  const [newsList, setNewsList] = useState([
    { id: 1, source: 'AgriNews India', title: 'IMD predicts normal monsoon arrival in Maharashtra', date: 'June 28, 2026', snippet: 'Indian Meteorological Department projects steady rain distributions across Konkan and central regions.', emoji: '🌧️' },
    { id: 2, source: 'Krishi Patrika', title: 'How to save cotton crops during unexpected summer hail storms', date: 'June 25, 2026', snippet: 'Expert guidelines on crop protection, physical covers, and foliar sprays for recovery.', emoji: '🌿' }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const activeWeather = weatherData || {
    city: 'Ahmedabad',
    state: 'Gujarat',
    temp: 30,
    condition: 'Clear',
    icon: '☀️',
    feelsLike: '32°C',
    humidity: '50%',
    windSpeed: '10 km/h',
    uvIndex: '5 (Moderate)',
    visibility: '10 km',
    airQuality: '45 (Good)',
    pressure: '1010 hPa',
    sunrise: '06:00 AM',
    sunset: '07:00 PM',
    hourly: [
      { time: 'Now', temp: '30°C', icon: '☀️', rain: '0%', wind: '10km/h' },
      { time: '+1h', temp: '29°C', icon: '☀️', rain: '0%', wind: '9km/h' },
      { time: '+2h', temp: '28°C', icon: '🌙', rain: '0%', wind: '8km/h' },
      { time: '+3h', temp: '28°C', icon: '🌙', rain: '0%', wind: '8km/h' },
      { time: '+4h', temp: '29°C', icon: '☀️', rain: '0%', wind: '9km/h' },
      { time: '+5h', temp: '30°C', icon: '☀️', rain: '0%', wind: '10km/h' },
      { time: '+6h', temp: '31°C', icon: '☀️', rain: '0%', wind: '11km/h' },
    ],
    daily: [
      { day: 'Today', icon: '☀️', min: '28°C', max: '36°C', rain: '5%', wind: '18km/h' },
      { day: 'Mon', icon: '⛅', min: '27°C', max: '34°C', rain: '10%', wind: '15km/h' },
      { day: 'Tue', icon: '🌦️', min: '26°C', max: '33°C', rain: '20%', wind: '20km/h' },
      { day: 'Wed', icon: '☁️', min: '25°C', max: '31°C', rain: '30%', wind: '22km/h' },
      { day: 'Thu', icon: '🌧️', min: '24°C', max: '29°C', rain: '60%', wind: '25km/h' },
      { day: 'Fri', icon: '🌦️', min: '25°C', max: '31°C', rain: '25%', wind: '18km/h' },
      { day: 'Sat', icon: '⛅', min: '27°C', max: '33°C', rain: '15%', wind: '16km/h' },
    ],
    alerts: [],
    cropSuitability: [
      { name: '🌾 Wheat', pct: 75, status: 'Good', color: '#43A047', desc: 'Suitable sowing conditions. Moderate humidity expected.' },
      { name: '🌿 Cotton', pct: 60, status: 'Average', color: '#FFB300', desc: 'Watch for excess moisture. Ensure drainage before sowing.' },
      { name: '🍅 Tomato', pct: 85, status: 'Excellent', color: '#43A047', desc: 'Ideal temperature & humidity. Good time to transplant.' },
      { name: '🧅 Onion', pct: 50, status: 'Average', color: '#FFB300', desc: 'Rain probability moderate. Delay spraying if rain expected.' },
    ],
    aiSuggestions: [],
    charts: { temp: [30, 29, 28, 28, 29, 30, 31], humidity: [50, 52, 55, 54, 51, 50, 48], rain: [0, 0, 0, 0, 0, 0, 0] }
  };

  const showToast = useCallback((msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const fetchWeather = async (lat, lon, query = '') => {
    setIsLoading(true);
    try {
      const res = await getCurrentWeather(lat, lon, query);
      if (res.data?.success && res.data?.weather) {
        setWeatherData(res.data.weather);
        const resolvedName = `${res.data.weather.city}, ${res.data.weather.state}`;
        updateHistory(resolvedName);
      } else {
        showToast("Error retrieving weather from server.", "error");
      }
    } catch (err) {
      console.error("Weather fetch failed:", err);
      showToast("Could not retrieve real-time weather details.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateHistory = (locationName) => {
    setRecentLocations((prev) => {
      const filtered = prev.filter((loc) => loc.toLowerCase() !== locationName.toLowerCase());
      return [locationName, ...filtered].slice(0, 5);
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    fetchWeather(null, null, searchQuery.trim());
    setSearchQuery('');
  };

  const handleRecentClick = (locName) => {
    fetchWeather(null, null, locName);
  };

  const handleCurrentLocationBtn = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
          showToast("Refreshed current location.", "success");
        },
        (error) => {
          showToast("Location access denied or unavailable. Loading Ahmedabad.", "error");
          fetchWeather(23.0225, 72.5714);
        }
      );
    } else {
      showToast("Geolocation not supported. Loading Ahmedabad.", "error");
      fetchWeather(23.0225, 72.5714);
    }
  };

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);

  const handleGrantPermission = () => {
    setShowLocationModal(false);
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          showToast("Location detected successfully.", "success");
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.warn("[Geolocation] Error:", error.message);
          showToast("Location access denied. Loading Ahmedabad.", "info");
          setLocationBlocked(true);
          fetchWeather(23.0225, 72.5714);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      showToast("Geolocation not supported. Loading Ahmedabad.", "info");
      fetchWeather(23.0225, 72.5714);
    }
  };

  const handleUseDefault = () => {
    setShowLocationModal(false);
    showToast("Loading default weather profile.", "info");
    fetchWeather(23.0225, 72.5714);
  };

  // Get location on mount using permission checks
  useEffect(() => {
    const checkPermissionsAndLoad = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          console.log("[Geolocation Permission Status]:", result.state);
          
          if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
              () => {
                setLocationBlocked(true);
                fetchWeather(23.0225, 72.5714);
              }
            );
          } else if (result.state === 'prompt') {
            setIsLoading(false);
            setShowLocationModal(true);
          } else {
            setLocationBlocked(true);
            fetchWeather(23.0225, 72.5714);
          }
        } else {
          setShowLocationModal(true);
        }
      } catch (err) {
        console.warn("[Permission API error]:", err);
        setShowLocationModal(true);
      }
    };
    checkPermissionsAndLoad();
  }, []);

  useEffect(() => {
    const fetchRealNews = async () => {
      try {
        const res = await getNews("Weather");
        if (res.data?.success && res.data?.news?.length > 0) {
          setNewsList(res.data.news.slice(0, 3).map(n => ({
            id: n._id,
            source: n.source || "Smart Krishi",
            title: n.title,
            date: new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            snippet: n.content ? (n.content.length > 120 ? n.content.substring(0, 120) + "..." : n.content) : "No description available.",
            emoji: n.category === "Weather" ? "🌧️" : (n.category === "Market" ? "📈" : "🌿")
          })));
        } else {
          const resAll = await getNews();
          if (resAll.data?.success && resAll.data?.news?.length > 0) {
            setNewsList(resAll.data.news.slice(0, 3).map(n => ({
              id: n._id,
              source: n.source || "Smart Krishi",
              title: n.title,
              date: new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              snippet: n.content ? (n.content.length > 120 ? n.content.substring(0, 120) + "..." : n.content) : "No description available.",
              emoji: n.category === "Weather" ? "🌧️" : (n.category === "Market" ? "📈" : "🌿")
            })));
          }
        }
      } catch (err) {
        console.error("Error loading news in weather page:", err);
      }
    };
    fetchRealNews();
  }, []);

  const todayStats = [
    { label: 'Humidity', value: activeWeather.humidity, icon: '💧', color: '#42A5F5' },
    { label: 'Wind', value: activeWeather.windSpeed, icon: '💨', color: '#78909C' },
    { label: 'Rain Chance', value: activeWeather.hourly?.[0]?.rain || '0%', icon: '🌧️', color: '#5C6BC0' },
    { label: 'UV Index', value: activeWeather.uvIndex ? activeWeather.uvIndex.split(' ')[0] : '0', icon: '☀️', color: '#FFA726' },
    { label: 'Visibility', value: activeWeather.visibility, icon: '👁️', color: '#26A69A' },
    { label: 'Pressure', value: activeWeather.pressure || '1010 hPa', icon: '🔵', color: '#7E57C2' },
  ];

  return (
    <div className="wt2-root">

      {/* ── Toast ──────────────────────────────────────── */}
      {notification && (
        <div className={`wt2-toast wt2-toast--${notification.type}`}>
          <span>{notification.type === 'success' ? '✅' : 'ℹ️'}</span>
          {notification.msg}
        </div>
      )}

      {/* ── Navbar — only for logged-in users ─────────── */}
      {isAuthenticated ? (
        <Navbar
          user={user || { name: 'User', role: 'Farmer' }}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          notificationSlot={<NotificationBell notifications={[]} />}
        />
      ) : (
        /* Minimal public header for non-logged-in visitors */
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', background: '#fff',
          boxShadow: '0 1px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => navigate('/')}>
            <span style={{ fontSize: '22px' }}>🌱</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#2E7D32' }}>Smart Krishi Mitra</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/login')} style={{
              padding: '7px 18px', borderRadius: '8px', border: '1.5px solid #2E7D32',
              background: 'transparent', color: '#2E7D32', fontWeight: 600, cursor: 'pointer', fontSize: '13px'
            }}>Login</button>
            <button onClick={() => navigate('/signup')} style={{
              padding: '7px 18px', borderRadius: '8px', border: 'none',
              background: 'linear-gradient(135deg, #2E7D32, #43A047)', color: '#fff',
              fontWeight: 600, cursor: 'pointer', fontSize: '13px'
            }}>Sign Up</button>
          </div>
        </header>
      )}

      {/* ── Layout ─────────────────────────────────────── */}
      <div className="wt2-layout">

        {/* Sidebar — only for logged-in users */}
        {isAuthenticated && (
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            activeItem="weather"
          />
        )}

        <main className="wt2-main">
          {locationBlocked && (
            <div className="wt2-warning-banner">
              <span>⚠️</span>
              <div>
                <strong>Location access is blocked.</strong> Smart Krishi Mitra needs your location to display local forecasts. Please enable location permission in your browser address bar settings, or use the search box to find your town.
              </div>
              <button className="wt2-warning-close" onClick={() => setLocationBlocked(false)}>×</button>
            </div>
          )}

          {/* ══ COMPACT HERO ══════════════════════════════ */}
          <section className="wt2-hero">
            <div className="wt2-hero-glass">
              <div className="wt2-hero-left">
                <div className="wt2-hero-loc">
                  <span className="wt2-hero-pin">📍</span>
                  <span>{activeWeather.city}, {activeWeather.state}</span>
                </div>
                <div className="wt2-hero-temp-row">
                  <span className="wt2-hero-icon">{activeWeather.icon}</span>
                  <span className="wt2-hero-temp">{activeWeather.temp}°<sup>C</sup></span>
                </div>
                <div className="wt2-hero-cond">{activeWeather.condition}</div>
                <div className="wt2-hero-sunrow">
                  <span>🌅 {activeWeather.sunrise}</span>
                  <span className="wt2-hero-divider">·</span>
                  <span>🌇 {activeWeather.sunset}</span>
                  <span className="wt2-hero-divider">·</span>
                  <span>Feels like {activeWeather.feelsLike}</span>
                </div>
              </div>

              {/* Search inside hero */}
              <div className="wt2-hero-right">
                <form className="wt2-search-form" onSubmit={handleSearchSubmit}>
                  <div className="wt2-search-wrap">
                    <span className="wt2-search-ico">🔍</span>
                    <input
                      type="text"
                      className="wt2-search-input"
                      placeholder="Search city, village or district…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button type="submit" variant="primary" className="wt2-search-btn">Search</Button>
                  </div>
                </form>
                <div className="wt2-hero-actions">
                  <Button variant="outline" className="wt2-loc-btn" onClick={handleCurrentLocationBtn}>
                    📍 My Location
                  </Button>
                  <div className="wt2-recent-chips">
                    {recentLocations.slice(0, 3).map((loc, i) => (
                      <button key={i} className="wt2-chip" onClick={() => handleRecentClick(loc)} type="button">
                        {loc.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ TODAY'S QUICK STATS ═══════════════════════ */}
          <div className="wt2-stats-strip">
            {todayStats.map((s, i) => (
              <div key={i} className="wt2-stat-pill">
                <span className="wt2-stat-ico" style={{ color: s.color }}>{s.icon}</span>
                <div className="wt2-stat-body">
                  <span className="wt2-stat-val">{s.value}</span>
                  <span className="wt2-stat-lbl">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="wt2-loading">
              <Loader variant="page" text="Fetching weather data…" />
            </div>
          ) : (
            <>
              {/* ══ ALERTS ════════════════════════════════ */}
              {activeWeather.alerts.length > 0 && (
                <div className="wt2-alerts-row">
                  {activeWeather.alerts.map((a, i) => (
                    <div key={i} className="wt2-alert" style={{ borderLeftColor: a.color, background: a.bg }}>
                      <span className="wt2-alert-ico">{a.icon}</span>
                      <div className="wt2-alert-body">
                        <span className="wt2-alert-sev" style={{ color: a.color }}>{a.severity} — {a.type}</span>
                        <p className="wt2-alert-desc">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ══ MAIN DASHBOARD GRID ═══════════════════ */}
              <div className="wt2-grid">

                {/* LEFT COLUMN */}
                <div className="wt2-col-main">

                  {/* Hourly Forecast */}
                  <Card className="wt2-card">
                    <div className="wt2-card-head">
                      <h2 className="wt2-section-title">⏰ Hourly Forecast</h2>
                      <span className="wt2-badge-sub">Next 7 hours</span>
                    </div>
                    <div className="wt2-hourly-scroll">
                      {activeWeather.hourly.map((h, i) => (
                        <div key={i} className={`wt2-hour-card ${i === 0 ? 'wt2-hour-card--now' : ''}`}>
                          <span className="wt2-hour-time">{h.time}</span>
                          <span className="wt2-hour-icon">{h.icon}</span>
                          <span className="wt2-hour-temp">{h.temp}</span>
                          <span className="wt2-hour-rain">💧{h.rain}</span>
                          <span className="wt2-hour-wind">💨{h.wind}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Charts — 2 columns */}
                  <Card className="wt2-card">
                    <h2 className="wt2-section-title">📈 Weather Trends</h2>
                    <div className="wt2-charts-2col">
                      <WeatherTrendChart data={activeWeather.charts.temp} type="temp" color="#EF5350" label="Temperature (°C)" />
                      <WeatherTrendChart data={activeWeather.charts.humidity} type="humidity" color="#42A5F5" label="Humidity (%)" />
                    </div>
                  </Card>

                  {/* AI Recommendations */}
                  <Card className="wt2-card wt2-card--ai">
                    <div className="wt2-card-head">
                      <h2 className="wt2-section-title">🤖 AI Agronomist Recommendations</h2>
                      <span className="wt2-gemini-badge">Gemini Powered</span>
                    </div>
                    <div className="wt2-ai-list">
                      {activeWeather.aiSuggestions.map((s) => (
                        <div key={s.id} className="wt2-ai-item">
                          <div className="wt2-ai-icon-wrap">{s.icon}</div>
                          <div className="wt2-ai-body">
                            <div className="wt2-ai-row">
                              <span className="wt2-ai-title">{s.title}</span>
                              <span className="wt2-ai-priority" style={{ background: s.priorityColor + '22', color: s.priorityColor }}>
                                {s.priority}
                              </span>
                            </div>
                            <p className="wt2-ai-desc">{s.desc}</p>
                          </div>
                          <button className="wt2-ai-action" onClick={() => navigate('/messages')}>Ask AI →</button>
                        </div>
                      ))}
                    </div>
                    <Button variant="primary" className="wt2-ai-full-btn" onClick={() => navigate('/messages')}>
                      💬 Ask AI Assistant for Detailed Advice
                    </Button>
                  </Card>

                  {/* Agriculture News */}
                  <Card className="wt2-card">
                    <h2 className="wt2-section-title">📰 Agriculture Weather News</h2>
                    <div className="wt2-news-grid">
                      {newsList.map((news) => (
                        <div key={news.id} className="wt2-news-card">
                          <div className="wt2-news-thumb">{news.emoji}</div>
                          <div className="wt2-news-body">
                            <div className="wt2-news-meta">
                              <span className="wt2-news-src">📡 {news.source}</span>
                              <span className="wt2-news-date">{news.date}</span>
                            </div>
                            <h3 className="wt2-news-title">{news.title}</h3>
                            <p className="wt2-news-snip">{news.snippet}</p>
                            <button className="wt2-news-read" onClick={() => showToast('Opening article…', 'info')}>
                              Read More →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* RIGHT COLUMN */}
                <div className="wt2-col-side">

                  {/* 7-Day Forecast — NEXT 7 days starting from TODAY */}
                  <Card className="wt2-card">
                    <div className="wt2-card-head">
                      <h2 className="wt2-section-title">📅 Next 7-Day Forecast</h2>
                      <span className="wt2-badge-sub">Today + next 6 days</span>
                    </div>
                    <div className="wt2-daily-list">
                      {activeWeather.daily.map((day, i) => (
                        <div key={i} className={`wt2-daily-row ${i === 0 ? 'wt2-daily-row--today' : ''}`}>
                          <span className="wt2-daily-day">
                            {i === 0 ? (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                📍 <strong>Today</strong>
                              </span>
                            ) : day.day}
                          </span>
                          <span className="wt2-daily-ico">{day.icon}</span>
                          <div className="wt2-daily-bar-wrap">
                            <span className="wt2-daily-min">{day.min}</span>
                            <div className="wt2-daily-bar-rail">
                              <div className="wt2-daily-bar-fill" />
                            </div>
                            <span className="wt2-daily-max">{day.max}</span>
                          </div>
                          <span className="wt2-daily-rain">💧{day.rain}</span>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Crop Suitability */}
                  <Card className="wt2-card">
                    <h2 className="wt2-section-title">🌾 Crop Suitability</h2>
                    <p className="wt2-card-sub">Real-time sowing & spraying conditions</p>
                    <div className="wt2-crop-list">
                      {activeWeather.cropSuitability.map((crop, i) => (
                        <div key={i} className="wt2-crop-item">
                          <div className="wt2-crop-header">
                            <span className="wt2-crop-name">{crop.name}</span>
                            <span className="wt2-crop-status" style={{ color: crop.color }}>
                              {crop.pct > 0 ? `${crop.pct}%` : '—'} · {crop.status}
                            </span>
                          </div>
                          <div className="wt2-crop-bar-rail">
                            <div
                              className="wt2-crop-bar-fill"
                              style={{ width: `${crop.pct}%`, background: crop.color }}
                            />
                          </div>
                          <p className="wt2-crop-desc">{crop.desc}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Extra metrics card */}
                  <Card className="wt2-card">
                    <h2 className="wt2-section-title">📊 Atmospheric Details</h2>
                    <div className="wt2-atm-grid">
                      {[
                        { label: 'Feels Like', value: activeWeather.feelsLike, icon: '🌡️' },
                        { label: 'UV Index', value: activeWeather.uvIndex, icon: '☀️' },
                        { label: 'Visibility', value: activeWeather.visibility, icon: '👁️' },
                        { label: 'Air Quality', value: activeWeather.airQuality, icon: '🍃' },
                        { label: 'Sunrise', value: activeWeather.sunrise, icon: '🌅' },
                        { label: 'Sunset', value: activeWeather.sunset, icon: '🌇' },
                      ].map((m, i) => (
                        <div key={i} className="wt2-atm-item">
                          <span className="wt2-atm-ico">{m.icon}</span>
                          <span className="wt2-atm-val">{m.value}</span>
                          <span className="wt2-atm-lbl">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          <Footer />
        </main>
      </div>

      {/* ── Floating AI Button ─────────────────────────── */}
      <button className="wt2-fab" onClick={() => navigate('/messages')} title="Ask AI Assistant">
        🤖
        <span className="wt2-fab-label">AI</span>
      </button>

      {showLocationModal && (
        <div className="wt2-modal-overlay">
          <div className="wt2-modal-card">
            <div className="wt2-modal-icon">📍</div>
            <h3 className="wt2-modal-title">Enable Local Weather</h3>
            <p className="wt2-modal-desc">
              Smart Krishi Mitra needs your location permission to show real-time weather forecasts, dynamic crop suitability ratings, and AI agronomy suggestions for your farm.
            </p>
            <div className="wt2-modal-actions">
              <Button variant="primary" onClick={handleGrantPermission}>
                Allow Location Access
              </Button>
              <Button variant="outline" onClick={handleUseDefault} style={{ marginTop: "5px" }}>
                Use Ahmedabad (Default)
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
