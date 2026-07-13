import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../WeatherCard/WeatherCard';
import { useAuth } from '../../context/AuthContext';
import { getDashboardSummary } from '../../services/dashboardService';
import { getNews } from '../../services/newsService';
import { getGovSchemes } from '../../services/governmentService';
import { getTransactions } from '../../services/transactionService';
import { getNotifications } from '../../services/notificationService';
import { getCurrentWeather } from '../../services/weatherService';
import { getListings } from '../../services/marketplaceService';

const QUICK_ACCESS_ITEMS = [
  { id: 'marketplace', icon: '🛒', title: 'Marketplace', desc: 'Buy and sell crops directly with vendors.', path: '/marketplace' },
  { id: 'ai-assistant', icon: '🤖', title: 'AI Assistant', desc: 'Get smart crop care tips & advisory.', path: '/crop-knowledge' },
  { id: 'weather', icon: '🌦️', title: 'Weather Alerts', desc: 'Real-time local forecasts & warnings.', path: '/weather' },
  { id: 'knowledge', icon: '📚', title: 'Crop Knowledge', desc: 'Detailed guides on pests and cultivation.', path: '/crop-knowledge' },
  { id: 'calculator', icon: '🧮', title: 'Cost Calculator', desc: 'Estimate production costs & profits.', path: '/calculator' },
  { id: 'messages', icon: '💬', title: 'Messages', desc: 'Chat directly with potential buyers.', path: '/messages' },
  { id: 'transactions', icon: '📜', title: 'Transaction History', desc: 'View past bills, payments, and sales.', path: '/transactions' },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  const [stats, setStats] = useState({
    totalCrops: 0,
    earnings: 0,
    activeListings: 0,
    newNotifications: 0
  });
  const [recentTx, setRecentTx] = useState([]);
  const [news, setNews] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState({ temp: 31, description: "Mostly Sunny", icon: "🌤️" });
  const [notifications, setNotifications] = useState([]);
  const [marketplacePreviews, setMarketplacePreviews] = useState([]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [sumRes, newsRes, schemeRes, weatherRes, notifRes, txRes, listingsRes] = await Promise.allSettled([
          getDashboardSummary(),
          getNews("General"),
          getGovSchemes(),
          getCurrentWeather(30.73, 76.77),
          getNotifications(),
          getTransactions({ limit: 4 }),
          getListings({ limit: 4 })
        ]);

        if (sumRes.status === "fulfilled" && sumRes.value.data?.success) {
          const d = sumRes.value.data.data;
          setStats({
            totalCrops: d.totalListings,
            earnings: d.totalRevenue,
            activeListings: d.totalListings,
            newNotifications: d.unreadNotifications
          });
        }

        if (newsRes.status === "fulfilled" && newsRes.value.data?.success) {
          setNews(newsRes.value.data.news.slice(0, 3));
        }

        if (schemeRes.status === "fulfilled" && schemeRes.value.data?.success) {
          setSchemes(schemeRes.value.data.schemes.slice(0, 3));
        }

        if (weatherRes.status === "fulfilled" && weatherRes.value.data?.success) {
          const w = weatherRes.value.data.weather;
          setWeather({
            temp: w.temp,
            description: w.description,
            icon: w.temp > 30 ? "🌤️" : "🌧️"
          });
        }

        if (notifRes.status === "fulfilled" && notifRes.value.data?.success) {
          setNotifications(notifRes.value.data.notifications.slice(0, 4));
        }

        if (txRes.status === "fulfilled" && txRes.value.data?.success) {
          setRecentTx(txRes.value.data.transactions.slice(0, 4));
        }

        if (listingsRes.status === "fulfilled" && listingsRes.value.data?.success) {
          const mapped = listingsRes.value.data.listings.slice(0, 4).map((listing) => ({
            id: listing._id,
            name: listing.cropName,
            price: `₹${listing.price} / ${listing.unit}`,
            location: listing.location,
            seller: listing.seller.fullName,
            image: listing.image || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop"
          }));
          setMarketplacePreviews(mapped);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };
    loadDashboardData();
  }, []);

  const STATS_DATA = [
    {
      id: 'stat-crops',
      icon: '🌾',
      value: stats.totalCrops,
      label: 'Total Crops',
      desc: 'Types under cultivation',
      trend: 'From your listings',
      trendType: 'up',
      color: '#2E7D32',
      bg: '#E8F5E9'
    },
    {
      id: 'stat-earnings',
      icon: '💰',
      value: `₹${stats.earnings.toLocaleString()}`,
      label: 'Estimated Earnings',
      desc: 'Total sales this cycle',
      trend: 'Direct payout revenue',
      trendType: 'up',
      color: '#1565C0',
      bg: '#E3F2FD'
    },
    {
      id: 'stat-listings',
      icon: '📦',
      value: stats.activeListings,
      label: 'Active Listings',
      desc: 'Crops live in marketplace',
      trend: 'Visible to buyers',
      trendType: 'neutral',
      color: '#E65100',
      bg: '#FFF3E0'
    },
    {
      id: 'stat-notifs',
      icon: '🔔',
      value: stats.newNotifications,
      label: 'New Notifications',
      desc: 'Requires attention',
      trend: 'Unread updates',
      trendType: 'danger',
      color: '#6A1B9A',
      bg: '#F3E5F5'
    }
  ];

  return (
    <div className="skm-container">
      {/* Welcome Header */}
      <section className="skm-welcome-card" style={{ flexDirection: window.innerWidth < 768 ? 'column' : 'row', alignItems: window.innerWidth < 768 ? 'stretch' : 'center', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="skm-text-muted" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>Good Morning, Welcome back</span>
          <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>{user?.fullName || "Farmer"} 👋</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 500 }} className="skm-text-muted">
            <span className="skm-badge" style={{ background: '#E8F5E9', color: '#2E7D32', fontSize: '12px' }}>Role: {user?.role || "Farmer"}</span>
            <span>|</span>
            <span>{currentTime}</span>
            <span>|</span>
            <span>{currentDate}</span>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--skm-bg)', border: '1.5px solid var(--skm-border)', padding: '10px 18px', borderRadius: '16px' }}>
            <span style={{ fontSize: '28px' }}>{weather.icon}</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--skm-text-main)' }}>{weather.temp}°C</div>
              <div className="skm-text-muted" style={{ fontSize: '11px' }}>{weather.description}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="skm-section">
        <div className="skm-section-header">
          <h2 className="skm-section-title">📊 Key Metrics</h2>
        </div>
        <div className="skm-grid">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="skm-stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <div className="skm-stat-header">
                <span className="skm-stat-label">{stat.label}</span>
                <span className="skm-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </span>
              </div>
              <div className="skm-stat-value">{stat.value}</div>
              <div className="skm-stat-footer">
                <span className="skm-stat-desc">{stat.desc}</span>
                <span className={`skm-stat-trend ${stat.trendType}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="skm-section">
        <div className="skm-section-header">
          <h2 className="skm-section-title">⚡ Quick Access Grid</h2>
        </div>
        <div className="skm-grid">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <div key={item.id} className="skm-action-card" onClick={() => navigate(item.path)}>
              <div className="skm-action-icon">{item.icon}</div>
              <h3 className="skm-action-title">{item.title}</h3>
              <p className="skm-action-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Widget Row: Weather & AI */}
      <section className="skm-dual-row">
        {/* Weather Widget — uses reusable WeatherCard component */}
        <div className="skm-card">
          <h3 className="skm-card-title">Today's Weather</h3>
          <WeatherCard
            weather={{
              location: user?.district ? `${user.district}, ${user.state}` : 'Punjab, India',
              temperature: weather.temp,
              condition: weather.description,
              humidity: 65,
              wind: 12,
              rain: 10,
              forecast: [
                { id: 1, day: 'Mon', temp: 31, icon: 'sunny' },
                { id: 2, day: 'Tue', temp: 29, icon: 'cloudy' },
                { id: 3, day: 'Wed', temp: 27, icon: 'rain' },
                { id: 4, day: 'Thu', temp: 30, icon: 'sunny' },
                { id: 5, day: 'Fri', temp: 32, icon: 'sunny' },
              ]
            }}
          />
          <button className="skm-action-btn" onClick={() => navigate('/weather')}>
            View Full Forecast
          </button>
        </div>

        {/* AI Assistant Widget */}
        <div className="skm-card">
          <h3 className="skm-card-title">🤖 AI Assistant</h3>
          <div className="skm-section">
            <p style={{ margin: 0, fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
              Need help with crop selection, soil health diagnostics, localized pest control, weather impact reports, or mandi price analysis?
            </p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="skm-badge">Crop Diagnostic</span>
              <span className="skm-badge">Market Predictor</span>
              <span className="skm-badge">Soil Advisor</span>
            </div>
            <button className="skm-action-btn" onClick={() => navigate('/crop-knowledge')}>
              Ask AI Advisor
            </button>
          </div>
        </div>
      </section>

      {/* Dual Widget Row 2: Marketplace & Notifications */}
      <section className="skm-dual-row">
        {/* Marketplace Preview */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">🛒 Marketplace Preview</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/marketplace')}>
              Go to Marketplace &rarr;
            </button>
          </div>
          <div className="skm-preview-list">
            {marketplacePreviews.length === 0 ? (
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#64748b'}}>No listings available.</div>
            ) : marketplacePreviews.map((crop) => (
              <div key={crop.id} className="skm-preview-item" style={{ cursor: "pointer", display: 'flex', gap: '8px' }} onClick={() => navigate('/marketplace')}>
                <img src={crop.image} alt={crop.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 800 }}>{crop.name}</h4>
                  <div style={{ fontSize: '11px', color: 'var(--skm-primary)', fontWeight: 700 }}>{crop.price}</div>
                  <div className="skm-text-muted" style={{ fontSize: '9px' }}>Seller: {crop.seller}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Preview */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">🔔 Notifications</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/notifications')}>
              View All &rarr;
            </button>
          </div>
          <div className="skm-preview-list">
            {notifications.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No new notifications.</div>
            ) : notifications.map((notif) => {
              const iconMap = { weather: '⛈️', chat: '💬', order: '💳', scheme: '🏛️', system: '🔔' };
              return (
                <div key={notif._id} className="skm-preview-item" style={{ alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{iconMap[notif.type] || '🔔'}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#3D5A3D', fontWeight: 500 }}>{notif.message}</p>
                    <span className="skm-text-muted" style={{ fontSize: '10px' }}>{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual Widget Row 3: News & Schemes */}
      <section className="skm-dual-row">
        {/* Latest News */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">📰 Latest News</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/news-schemes')}>
              More News &rarr;
            </button>
          </div>
          <div className="skm-preview-list">
            {news.length === 0 ? (
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#64748b'}}>No news articles available.</div>
            ) : news.map((item) => (
              <div key={item._id} className="skm-preview-item" style={{ cursor: 'pointer', gap: '10px' }} onClick={() => navigate('/news-schemes')}>
                <img src={item.image || "https://images.unsplash.com/photo-1561584882-3d0e895e6d9c?w=400&h=250&fit=crop"} alt={item.title} style={{ width: '60px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span className="skm-text-muted" style={{ fontSize: '9px' }}>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 700, lineHeight: 1.4 }}>{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Schemes */}
        <div className="skm-card">
          <div className="skm-section-header">
            <h3 className="skm-card-title">🏛️ Government Schemes</h3>
            <button className="skm-text-link-btn" onClick={() => navigate('/news-schemes')}>
              All Schemes &rarr;
            </button>
          </div>
          <div className="skm-preview-list">
            {schemes.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No government schemes available.</div>
            ) : schemes.map((scheme) => (
              <div key={scheme._id} className="skm-preview-item" style={{ cursor: 'pointer', flexDirection: 'column', gap: '4px', alignItems: 'stretch' }} onClick={() => navigate('/news-schemes')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 800 }}>{scheme.title}</h4>
                  <span className="skm-text-muted" style={{ fontSize: '9px' }}>Category: {scheme.category}</span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#555', lineHeight: 1.4 }}>{scheme.benefits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="skm-section">
        <div className="skm-section-header">
          <h2 className="skm-section-title">📜 Recent Transactions</h2>
          <button className="skm-text-link-btn" onClick={() => navigate('/transactions')}>
            View All Transactions &rarr;
          </button>
        </div>
        <div className="skm-table-card">
          <table className="skm-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Buyer/Seller</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTx.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "16px", color: "#64748b" }}>
                    No recent transactions found.
                  </td>
                </tr>
              ) : recentTx.map((txn) => {
                const isSeller = txn.seller._id === user?._id;
                let statusClass = "warning";
                if (txn.deliveryStatus === 'Delivered') statusClass = "success";
                return (
                  <tr key={txn._id}>
                    <td style={{ fontWeight: 700 }}>{txn.cropName}</td>
                    <td>{isSeller ? txn.buyer?.fullName : txn.seller?.fullName}</td>
                    <td style={{ fontWeight: 800, color: 'var(--skm-primary)' }}>₹{txn.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`skm-status-badge ${statusClass}`}>
                        {txn.deliveryStatus}
                      </span>
                    </td>
                    <td className="skm-text-muted">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
