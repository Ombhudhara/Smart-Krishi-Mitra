import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import Loader from '../../components/Loader/Loader';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import './News_Schemes.css';

// =============================================================================
// DUMMY DATA
// =============================================================================

const NEWS_DATA = [
  {
    id: 1,
    title: 'India Releases New High-Yield Wheat Variety HD-3386 for Rabi 2026',
    description: 'ICAR researchers have developed HD-3386, a rust-resistant wheat variety with 15% higher yield potential suited for North Indian plains, expected to benefit over 5 million farmers.',
    category: 'Agriculture', categoryColor: '#2E7D32',
    date: 'Jun 30, 2026', source: 'ICAR News',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=380&fit=crop',
    trending: true,
  },
  {
    id: 2,
    title: 'Cotton Prices Surge 18% Amid Rising Global Textile Demand',
    description: 'Cotton prices at Rajkot and Nagpur mandis touched Rs 7,800/quintal, the highest in 3 years. Experts attribute this to recovering global demand and lower US cotton output.',
    category: 'Market Prices', categoryColor: '#1565C0',
    date: 'Jun 29, 2026', source: 'AgriMarket India',
    image: 'https://images.unsplash.com/photo-1616431101491-554c0932ea40?w=600&h=380&fit=crop',
    trending: true,
  },
  {
    id: 3,
    title: 'Southwest Monsoon Arrives 5 Days Early, Covers Entire Kerala',
    description: 'IMD confirms the Southwest Monsoon reached Kerala on June 1, five days ahead of schedule. This early onset is expected to boost Kharif sowing across Maharashtra and Karnataka.',
    category: 'Weather', categoryColor: '#0277BD',
    date: 'Jun 28, 2026', source: 'IMD India',
    image: 'https://images.unsplash.com/photo-1561584882-3d0e895e6d9c?w=600&h=380&fit=crop',
    trending: false,
  },
  {
    id: 4,
    title: 'Solar-Powered Smart Irrigation Systems Now Available at 40% Subsidy',
    description: 'The Ministry of Agriculture has partnered with NABARD to offer solar drip irrigation kits at 40% subsidy to small and marginal farmers in drought-prone districts.',
    category: 'Technology', categoryColor: '#6A1B9A',
    date: 'Jun 27, 2026', source: 'Ministry of Agriculture',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=380&fit=crop',
    trending: false,
  },
  {
    id: 5,
    title: 'Organic Farming Area in India Doubles to 4.5 Million Hectares',
    description: "India's certified organic farming area has doubled over five years reaching 4.5 million ha. Sikkim remains fully organic; Madhya Pradesh and Rajasthan lead in coverage.",
    category: 'Organic Farming', categoryColor: '#388E3C',
    date: 'Jun 26, 2026', source: 'APEDA',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=380&fit=crop',
    trending: false,
  },
  {
    id: 6,
    title: "India's Agriculture Exports Cross $55 Billion in FY 2025-26",
    description: 'India achieved record agriculture exports of $55.2 billion in FY26, led by rice ($11.2B), spices ($4.5B), and marine products. Basmati rice saw 22% volume growth.',
    category: 'Export', categoryColor: '#E65100',
    date: 'Jun 25, 2026', source: 'APEDA Export Council',
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&h=380&fit=crop',
    trending: true,
  },
  {
    id: 7,
    title: 'eNAM Platform Crosses 10 Million Farmers and 2,000 Mandis',
    description: 'The National Agriculture Market (eNAM) has onboarded 10.2 million farmers and integrated 2,046 mandis. Monthly trade volume crossed Rs 12,000 crore for the first time.',
    category: 'Government', categoryColor: '#880E4F',
    date: 'Jun 24, 2026', source: 'SFAC India',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=380&fit=crop',
    trending: false,
  },
  {
    id: 8,
    title: 'Drone Spraying Adopted by 5 Lakh Farmers Under SMAM Scheme',
    description: 'The Sub-Mission on Agricultural Mechanization (SMAM) has enabled 5 lakh farmers to access drone spraying services, reducing pesticide use by 30% and labour costs by 60%.',
    category: 'Technology', categoryColor: '#6A1B9A',
    date: 'Jun 23, 2026', source: 'DAC&FW',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=380&fit=crop',
    trending: false,
  },
  {
    id: 9,
    title: 'Tomato Prices Crash to Rs 2/kg in Nashik; Farmers Demand MSP',
    description: 'Bumper production in Nashik and Kolar has pushed wholesale tomato prices to Rs 1.5-2/kg, causing massive losses for farmers. Agriculture ministry is considering MSP for tomatoes.',
    category: 'Market Prices', categoryColor: '#1565C0',
    date: 'Jun 22, 2026', source: 'The Hindu Agri',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&h=380&fit=crop',
    trending: true,
  },
];

