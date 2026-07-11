import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import Card from '../../components/Card/Card';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import { saveCalculation as saveCalculationApi } from '../../services/calculatorService';
import './CostCalculator.css';

// ─── Constants & Dummy Data ───────────────────────────────────────────────────

const CROPS = [
  { value: 'wheat', label: '🌾 Wheat', avgYield: 35, avgPrice: 2200 },
  { value: 'rice', label: '🌾 Rice', avgYield: 40, avgPrice: 1900 },
  { value: 'cotton', label: '🌿 Cotton', avgYield: 18, avgPrice: 6500 },
  { value: 'soybean', label: '🫘 Soybean', avgYield: 25, avgPrice: 4200 },
  { value: 'sugarcane', label: '🎋 Sugarcane', avgYield: 700, avgPrice: 310 },
  { value: 'maize', label: '🌽 Maize', avgYield: 45, avgPrice: 1750 },
  { value: 'tomato', label: '🍅 Tomato', avgYield: 200, avgPrice: 1200 },
  { value: 'potato', label: '🥔 Potato', avgYield: 250, avgPrice: 950 },
  { value: 'onion', label: '🧅 Onion', avgYield: 150, avgPrice: 1400 },
  { value: 'groundnut', label: '🥜 Groundnut', avgYield: 22, avgPrice: 5500 },
];

const SOIL_TYPES = ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy Loam', 'Clay', 'Loamy'];
const IRRIGATION_TYPES = ['Drip', 'Sprinkler', 'Canal', 'Borewell', 'Rainfed', 'Flood'];
const AREA_UNITS = ['Acres', 'Hectares', 'Bigha', 'Guntha'];
const YIELD_UNITS = ['Quintals', 'Tonnes', 'Kg'];

const RECENT_CALCULATIONS = [
  { id: 1, crop: '🌾 Wheat', area: '5 Acres', investment: '₹42,500', revenue: '₹77,000', profit: '₹34,500', date: 'Jun 25, 2025', profitPct: 81 },
  { id: 2, crop: '🌿 Cotton', area: '3 Acres', investment: '₹68,200', revenue: '₹1,05,300', profit: '₹37,100', date: 'Jun 18, 2025', profitPct: 54 },
  { id: 3, crop: '🫘 Soybean', area: '4 Acres', investment: '₹38,000', revenue: '₹67,200', profit: '₹29,200', date: 'Jun 10, 2025', profitPct: 77 },
  { id: 4, crop: '🌽 Maize', area: '6 Acres', investment: '₹51,000', revenue: '₹94,500', profit: '₹43,500', date: 'Jun 02, 2025', profitPct: 85 },
  { id: 5, crop: '🍅 Tomato', area: '2 Acres', investment: '₹29,000', revenue: '₹72,000', profit: '₹43,000', date: 'May 28, 2025', profitPct: 148 },
];

const AI_RECOMMENDATIONS = [
  { id: 1, icon: '🌱', title: 'Reduce Fertilizer Usage', desc: 'Soil analysis suggests 20% less nitrogen fertilizer can maintain the same yield, saving ₹3,200/acre.', type: 'saving', badge: 'Cost Saving' },
  { id: 2, icon: '💧', title: 'Switch to Drip Irrigation', desc: 'Drip irrigation can reduce water usage by 40% and boost yield by 15% for your selected crop.', type: 'efficiency', badge: 'Efficiency' },
  { id: 3, icon: '📈', title: 'Cotton Prices Rising', desc: 'Market intelligence shows cotton prices trending 12% higher this season. Consider increasing cotton acreage.', type: 'market', badge: 'Market Insight' },
  { id: 4, icon: '🔄', title: 'Soybean Rotation Advised', desc: 'Rotating with soybean next season will improve soil nitrogen by 30%, reducing fertilizer cost.', type: 'agronomy', badge: 'Agronomy' },
  { id: 5, icon: '⏰', title: 'Optimal Sowing Window', desc: 'Weather forecast indicates the next 10 days are ideal for sowing. Act now to maximize germination rates.', type: 'weather', badge: 'Weather Alert' },
  { id: 6, icon: '🏪', title: 'Government Subsidy Available', desc: 'PM-Kisan scheme offers ₹6,000/year. Check eligibility under the new 2025 revised norms.', type: 'scheme', badge: 'Government Scheme' },
];

