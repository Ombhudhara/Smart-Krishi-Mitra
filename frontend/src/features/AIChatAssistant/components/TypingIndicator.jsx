// ─────────────────────────────────────────────────────────────────────────────
// TypingIndicator.jsx
// Shows animated three-dot typing indicator with language-aware label
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";

/**
 * Animated typing indicator displayed when the AI is generating a response.
 *
 * @param {{ typingText: string }} props - Language-specific "AI is thinking" text
 */
function TypingIndicator({ typingText = "Krishi AI is thinking…" }) {
  return (
    <div className="ai-typing-row">
      {/* AI Avatar */}
      <div className="ai-typing-avatar" aria-hidden="true">
        🌾
      </div>

      {/* Bouncing dots bubble */}
      <div className="ai-typing-bubble" role="status" aria-label={typingText}>
        <span className="ai-typing-dot" />
        <span className="ai-typing-dot" />
        <span className="ai-typing-dot" />
        <span className="ai-typing-label">{typingText}</span>
      </div>
    </div>
  );
}

export default TypingIndicator;