const SCHEMES_DATA = [
  {
    id: 1, name: 'PM-KISAN Samman Nidhi', emoji: '\uD83D\uDCB0',
    department: 'Ministry of Agriculture & Farmers Welfare',
    benefits: 'Rs 6,000/year direct income support in 3 instalments of Rs 2,000 directly into bank account.',
    eligibility: 'All landholding farmer families with cultivable land. Excludes income-tax payers and government employees.',
    deadline: 'Rolling - Register anytime',
    documents: ['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Account (Aadhaar linked)', 'Mobile Number'],
    status: 'Active', beneficiaries: '11.5 Cr Farmers', budget: 'Rs 60,000 Cr/year',
  },
  {
    id: 2, name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', emoji: '\uD83D\uDEE1\uFE0F',
    department: 'Ministry of Agriculture & Farmers Welfare',
    benefits: 'Comprehensive crop insurance covering natural calamities, pests, diseases. Premium as low as 1.5% for Rabi crops.',
    eligibility: 'All farmers growing notified crops in notified areas. Loanee farmers are automatically covered.',
    deadline: 'Kharif: July 31 | Rabi: Dec 31',
    documents: ['Aadhaar Card', 'Bank Passbook', 'Land Record / Lease Agreement', 'Sowing Certificate'],
    status: 'Active', beneficiaries: '5.6 Cr Farmers', budget: 'Rs 15,000 Cr/year',
  },
  {
    id: 3, name: 'Kisan Credit Card (KCC)', emoji: '\uD83D\uDCB3',
    department: 'NABARD / Ministry of Finance',
    benefits: 'Short-term credit up to Rs 3 lakh at 4% effective interest. Covers crop production, post-harvest and allied activities.',
    eligibility: 'All farmer landholders, tenant farmers, sharecroppers, and SHG members engaged in farming.',
    deadline: 'Rolling - Apply at any bank branch',
    documents: ['Aadhaar Card', 'Land Records', 'Passport Photo', 'Income/Solvency Certificate'],
    status: 'Active', beneficiaries: '7.2 Cr Farmers', budget: 'Credit Linked',
  },
  {
    id: 4, name: 'Soil Health Card Scheme', emoji: '\uD83E\uDDEA',
    department: 'Dept. of Agriculture & Farmers Welfare',
    benefits: 'Free soil testing and nutrient management advisory. Reduces fertilizer cost by 10-15%. Improves yield by 5-6%.',
    eligibility: 'Every farmer in India is eligible for one soil health card per 2 hectares every 2 years. Free of cost.',
    deadline: 'Rolling - Visit nearest soil testing lab',
    documents: ['Aadhaar Card', 'Land Records', 'Mobile Number for OTP'],
    status: 'Active', beneficiaries: '22 Cr Cards Issued', budget: 'Rs 368 Cr/year',
  },
  {
    id: 5, name: 'PM Krishi Sinchayee Yojana (PMKSY)', emoji: '\uD83D\uDCA7',
    department: 'Ministry of Jal Shakti / Ministry of Agriculture',
    benefits: 'Up to 55% subsidy for drip irrigation. 45% subsidy for sprinkler systems. Covers equipment, installation, and pipeline costs.',
    eligibility: 'All categories of farmers (Individual, group, cooperatives, SHGs). Land ownership or lease required.',
    deadline: 'Sep 30, 2026',
    documents: ['Aadhaar Card', 'Land Ownership/Lease Document', 'Bank Account Details', 'Quotation from approved vendor'],
    status: 'Active', beneficiaries: '55 Lakh Farmers', budget: 'Rs 93,068 Cr',
  },
  {
    id: 6, name: 'Agriculture Infrastructure Fund (AIF)', emoji: '\uD83C\uDFD7\uFE0F',
    department: 'Ministry of Agriculture & Farmers Welfare',
    benefits: 'Loans up to Rs 2 crore at 3% interest subvention for 7 years for cold storage, warehouses, and processing units.',
    eligibility: 'Farmers, FPOs, PACS, Agri-entrepreneurs, Start-ups, and State Agencies involved in post-harvest management.',
    deadline: 'Mar 31, 2027',
    documents: ['Project Report', 'Aadhaar Card', 'Land Documents', 'Bank Statements (6 months)', 'GST Registration'],
    status: 'Active', beneficiaries: '67,000+ Projects', budget: 'Rs 1 Lakh Cr',
  },
];

