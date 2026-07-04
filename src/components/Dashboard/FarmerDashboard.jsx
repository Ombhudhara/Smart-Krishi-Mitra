import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WeatherCard from '../WeatherCard/WeatherCard';
import './FarmerDashboard.css';

// =============================================================================
// REALISTIC DUMMY DATA FOR THE FARMER CONTROL CENTER
// =============================================================================

const STATS_DATA = [
  {
    id: 'stat-crops',
    icon: '🌾',
    value: '15',
    label: 'Total Crops',
    desc: 'Types under cultivation',
    trend: '+2 this month',
    trendType: 'up',
    color: '#2E7D32',
    bg: '#E8F5E9'
  },
  {
    id: 'stat-earnings',
    icon: '💰',
    value: '₹85,000',
    label: 'Estimated Earnings',
    desc: 'Total sales this cycle',
    trend: '+12.4% vs last cycle',
    trendType: 'up',
    color: '#1565C0',
    bg: '#E3F2FD'
  },
  {
    id: 'stat-listings',
    icon: '📦',
    value: '8',
    label: 'Active Listings',
    desc: 'Crops live in marketplace',
    trend: 'Stable demand',
    trendType: 'neutral',
    color: '#E65100',
    bg: '#FFF3E0'
  },
  {
    id: 'stat-notifs',
    icon: '🔔',
    value: '5',
    label: 'New Notifications',
    desc: 'Requires attention',
    trend: '3 high priority',
    trendType: 'danger',
    color: '#6A1B9A',
    bg: '#F3E5F5'
  }
];

const QUICK_ACCESS_ITEMS = [
  { id: 'marketplace', icon: '🛒', title: 'Marketplace', desc: 'Buy and sell crops directly with vendors.', path: '/marketplace' },
  { id: 'ai-assistant', icon: '🤖', title: 'AI Assistant', desc: 'Get smart crop care tips & advisory.', path: '/crop-knowledge' },
  { id: 'weather', icon: '🌦️', title: 'Weather Alerts', desc: 'Real-time local forecasts & warnings.', path: '/weather' },
  { id: 'knowledge', icon: '📚', title: 'Crop Knowledge', desc: 'Detailed guides on pests and cultivation.', path: '/crop-knowledge' },
  { id: 'calculator', icon: '🧮', title: 'Cost Calculator', desc: 'Estimate production costs & profits.', path: '/calculator' },
  { id: 'messages', icon: '💬', title: 'Messages', desc: 'Chat directly with potential buyers.', path: '/messages' },
  { id: 'transactions', icon: '📜', title: 'Transaction History', desc: 'View past bills, payments, and sales.', path: '/transactions' },
];

const MARKETPLACE_PREVIEWS = [
  {
    id: 1,
    name: 'Premium Sharbati Wheat',
    price: '₹2,450 / Quintal',
    location: 'Indore, MP',
    seller: 'Om Bhudhara (You)',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop'
  },
  {
    id: 2,
    name: 'Organic BT Cotton',
    price: '₹7,900 / Quintal',
    location: 'Rajkot, Gujarat',
    seller: 'Rajesh Patel',
    image: 'https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=300&h=200&fit=crop'
  },
  {
    id: 3,
    name: 'Basmati Rice (1121)',
    price: '₹6,200 / Quintal',
    location: 'Karnal, Haryana',
    seller: 'Amit Singh',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=300&h=200&fit=crop'
  },
  {
    id: 4,
    name: 'Desi Groundnut Bold',
    price: '₹6,800 / Quintal',
    location: 'Junagadh, Gujarat',
    seller: 'Manish Vaghela',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop'
  }
];

const NOTIFICATIONS_PREVIEW = [
  { id: 1, icon: '⛈️', text: 'Heavy rainfall expected tomorrow in your sub-district.', time: '10 mins ago', type: 'weather' },
  { id: 2, icon: '💬', text: 'Raj Patel sent you a new message regarding Cotton pricing.', time: '25 mins ago', type: 'message' },
  { id: 3, icon: '💳', text: 'Payment of ₹14,200 received successfully for Onion sale.', time: '2 hours ago', type: 'payment' },
  { id: 4, icon: '🤖', text: 'AI recommendation: Delay pesticide spraying until wind speed drops.', time: '3 hours ago', type: 'ai' }
];

