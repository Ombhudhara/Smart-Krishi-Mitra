import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROFILE_DATA, RECENT_ACTIVITIES } from './profileData';

// ── Reusable UI Components ────────────────────────────────────────────────────
import Button from '../Button/Button';
import Card   from '../Card/Card';
import Modal  from '../Modal/Modal';
import Loader from '../Loader/Loader';

import '../../pages/Profile/Profile.css';
import './ProfilePage.css';

// =============================================================================
// ProfilePage.jsx — Redesigned Tabbed Profile Engine  |  Smart Krishi Mitra
// =============================================================================
// Reorganizes components into a clean, tabbed dashboard layout.
// Uses reusable Card, Button, Modal, and Loader components for UI elements.
// =============================================================================

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
  const activeProfile = PROFILE_DATA[role] || PROFILE_DATA.farmer;

  // ── Active Tab State ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('overview');

  // ── Edit Mode States ─────────────────────────────────────────────────────────
  const [isEditing,    setIsEditing]    = useState(false);
  const [personalForm, setPersonalForm] = useState(activeProfile.personal);
  const [roleForm,     setRoleForm]     = useState(activeProfile.roleSpecific);

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

  // ── Sync states when role changes ───────────────────────────────────────────
  useEffect(() => {
    setPersonalForm(activeProfile.personal);
    setRoleForm(activeProfile.roleSpecific);
    setIsEditing(false);
    setActiveTab('overview');
  }, [role, activeProfile]);

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
  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      PROFILE_DATA[role].personal     = personalForm;
      PROFILE_DATA[role].roleSpecific = roleForm;
      setIsEditing(false);
      setIsSaving(false);
      showToast('Profile updated successfully!', 'success');
    }, 600);
  };

  // ── Toggles Save ─────────────────────────────────────────────────────────────
  const handleSettingToggle = (key) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast(`Preference updated.`, 'success');
      return updated;
    });
  };

  // ── Logout Handler ───────────────────────────────────────────────────────────
  const handleLogout = () => {
    showToast('Logging out… redirecting.', 'info');
    setTimeout(() => navigate('/'), 1200);
  };

  // ── Deletion Handler ─────────────────────────────────────────────────────────
  const handleConfirmDelete = () => {
    setDeleteModalOpen(false);
    showToast('Account deletion restricted in demo.', 'error');
  };

  if (isSaving) return <Loader variant="page" text="Saving details…" />;

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
                { label: 'Full Name',       name: 'fullName', val: personalForm.fullName || personalForm.name || '' },
                { label: 'Phone Number',    name: 'phone',    val: personalForm.phone || '' },
                { label: 'Email Address',   name: 'email',    val: personalForm.email || '' },
                { label: 'Primary Address', name: 'address',  val: personalForm.address || '' },
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
              { label: 'Full Name',       val: activeProfile.personal.fullName || activeProfile.personal.name },
              { label: 'Phone Number',    val: activeProfile.personal.phone },
              { label: 'Email Address',   val: activeProfile.personal.email },
              { label: 'Primary Address', val: activeProfile.personal.address },
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
              <h2 className="pp-section-title">{activeProfile.role} Details</h2>
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
            Object.keys(activeProfile.roleSpecific).map((key) => (
              <div key={key} className="pp-role-item">
                <span className="pp-role-label">{key.replace(/([A-Z])/g, ' $1')}</span>
                <span className="pp-role-value">{activeProfile.roleSpecific[key]}</span>
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
            <span>ID</span>
            <span className="pp-txn-col-right">Amount</span>
            <span className="pp-txn-col-right">Status</span>
          </div>
          {(activeProfile.recentTransactions || []).length === 0 ? (
            <div className="pp-empty-state">
              <span>📭</span>
              <p>No transactions recorded yet</p>
            </div>
          ) : (
            (activeProfile.recentTransactions || []).map((txn) => (
              <div key={txn.id} className="pp-txn-row">
                <div className="pp-txn-item-cell">
                  <span className="pp-txn-emoji">{txn.emoji || '📦'}</span>
                  <span className="pp-txn-name">{txn.crop || txn.action}</span>
                </div>
                <span className="pp-txn-date">{txn.date}</span>
                <span className="pp-txn-id">{txn.id}</span>
                <span className="pp-txn-amt pp-txn-col-right">{txn.amount}</span>
                <div className="pp-txn-col-right">
                  <span className={`pp-status-pill pp-status--${txn.status.toLowerCase()}`}>
                    {txn.status}
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

        {(!activeProfile.reviews || activeProfile.reviews.length === 0) ? (
          <div className="pp-empty-state">
            <span>💬</span>
            <p>No feedback reviews recorded yet</p>
          </div>
        ) : (
          <div className="pp-reviews-grid">
            {activeProfile.reviews.map((rev, i) => (
              <div key={i} className="pp-review-card">
                <div className="pp-review-header">
                  <div className="pp-reviewer-avatar">{rev.user?.[0] || '?'}</div>
                  <div className="pp-reviewer-meta">
                    <span className="pp-reviewer-name">{rev.user}</span>
                    <div className="pp-stars">
                      {[...Array(5)].map((_, si) => (
                        <span key={si} className={si < rev.stars ? 'pp-star pp-star--on' : 'pp-star'}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="pp-review-text">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        )}
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
          {activeProfile.achievements.map((badge, i) => (
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
            { key: 'profilePublic', label: 'Public directory profile search',   desc: 'List your profile in the searchable mandi directory' },
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
          style={{ backgroundImage: `url(${activeProfile.banner})` }}
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
            <div className="pp-avatar">{activeProfile.avatar}</div>
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
              <h1 className="pp-name">{activeProfile.name}</h1>
              {activeProfile.verified && (
                <span className="pp-verified-chip">✓ Verified</span>
              )}
              <span className={`pp-role-chip pp-role-chip--${role.toLowerCase()}`}>
                {activeProfile.role}
              </span>
            </div>
            <div className="pp-meta-row">
              <span>📍 {activeProfile.location}</span>
              <span className="pp-meta-dot">·</span>
              <span>📅 Member since {activeProfile.memberSince}</span>
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
        {activeProfile.stats.map((stat, i) => (
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
