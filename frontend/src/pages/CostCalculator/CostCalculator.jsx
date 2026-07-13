import React, { useState, useEffect, useRef, useCallback } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
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
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
      else prevValueRef.current = end;
    };
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [value]);

  const formatted = displayValue.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <span>{prefix}{formatted}</span>;
}

function PieChart({ expenses }) {
  const total = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  if (total === 0) return <div className="cc-pie-empty"><span>🌾</span><p>Enter expense values to see the breakdown chart</p></div>;

  let cumulativeAngle = -90;
  const radius = 80, cx = 110, cy = 110;

  const segments = EXPENSE_FIELDS.map(({ key, label, color }) => {
    const val = parseFloat(expenses[key]) || 0;
    if (val === 0) return null;
    const pct = (val / total) * 100;
    const angle = (val / total) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    const toRad = (deg) => (deg * Math.PI) / 180;
    const x1 = cx + radius * Math.cos(toRad(startAngle)), y1 = cy + radius * Math.sin(toRad(startAngle));
    const x2 = cx + radius * Math.cos(toRad(endAngle)), y2 = cy + radius * Math.sin(toRad(endAngle));
    const largeArc = angle > 180 ? 1 : 0;
    const pathD = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { key, label, color, pct, val, pathD };
  }).filter(Boolean);

  return (
    <div className="cc-pie-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      <svg viewBox="0 0 220 220" style={{ width: '220px', height: '220px' }}>
        {segments.map((s) => (
          <path key={s.key} d={s.pathD} fill={s.color}><title>{s.label}: ₹{s.val.toLocaleString('en-IN')} ({s.pct.toFixed(1)}%)</title></path>
        ))}
        <circle cx={cx} cy={cy} r={52} fill="white" />
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="#78909C">Total</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="16" fill="#1B5E20" fontWeight="700">₹{total >= 1000 ? `${(total / 1000).toFixed(0)}K` : total}</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {segments.map((s) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color }} />
            <span style={{ flex: 1 }}>{s.label}</span>
            <span style={{ fontWeight: 'bold' }}>{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChart({ data }) {
  const W = 580, H = 200, pad = { top: 20, right: 20, bottom: 38, left: 52 };
  const iW = W - pad.left - pad.right, iH = H - pad.top - pad.bottom;
  const allValues = data.flatMap((d) => [d.cost, d.revenue]);
  const maxVal = Math.max(...allValues, 1);
  const xStep = iW / (data.length - 1);
  const yS = (v) => iH - (v / maxVal) * iH;

  const costPts = data.map((d, i) => `${pad.left + i * xStep},${pad.top + yS(d.cost)}`).join(' ');
  const revPts = data.map((d, i) => `${pad.left + i * xStep},${pad.top + yS(d.revenue)}`).join(' ');
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(maxVal * f));

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: '500px' }}>
        <defs>
          <linearGradient id="lg-cost" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF5350" stopOpacity="0.25" /><stop offset="100%" stopColor="#EF5350" stopOpacity="0" /></linearGradient>
          <linearGradient id="lg-rev" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#43A047" stopOpacity="0.25" /><stop offset="100%" stopColor="#43A047" stopOpacity="0" /></linearGradient>
        </defs>
        {yTicks.map((t, i) => {
          const y = pad.top + yS(t);
          return (
            <g key={i}>
              <line x1={pad.left} y1={y} x2={pad.left + iW} y2={y} stroke="#E8F5E9" />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize="9" fill="#90A4AE">{t >= 1000 ? `${(t / 1000).toFixed(0)}K` : t}</text>
            </g>
          );
        })}
        {data.map((d, i) => <text key={i} x={pad.left + i * xStep} y={H - 8} textAnchor="middle" fontSize="9" fill="#90A4AE">{d.month}</text>)}
        <polygon points={`${pad.left},${pad.top + iH} ${costPts} ${pad.left + (data.length - 1) * xStep},${pad.top + iH}`} fill="url(#lg-cost)" />
        <polygon points={`${pad.left},${pad.top + iH} ${revPts} ${pad.left + (data.length - 1) * xStep},${pad.top + iH}`} fill="url(#lg-rev)" />
        <polyline points={costPts} fill="none" stroke="#EF5350" strokeWidth="2.5" />
        <polyline points={revPts} fill="none" stroke="#43A047" strokeWidth="2.5" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={pad.left + i * xStep} cy={pad.top + yS(d.cost)} r="3.5" fill="white" stroke="#EF5350" strokeWidth="2" />
            {d.revenue > 0 && <circle cx={pad.left + i * xStep} cy={pad.top + yS(d.revenue)} r="3.5" fill="white" stroke="#43A047" strokeWidth="2" />}
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '10px', fontSize: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF5350' }}/> Monthly Cost</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#43A047' }}/> Monthly Revenue</span>
      </div>
    </div>
  );
}