const LATEST_NEWS = [
  {
    id: 1,
    headline: 'Monsoon Update: Normal Rainfall Expected Across North India',
    date: 'Jun 30, 2026',
    image: 'https://images.unsplash.com/photo-1561584882-3d0e895e6d9c?w=400&h=250&fit=crop'
  },
  {
    id: 2,
    headline: 'Cotton Sowing Area Expands by 12% in Gujarat and Punjab',
    date: 'Jun 28, 2026',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=250&fit=crop'
  },
  {
    id: 3,
    headline: 'Government Launches Custom Drone Subsidy for Small Farmers',
    date: 'Jun 26, 2026',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=250&fit=crop'
  }
];

const GOVERNMENT_SCHEMES = [
  { id: 1, name: 'PM-KISAN Samman Nidhi', benefits: 'Direct income support of ₹6,000/year to all landholding families.', deadline: 'Rolling Registration' },
  { id: 2, name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', benefits: 'Comprehensive crop insurance covering yield loss with nominal premium rates.', deadline: 'July 31, 2026' },
  { id: 3, name: 'Kisan Credit Card (KCC) Loan Subvention', benefits: 'Short term crop loans up to ₹3 Lakhs at 4% effective interest rate.', deadline: 'Rolling Registration' }
];

const RECENT_TRANSACTIONS = [
  { id: 'txn-1', crop: 'Cotton (BT)', buyer: 'Rajesh Patel', amount: '₹39,500', status: 'Completed', date: 'Jun 28, 2026' },
  { id: 'txn-2', crop: 'Wheat (Sharbati)', buyer: 'FreshMart Agri Ltd', amount: '₹24,500', status: 'Pending', date: 'Jun 27, 2026' },
  { id: 'txn-3', crop: 'Onion Red', buyer: 'Karan Traders', amount: '₹14,200', status: 'Completed', date: 'Jun 26, 2026' },
  { id: 'txn-4', crop: 'Potatoes (Desi)', buyer: 'Organic Basket', amount: '₹6,800', status: 'Completed', date: 'Jun 24, 2026' }
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

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

  return (
    <div className="fd-container">
      {/* Welcome Header */}
      <section className="fd-welcome-section">
        <div className="fd-welcome-left">
          <span className="fd-time-greeting">Good Morning, Welcome back</span>
          <h1 className="fd-welcome-title">Om 👋</h1>
          <div className="fd-header-metadata">
            <span className="fd-meta-badge">Role: Farmer</span>
            <span className="fd-meta-divider">|</span>
            <span className="fd-meta-time">{currentTime}</span>
            <span className="fd-meta-divider">|</span>
            <span className="fd-meta-date">{currentDate}</span>
          </div>
        </div>
        <div className="fd-welcome-right">
          <div className="fd-welcome-weather-widget">
            <span className="fd-widget-weather-icon">🌤️</span>
            <div>
              <div className="fd-widget-weather-temp">31°C</div>
              <div className="fd-widget-weather-status">Mostly Sunny</div>
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
              location: 'Nagpur, Maharashtra',
              temperature: 31,
              condition: 'Mostly Sunny',
              humidity: 52,
              wind: 14,
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
            {MARKETPLACE_PREVIEWS.map((crop) => (
              <div key={crop.id} className="fd-crop-preview-card">
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
            {NOTIFICATIONS_PREVIEW.map((notif) => (
              <div key={notif.id} className="fd-notif-preview-item">
                <span className="fd-notif-preview-icon">{notif.icon}</span>
                <div className="fd-notif-preview-content">
                  <p className="fd-notif-preview-text">{notif.text}</p>
                  <span className="fd-notif-preview-time">{notif.time}</span>
                </div>
              </div>
            ))}
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
            {LATEST_NEWS.map((news) => (
              <div key={news.id} className="fd-news-preview-item" onClick={() => navigate('/news-schemes')}>
                <img src={news.image} alt={news.headline} className="fd-news-preview-img" />
                <div className="fd-news-preview-details">
                  <span className="fd-news-preview-date">{news.date}</span>
                  <h4 className="fd-news-preview-headline">{news.headline}</h4>
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
            {GOVERNMENT_SCHEMES.map((scheme) => (
              <div key={scheme.id} className="fd-scheme-preview-item" onClick={() => navigate('/news-schemes')}>
                <div className="fd-scheme-preview-meta">
                  <h4 className="fd-scheme-preview-name">{scheme.name}</h4>
                  <span className="fd-scheme-preview-deadline">Ends: {scheme.deadline}</span>
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
                <th>Buyer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSACTIONS.map((txn) => (
                <tr key={txn.id}>
                  <td className="fd-table-cell-bold">{txn.crop}</td>
                  <td>{txn.buyer}</td>
                  <td className="fd-table-cell-amount">{txn.amount}</td>
                  <td>
                    <span className={`fd-table-status-badge status-${txn.status.toLowerCase()}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="fd-table-cell-date">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