const MONTHLY_TREND = [
  { month: 'Jan', cost: 12000, revenue: 0 },
  { month: 'Feb', cost: 8500, revenue: 0 },
  { month: 'Mar', cost: 15200, revenue: 0 },
  { month: 'Apr', cost: 9800, revenue: 0 },
  { month: 'May', cost: 6200, revenue: 18000 },
  { month: 'Jun', cost: 4100, revenue: 45000 },
  { month: 'Jul', cost: 7800, revenue: 32000 },
  { month: 'Aug', cost: 5500, revenue: 0 },
  { month: 'Sep', cost: 11200, revenue: 67000 },
  { month: 'Oct', cost: 3200, revenue: 0 },
  { month: 'Nov', cost: 4800, revenue: 0 },
  { month: 'Dec', cost: 2100, revenue: 15000 },
];

const EXPENSE_FIELDS = [
  { key: 'seed', label: 'Seed Cost', icon: '🌱', placeholder: '5000', color: '#43A047' },
  { key: 'fertilizer', label: 'Fertilizer Cost', icon: '🧪', placeholder: '8000', color: '#26C6DA' },
  { key: 'pesticide', label: 'Pesticide Cost', icon: '🛡️', placeholder: '3500', color: '#EF5350' },
  { key: 'machinery', label: 'Machinery Cost', icon: '🚜', placeholder: '6000', color: '#FFA726' },
  { key: 'labor', label: 'Labor Cost', icon: '👨‍🌾', placeholder: '9000', color: '#AB47BC' },
  { key: 'irrigation', label: 'Irrigation Cost', icon: '💧', placeholder: '4000', color: '#29B6F6' },
  { key: 'transportation', label: 'Transportation Cost', icon: '🚛', placeholder: '2500', color: '#FF7043' },
  { key: 'miscellaneous', label: 'Miscellaneous', icon: '📦', placeholder: '1500', color: '#8D6E63' },
];

// ─── Animated Number Component ─────────────────────────────────────────────

function AnimatedNumber({ value, prefix = '₹', decimals = 0 }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animRef = useRef(null);
  const prevValueRef = useRef(0);

  useEffect(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const start = prevValueRef.current;
    const end = value;
    const duration = 800;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplayValue(current);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = end;
      }
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  const formatted = displayValue.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return <span>{prefix}{formatted}</span>;
}

// ─── Pie Chart Component ───────────────────────────────────────────────────

