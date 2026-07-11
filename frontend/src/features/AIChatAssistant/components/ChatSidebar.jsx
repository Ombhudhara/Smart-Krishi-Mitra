// ─────────────────────────────────────────────────────────────────────────────
// ChatSidebar.jsx
// Premium designed sidebar — collapsible, time category groupings, settings gear
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useMemo } from "react";
import { formatTime, groupConversationsByTime, truncate } from "../utils/chatHelpers";

/* ── Inline SVG Icons ── */
function SearchIcon() {
  return (
    <svg className="ai-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function PinIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M12 17l-5 3V8a2 2 0 012-2h6a2 2 0 012 2v12l-5-3z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ai-sidebar-settings-svg">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function SidebarLogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ai-sidebar-logo-svg">
      <path d="M12 2a15 15 0 0 0-9 9c0 4 3 6 5 6h4v4h2v-4h4c2 0 5-2 5-6a15 15 0 0 0-9-9z" />
      <path d="M9 17a3 3 0 0 0 6 0" />
    </svg>
  );
}

function PlantIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="ai-conv-item-svg">
      <path d="M12 2a15 15 0 0 0-9 9c0 4 3 6 5 6h4v4h2v-4h4c2 0 5-2 5-6a15 15 0 0 0-9-9z" />
    </svg>
  );
}

function SidebarToggleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  );
}

/**
 * ChatSidebar component.
 */
function ChatSidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onPinConversation,
  isOpen,
  onClose,
  strings = {},
  isCollapsed = false,
  onToggleCollapse,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const GROUP_LABELS = {
    pinned: strings.sidebarSectionPinned || "Pinned",
    today: strings.sidebarSectionToday || "Today",
    yesterday: strings.sidebarSectionYesterday || "Yesterday",
    lastWeek: strings.sidebarSectionLastWeek || "Last 7 Days",
    older: strings.sidebarSectionOlder || "Older",
  };

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const grouped = useMemo(
    () => groupConversationsByTime(filteredConversations),
    [filteredConversations]
  );

  function renderConvItem(conv) {
    const isActive = conv.id === activeId;
    return (
      <div
        key={conv.id}
        className={`ai-conv-item ${isActive ? "active" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => { onSelectConversation(conv.id); onClose?.(); }}
        onKeyDown={(e) => e.key === "Enter" && onSelectConversation(conv.id)}
        aria-current={isActive ? "page" : undefined}
        aria-label={conv.title}
      >
        <div className="ai-conv-item-avatar" aria-hidden="true">
          <PlantIcon />
        </div>

        <div className="ai-conv-content">
          <p className="ai-conv-title">{conv.title}</p>
          <p className="ai-conv-preview">{truncate(conv.preview, 42)}</p>
        </div>

        <div className="ai-conv-actions">
          <button
            className="ai-conv-action-btn"
            onClick={(e) => { e.stopPropagation(); onPinConversation(conv.id); }}
            title={conv.pinned ? "Unpin" : "Pin conversation"}
            aria-label={conv.pinned ? "Unpin conversation" : "Pin conversation"}
          >
            <PinIcon filled={conv.pinned} />
          </button>
          <button
            className="ai-conv-action-btn delete"
            onClick={(e) => { e.stopPropagation(); onDeleteConversation(conv.id); }}
            title="Delete conversation"
            aria-label="Delete conversation"
          >
            <TrashIcon />
          </button>
        </div>

        <time className="ai-conv-item-time">{formatTime(conv.timestamp)}</time>
      </div>
    );
  }

  // If sidebar is collapsed (desktop view), render a thin minimalist bar instead of full sidebar
  if (isCollapsed) {
    return (
      <aside className="ai-sidebar collapsed" aria-label="Conversation history collapsed">
        <div className="ai-sidebar-collapsed-actions">
          <button
            className="ai-sidebar-expand-trigger-btn"
            onClick={onToggleCollapse}
            title="Expand Sidebar"
            aria-label="Expand Sidebar"
          >
            <SidebarToggleIcon />
          </button>
          <button
            className="ai-sidebar-expand-trigger-btn new-chat-trigger"
            onClick={onNewChat}
            title="New Chat"
            aria-label="New Chat"
          >
            <PlusIcon />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className={`ai-sidebar ${isOpen ? "is-open" : ""}`} aria-label="Conversation history">
      {/* ── Sidebar Header ── */}
      <div className="ai-sidebar-header">
        <div className="ai-sidebar-logo-container">
          <div className="ai-sidebar-logo">
            <div className="ai-sidebar-logo-icon" aria-hidden="true">
              <SidebarLogoIcon />
            </div>
            <div>
              <span className="ai-sidebar-logo-text">
                Smart Krishi Mitra
                <small className="ai-sidebar-logo-sub">{strings.sidebarLogoSub || "AI Farming Assistant"}</small>
              </span>
            </div>
          </div>
          {/* Collapse Button inside header */}
          <button
            className="ai-sidebar-collapse-btn"
            onClick={onToggleCollapse}
            title="Collapse Sidebar"
            aria-label="Collapse Sidebar"
          >
            <SidebarToggleIcon />
          </button>
        </div>

        {/* Solid Green New Chat button */}
        <button
          className="ai-new-chat-btn"
          onClick={() => { onNewChat(); onClose?.(); }}
          id="ai-sidebar-new-chat"
          aria-label="Start new chat"
        >
          <PlusIcon />
          {strings.sidebarNewChat || "New Chat"}
        </button>
      </div>

      <div className="ai-sidebar-section-heading">
        {strings.sidebarSectionConversations || "Conversations"}
      </div>

      {/* ── Search ── */}
      <div className="ai-search-wrapper">
        <div className="ai-search-input-wrap">
          <SearchIcon />
          <input
            type="search"
            className="ai-search-input"
            placeholder={strings.sidebarSearch || "Search conversations…"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search conversations"
            id="ai-sidebar-search"
          />
        </div>
      </div>

      {/* ── Conversation List ── */}
      <nav className="ai-sidebar-conversations" aria-label="Recent conversations">
        {Object.entries(grouped).map(([group, convs]) => {
          if (convs.length === 0) return null;
          return (
            <div key={group} className="ai-sidebar-group-container">
              <div className="ai-group-label">
                <span>{GROUP_LABELS[group] || group}</span>
              </div>
              <div className="ai-group-items">
                {convs.map(renderConvItem)}
              </div>
            </div>
          );
        })}

        {filteredConversations.length === 0 && (
          <div className="ai-sidebar-empty">
            <span style={{ fontSize: 32 }}>🔍</span>
            <p>{strings.sidebarEmptySearch || "No conversations found"}</p>
          </div>
        )}
      </nav>

      {/* ── Sidebar Footer ── */}
      <div className="ai-sidebar-footer">
        <div className="ai-sidebar-footer-info">
          <div className="ai-sidebar-footer-avatar" aria-hidden="true">👤</div>
          <div className="ai-sidebar-footer-text">
            <strong>Farmer Account</strong>
            <small>{strings.sidebarFreePlan || "Free Plan · Unlimited chats"}</small>
          </div>
          <button className="ai-sidebar-settings-btn" title="Settings" aria-label="Settings">
            <SettingsIcon />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default ChatSidebar;