export default function CostCalculator() {
  const [collapsed, setCollapsed] = useState(false);
  const [formData, setFormData] = useState({ crop: 'wheat', landArea: '', areaUnit: 'Acres', soilType: 'Alluvial', irrigationType: 'Drip', expectedYield: '', marketPrice: '', yieldUnit: 'Quintals' });
  const [expenses, setExpenses] = useState({ seed: '', fertilizer: '', pesticide: '', machinery: '', labor: '', irrigation: '', transportation: '', miscellaneous: '' });
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [notification, setNotification] = useState(null);

  const selectedCrop = CROPS.find((c) => c.value === formData.crop);

  const showNotification = useCallback((msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); }, []);
  const handleFormChange = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleExpenseChange = (key, value) => setExpenses((prev) => ({ ...prev, [key]: value }));
  const handleCropChange = (value) => {
    const crop = CROPS.find((c) => c.value === value);
    setFormData((prev) => ({ ...prev, crop: value, marketPrice: crop ? String(crop.avgPrice) : prev.marketPrice }));
  };

  const handleCalculate = () => {
    const totalExpenses = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);
    const revenue = (parseFloat(formData.expectedYield) || 0) * (parseFloat(formData.marketPrice) || 0);
    const profit = revenue - totalExpenses;
    setResults({ totalExpenses, revenue, profit, margin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0.0' });
    setHasCalculated(true); setIsSaved(false);
    showNotification('Calculation completed successfully!', 'success');
  };

  const handleReset = () => {
    setFormData({ crop: 'wheat', landArea: '', areaUnit: 'Acres', soilType: 'Alluvial', irrigationType: 'Drip', expectedYield: '', marketPrice: '', yieldUnit: 'Quintals' });
    setExpenses({ seed: '', fertilizer: '', pesticide: '', machinery: '', labor: '', irrigation: '', transportation: '', miscellaneous: '' });
    setResults(null); setHasCalculated(false); setIsSaved(false);
    showNotification('Form has been reset.', 'info');
  };

  const handleSave = async () => {
    if (!hasCalculated) return showNotification('Please calculate first before saving.', 'warning');
    try {
      const otherExpenses = (parseFloat(expenses.pesticide) || 0) + (parseFloat(expenses.transportation) || 0) + (parseFloat(expenses.miscellaneous) || 0);
      const res = await saveCalculationApi({
        cropName: formData.crop, landArea: parseFloat(formData.landArea) || 1,
        seedCost: parseFloat(expenses.seed) || 0, fertilizerCost: parseFloat(expenses.fertilizer) || 0,
        labourCost: parseFloat(expenses.labor) || 0, machineryCost: parseFloat(expenses.machinery) || 0,
        irrigationCost: parseFloat(expenses.irrigation) || 0, otherCost: otherExpenses, totalCost: results.totalExpenses,
        expectedYield: parseFloat(formData.expectedYield) || 0, expectedRevenue: results.revenue || 0,
        expectedProfit: results.profit || 0, season: formData.irrigationType || "", cropVariety: formData.soilType || "",
      });
      if (res.data?.success) { setIsSaved(true); showNotification('Calculation saved successfully to MongoDB!', 'success'); }
    } catch (err) { showNotification('Failed to save calculation to backend.', 'error'); }
  };

  useEffect(() => {
    if (formData.landArea && selectedCrop) {
      setFormData((prev) => ({ ...prev, expectedYield: String(Math.round(selectedCrop.avgYield * (parseFloat(formData.landArea) || 1))), marketPrice: String(selectedCrop.avgPrice) }));
    }
  }, [formData.landArea, formData.crop, selectedCrop]);

  const totalExpenses = Object.values(expenses).reduce((s, v) => s + (parseFloat(v) || 0), 0);

  return (
    <div className="skm-root">
      {notification && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', background: notification.type === 'error' ? '#f44336' : notification.type === 'warning' ? '#FF9800' : '#4CAF50', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 9999 }}>
          {notification.msg}
        </div>
      )}

      <Navbar user={{ name: 'OM', role: 'Farmer' }} onToggleSidebar={() => setCollapsed(!collapsed)} notificationSlot={<NotificationBell notifications={[]} />} />

      <div className="skm-layout">
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} activeItem="calculator" />

        <main className="skm-main">
          <div className="skm-content-area">
            {/* HERO */}
            <section className="skm-welcome-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="skm-text-muted" style={{ fontSize: '12px' }}>Dashboard / Cost Calculator</div>
                <h1 className="skm-title" style={{ fontSize: '28px', margin: 0 }}>🌾 Smart Farming Cost Calculator</h1>
                <p className="skm-text-muted" style={{ margin: '8px 0', fontSize: '13px' }}>Estimate your cultivation expenses, expected revenue, and farming profit with an easy-to-use smart calculator.</p>
              </div>
            </section>

            {/* STATS */}
            <div className="skm-grid" style={{ marginBottom: '24px' }}>
              {[
                { label: 'Season Budget', value: '₹2.4L', icon: '💰', trend: '+12%', up: true },
                { label: 'Avg Profit / Acre', value: '₹8,200', icon: '📈', trend: '+5%', up: true },
                { label: 'Active Crops', value: '4', icon: '🌾', trend: 'Stable', up: true },
                { label: 'Loan Utilization', value: '68%', icon: '🏦', trend: '-3%', up: false },
              ].map((s, i) => (
                <div key={i} className="skm-stat-card">
                  <div className="skm-stat-header">
                    <span className="skm-stat-label">{s.label}</span>
                    <span className="skm-stat-icon" style={{ background: '#F5F5F5' }}>{s.icon}</span>
                  </div>
                  <div className="skm-stat-value">{s.value}</div>
                  <div className="skm-stat-footer">
                    <span className={`skm-stat-trend ${s.up ? 'positive' : 'negative'}`}>{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* FORM */}
            <div className="skm-card" style={{ marginBottom: '24px' }}>
              <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2 className="skm-section-title">🌿 Crop & Field Details</h2>
                  <p className="skm-text-muted" style={{ fontSize: '12px', margin: 0 }}>Select your crop, land size, and farming method</p>
                </div>
              </div>
              <div className="skm-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Crop Selection</label>
                  <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={formData.crop} onChange={(e) => handleCropChange(e.target.value)}>
                    {CROPS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {selectedCrop && <span className="skm-text-muted" style={{ fontSize: '11px' }}>Avg Yield: {selectedCrop.avgYield} Q/Acre · MSP: ₹{selectedCrop.avgPrice}/Q</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Land Area</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" style={{ flex: 1, padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={formData.landArea} onChange={(e) => handleFormChange('landArea', e.target.value)} />
                    <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px', background: '#f5f5f5' }} value={formData.areaUnit} onChange={(e) => handleFormChange('areaUnit', e.target.value)}>{AREA_UNITS.map((u) => <option key={u}>{u}</option>)}</select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Soil Type</label>
                  <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={formData.soilType} onChange={(e) => handleFormChange('soilType', e.target.value)}>{SOIL_TYPES.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Irrigation Type</label>
                  <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={formData.irrigationType} onChange={(e) => handleFormChange('irrigationType', e.target.value)}>{IRRIGATION_TYPES.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
              </div>
            </div>

            <div className="skm-card" style={{ marginBottom: '24px' }}>
              <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2 className="skm-section-title">💰 Expense Breakdown</h2>
                  <p className="skm-text-muted" style={{ fontSize: '12px', margin: 0 }}>Enter all farming costs in INR (₹)</p>
                </div>
              </div>
              <div className="skm-grid">
                {EXPENSE_FIELDS.map(({ key, label, icon, placeholder }) => (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>{icon} {label}</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--skm-border)', borderRadius: '8px', padding: '0 8px' }}>
                      <span className="skm-text-muted">₹</span>
                      <input type="number" style={{ flex: 1, padding: '8px', border: 'none', outline: 'none', background: 'transparent' }} placeholder={placeholder} value={expenses[key]} onChange={(e) => handleExpenseChange(key, e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '16px', padding: '12px', background: '#F5F5F5', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>Total Expenses</span>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#c62828' }}>₹{totalExpenses.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="skm-card" style={{ marginBottom: '24px' }}>
              <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2 className="skm-section-title">📊 Yield & Revenue</h2>
                </div>
              </div>
              <div className="skm-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Expected Yield</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="number" style={{ flex: 1, padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={formData.expectedYield} onChange={(e) => handleFormChange('expectedYield', e.target.value)} />
                    <select style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px', background: '#f5f5f5' }} value={formData.yieldUnit} onChange={(e) => handleFormChange('yieldUnit', e.target.value)}>{YIELD_UNITS.map((u) => <option key={u}>{u}</option>)}</select>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Market Price (₹)</label>
                  <input type="number" style={{ padding: '8px', border: '1px solid var(--skm-border)', borderRadius: '8px' }} value={formData.marketPrice} onChange={(e) => handleFormChange('marketPrice', e.target.value)} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Estimated Gross Revenue</label>
                  <div style={{ padding: '8px', background: '#E8F5E9', borderRadius: '8px', color: '#2E7D32', fontWeight: 900, fontSize: '16px' }}>
                    ₹{((parseFloat(formData.expectedYield) || 0) * (parseFloat(formData.marketPrice) || 0)).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button className="skm-action-btn" onClick={handleCalculate}>🧮 Calculate</button>
                <button className="skm-action-btn" style={{ background: '#E3F2FD', color: '#1565C0' }} onClick={handleSave}>{isSaved ? '✅ Saved!' : '💾 Save'}</button>
                <button className="skm-action-btn" style={{ background: 'transparent', border: '1px solid var(--skm-border)', color: 'var(--skm-text-main)' }} onClick={handleReset}>🔄 Reset</button>
              </div>
            </div>

            {hasCalculated && results && (
              <div className="skm-section" style={{ marginBottom: '24px' }}>
                <h2 className="skm-section-title" style={{ marginBottom: '16px' }}>📈 Calculation Results</h2>
                <div className="skm-grid">
                  <div className="skm-stat-card" style={{ borderLeft: '4px solid #f44336' }}>
                    <div className="skm-stat-header"><span className="skm-stat-label">Total Investment</span><span className="skm-stat-icon">💰</span></div>
                    <div className="skm-stat-value"><AnimatedNumber value={results.totalExpenses} /></div>
                  </div>
                  <div className="skm-stat-card" style={{ borderLeft: '4px solid #2196F3' }}>
                    <div className="skm-stat-header"><span className="skm-stat-label">Expected Revenue</span><span className="skm-stat-icon">📈</span></div>
                    <div className="skm-stat-value"><AnimatedNumber value={results.revenue} /></div>
                  </div>
                  <div className="skm-stat-card" style={{ borderLeft: `4px solid ${results.profit >= 0 ? '#4CAF50' : '#f44336'}` }}>
                    <div className="skm-stat-header"><span className="skm-stat-label">Estimated {results.profit >= 0 ? 'Profit' : 'Loss'}</span><span className="skm-stat-icon">{results.profit >= 0 ? '🎯' : '⚠️'}</span></div>
                    <div className="skm-stat-value"><AnimatedNumber value={Math.abs(results.profit)} /></div>
                  </div>
                  <div className="skm-stat-card">
                    <div className="skm-stat-header"><span className="skm-stat-label">Profit Margin</span><span className="skm-stat-icon">📉</span></div>
                    <div className="skm-stat-value">{results.margin}%</div>
                  </div>
                </div>
              </div>
            )}

            <div className="skm-dual-row" style={{ marginBottom: '24px' }}>
              <div className="skm-card">
                <h2 className="skm-section-title" style={{ marginBottom: '16px' }}>Expense Breakdown</h2>
                <PieChart expenses={expenses} />
              </div>
              <div className="skm-card">
                <h2 className="skm-section-title" style={{ marginBottom: '16px' }}>Monthly Cost Trend</h2>
                <LineChart data={MONTHLY_TREND} />
              </div>
            </div>

            <div className="skm-section" style={{ marginBottom: '24px' }}>
              <div className="skm-section-header" style={{ marginBottom: '16px' }}>
                <h2 className="skm-section-title">🤖 AI Recommendations</h2>
                <span className="skm-badge" style={{ background: '#E1BEE7', color: '#4A148C' }}>✨ Powered by Gemini</span>
              </div>
              <div className="skm-grid">
                {AI_RECOMMENDATIONS.map(rec => (
                  <div key={rec.id} className="skm-preview-item" style={{ gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{rec.icon}</span>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{rec.title}</div>
                      <p className="skm-text-muted" style={{ fontSize: '12px', margin: '4px 0 0 0' }}>{rec.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="skm-table-card">
              <div className="skm-section-header" style={{ padding: '16px' }}>
                <h2 className="skm-section-title">🗂️ Recent Calculations</h2>
              </div>
              <table className="skm-table">
                <thead>
                  <tr><th>Crop</th><th>Area</th><th>Investment</th><th>Revenue</th><th>Profit</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {RECENT_CALCULATIONS.map(row => (
                    <tr key={row.id}>
                      <td>{row.crop}</td><td>{row.area}</td><td style={{ color: '#c62828', fontWeight: 600 }}>{row.investment}</td>
                      <td style={{ color: '#2E7D32', fontWeight: 600 }}>{row.revenue}</td><td style={{ fontWeight: 800 }}>{row.profit}</td>
                      <td className="skm-text-muted">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