function PieChart({ expenses }) {
  const total = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  if (total === 0) {
    return (
      <div className="cc-pie-empty">
        <span>🌾</span>
        <p>Enter expense values to see the breakdown chart</p>
      </div>
    );
  }

  let cumulativeAngle = -90;
  const radius = 80;
  const cx = 110;
  const cy = 110;

  const segments = EXPENSE_FIELDS.map(({ key, label, color }) => {
    const val = parseFloat(expenses[key]) || 0;
    if (val === 0) return null;
    const pct = (val / total) * 100;
    const angle = (val / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const toRad = (deg) => (deg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(toRad(startAngle));
    const y1 = cy + radius * Math.sin(toRad(startAngle));
    const x2 = cx + radius * Math.cos(toRad(endAngle));
    const y2 = cy + radius * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { key, label, color, pct, val, pathD };
  }).filter(Boolean);

  return (
    <div className="cc-pie-wrapper">
      <svg viewBox="0 0 220 220" className="cc-pie-svg">
        {segments.map((s) => (
          <path key={s.key} d={s.pathD} fill={s.color} className="cc-pie-segment">
            <title>{s.label}: ₹{s.val.toLocaleString('en-IN')} ({s.pct.toFixed(1)}%)</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={52} fill="white" />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#78909C" fontFamily="Poppins, sans-serif">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="16" fill="#1B5E20" fontFamily="Poppins, sans-serif" fontWeight="700">
          ₹{total >= 1000 ? `${(total / 1000).toFixed(0)}K` : total}
        </text>
      </svg>
      <div className="cc-pie-legend">
        {segments.map((s) => (
          <div key={s.key} className="cc-legend-item">
            <span className="cc-legend-dot" style={{ background: s.color }} />
            <span className="cc-legend-name">{s.label}</span>
            <span className="cc-legend-pct">{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Line Chart Component ──────────────────────────────────────────────────

function LineChart({ data }) {
  const W = 580;
  const H = 200;
  const pad = { top: 20, right: 20, bottom: 38, left: 52 };
  const iW = W - pad.left - pad.right;
  const iH = H - pad.top - pad.bottom;

  const allValues = data.flatMap((d) => [d.cost, d.revenue]);
  const maxVal = Math.max(...allValues, 1);
  const xStep = iW / (data.length - 1);
  const yS = (v) => iH - (v / maxVal) * iH;

  const costPts = data.map((d, i) => `${pad.left + i * xStep},${pad.top + yS(d.cost)}`).join(' ');
  const revPts = data.map((d, i) => `${pad.left + i * xStep},${pad.top + yS(d.revenue)}`).join(' ');
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f));

  return (
    <div className="cc-line-chart-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} className="cc-line-svg">
        <defs>
          <linearGradient id="lg-cost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF5350" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#EF5350" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lg-rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#43A047" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#43A047" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((t, i) => {
          const y = pad.top + yS(t);
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={pad.left + iW} y2={y} stroke="#E8F5E9" strokeWidth="1" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#90A4AE" fontFamily="Poppins, sans-serif">
                {t >= 1000 ? `${(t / 1000).toFixed(0)}K` : t}
              </text>
            </g>
          );
        })}

        {data.map((d, i) => (
          <text key={i} x={pad.left + i * xStep} y={H - 8} textAnchor="middle" fontSize="9" fill="#90A4AE" fontFamily="Poppins, sans-serif">
            {d.month}
          </text>
        ))}

        <polygon
          points={`${pad.left},${pad.top + iH} ${costPts} ${pad.left + (data.length - 1) * xStep},${pad.top + iH}`}
          fill="url(#lg-cost)"
        />
        <polygon
          points={`${pad.left},${pad.top + iH} ${revPts} ${pad.left + (data.length - 1) * xStep},${pad.top + iH}`}
          fill="url(#lg-rev)"
        />

        <polyline points={costPts} fill="none" stroke="#EF5350" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={revPts} fill="none" stroke="#43A047" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((d, i) => (
          <g key={i}>
            <circle cx={pad.left + i * xStep} cy={pad.top + yS(d.cost)} r="3.5" fill="white" stroke="#EF5350" strokeWidth="2" />
            {d.revenue > 0 && (
              <circle cx={pad.left + i * xStep} cy={pad.top + yS(d.revenue)} r="3.5" fill="white" stroke="#43A047" strokeWidth="2" />
            )}
          </g>
        ))}
      </svg>

      <div className="cc-line-legend">
        <span className="cc-line-leg-item">
          <span className="cc-line-dot" style={{ background: '#EF5350' }} />Monthly Cost
        </span>
        <span className="cc-line-leg-item">
          <span className="cc-line-dot" style={{ background: '#43A047' }} />Monthly Revenue
        </span>
      </div>
    </div>
  );
}

// ─── Main CostCalculator Component ────────────────────────────────────────

export default function CostCalculator() {
  const [collapsed, setCollapsed] = useState(false);

  const [formData, setFormData] = useState({
    crop: 'wheat',
    landArea: '',
    areaUnit: 'Acres',
    soilType: 'Alluvial',
    irrigationType: 'Drip',
    expectedYield: '',
    marketPrice: '',
    yieldUnit: 'Quintals',
  });

  const [expenses, setExpenses] = useState({
    seed: '', fertilizer: '', pesticide: '', machinery: '',
    labor: '', irrigation: '', transportation: '', miscellaneous: '',
  });

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState(null);

  const selectedCrop = CROPS.find((c) => c.value === formData.crop);

  const showNotification = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExpenseChange = (key, value) => {
    setExpenses((prev) => ({ ...prev, [key]: value }));
  };

  const handleCropChange = (value) => {
    const crop = CROPS.find((c) => c.value === value);
    setFormData((prev) => ({
      ...prev,
      crop: value,
      marketPrice: crop ? String(crop.avgPrice) : prev.marketPrice,
    }));
  };

  const handleCalculate = () => {
    const totalExpenses = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    const yieldAmt = parseFloat(formData.expectedYield) || 0;
    const price = parseFloat(formData.marketPrice) || 0;
    const revenue = yieldAmt * price;
    const profit = revenue - totalExpenses;
    const margin = revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0';
    setResults({ totalExpenses, revenue, profit, margin });
    setHasCalculated(true);
    setIsSaved(false);
    showNotification('Calculation completed successfully!', 'success');
  };

  const handleReset = () => {
    setFormData({ crop: 'wheat', landArea: '', areaUnit: 'Acres', soilType: 'Alluvial', irrigationType: 'Drip', expectedYield: '', marketPrice: '', yieldUnit: 'Quintals' });
    setExpenses({ seed: '', fertilizer: '', pesticide: '', machinery: '', labor: '', irrigation: '', transportation: '', miscellaneous: '' });
    setResults(null);
    setHasCalculated(false);
    setIsSaved(false);
    showNotification('Form has been reset.', 'info');
  };

  const handleSave = async () => {
    if (!hasCalculated) { showNotification('Please calculate first before saving.', 'warning'); return; }
    try {
      const otherExpenses = (parseFloat(expenses.pesticide) || 0) +
                            (parseFloat(expenses.transportation) || 0) +
                            (parseFloat(expenses.miscellaneous) || 0);

      const payload = {
        cropName: formData.crop,
        landArea: parseFloat(formData.landArea) || 1,
        seedCost: parseFloat(expenses.seed) || 0,
        fertilizerCost: parseFloat(expenses.fertilizer) || 0,
        labourCost: parseFloat(expenses.labor) || 0,
        machineryCost: parseFloat(expenses.machinery) || 0,
        irrigationCost: parseFloat(expenses.irrigation) || 0,
        otherCost: otherExpenses,
        totalCost: results.totalExpenses,
        expectedYield: parseFloat(formData.expectedYield) || 0,
        expectedRevenue: results.revenue || 0,
        expectedProfit: results.profit || 0,
        season: formData.irrigationType || "",
        cropVariety: formData.soilType || "",
      };

      const res = await saveCalculationApi(payload);
      if (res.data?.success) {
        setIsSaved(true);
        showNotification('Calculation saved successfully to MongoDB!', 'success');
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to save calculation to backend.', 'error');
    }
  };

  useEffect(() => {
    if (formData.landArea && selectedCrop) {
      const area = parseFloat(formData.landArea) || 1;
      setFormData((prev) => ({
        ...prev,
        expectedYield: String(Math.round(selectedCrop.avgYield * area)),
        marketPrice: String(selectedCrop.avgPrice),
      }));
    }
  }, [formData.landArea, formData.crop]); // eslint-disable-line

  // NAV_ITEMS removed (managed by Sidebar)

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  return (
    <div className="cc-root">
      {/* ── Toast Notification ────────────────────────────── */}
      {notification && (
        <div className={`cc-toast cc-toast--${notification.type}`}>
          <span className="cc-toast-icon">
            {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : 'ℹ️'}
          </span>
          {notification.msg}
        </div>
      )}

      {/* ── Fixed Navbar ──────────────────────────────────── */}
      <Navbar 
        user={{ name: 'OM', role: 'Farmer' }} 
        onToggleSidebar={() => setCollapsed(!collapsed)}
        notificationSlot={<NotificationBell notifications={[]} />}
      />

      {/* ── Layout ───────────────────────────────────────── */}
      <div className="cc-layout">
        {/* ── Sidebar ──────────────────────────────────── */}
        <Sidebar 
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          activeItem="calculator"
        />

        {/* ── Main Content ────────────────────────────── */}
        <main className="cc-main">

          {/* ── Page Header ─────────────────────────── */}
          <div className="cc-page-header">
            <div className="cc-header-content">
              <div className="cc-header-text">
                <div className="cc-breadcrumb">Dashboard / <span>Cost Calculator</span></div>
                <h1 className="cc-page-title">🌾 Smart Farming Cost Calculator</h1>
                <p className="cc-page-subtitle">
                  Estimate your cultivation expenses, expected revenue, and farming profit with an easy-to-use smart calculator.
                </p>
              </div>
              <div className="cc-header-illustration">
                <svg viewBox="0 0 220 160" className="cc-illus-svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E8F5E9" />
                      <stop offset="100%" stopColor="#C8E6C9" />
                    </linearGradient>
                    <linearGradient id="fieldG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#66BB6A" />
                      <stop offset="100%" stopColor="#388E3C" />
                    </linearGradient>
                  </defs>
                  <rect width="220" height="160" fill="url(#skyG)" rx="16" />
                  <circle cx="182" cy="34" r="22" fill="#FFD54F" opacity="0.9" />
                  <circle cx="182" cy="34" r="30" fill="#FFD54F" opacity="0.15" />
                  <ellipse cx="58" cy="30" rx="28" ry="11" fill="white" opacity="0.85" />
                  <ellipse cx="74" cy="24" rx="20" ry="9" fill="white" opacity="0.85" />
                  <ellipse cx="128" cy="38" rx="22" ry="9" fill="white" opacity="0.7" />
                  <rect x="0" y="106" width="220" height="54" fill="url(#fieldG)" />
                  {[20, 50, 80, 110, 140, 168, 194].map((x, i) => (
                    <g key={i} transform={`translate(${x},88)`}>
                      <line x1="0" y1="20" x2="0" y2="0" stroke="#1B5E20" strokeWidth="2.5" />
                      <ellipse cx="0" cy="-2" rx="6" ry="10" fill="#43A047" />
                      <ellipse cx="-5" cy="8" rx="5" ry="7" fill="#66BB6A" transform="rotate(-20)" />
                      <ellipse cx="5" cy="8" rx="5" ry="7" fill="#66BB6A" transform="rotate(20)" />
                    </g>
                  ))}
                  <g transform="translate(28,108)">
                    <rect x="0" y="8" width="38" height="18" rx="4" fill="#F57F17" />
                    <rect x="8" y="2" width="18" height="12" rx="3" fill="#FFA000" />
                    <circle cx="8" cy="28" r="8" fill="#37474F" />
                    <circle cx="8" cy="28" r="4" fill="#546E7A" />
                    <circle cx="30" cy="28" r="6" fill="#37474F" />
                    <circle cx="30" cy="28" r="3" fill="#546E7A" />
                  </g>
                  <rect x="140" y="88" width="70" height="44" rx="8" fill="white" opacity="0.95" />
                  <text x="153" y="103" fontSize="8" fill="#388E3C" fontWeight="700" fontFamily="Poppins,sans-serif">Profit ↑ 85%</text>
                  <text x="153" y="118" fontSize="12" fill="#1B5E20" fontWeight="800" fontFamily="Poppins,sans-serif">₹43.5K</text>
                  <text x="153" y="128" fontSize="7" fill="#66BB6A" fontFamily="Poppins,sans-serif">Net Earnings</text>
                </svg>
              </div>
            </div>
          </div>

          {/* ── Stats Bar ──────────────────────────── */}
          <div className="cc-stats-bar">
            {[
              { label: 'Season Budget', value: '₹2.4L', icon: '💰', trend: '+12%', up: true },
              { label: 'Avg Profit / Acre', value: '₹8,200', icon: '📈', trend: '+5%', up: true },
              { label: 'Active Crops', value: '4', icon: '🌾', trend: 'Stable', up: true },
              { label: 'Loan Utilization', value: '68%', icon: '🏦', trend: '-3%', up: false },
            ].map((s, i) => (
              <div key={i} className="cc-stat-chip">
                <span className="cc-stat-icon">{s.icon}</span>
                <div className="cc-stat-text">
                  <div className="cc-stat-value">{s.value}</div>
                  <div className="cc-stat-label">{s.label}</div>
                </div>
                <span className={`cc-stat-trend ${s.up ? 'cc-trend-up' : 'cc-trend-down'}`}>{s.trend}</span>
              </div>
            ))}
          </div>

          {/* ═══ FORM SECTION ═══════════════════════════ */}
          <div className="cc-form-wrapper">

            {/* Step 1 – Crop Details */}
            <Card className="cc-form-section">
              <div className="cc-card-header">
                <div className="cc-card-title-group">
                  <span className="cc-card-icon-bg">🌿</span>
                  <div>
                    <h2 className="cc-card-title">Crop &amp; Field Details</h2>
                    <p className="cc-card-desc">Select your crop, land size, and farming method</p>
                  </div>
                </div>
                <div className="cc-step-badge">Step 1</div>
              </div>
              <div className="cc-form-grid-2">
                <div className="cc-field">
                  <label className="cc-label">Crop Selection</label>
                  <select className="cc-select" value={formData.crop} onChange={(e) => handleCropChange(e.target.value)}>
                    {CROPS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {selectedCrop && (
                    <div className="cc-field-hint">
                      📊 Avg Yield: {selectedCrop.avgYield} Q/Acre &nbsp;·&nbsp; MSP: ₹{selectedCrop.avgPrice.toLocaleString('en-IN')}/Q
                    </div>
                  )}
                </div>

                <div className="cc-field">
                  <label className="cc-label">Land Area</label>
                  <div className="cc-input-group">
                    <input
                      type="number"
                      className="cc-input cc-input--with-unit"
                      placeholder="e.g. 5"
                      value={formData.landArea}
                      onChange={(e) => handleFormChange('landArea', e.target.value)}
                      min="0"
                    />
                    <select className="cc-unit-select" value={formData.areaUnit} onChange={(e) => handleFormChange('areaUnit', e.target.value)}>
                      {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="cc-field">
                  <label className="cc-label">Soil Type</label>
                  <select className="cc-select" value={formData.soilType} onChange={(e) => handleFormChange('soilType', e.target.value)}>
                    {SOIL_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="cc-field">
                  <label className="cc-label">Irrigation Type</label>
                  <select className="cc-select" value={formData.irrigationType} onChange={(e) => handleFormChange('irrigationType', e.target.value)}>
                    {IRRIGATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </Card>

            {/* Step 2 – Expenses */}
            <Card className="cc-form-section">
              <div className="cc-card-header">
                <div className="cc-card-title-group">
                  <span className="cc-card-icon-bg">💰</span>
                  <div>
                    <h2 className="cc-card-title">Expense Breakdown</h2>
                    <p className="cc-card-desc">Enter all farming costs in Indian Rupees (₹)</p>
                  </div>
                </div>
                <div className="cc-step-badge cc-step-badge--2">Step 2</div>
              </div>

              <div className="cc-expense-grid">
                {EXPENSE_FIELDS.map(({ key, label, icon, placeholder, color }) => (
                  <div key={key} className="cc-expense-card" style={{ '--accent': color }}>
                    <div className="cc-expense-card-top">
                      <span className="cc-expense-icon">{icon}</span>
                      <span className="cc-expense-label">{label}</span>
                    </div>
                    <div className="cc-expense-input-wrap">
                      <span className="cc-rupee-sign">₹</span>
                      <input
                        type="number"
                        className="cc-expense-input"
                        placeholder={placeholder}
                        value={expenses[key]}
                        onChange={(e) => handleExpenseChange(key, e.target.value)}
                        min="0"
                      />
                    </div>
                    {expenses[key] && (
                      <div className="cc-expense-bar">
                        <div
                          className="cc-expense-bar-fill"
                          style={{ width: `${Math.min(100, (parseFloat(expenses[key]) / 15000) * 100)}%`, background: color }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="cc-expense-total-row">
                <span className="cc-expense-total-label">Total Expenses</span>
                <span className="cc-expense-total-value">₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>
            </Card>

            {/* Step 3 – Yield & Revenue */}
            <Card className="cc-form-section">
              <div className="cc-card-header">
                <div className="cc-card-title-group">
                  <span className="cc-card-icon-bg">📊</span>
                  <div>
                    <h2 className="cc-card-title">Yield &amp; Revenue</h2>
                    <p className="cc-card-desc">Enter expected yield and market selling price</p>
                  </div>
                </div>
                <div className="cc-step-badge cc-step-badge--3">Step 3</div>
              </div>

              <div className="cc-form-grid-3">
                <div className="cc-field">
                  <label className="cc-label">Expected Yield</label>
                  <div className="cc-input-group">
                    <input
                      type="number"
                      className="cc-input cc-input--with-unit"
                      placeholder="e.g. 175"
                      value={formData.expectedYield}
                      onChange={(e) => handleFormChange('expectedYield', e.target.value)}
                      min="0"
                    />
                    <select className="cc-unit-select" value={formData.yieldUnit} onChange={(e) => handleFormChange('yieldUnit', e.target.value)}>
                      {YIELD_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>

                <div className="cc-field">
                  <label className="cc-label">Market Price (₹ / {formData.yieldUnit.slice(0, -1)})</label>
                  <div className="cc-input-group">
                    <span className="cc-input-prefix">₹</span>
                    <input
                      type="number"
                      className="cc-input cc-input--with-prefix"
                      placeholder="e.g. 2200"
                      value={formData.marketPrice}
                      onChange={(e) => handleFormChange('marketPrice', e.target.value)}
                      min="0"
                    />
                  </div>
                  <div className="cc-field-hint">💡 MSP for {selectedCrop?.label}: ₹{selectedCrop?.avgPrice.toLocaleString('en-IN')}/Q</div>
                </div>

                <div className="cc-field">
                  <label className="cc-label">Gross Revenue Preview</label>
                  <div className="cc-revenue-box">
                    <span className="cc-revenue-label">Estimated Revenue</span>
                    <span className="cc-revenue-amount">
                      ₹{((parseFloat(formData.expectedYield) || 0) * (parseFloat(formData.marketPrice) || 0)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cc-action-buttons">
                <Button variant="primary" onClick={handleCalculate} icon="🧮" text="Calculate" />
                <Button variant="secondary" onClick={handleSave} icon={isSaved ? '✅' : '💾'} text={isSaved ? 'Saved!' : 'Save'} />
                <Button variant="outline" onClick={handleReset} icon="🔄" text="Reset" />
                <Button variant="outline" onClick={() => showNotification('PDF export coming soon!', 'info')} icon="📄" text="Download PDF" />
                <Button variant="outline" onClick={() => showNotification('Share feature coming soon!', 'info')} icon="🔗" text="Share" />
              </div>
            </Card>
          </div>

          {/* ═══ RESULTS ════════════════════════════════ */}
          {hasCalculated && results && (
            <section className="cc-results-section">
              <div className="cc-section-header">
                <h2 className="cc-section-title">📊 Calculation Results</h2>
                <span className="cc-section-badge cc-badge--live">● Live</span>
              </div>
              <div className="cc-results-grid">
                <div className="cc-result-card cc-result-card--investment">
                  <div className="cc-result-icon-wrap">💰</div>
                  <div className="cc-result-label">Total Investment</div>
                  <div className="cc-result-value"><AnimatedNumber value={results.totalExpenses} /></div>
                  <div className="cc-result-sub">All farming expenses combined</div>
                  <div className="cc-result-sparkline cc-spark--red" />
                </div>

                <div className="cc-result-card cc-result-card--revenue">
                  <div className="cc-result-icon-wrap">📈</div>
                  <div className="cc-result-label">Expected Revenue</div>
                  <div className="cc-result-value"><AnimatedNumber value={results.revenue} /></div>
                  <div className="cc-result-sub">Based on yield × market price</div>
                  <div className="cc-result-sparkline cc-spark--blue" />
                </div>

                <div className={`cc-result-card ${results.profit >= 0 ? 'cc-result-card--profit' : 'cc-result-card--loss'}`}>
                  <div className="cc-result-icon-wrap">{results.profit >= 0 ? '🎯' : '⚠️'}</div>
                  <div className="cc-result-label">Estimated {results.profit >= 0 ? 'Profit' : 'Loss'}</div>
                  <div className="cc-result-value"><AnimatedNumber value={Math.abs(results.profit)} /></div>
                  <div className="cc-result-sub">{results.profit >= 0 ? 'Net earnings after all costs' : 'Reduce costs or increase yield'}</div>
                  <div className={`cc-result-sparkline ${results.profit >= 0 ? 'cc-spark--green' : 'cc-spark--red'}`} />
                </div>

                <div className="cc-result-card cc-result-card--margin">
                  <div className="cc-result-icon-wrap">📉</div>
                  <div className="cc-result-label">Profit Margin</div>
                  <div className="cc-result-value cc-result-value--pct">
                    <AnimatedNumber value={parseFloat(results.margin)} prefix="" decimals={1} />%
                  </div>
                  <div className="cc-result-sub">
                    {parseFloat(results.margin) >= 30 ? '✅ Healthy margin' : parseFloat(results.margin) >= 0 ? '⚠️ Low margin' : '❌ Negative margin'}
                  </div>
                  <svg className="cc-radial-svg" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="24" fill="none" stroke="#E8F5E9" strokeWidth="6" />
                    <circle
                      cx="30" cy="30" r="24" fill="none"
                      stroke={parseFloat(results.margin) >= 30 ? '#43A047' : parseFloat(results.margin) >= 0 ? '#FFD54F' : '#EF5350'}
                      strokeWidth="6"
                      strokeDasharray={`${Math.min(Math.abs(parseFloat(results.margin)), 100) * 1.508} 150.8`}
                      strokeLinecap="round"
                      transform="rotate(-90 30 30)"
                    />
                  </svg>
                </div>
              </div>
            </section>
          )}

          {/* ═══ CHARTS ══════════════════════════════════ */}
          <div className="cc-charts-grid">
            <Card className="cc-chart-section">
              <div className="cc-card-header">
                <div className="cc-card-title-group">
                  <span className="cc-card-icon-bg">🥧</span>
                  <div>
                    <h2 className="cc-card-title">Expense Breakdown</h2>
                    <p className="cc-card-desc">Visual distribution of all farming costs</p>
                  </div>
                </div>
              </div>
              <PieChart expenses={expenses} />
            </Card>

            <Card className="cc-chart-section">
              <div className="cc-card-header">
                <div className="cc-card-title-group">
                  <span className="cc-card-icon-bg">📈</span>
                  <div>
                    <h2 className="cc-card-title">Monthly Cost Trend</h2>
                    <p className="cc-card-desc">Cost vs revenue distribution — FY 2024-25</p>
                  </div>
                </div>
                <select className="cc-mini-select">
                  <option>FY 2024-25</option>
                  <option>FY 2023-24</option>
                </select>
              </div>
              <LineChart data={MONTHLY_TREND} />
            </Card>
          </div>

          {/* ═══ AI RECOMMENDATIONS ══════════════════════ */}
          <section className="cc-ai-section">
            <div className="cc-section-header">
              <h2 className="cc-section-title">🤖 AI Recommendations</h2>
              <span className="cc-section-badge cc-badge--ai">✨ Powered by Gemini</span>
            </div>
            <div className="cc-ai-grid">
              {AI_RECOMMENDATIONS.map((rec) => (
                <div key={rec.id} className={`cc-ai-card cc-ai-card--${rec.type}`}>
                  <div className="cc-ai-card-top">
                    <span className="cc-ai-icon">{rec.icon}</span>
                    <span className={`cc-ai-badge cc-ai-badge--${rec.type}`}>{rec.badge}</span>
                  </div>
                  <h3 className="cc-ai-title">{rec.title}</h3>
                  <p className="cc-ai-desc">{rec.desc}</p>
                  <Button variant="outline" text="Learn More →" className="cc-ai-learn-btn" />
                </div>
              ))}
            </div>
          </section>

          {/* ═══ RECENT CALCULATIONS TABLE ═══════════════ */}
          <Card className="cc-table-section">
            <div className="cc-card-header">
              <div className="cc-card-title-group">
                <span className="cc-card-icon-bg">🗂️</span>
                <div>
                  <h2 className="cc-card-title">Recent Calculations</h2>
                  <p className="cc-card-desc">Your last 5 farming cost calculations</p>
                </div>
              </div>
              <Button variant="outline" text="View All →" className="cc-view-all-btn" />
            </div>
            <div className="cc-table-wrap">
              <table className="cc-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Crop</th>
                    <th>Area</th>
                    <th>Investment</th>
                    <th>Revenue</th>
                    <th>Profit</th>
                    <th>ROI</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_CALCULATIONS.map((row, i) => (
                    <tr key={row.id} className="cc-table-row">
                      <td className="cc-td-num">{i + 1}</td>
                      <td className="cc-td-crop">{row.crop}</td>
                      <td>{row.area}</td>
                      <td className="cc-td-inv">{row.investment}</td>
                      <td className="cc-td-rev">{row.revenue}</td>
                      <td className="cc-td-profit">{row.profit}</td>
                      <td>
                        <span
                          className="cc-roi-pill"
                          style={{ '--roi-color': row.profitPct > 80 ? '#43A047' : row.profitPct > 50 ? '#F9A825' : '#FF7043' }}
                        >
                          {row.profitPct}%
                        </span>
                      </td>
                      <td className="cc-td-date">{row.date}</td>
                      <td>
                        <Button variant="outline" icon="👁️" size="small" className="cc-table-action-btn" title="View Details" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* ═══ FOOTER ══════════════════════════════════ */}
          <Footer />

        </main>
      </div>
    </div>
  );
}
