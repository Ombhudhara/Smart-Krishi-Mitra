import React from "react";

/**
 * Empty chat state welcome screen.
 * Displays AI assistant badge, gradient "Hello, Farmer 👋", and minimalistic action cards.
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

      {/* Greetings with Gradient Text */}
      <h1 className="ai-empty-welcome-gradient">
        {strings.welcomeTitle === "Hello 👋" || strings.welcomeTitle === "Hello" ? "Hello, Farmer 👋" : strings.welcomeTitle}
      </h1>
      <h2 className="ai-empty-welcome-subtitle">{strings.welcomeHeading}</h2>

      {/* Grid of Quick Action Cards (Minimalistic 2x3 grid) */}
      <div className="ai-empty-actions-minimal" role="list">
        {strings.quickActions.map((action) => (
          <button
            key={action.id}
            className="ai-quick-action-card-minimal"
            role="listitem"
            onClick={() => onQuickAction(action.template)}
            title={action.description}
          >
            <span className="ai-quick-action-icon-minimal" aria-hidden="true">
              {action.icon}
            </span>
            <div className="ai-quick-action-content-minimal">
              <span className="ai-quick-action-title-minimal">{action.title}</span>
              <span className="ai-quick-action-desc-minimal">{action.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyChat;
