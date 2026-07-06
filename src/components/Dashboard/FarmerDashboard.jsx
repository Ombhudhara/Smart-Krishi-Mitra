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
import './FarmerDashboard.css';

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
    <div className="fd-container">
      {/* Welcome Header */}
      <section className="fd-welcome-section">
        <div className="fd-welcome-left">
          <span className="fd-time-greeting">Good Morning, Welcome back</span>
          <h1 className="fd-welcome-title">{user?.fullName || "Farmer"} 👋</h1>
          <div className="fd-header-metadata">
            <span className="fd-meta-badge">Role: {user?.role || "Farmer"}</span>
            <span className="fd-meta-divider">|</span>
            <span className="fd-meta-time">{currentTime}</span>
            <span className="fd-meta-divider">|</span>
            <span className="fd-meta-date">{currentDate}</span>
          </div>
        </div>
        <div className="fd-welcome-right">
          <div className="fd-welcome-weather-widget">
            <span className="fd-widget-weather-icon">{weather.icon}</span>
            <div>
              <div className="fd-widget-weather-temp">{weather.temp}°C</div>
              <div className="fd-widget-weather-status">{weather.description}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="fd-stats-section">
        <div className="fd-section-header">
          <h2 className="fd-section-title">📊 Key Metrics</h2>
        </div>
        <div className="fd-stats-grid">
          {STATS_DATA.map((stat) => (
            <div key={stat.id} className="fd-stat-card" style={{ borderTop: `4px solid ${stat.color}` }}>
              <div className="fd-stat-card-header">
                <span className="fd-stat-label">{stat.label}</span>
                <span className="fd-stat-icon" style={{ background: stat.bg, color: stat.color }}>
                  {stat.icon}
                </span>
              </div>
              <div className="fd-stat-value">{stat.value}</div>
              <div className="fd-stat-card-footer">
                <span className="fd-stat-desc">{stat.desc}</span>
                <span className={`fd-stat-trend trend-${stat.trendType}`}>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Access Grid */}
      <section className="fd-quick-section">
        <div className="fd-section-header">
          <h2 className="fd-section-title">⚡ Quick Access Grid</h2>
        </div>
        <div className="fd-quick-grid">
          {QUICK_ACCESS_ITEMS.map((item) => (
            <div key={item.id} className="fd-quick-card" onClick={() => navigate(item.path)}>
              <div className="fd-quick-icon-wrap">{item.icon}</div>
              <h3 className="fd-quick-title">{item.title}</h3>
              <p className="fd-quick-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dual Widget Row: Weather & AI */}
      <section className="fd-dual-row">
        {/* Weather Widget — uses reusable WeatherCard component */}
        <div className="fd-widget-card fd-weather-widget-card">
          <h3 className="fd-widget-title">Today's Weather</h3>
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
          <button className="fd-widget-action-btn" onClick={() => navigate('/weather')}>
            View Full Forecast
          </button>
        </div>

        {/* AI Assistant Widget */}
        <div className="fd-widget-card fd-ai-widget-card">
          <h3 className="fd-widget-title">🤖 AI Assistant</h3>
          <div className="fd-ai-body">
            <p className="fd-ai-description">
              Need help with crop selection, soil health diagnostics, localized pest control, weather impact reports, or mandi price analysis?
            </p>
            <div className="fd-ai-features">
              <span className="fd-ai-feature-tag">Crop Diagnostic</span>
              <span className="fd-ai-feature-tag">Market Predictor</span>
              <span className="fd-ai-feature-tag">Soil Advisor</span>
            </div>
            <button className="fd-widget-action-btn fd-btn-ai" onClick={() => navigate('/crop-knowledge')}>
              Ask AI Advisor
            </button>
          </div>
        </div>
      </section>

      {/* Dual Widget Row 2: Marketplace & Notifications */}
      <section className="fd-dual-row">
        {/* Marketplace Preview */}
        <div className="fd-widget-card fd-marketplace-preview-card">
          <div className="fd-widget-header-row">
            <h3 className="fd-widget-title">🛒 Marketplace Preview</h3>
            <button className="fd-text-link-btn" onClick={() => navigate('/marketplace')}>
              Go to Marketplace &rarr;
            </button>
          </div>
          <div className="fd-crop-previews-grid">
            {marketplacePreviews.length === 0 ? (
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#64748b'}}>No listings available.</div>
            ) : marketplacePreviews.map((crop) => (
              <div key={crop.id} className="fd-crop-preview-card" style={{ cursor: "pointer" }} onClick={() => navigate('/marketplace')}>
                <img src={crop.image} alt={crop.name} className="fd-crop-preview-img" />
                <div className="fd-crop-preview-info">
                  <h4 className="fd-crop-preview-name">{crop.name}</h4>
                  <div className="fd-crop-preview-price">{crop.price}</div>
                  <div className="fd-crop-preview-seller">Seller: {crop.seller}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Preview */}
        <div className="fd-widget-card fd-notifications-preview-card">
          <div className="fd-widget-header-row">
            <h3 className="fd-widget-title">🔔 Notifications</h3>
            <button className="fd-text-link-btn" onClick={() => navigate('/notifications')}>
              View All &rarr;
            </button>
          </div>
          <div className="fd-notif-preview-list">
            {notifications.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No new notifications.</div>
            ) : notifications.map((notif) => {
              const iconMap = { weather: '⛈️', chat: '💬', order: '💳', scheme: '🏛️', system: '🔔' };
              return (
                <div key={notif._id} className="fd-notif-preview-item">
                  <span className="fd-notif-preview-icon">{iconMap[notif.type] || '🔔'}</span>
                  <div className="fd-notif-preview-content">
                    <p className="fd-notif-preview-text">{notif.message}</p>
                    <span className="fd-notif-preview-time">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual Widget Row 3: News & Schemes */}
      <section className="fd-dual-row">
        {/* Latest News */}
        <div className="fd-widget-card fd-news-preview-card">
          <div className="fd-widget-header-row">
            <h3 className="fd-widget-title">📰 Latest News</h3>
            <button className="fd-text-link-btn" onClick={() => navigate('/news-schemes')}>
              More News &rarr;
            </button>
          </div>
          <div className="fd-news-previews-grid">
            {news.length === 0 ? (
              <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '20px', color: '#64748b'}}>No news articles available.</div>
            ) : news.map((item) => (
              <div key={item._id} className="fd-news-preview-item" onClick={() => navigate('/news-schemes')}>
                <img src={item.image || "https://images.unsplash.com/photo-1561584882-3d0e895e6d9c?w=400&h=250&fit=crop"} alt={item.title} className="fd-news-preview-img" />
                <div className="fd-news-preview-details">
                  <span className="fd-news-preview-date">{new Date(item.publishedAt).toLocaleDateString()}</span>
                  <h4 className="fd-news-preview-headline">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Government Schemes */}
        <div className="fd-widget-card fd-schemes-preview-card">
          <div className="fd-widget-header-row">
            <h3 className="fd-widget-title">🏛️ Government Schemes</h3>
            <button className="fd-text-link-btn" onClick={() => navigate('/news-schemes')}>
              All Schemes &rarr;
            </button>
          </div>
          <div className="fd-schemes-preview-list">
            {schemes.length === 0 ? (
              <div style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No government schemes available.</div>
            ) : schemes.map((scheme) => (
              <div key={scheme._id} className="fd-scheme-preview-item" onClick={() => navigate('/news-schemes')}>
                <div className="fd-scheme-preview-meta">
                  <h4 className="fd-scheme-preview-name">{scheme.title}</h4>
                  <span className="fd-scheme-preview-deadline">Category: {scheme.category}</span>
                </div>
                <p className="fd-scheme-preview-benefits">{scheme.benefits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Transactions Table */}
      <section className="fd-transactions-section">
        <div className="fd-widget-header-row">
          <h2 className="fd-section-title">📜 Recent Transactions</h2>
          <button className="fd-text-link-btn" onClick={() => navigate('/transactions')}>
            View All Transactions &rarr;
          </button>
        </div>
        <div className="fd-table-card">
          <table className="fd-transactions-table">
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
                return (
                  <tr key={txn._id}>
                    <td className="fd-table-cell-bold">{txn.cropName}</td>
                    <td>{isSeller ? txn.buyer?.fullName : txn.seller?.fullName}</td>
                    <td className="fd-table-cell-amount">₹{txn.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`fd-table-status-badge status-${txn.deliveryStatus.toLowerCase()}`}>
                        {txn.deliveryStatus}
                      </span>
                    </td>
                    <td className="fd-table-cell-date">{new Date(txn.createdAt).toLocaleDateString()}</td>
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
