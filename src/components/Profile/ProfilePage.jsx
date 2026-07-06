import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateProfile as updateProfileApi } from '../../services/profileService';
import { getTransactions } from '../../services/transactionService';
import { getDashboardSummary } from '../../services/dashboardService';
import { RECENT_ACTIVITIES } from './profileData';

// ── Reusable UI Components ────────────────────────────────────────────────────
import Button from '../Button/Button';
import Card   from '../Card/Card';
import Modal  from '../Modal/Modal';

import '../../pages/Profile/Profile.css';
import './ProfilePage.css';

const TABS = [
  { id: 'overview',      label: 'Overview',      icon: '👤' },
  { id: 'transactions',  label: 'Transactions',  icon: '📜' },
  { id: 'activity',      label: 'Activity',      icon: '⏱️' },
  { id: 'reviews',       label: 'Reviews',       icon: '⭐' },
  { id: 'settings',      label: 'Settings',      icon: '⚙️' },
];

const SHORTCUTS = [
  { title: 'Smart Calculator', desc: 'Predict sowing costs and expected ROI',          path: '/calculator',     icon: '🧮' },
  { title: 'Crop Library',     desc: 'Read pest guidelines and irrigation schedules',  path: '/crop-knowledge', icon: '📚' },
  { title: 'Messages',         desc: 'Chat directly with mandi buyers and vendors',    path: '/messages',       icon: '💬' },
  { title: 'Log Invoices',     desc: 'Inspect receipt details and transaction audits', path: '/transactions',   icon: '📜' },
];

