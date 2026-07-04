// ─────────────────────────────────────────────────────────────────────────────
// EmptyChat.jsx
// Welcome screen — matches the premium, clean layout in the design mockup
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import SuggestedQuestions from "./SuggestedQuestions";

/**
 * Empty chat state welcome screen.
 * Displays AI assistant leaf badge, "Hello! 👋", quick action grid,
 * and horizontal suggested questions underneath.
 *
 * @param {{
 *   onQuickAction: (template: string) => void,
 *   strings: Object,
 *   langCode: string
 * }} props
 */
function EmptyChat({ onQuickAction, strings, langCode }) {
  return (
    <div className="ai-empty-chat">
      {/* Premium Leaf Circle Badge */}
      <div className="ai-empty-illustration-badge" role="img" aria-label="Krishi AI Assistant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a15 15 0 0 0-9 9c0 4 3 6 5 6h4v4h2v-4h4c2 0 5-2 5-6a15 15 0 0 0-9-9z" />
          <path d="M9 17a3 3 0 0 0 6 0" />
        </svg>
      </div>

      {/* Greetings */}
      <h2 className="ai-empty-welcome">{strings.welcomeTitle}</h2>
      <h3 className="ai-empty-heading">{strings.welcomeHeading}</h3>
      <p className="ai-empty-subtitle">{strings.welcomeSubtitle}</p>

      {/* Grid of 4 Quick Action Cards */}
      <div className="ai-empty-actions" role="list">
        {strings.quickActions.map((action) => (
          <button
            key={action.id}
            className="ai-quick-action-card"
            role="listitem"
            onClick={() => onQuickAction(action.template)}
            title={action.description}
          >
            <div className="ai-quick-action-header">
              <span className="ai-quick-action-icon" aria-hidden="true">
                {action.icon}
              </span>
              <span className="ai-quick-action-title">{action.title}</span>
            </div>
            <span className="ai-quick-action-desc">{action.description}</span>
          </button>
        ))}
      </div>

      {/* Suggested question chips directly in the welcome area */}
      <div className="ai-empty-suggested-container">
        <SuggestedQuestions
          onSelect={onQuickAction}
          langCode={langCode}
          label=""
        />
      </div>
    </div>
  );
}

export default EmptyChat;