const AI_RECOMMENDATIONS = [
  {
    id: 1, icon: '\uD83C\uDF3E', priority: 'high', action: 'Apply Now',
    title: 'PM-KISAN Eligibility Detected',
    desc: 'Based on your profile and land records, you are eligible for PM-KISAN. Receive Rs 6,000/year directly in your bank account.',
  },
  {
    id: 2, icon: '\uD83D\uDCA7', priority: 'high', action: 'Check Eligibility',
    title: 'Drip Irrigation Subsidy for Your Region',
    desc: 'Your district (Vidarbha) is listed under PMKSY priority zones. Avail 55% subsidy on drip irrigation - estimated saving of Rs 45,000.',
  },
  {
    id: 3, icon: '\uD83D\uDCC8', priority: 'medium', action: 'View Market Data',
    title: 'Cotton Prices Rising - Hold Your Stock',
    desc: 'Cotton prices rose 18% in June. AI analysis suggests an additional 8-10% rise in July. Consider holding current stock if storage is available.',
  },
  {
    id: 4, icon: '\uD83C\uDF26\uFE0F', priority: 'urgent', action: 'View Weather',
    title: 'Heavy Rain Tomorrow - Delay Pesticide Spraying',
    desc: 'IMD forecast shows 80% probability of heavy rain tomorrow in your district. Delay pesticide spraying by 2 days to avoid washoff.',
  },
  {
    id: 5, icon: '\uD83E\uDDEA', priority: 'medium', action: 'Schedule Test',
    title: 'Soil Health Card Due for Renewal',
    desc: 'Your last soil test was 2 years ago. A new test can help save 12-15% on input costs through updated fertilizer recommendations.',
  },
];

const TRENDING_NEWS = [
  { id: 1, headline: 'MSP for Kharif 2026 Increased by 7%', category: 'Government', date: 'Jun 30, 2026',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop' },
  { id: 2, headline: 'AI Soil Analysis App Launched by IARI', category: 'Technology', date: 'Jun 29, 2026',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&h=200&fit=crop' },
  { id: 3, headline: 'Onion Export Ban Lifted - Prices Expected to Rise', category: 'Export', date: 'Jun 28, 2026',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=200&fit=crop' },
  { id: 4, headline: 'FPO Formation Target: 10,000 New FPOs by 2027', category: 'Government', date: 'Jun 27, 2026',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&h=200&fit=crop' },
  { id: 5, headline: 'Wheat Procurement Crosses 30 Million Tonnes', category: 'Agriculture', date: 'Jun 26, 2026',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop' },
];

const POPULAR_SCHEMES = [
  { id: 1, name: 'PM-KISAN', desc: 'Rs 6,000/year income support for all farmers', status: 'Active', beneficiaries: '11.5 Cr' },
  { id: 2, name: 'PMFBY Crop Insurance', desc: 'Low-premium crop insurance covering all risks', status: 'Active', beneficiaries: '5.6 Cr' },
  { id: 3, name: 'eNAM Digital Mandi', desc: 'Online mandi trading for better prices', status: 'Active', beneficiaries: '1.8 Cr' },
  { id: 4, name: 'Kisan Credit Card', desc: '4% interest crop loan up to Rs 3 lakh', status: 'Active', beneficiaries: '7.2 Cr' },
  { id: 5, name: 'Soil Health Card', desc: 'Free soil testing and advisory service', status: 'Active', beneficiaries: '22 Cr Cards' },
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
function BookmarkItem({ id, onRemove }) {
  const newsItem   = NEWS_DATA.find((n) => n.id === id);
  const schemeId   = typeof id === 'string' && id.startsWith('scheme_')
    ? parseInt(id.replace('scheme_', ''), 10)
    : null;
  const schemeItem = schemeId ? SCHEMES_DATA.find((s) => s.id === schemeId) : null;
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
  // const navigate = useNavigate();
  const trendingRef = useRef(null);

  // UI state
  const [sidebarOpen,    setSidebarOpen]    = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [bookmarks,      setBookmarks]      = useState([1, 'scheme_1']);
  const [isLoading,      setIsLoading]      = useState(true);
  const [notification,   setNotification]   = useState(null);
  const [activeTab,      setActiveTab]      = useState('news');

  // Simulate initial data loading
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1400);
    return () => clearTimeout(t);
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


  const filteredNews = NEWS_DATA.filter((n) => {
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
        user={{ name: 'OM', role: 'Customer' }}
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
                  {TRENDING_NEWS.map((item) => <TrendingCard key={item.id} item={item} />)}
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
                  <span className="ns-section-pill">{SCHEMES_DATA.length} active</span>
                </div>
                <div className="ns-schemes-grid">
                  {SCHEMES_DATA.map((scheme) => (
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
                    <BookmarkItem key={id} id={id} onRemove={handleRemoveBookmark} />
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