export default function ProfilePage({ role }) {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuth();

  // ── Active Tab State ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');

  // ── Edit Mode States ─────────────────────────────────────────────────────────
  const [isEditing,    setIsEditing]    = useState(false);
  const [personalForm, setPersonalForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    state: '',
    district: '',
    village: '',
    preferredLanguage: 'English'
  });
  const [roleForm,     setRoleForm]     = useState({
    farmSize: '',
    soilType: '',
    cropsGrown: ''
  });

  // ── Settings Toggles State ───────────────────────────────────────────────────
  const [settings, setSettings] = useState({
    emailNotif:    true,
    smsNotif:      true,
    profilePublic: true,
    allowAiCalls:  true,
  });

  // ── UI Overlay States ────────────────────────────────────────────────────────
  const [notification,    setNotification]    = useState(null);
  const [isSaving,        setIsSaving]        = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // ── Dynamic data states ──
  const [recentTx, setRecentTx] = useState([]);
  const [stats, setStats] = useState({
    totalCrops: 0,
    earnings: 0,
    activeListings: 0,
    completedDeals: 0
  });

  // ── Sync user to form state ──
  useEffect(() => {
    if (user) {
      setPersonalForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        state: user.state || '',
        district: user.district || '',
        village: user.village || '',
        preferredLanguage: user.preferredLanguage || 'English',
      });
      setRoleForm({
        farmSize: user.farmSize || '',
        soilType: user.soilType || '',
        cropsGrown: user.cropsGrown?.join(', ') || '',
      });
      setSettings({
        emailNotif: user.notificationSettings?.emailAlerts ?? true,
        smsNotif: user.notificationSettings?.smsAlerts ?? true,
        profilePublic: true,
        allowAiCalls: user.notificationSettings?.weatherAlerts ?? true,
      });
    }
  }, [user]);

  // ── Fetch dynamic profile stats and transactions on tab switch ──
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [txRes, sumRes] = await Promise.allSettled([
          getTransactions({ limit: 5 }),
          getDashboardSummary()
        ]);

        if (txRes.status === "fulfilled" && txRes.value.data?.success) {
          setRecentTx(txRes.value.data.transactions);
        }

        if (sumRes.status === "fulfilled" && sumRes.value.data?.success) {
          const d = sumRes.value.data.data;
          setStats({
            totalCrops: d.totalListings,
            earnings: d.totalRevenue,
            activeListings: d.totalListings,
            completedDeals: d.totalSales
          });
        }
      } catch (err) {
        console.error("Error loading profile stats:", err);
      }
    };
    fetchProfileData();
  }, [activeTab]);

  // ── Toast Alert Helper ───────────────────────────────────────────────────────
  const showToast = useCallback((msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // ── Input Change Handlers ───────────────────────────────────────────────────
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleRoleChange = (e) => {
    const { name, value } = e.target;
    setRoleForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Profile Updates ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: personalForm.fullName,
        phone: personalForm.phone,
        address: personalForm.address,
        state: personalForm.state,
        district: personalForm.district,
        village: personalForm.village,
        preferredLanguage: personalForm.preferredLanguage,
        farmSize: roleForm.farmSize,
        soilType: roleForm.soilType,
        cropsGrown: roleForm.cropsGrown ? roleForm.cropsGrown.split(',').map((c) => c.trim()) : [],
        notificationSettings: {
          emailAlerts: settings.emailNotif,
          smsAlerts: settings.smsNotif,
          weatherAlerts: settings.allowAiCalls,
        },
      };

      const response = await updateProfileApi(payload);
      if (response.data?.success) {
        updateProfile(response.data.user);
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Error updating profile details.';
      showToast(errMsg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Toggles Save ─────────────────────────────────────────────────────────────
  const handleSettingToggle = async (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    setSettings(updatedSettings);

    try {
      const payload = {
        notificationSettings: {
          emailAlerts: updatedSettings.emailNotif,
          smsAlerts: updatedSettings.smsNotif,
          weatherAlerts: updatedSettings.allowAiCalls,
        },
      };
      const response = await updateProfileApi(payload);
      if (response.data?.success) {
        updateProfile(response.data.user);
        showToast('Preference updated.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update preference.', 'error');
    }
  };

  // ── Logout Handler ───────────────────────────────────────────────────────────
  const handleLogout = async () => {
    showToast('Logging out… redirecting.', 'info');
    await logout();
    setTimeout(() => navigate('/login'), 1000);
  };

  const handleConfirmDelete = async () => {
    setDeleteModalOpen(false);
    showToast('Simulating account deletion... redirecting.', 'info');
    await logout();
    setTimeout(() => navigate('/register'), 1500);
  };

  // ─── TAB CONTENT RENDERERS ────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="pp-tab-content pp-tab-content--overview">
      {/* Card 1: Personal Details */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">👤</span>
            <div>
              <h2 className="pp-section-title">Personal Details</h2>
              <p className="pp-section-sub">Your contact and identity information</p>
            </div>
          </div>
          {!isEditing && (
            <Button text="Edit" variant="outline" size="small" onClick={() => setIsEditing(true)} />
          )}
        </div>

        <div className="pp-info-grid">
          {isEditing ? (
            <>
              {[
                { label: 'Full Name',       name: 'fullName', val: personalForm.fullName || '' },
                { label: 'Phone Number',    name: 'phone',    val: personalForm.phone || '' },
                { label: 'Email Address',   name: 'email',    val: personalForm.email || '' },
                { label: 'Primary Address', name: 'address',  val: personalForm.address || '' },
                { label: 'State',           name: 'state',    val: personalForm.state || '' },
                { label: 'District',        name: 'district', val: personalForm.district || '' },
                { label: 'Village',         name: 'village',  val: personalForm.village || '' },
                { label: 'Language',        name: 'preferredLanguage', val: personalForm.preferredLanguage || '' },
              ].map(({ label, name, val }) => (
                <div key={name} className="pp-field">
                  <label className="pp-label">{label}</label>
                  <input className="pp-input" name={name} value={val} onChange={handlePersonalChange} />
                </div>
              ))}
              <div className="pp-edit-actions">
                <Button text="Cancel"       variant="outline" size="small" onClick={() => setIsEditing(false)} />
                <Button text="💾 Save"      variant="primary" size="small" loading={isSaving} onClick={handleSaveProfile} />
              </div>
            </>
          ) : (
            [
              { label: 'Full Name',       val: personalForm.fullName || user?.fullName },
              { label: 'Phone Number',    val: personalForm.phone || user?.phone },
              { label: 'Email Address',   val: personalForm.email || user?.email },
              { label: 'Primary Address', val: personalForm.address || 'Not Provided' },
              { label: 'State',           val: personalForm.state || 'Not Provided' },
              { label: 'District',        val: personalForm.district || 'Not Provided' },
              { label: 'Village',         val: personalForm.village || 'Not Provided' },
              { label: 'Language',        val: personalForm.preferredLanguage || 'English' },
            ].map(({ label, val }) => (
              <div key={label} className="pp-info-item">
                <span className="pp-info-label">{label}</span>
                <span className="pp-info-value">{val}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Card 2: Role Details (Farmer/Vendor/Customer specific) */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">🏷️</span>
            <div>
              <h2 className="pp-section-title">{user?.role || "User"} Details</h2>
              <p className="pp-section-sub">Role-specific verification and profile settings</p>
            </div>
          </div>
        </div>

        <div className="pp-role-grid">
          {isEditing ? (
            Object.keys(roleForm).map((key) => (
              <div key={key} className="pp-field">
                <label className="pp-label" style={{ textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                <input className="pp-input" name={key} value={roleForm[key]} onChange={handleRoleChange} />
              </div>
            ))
          ) : (
            Object.keys(roleForm).map((key) => (
              <div key={key} className="pp-role-item">
                <span className="pp-role-label">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="pp-role-value">{roleForm[key] || 'Not Provided'}</span>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Card 3: Quick Navigation Shortcuts */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">🚀</span>
            <div>
              <h2 className="pp-section-title">Quick Navigation</h2>
              <p className="pp-section-sub">Fast access to utilities and dashboard pages</p>
            </div>
          </div>
        </div>
        <div className="pp-shortcuts-grid">
          {SHORTCUTS.map((item, i) => (
            <div
              key={i}
              className="pp-shortcut-item"
              onClick={() => navigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(item.path)}
            >
              <div className="pp-shortcut-icon">{item.icon}</div>
              <div className="pp-shortcut-text">
                <div className="pp-shortcut-title">{item.title}</div>
                <div className="pp-shortcut-desc">{item.desc}</div>
              </div>
              <span className="pp-shortcut-arrow">→</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderTransactions = () => (
    <div className="pp-tab-content pp-tab-content--transactions">
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">📜</span>
            <div>
              <h2 className="pp-section-title">Recent Transactions</h2>
              <p className="pp-section-sub">Audit trail of transactions and purchase invoices</p>
            </div>
          </div>
          <Button
            text="View Full Ledger"
            variant="outline"
            size="small"
            onClick={() => navigate('/transactions')}
          />
        </div>

        <div className="pp-txn-table">
          <div className="pp-txn-table-head">
            <span>Item</span>
            <span>Date</span>
            <span>Invoice No</span>
            <span className="pp-txn-col-right">Amount</span>
            <span className="pp-txn-col-right">Status</span>
          </div>
          {recentTx.length === 0 ? (
            <div className="pp-empty-state">
              <span>📭</span>
              <p>No transactions recorded yet</p>
            </div>
          ) : (
            recentTx.map((txn) => (
              <div key={txn._id} className="pp-txn-row">
                <div className="pp-txn-item-cell">
                  <span className="pp-txn-emoji">🌾</span>
                  <span className="pp-txn-name">{txn.cropName}</span>
                </div>
                <span className="pp-txn-date">{new Date(txn.createdAt).toLocaleDateString()}</span>
                <span className="pp-txn-id">{txn.invoiceNumber}</span>
                <span className="pp-txn-amt pp-txn-col-right">₹{txn.totalAmount.toLocaleString()}</span>
                <div className="pp-txn-col-right">
                  <span className={`pp-status-pill pp-status--${txn.deliveryStatus.toLowerCase()}`}>
                    {txn.deliveryStatus}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );

  const renderActivity = () => (
    <div className="pp-tab-content pp-tab-content--activity">
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">⏱️</span>
            <div>
              <h2 className="pp-section-title">Recent Activity</h2>
              <p className="pp-section-sub">Chronological audit log of dashboard events</p>
            </div>
          </div>
        </div>

        <div className="pp-timeline">
          {RECENT_ACTIVITIES.map((act, i) => (
            <div key={act.id} className="pp-timeline-item">
              <div className="pp-timeline-left">
                <div className="pp-timeline-dot">{act.icon}</div>
                {i < RECENT_ACTIVITIES.length - 1 && <div className="pp-timeline-line" />}
              </div>
              <div className="pp-timeline-body">
                <div className="pp-timeline-action">{act.action}</div>
                <div className="pp-timeline-time">{act.time}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderReviews = () => (
    <div className="pp-tab-content pp-tab-content--reviews">
      {/* Feedback Card */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">⭐</span>
            <div>
              <h2 className="pp-section-title">Customer Feedback</h2>
              <p className="pp-section-sub">Ratings and testimonial reviews submitted by clients</p>
            </div>
          </div>
        </div>

        <div className="pp-empty-state">
          <span>💬</span>
          <p>No feedback reviews recorded yet</p>
        </div>
      </Card>

      {/* Badges Card */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">🏆</span>
            <div>
              <h2 className="pp-section-title">Certifications &amp; Badges</h2>
              <p className="pp-section-sub">Platform achievements and community levels earned</p>
            </div>
          </div>
        </div>
        <div className="pp-badges-grid">
          {[
            { name: '🌱 Verified Member', desc: 'Active account on platform' },
            { name: '🏆 Eco-Farmer', desc: 'Promoting organic farming solutions' }
          ].map((badge, i) => (
            <div key={i} className="pp-badge-card" title={badge.desc}>
              <span className="pp-badge-name">{badge.name}</span>
              <span className="pp-badge-desc">{badge.desc}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="pp-tab-content pp-tab-content--settings">
      {/* Notifications Card */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">🔔</span>
            <div>
              <h2 className="pp-section-title">Notifications &amp; Privacy</h2>
              <p className="pp-section-sub">Manage alerts, notifications, and profile visibility</p>
            </div>
          </div>
        </div>

        <div className="pp-toggle-list">
          {[
            { key: 'emailNotif',    label: 'Email transactional receipts',     desc: 'Send digital receipts and invoice copies directly' },
            { key: 'smsNotif',      label: 'SMS price alert notifications',     desc: 'Get fast local mandi alerts on crop price changes' },
            { key: 'allowAiCalls',  label: 'Enable AI rotation suggestions',    desc: 'Receive AI smart-farm crop advisory tips' },
          ].map((s) => (
            <div key={s.key} className="pp-toggle-row">
              <div className="pp-toggle-text">
                <span className="pp-toggle-label">{s.label}</span>
                <span className="pp-toggle-desc">{s.desc}</span>
              </div>
              <button
                className={`pp-toggle-switch ${settings[s.key] ? 'on' : 'off'}`}
                onClick={() => handleSettingToggle(s.key)}
                aria-label={`Toggle ${s.label}`}
              >
                <div className="pp-toggle-dot" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Security Actions Card */}
      <Card hover={false} shadow={true} rounded={true} className="pp-section-card">
        <div className="pp-section-header">
          <div className="pp-section-title-group">
            <span className="pp-section-icon">🔐</span>
            <div>
              <h2 className="pp-section-title">Account Actions</h2>
              <p className="pp-section-sub">Security logins and profile access controls</p>
            </div>
          </div>
        </div>

        <div className="pp-account-actions">
          <div className="pp-action-row">
            <div className="pp-action-info">
              <span className="pp-action-title">🔑 Change Password</span>
              <span className="pp-action-desc">Update your current security code credentials</span>
            </div>
            <Button
              text="Update Password"
              variant="outline"
              size="small"
              onClick={() => showToast('Password reset email sent (UI stub).', 'success')}
            />
          </div>

          <div className="pp-action-row pp-action-row--logout">
            <div className="pp-action-info">
              <span className="pp-action-title">🚪 Sign Out</span>
              <span className="pp-action-desc">Log out of your session on this device</span>
            </div>
            <Button
              text="Logout"
              variant="secondary"
              size="small"
              onClick={handleLogout}
            />
          </div>

          <div className="pp-action-row pp-action-row--danger">
            <div className="pp-action-info">
              <span className="pp-action-title">🗑️ Delete Account</span>
              <span className="pp-action-desc">Irreversibly delete your profile, listings, and trade audits</span>
            </div>
            <Button
              text="Delete Account"
              variant="danger"
              size="small"
              onClick={() => setDeleteModalOpen(true)}
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const tabContentMap = {
    overview:     renderOverview(),
    transactions: renderTransactions(),
    activity:     renderActivity(),
    reviews:      renderReviews(),
    settings:     renderSettings(),
  };

  const profileStats = [
    { label: 'Crops Listed', value: `${stats.totalCrops} Items`, icon: '🌾', trend: 'From active listings' },
    { label: 'Total Earnings', value: `₹${stats.earnings.toLocaleString()}`, icon: '💰', trend: 'Platform payouts' },
    { label: 'Seller Rating', value: '4.8 / 5', icon: '⭐', trend: 'Verified partner' },
    { label: 'Completed Deals', value: `${stats.completedDeals} Orders`, icon: '📦', trend: '100% fulfillment' },
  ];

  return (
    <div className="pp-root">
      {/* ── Toast notifications ── */}
      {notification && (
        <div className={`pp-toast pp-toast--${notification.type}`}>
          <span className="pp-toast-icon">{notification.type === 'success' ? '✅' : 'ℹ️'}</span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* ── Irreversible Deletion Modal ── */}
      <Modal
        isOpen={deleteModalOpen}
        title="Delete Account"
        variant="delete"
        size="sm"
        onClose={() => setDeleteModalOpen(false)}
        actions={
          <>
            <Button text="Cancel"         variant="outline" onClick={() => setDeleteModalOpen(false)} />
            <Button text="Yes, Delete"    variant="danger"  onClick={handleConfirmDelete} />
          </>
        }
      >
        <p style={{ fontSize: '14.5px', lineHeight: 1.7, color: 'var(--pr-text-mid)' }}>
          This action is <strong>permanent and irreversible</strong>. All your listings,
          transactions, and profile history will be permanently deleted from Smart Krishi Mitra.
        </p>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════════
          BANNER + PROFILE HERO BLOCK
         ═══════════════════════════════════════════════════════════════ */}
      <div className="pp-hero">
        <div
          className="pp-banner"
          style={{ backgroundImage: `url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1000&h=300&fit=crop")` }}
        >
          <button
            className="pp-banner-btn"
            onClick={() => showToast('Cover photo upload triggered.', 'info')}
          >
            📷 Change Cover
          </button>
        </div>

        <div className="pp-profile-card">
          <div className="pp-avatar-wrap">
            <div className="pp-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="" style={{width: '100%', height: '100%', borderRadius: '50%'}} />
              ) : (
                user?.role === "Farmer" ? "👨‍🌾" : (user?.role === "Vendor" ? "🏬" : "🤵")
              )}
            </div>
            <button
              className="pp-avatar-edit-btn"
              title="Change Avatar"
              onClick={() => showToast('Avatar change triggered.', 'info')}
            >
              📷
            </button>
          </div>

          <div className="pp-identity">
            <div className="pp-name-row">
              <h1 className="pp-name">{personalForm.fullName || user?.fullName}</h1>
              <span className="pp-verified-chip">✓ Verified</span>
              <span className={`pp-role-chip pp-role-chip--${(user?.role || 'Farmer').toLowerCase()}`}>
                {user?.role || 'Farmer'}
              </span>
            </div>
            <div className="pp-meta-row">
              <span>📍 {user?.district ? `${user.district}, ${user.state}` : 'Punjab, India'}</span>
              <span className="pp-meta-dot">·</span>
              <span>📅 Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>

          <div className="pp-hero-actions">
            {isEditing ? (
              <>
                <Button text="Cancel"      variant="outline" size="small" onClick={() => setIsEditing(false)} />
                <Button text="💾 Save"     variant="primary" size="small" loading={isSaving} onClick={handleSaveProfile} />
              </>
            ) : (
              <Button text="✏️ Edit Profile" variant="primary" size="small" onClick={() => { setIsEditing(true); setActiveTab('overview'); }} />
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STATISTICS Cards Strip
         ═══════════════════════════════════════════════════════════════ */}
      <div className="pp-stats-strip">
        {profileStats.map((stat, i) => (
          <Card key={i} hover={true} shadow={true} rounded={true} className="pp-stat-card">
            <div className="pp-stat-head">
              <span className="pp-stat-icon">{stat.icon}</span>
              <span className="pp-stat-trend">{stat.trend}</span>
            </div>
            <div className="pp-stat-value">{stat.value}</div>
            <div className="pp-stat-label">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB NAVIGATION BAR
         ═══════════════════════════════════════════════════════════════ */}
      <div className="pp-tab-bar-wrap">
        <nav className="pp-tab-bar" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`pp-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="pp-tab-icon">{tab.icon}</span>
              <span className="pp-tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TAB PANEL AREA
         ═══════════════════════════════════════════════════════════════ */}
      <div className="pp-panel" role="tabpanel">
        {tabContentMap[activeTab]}
      </div>
    </div>
  );
}
