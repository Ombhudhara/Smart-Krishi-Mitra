// ─────────────────────────────────────────────────────────────────────────────
// AIChatAssistant.jsx  (pages/AIChatAssistant.jsx)
// Feature entry point — floating FAB + slide-out drawer, or fullscreen mode
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import ChatBox from "../components/ChatBox";
import "../styles/AIChatAssistant.css";

/* ── Bot SVG Icon ── */
function BotIcon({ open }) {
  if (open) {
    // Show X when chat is open
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="11" />
      <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="3" />
      <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
    </svg>
  );
}

/**
 * AIChatAssistant — Feature entry-point component.
 *
 * Usage:
 *   <AIChatAssistant />                  → Floating FAB + drawer (default)
 *   <AIChatAssistant isFloating={false} /> → Fullscreen standalone page
 *
 * @param {{ isFloating?: boolean }} props
 */
function AIChatAssistant({ isFloating = true }) {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);

  /* Close on Escape key */
  useEffect(() => {
    if (!isFloating) return;
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFloating]);

  /* Prevent body scroll when drawer is open (floating mode) */
  useEffect(() => {
    if (!isFloating) return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, isFloating]);

  /* ── Fullscreen mode ── */
  if (!isFloating) {
    return (
      <div className="ai-chat-fullscreen ai-chat-module">
        <ChatBox showClose={false} />
      </div>
    );
  }

  /* ── Floating FAB + Drawer mode ── */
  return (
    <div className="ai-chat-module">
      {/* ── FAB container ── */}
      <div className="ai-fab-container">
        <span className="ai-fab-tooltip">
          {isOpen ? "Close Assistant" : "Ask Krishi AI"}
        </span>
        <button
          className={`ai-fab ${isOpen ? "is-open" : ""}`}
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? "Close AI Chat Assistant" : "Open AI Chat Assistant"}
          aria-expanded={isOpen}
          aria-controls="ai-chat-drawer"
          id="ai-fab-btn"
        >
          <BotIcon open={isOpen} />
        </button>
      </div>

      {/* ── Chat drawer overlay ── */}
      <div
        ref={overlayRef}
        className={`ai-chat-overlay ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="AI Chat Assistant"
        aria-hidden={!isOpen}
        id="ai-chat-drawer"
      >
        {/* Backdrop */}
        <div
          className="ai-chat-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Drawer Panel */}
        <div className="ai-chat-drawer">
          {/* Only render ChatBox when drawer is open (performance optimization) */}
          {isOpen && (
            <ChatBox
              onClose={() => setIsOpen(false)}
              showClose={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AIChatAssistant;
