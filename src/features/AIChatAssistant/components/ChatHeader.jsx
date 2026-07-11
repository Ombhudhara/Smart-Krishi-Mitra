// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader.jsx
// Chat window top bar — avatar, status, language selector, theme toggle, and menu
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import { SUPPORTED_LANGUAGES } from "../utils/languages";

/* ── Inline SVG Icons ── */
function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
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

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="ai-lang-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="ai-lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MoreVerticalIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function HeaderPlantIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ai-header-logo-svg">
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

// ─────────────────────────────────────────────────────────────────────────────
// LanguageSelector sub-component
// ─────────────────────────────────────────────────────────────────────────────

function LanguageSelector({ currentLang, onLangChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLangData = SUPPORTED_LANGUAGES.find((l) => l.code === currentLang)
    || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSelect(code) {
    onLangChange(code);
    setIsOpen(false);
  }

  return (
    <div className="ai-lang-selector" ref={containerRef}>
      <button
        className={`ai-lang-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${currentLangData.name}`}
        id="ai-lang-selector-btn"
        title={`Select language — ${label}`}
      >
        <span className="ai-lang-trigger-left">
          <span className="ai-lang-flag" aria-hidden="true">{currentLangData.flag}</span>
          <span className="ai-lang-name">{currentLangData.name}</span>
        </span>
        <ChevronDownIcon />
      </button>

      <button
        className={`ai-lang-trigger-compact ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`${label}: ${currentLangData.name}`}
        title="Select Language"
      >
        🌐
      </button>

      {isOpen && (
        <div
          className="ai-lang-dropdown"
          role="listbox"
          aria-label="Select language"
        >
          <p className="ai-lang-dropdown-label">🌐 {label}</p>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <button
                key={lang.code}
                className={`ai-lang-option ${isSelected ? "selected" : ""}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                id={`ai-lang-option-${lang.code}`}
              >
                <span className="ai-lang-option-flag" aria-hidden="true">{lang.flag}</span>
                <span className="ai-lang-option-text">
                  <span className="ai-lang-option-name">{lang.name}</span>
                </span>
                {isSelected && <CheckIcon />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ChatHeader component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Top header bar for the chat window.
 */
function ChatHeader({
  onClearChat,
  onNewChat,
  onClose,
  onToggleSidebar,
  showClose,
  currentLang,
  onLangChange,
  strings,
  theme = "light",
  toggleTheme,
  isSidebarCollapsed = false,
  onExportChat,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function clickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener("mousedown", clickOutside);
    }
    return () => document.removeEventListener("mousedown", clickOutside);
  }, [showMenu, menuRef]);

  return (
    <header className="ai-chat-header" role="banner">
      {/* Sidebar toggle (visible on desktop when collapsed, and on mobile always) */}
      <button
        className={`ai-header-toggle ${isSidebarCollapsed ? "collapsed-visible" : ""}`}
        onClick={onToggleSidebar}
        aria-label="Toggle conversation sidebar"
        title="Toggle Sidebar"
      >
        <SidebarToggleIcon />
      </button>

      {/* AI Avatar with online status */}
      <div className="ai-header-avatar">
        <div className="ai-header-avatar-inner" role="img" aria-label="Krishi AI">
          <HeaderPlantIcon />
        </div>
        <span className="ai-header-status-dot" aria-hidden="true" />
      </div>

      {/* Name and status */}
      <div className="ai-header-info">
        <h1 className="ai-header-title">Smart Krishi AI Assistant</h1>
        <div className="ai-header-subtitle">
          <span className="ai-header-status-text">Online</span>
          <span className="ai-header-dot-separator">&middot;</span>
          <span className="ai-header-powered-text">{strings.headerPoweredBy || "Powered by"}</span>
          <span className="ai-header-gemini-badge">{strings.headerGemini || "Gemini"}</span>
          <span className="ai-header-coming-soon-badge">{strings.headerComingSoon || "(Coming Soon)"}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="ai-header-actions">
        {/* Language Selector */}
        <LanguageSelector
          currentLang={currentLang}
          onLangChange={onLangChange}
          label={strings.headerLanguageLabel || "Language"}
        />

        {/* Theme Toggle (Sun/Moon) */}
        <button
          className="ai-header-action-icon-btn"
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to Dark Theme" : "Switch to Light Theme"}
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Triple Dot More Menu */}
        <div className="ai-header-more-menu-container" ref={menuRef}>
          <button
            className="ai-header-action-icon-btn"
            onClick={() => setShowMenu((v) => !v)}
            title="More Options"
            aria-label="More options"
            aria-expanded={showMenu}
          >
            <MoreVerticalIcon />
          </button>

          {showMenu && (
            <div className="ai-header-more-dropdown" role="menu">
              <button
                className="ai-header-dropdown-item"
                role="menuitem"
                onClick={() => { onClearChat(); setShowMenu(false); }}
              >
                <TrashIcon />
                {strings.headerClear || "Clear Chat"}
              </button>
              <button
                className="ai-header-dropdown-item"
                role="menuitem"
                onClick={() => { onNewChat(); setShowMenu(false); }}
              >
                <PlusIcon />
                {strings.headerNewChat || "New Chat"}
              </button>
              <button
                className="ai-header-dropdown-item"
                role="menuitem"
                onClick={() => { onExportChat(); setShowMenu(false); }}
                title="Download Chat History as TXT File"
              >
                <span style={{ marginRight: "10px", fontSize: "16px" }}>📥</span>
                {strings.headerExport || "Export Transcript (TXT)"}
              </button>
            </div>
          )}
        </div>

        {/* Close (only in floating/drawer mode) */}
        {showClose && (
          <button
            className="ai-header-btn close-btn"
            onClick={onClose}
            title="Close chat"
            aria-label="Close chat window"
            id="ai-header-close-btn"
          >
            <XIcon />
          </button>
        )}
      </div>
    </header>
  );
}

export default ChatHeader;
