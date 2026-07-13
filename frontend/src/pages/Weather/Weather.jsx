import React, { useState, useCallback, useEffect } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';
import { useAuth } from '../../context/AuthContext';
import { getCurrentWeather } from '../../services/weatherService';
import { getNews } from '../../services/newsService';

const SEARCH_HISTORY_DEFAULT = ['Ahmedabad, Gujarat', 'Nashik, Maharashtra', 'Pune, Maharashtra'];
const CHART_LABELS = ['Now', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];

function WeatherTrendChart({ data, type, color, label }) {
  const H = 100, W = 340, pad = { top: 16, bottom: 20, left: 28, right: 10 };
  const iW = W - pad.left - pad.right, iH = H - pad.top - pad.bottom;
  const chartData = Array.isArray(data) && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const maxVal = Math.max(...chartData, 10);
  const minVal = Math.min(...chartData, 0);
  const range = maxVal - minVal || 1;

  const pts = chartData.map((val, idx) => {
    const x = chartData.length > 1 ? pad.left + (idx * (iW / (chartData.length - 1))) : pad.left + iW / 2;
    const y = pad.top + iH - (((val - minVal) / range) * iH);
    return `${x},${y}`;
  }).join(' ');

  const firstX = pad.left, lastX = pad.left + iW, baseY = pad.top + iH;
  const areaPoints = `${firstX},${baseY} ${pts} ${lastX},${baseY}`;

  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: 'var(--skm-text-muted)' }}>{label}</div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%' }}>
        <defs>
          <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((r, i) => (
          <line key={i} x1={pad.left} y1={pad.top + iH * r} x2={pad.left + iW} y2={pad.top + iH * r} stroke="#E8F5E9" strokeWidth="1" strokeDasharray={r === 1 ? 'none' : '4 4'} />
        ))}
        {[0, 0.5, 1].map((r, i) => {
          const val = Math.round(maxVal - r * range);
          return <text key={i} x={pad.left - 4} y={pad.top + iH * r + 4} textAnchor="end" fontSize="8" fill="#9E9E9E">{type === 'temp' ? `${val}°` : `${val}%`}</text>;
        })}
        <polygon points={areaPoints} fill={`url(#grad-${type})`} />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {chartData.map((val, idx) => {
          const x = pad.left + (idx * (iW / (chartData.length - 1)));
          const y = pad.top + iH - (((val - minVal) / range) * iH);
          return <circle key={idx} cx={x} cy={y} r="3" fill="white" stroke={color} strokeWidth="1.5" />;
        })}
        {CHART_LABELS.map((lbl, idx) => {
          const x = pad.left + (idx * (iW / (chartData.length - 1)));
          return <text key={idx} x={x} y={H - 4} textAnchor="middle" fontSize="7.5" fill="#9E9E9E">{lbl}</text>;
        })}
      </svg>
    </div>
  );
}

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
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false);

  const activeWeather = weatherData || {
    city: 'Ahmedabad', state: 'Gujarat', temp: 30, condition: 'Clear', icon: '☀️',
    feelsLike: '32°C', humidity: '50%', windSpeed: '10 km/h', uvIndex: '5 (Moderate)',
    visibility: '10 km', airQuality: '45 (Good)', pressure: '1010 hPa',
    sunrise: '06:00 AM', sunset: '07:00 PM',
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

  const showToast = useCallback((msg, type = 'info') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); }, []);

  const fetchWeather = async (lat, lon, query = '') => {
    setIsLoading(true);
    try {
      const res = await getCurrentWeather(lat, lon, query);
      if (res.data?.success && res.data?.weather) {
        setWeatherData(res.data.weather);
        updateHistory(`${res.data.weather.city}, ${res.data.weather.state}`);
      } else {
        showToast("Error retrieving weather from server.", "error");
      }
    } catch (err) {
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

  const handleRecentClick = (locName) => fetchWeather(null, null, locName);

  const handleCurrentLocationBtn = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => { fetchWeather(position.coords.latitude, position.coords.longitude); showToast("Refreshed current location.", "success"); },
        () => { showToast("Location access denied. Loading Ahmedabad.", "error"); fetchWeather(23.0225, 72.5714); }
      );
    } else {
      showToast("Geolocation not supported. Loading Ahmedabad.", "error");
      fetchWeather(23.0225, 72.5714);
    }
  };

  const handleGrantPermission = () => {
    setShowLocationModal(false);
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => { showToast("Location detected successfully.", "success"); fetchWeather(position.coords.latitude, position.coords.longitude); },
        () => { showToast("Location access denied. Loading Ahmedabad.", "info"); fetchWeather(23.0225, 72.5714); },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      fetchWeather(23.0225, 72.5714);
    }
  };

  const handleUseDefault = () => {
    setShowLocationModal(false);
    showToast("Loading default weather profile.", "info");
    fetchWeather(23.0225, 72.5714);
  };

  useEffect(() => {
    const checkPermissionsAndLoad = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
              (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
              () => fetchWeather(23.0225, 72.5714)
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
        setShowLocationModal(true);
      }
    };
    checkPermissionsAndLoad();
  }, []);

  useEffect(() => {
    const fetchRealNews = async () => {
      try {
        const res = await getNews("Weather");
        const news = (res.data?.success && res.data?.news?.length > 0) ? res.data.news : (await getNews()).data?.news || [];
        if (news.length > 0) {
          setNewsList(news.slice(0, 3).map(n => ({
            id: n._id, source: n.source || "Smart Krishi", title: n.title,
            date: new Date(n.publishedAt || n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            snippet: n.content ? n.content.substring(0, 120) + (n.content.length > 120 ? '...' : '') : "No description available.",
            emoji: n.category === "Weather" ? "🌧️" : (n.category === "Market" ? "📈" : "🌿")
          })));
        }
      } catch (err) { console.error(err); }
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
    <div className="skm-root">
      {notification && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: notification.type === 'error' ? '#f44336' : notification.type === 'success' ? '#4CAF50' : '#2196F3', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 9999, display: 'flex', gap: '10px', alignItems: 'center' }}>
          {notification.type === 'success' ? '✅' : 'ℹ️'} {notification.msg}
        </div>
      )}

      {isAuthenticated ? (
        <Navbar user={user || { name: 'User', role: 'Farmer' }} onToggleSidebar={() => setCollapsed(!collapsed)} notificationSlot={<NotificationBell notifications={[]} />} />
      ) : (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#fff', boxShadow: '0 1px 8px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <span style={{ fontSize: '22px' }}>🌱</span>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#2E7D32' }}>Smart Krishi Mitra</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => navigate('/login')} style={{ padding: '7px 18px', borderRadius: '8px', border: '1.5px solid #2E7D32', background: 'transparent', color: '#2E7D32', fontWeight: 600, cursor: 'pointer' }}>Login</button>
            <button onClick={() => navigate('/signup')} style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #2E7D32, #43A047)', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Sign Up</button>
          </div>
        </header>
      )}

      <div className="skm-layout">
        {isAuthenticated && <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} activeItem="weather" />}

        <main className="skm-main">
          <div className="skm-content-area">
            {locationBlocked && (
              <div style={{ background: '#FFF3E0', border: '1px solid #FFB300', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span>⚠️</span>
                <div style={{ flex: 1, fontSize: '13px' }}>
                  <strong>Location access is blocked.</strong> Smart Krishi Mitra needs your location to display local forecasts. Please enable location permission in your browser settings, or use the search box to find your town.
                </div>
                <button onClick={() => setLocationBlocked(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
              </div>
            )}

            {/* HERO CARD */}
            <section className="skm-welcome-card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 40%, #42A5F5 100%)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'center' }}>
                <div style={{ color: '#fff' }}>
                  <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '4px' }}>📍 {activeWeather.city}, {activeWeather.state}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '48px' }}>{activeWeather.icon}</span>
                    <span style={{ fontSize: '56px', fontWeight: 900 }}>{activeWeather.temp}°<sup style={{ fontSize: '24px' }}>C</sup></span>
                  </div>
                  <div style={{ fontSize: '18px', opacity: 0.9, marginTop: '4px' }}>{activeWeather.condition}</div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', opacity: 0.8 }}>
                    <span>🌅 {activeWeather.sunrise}</span>
                    <span>🌇 {activeWeather.sunset}</span>
                    <span>Feels like {activeWeather.feelsLike}</span>
                  </div>
                </div>
                <div>
                  <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      placeholder="Search city, village or district…"
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: 'none', fontSize: '13px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="skm-action-btn" style={{ background: '#fff', color: '#2E7D32' }}>Search</button>
                  </form>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button onClick={handleCurrentLocationBtn} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer', fontSize: '12px', backdropFilter: 'blur(4px)' }}>
                      📍 My Location
                    </button>
                    {recentLocations.slice(0, 3).map((loc, i) => (
                      <button key={i} onClick={() => handleRecentClick(loc)} style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>
                        {loc.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* QUICK STATS */}
            <div className="skm-grid" style={{ marginBottom: '24px' }}>
              {todayStats.map((s, i) => (
                <div key={i} className="skm-stat-card">
                  <div className="skm-stat-header">
                    <span className="skm-stat-label">{s.label}</span>
                    <span className="skm-stat-icon" style={{ color: s.color, background: '#F5F5F5' }}>{s.icon}</span>
                  </div>
                  <div className="skm-stat-value" style={{ fontSize: '20px' }}>{s.value}</div>
                </div>
              ))}
            </div>

            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <Loader variant="page" text="Fetching weather data…" />
              </div>
            ) : (
              <div className="skm-dual-row" style={{ alignItems: 'flex-start' }}>
                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Hourly */}
                  <div className="skm-card">
                    <div className="skm-section-header" style={{ marginBottom: '12px' }}>
                      <h2 className="skm-section-title">⏰ Hourly Forecast</h2>
                      <span className="skm-badge" style={{ background: '#E8F5E9', color: '#2E7D32' }}>Next 7 hours</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                      {activeWeather.hourly.map((h, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '12px 16px', borderRadius: '12px', background: i === 0 ? 'linear-gradient(135deg, #2E7D32, #43A047)' : 'var(--skm-bg)', minWidth: '80px', color: i === 0 ? '#fff' : 'inherit', flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', fontWeight: 600 }}>{h.time}</span>
                          <span style={{ fontSize: '24px' }}>{h.icon}</span>
                          <span style={{ fontWeight: 800, fontSize: '14px' }}>{h.temp}</span>
                          <span style={{ fontSize: '11px', opacity: 0.8 }}>💧{h.rain}</span>
                          <span style={{ fontSize: '11px', opacity: 0.8 }}>💨{h.wind}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Charts */}
                  <div className="skm-card">
                    <h2 className="skm-section-title" style={{ marginBottom: '16px' }}>📈 Weather Trends</h2>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                      <WeatherTrendChart data={activeWeather.charts.temp} type="temp" color="#EF5350" label="Temperature (°C)" />
                      <WeatherTrendChart data={activeWeather.charts.humidity} type="humidity" color="#42A5F5" label="Humidity (%)" />
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="skm-card" style={{ background: 'linear-gradient(135deg, #F3E5F5, #fff)' }}>
                    <div className="skm-section-header" style={{ marginBottom: '12px' }}>
                      <h2 className="skm-section-title">🤖 AI Agronomist</h2>
                      <span className="skm-badge" style={{ background: '#EDE7F6', color: '#4A148C' }}>✨ Gemini Powered</span>
                    </div>
                    {activeWeather.aiSuggestions.length === 0 ? (
                      <p className="skm-text-muted" style={{ fontSize: '13px' }}>AI suggestions will appear based on your current weather conditions.</p>
                    ) : (
                      <div className="skm-preview-list">
                        {activeWeather.aiSuggestions.map((s) => (
                          <div key={s.id} className="skm-preview-item" style={{ gap: '12px' }}>
                            <span style={{ fontSize: '24px' }}>{s.icon}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{s.title}</div>
                              <p className="skm-text-muted" style={{ fontSize: '12px', margin: '4px 0 0' }}>{s.desc}</p>
                            </div>
                            <button className="skm-action-btn" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => navigate('/messages')}>Ask AI →</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="skm-action-btn" style={{ marginTop: '12px', width: '100%' }} onClick={() => navigate('/messages')}>💬 Ask AI Assistant for Detailed Advice</button>
                  </div>

                  {/* News */}
                  <div className="skm-card">
                    <h2 className="skm-section-title" style={{ marginBottom: '16px' }}>📰 Agriculture Weather News</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {newsList.map((news) => (
                        <div key={news.id} style={{ display: 'flex', gap: '12px', padding: '12px', background: 'var(--skm-bg)', borderRadius: '10px' }}>
                          <span style={{ fontSize: '32px', flexShrink: 0 }}>{news.emoji}</span>
                          <div>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px', marginBottom: '4px' }}>
                              <span className="skm-text-muted">📡 {news.source}</span>
                              <span className="skm-text-muted">{news.date}</span>
                            </div>
                            <h3 style={{ margin: '0 0 4px', fontSize: '14px' }}>{news.title}</h3>
                            <p className="skm-text-muted" style={{ fontSize: '12px', margin: 0 }}>{news.snippet}</p>
                            <button onClick={() => showToast('Opening article…', 'info')} style={{ marginTop: '6px', background: 'none', border: 'none', color: '#2E7D32', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}>Read More →</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '280px' }}>
                  {/* 7-Day */}
                  <div className="skm-card">
                    <div className="skm-section-header" style={{ marginBottom: '12px' }}>
                      <h2 className="skm-section-title">📅 7-Day Forecast</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {activeWeather.daily.map((day, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', background: i === 0 ? '#E8F5E9' : 'transparent', fontSize: '13px' }}>
                          <span style={{ width: '50px', fontWeight: i === 0 ? 800 : 500 }}>{i === 0 ? '📍 Today' : day.day}</span>
                          <span style={{ fontSize: '20px' }}>{day.icon}</span>
                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span className="skm-text-muted" style={{ fontSize: '11px', width: '35px' }}>{day.min}</span>
                            <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: '#E0E0E0' }}>
                              <div style={{ width: '60%', height: '100%', borderRadius: '2px', background: 'linear-gradient(90deg, #4FC3F7, #EF5350)' }} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, width: '35px', textAlign: 'right' }}>{day.max}</span>
                          </div>
                          <span className="skm-text-muted" style={{ fontSize: '11px', width: '35px', textAlign: 'right' }}>💧{day.rain}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Crop Suitability */}
                  <div className="skm-card">
                    <h2 className="skm-section-title" style={{ marginBottom: '4px' }}>🌾 Crop Suitability</h2>
                    <p className="skm-text-muted" style={{ fontSize: '12px', marginBottom: '16px' }}>Real-time sowing & spraying conditions</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeWeather.cropSuitability.map((crop, i) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px' }}>
                            <span style={{ fontWeight: 600 }}>{crop.name}</span>
                            <span style={{ color: crop.color, fontWeight: 700 }}>{crop.pct > 0 ? `${crop.pct}%` : '—'} · {crop.status}</span>
                          </div>
                          <div style={{ height: '6px', background: '#E0E0E0', borderRadius: '3px', marginBottom: '4px' }}>
                            <div style={{ width: `${crop.pct}%`, height: '100%', borderRadius: '3px', background: crop.color }} />
                          </div>
                          <p className="skm-text-muted" style={{ fontSize: '11px', margin: 0 }}>{crop.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Atmospheric Details */}
                  <div className="skm-card">
                    <h2 className="skm-section-title" style={{ marginBottom: '16px' }}>📊 Atmospheric Details</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {[
                        { label: 'Feels Like', value: activeWeather.feelsLike, icon: '🌡️' },
                        { label: 'UV Index', value: activeWeather.uvIndex, icon: '☀️' },
                        { label: 'Visibility', value: activeWeather.visibility, icon: '👁️' },
                        { label: 'Air Quality', value: activeWeather.airQuality, icon: '🍃' },
                        { label: 'Sunrise', value: activeWeather.sunrise, icon: '🌅' },
                        { label: 'Sunset', value: activeWeather.sunset, icon: '🌇' },
                      ].map((m, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '12px', background: 'var(--skm-bg)', borderRadius: '10px', textAlign: 'center' }}>
                          <span style={{ fontSize: '22px' }}>{m.icon}</span>
                          <span style={{ fontWeight: 800, fontSize: '14px' }}>{m.value}</span>
                          <span className="skm-text-muted" style={{ fontSize: '10px' }}>{m.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating AI Button */}
      <button onClick={() => navigate('/messages')} title="Ask AI Assistant" style={{ position: 'fixed', bottom: '24px', right: '24px', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #2E7D32, #43A047)', color: '#fff', border: 'none', fontSize: '24px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(46,125,50,0.4)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2px' }}>
        🤖
        <span style={{ fontSize: '8px', lineHeight: 1 }}>AI</span>
      </button>

      {/* Location Modal */}
      {showLocationModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="skm-card" style={{ maxWidth: '400px', width: '90%', textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📍</div>
            <h3 className="skm-card-title" style={{ fontSize: '20px', marginBottom: '12px' }}>Enable Local Weather</h3>
            <p className="skm-text-muted" style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
              Smart Krishi Mitra needs your location permission to show real-time weather forecasts, dynamic crop suitability ratings, and AI agronomy suggestions for your farm.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="skm-action-btn" style={{ width: '100%' }} onClick={handleGrantPermission}>
                📍 Allow Location Access
              </button>
              <button className="skm-action-btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={handleUseDefault}>
                Use Ahmedabad (Default)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
