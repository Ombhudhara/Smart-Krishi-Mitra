// ─────────────────────────────────────────────────────────────────────────────
// ChatMessage.jsx
// Renders individual chat messages — user bubbles and AI rich-text cards
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { formatTime, parseMarkdownToReact } from "../utils/chatHelpers";

function DoubleCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="17 6 9 17 4 12" />
      <polyline points="23 6 15 17 13 15" />
    </svg>
  );
}

function MessagePlantIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ai-message-avatar-svg">
      <path d="M12 2a15 15 0 0 0-9 9c0 4 3 6 5 6h4v4h2v-4h4c2 0 5-2 5-6a15 15 0 0 0-9-9z" />
    </svg>
  );
}

function MessageUserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ai-message-avatar-svg">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/**
 * Renders a single message row (user or AI).
 *
 * @param {{ message: {
 *   id: string,
 *   role: 'user'|'ai',
 *   text: string,
 *   timestamp: string,
 *   attachments?: Array<{name: string, url: string, type: string}>
 * }}} props
 */
function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <div className={`ai-message-row ${isUser ? "user" : "ai"}`}>
      {/* Premium Avatar Badge (SVGs) */}
      <div
        className="ai-message-avatar"
        role="img"
        aria-label={isUser ? "You" : "Krishi AI"}
        title={isUser ? "You" : "Krishi AI"}
      >
        {isUser ? <MessageUserIcon /> : <MessagePlantIcon />}
      </div>

      {/* Message group */}
      <div className="ai-message-group">
        {/* Main bubble */}
        <div className="ai-message-bubble">
          {isUser ? (
            /* User — plain text */
            <p className="ai-p" style={{ color: "#fff" }}>
              {message.text}
            </p>
          ) : (
            /* AI — rich markdown */
            <div>
              <div className="ai-markdown-body">
                {parseMarkdownToReact(message.text)}
              </div>
              {(message.confidenceScore || (message.sources && message.sources.length > 0)) && (
                <div className="ai-message-extra-info" style={{ marginTop: "12px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "8px", fontSize: "0.75rem", opacity: 0.8 }}>
                  {message.confidenceScore && (
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, color: "var(--ai-primary)", marginRight: "6px" }}>Confidence Score:</span>
                      <span className="ai-confidence-badge" style={{ background: "rgba(76, 175, 80, 0.1)", color: "#2e7d32", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                        {message.confidenceScore}%
                      </span>
                    </div>
                  )}
                  {message.sources && message.sources.length > 0 && (
                    <div>
                      <span style={{ fontWeight: 600, color: "var(--ai-primary)", marginRight: "6px" }}>Sources:</span>
                      <span style={{ fontStyle: "italic" }}>{message.sources.join(", ")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Attached files / images */}
        {message.attachments && message.attachments.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
            {message.attachments.map((att, idx) => (
              <div key={idx} className="ai-message-attachment">
                {att.type === "image" ? (
                  <img src={att.url} alt={att.name} className="ai-attachment-thumb" />
                ) : (
                  <span style={{ fontSize: 20 }}>📄</span>
                )}
                <span style={{ fontSize: "0.75rem", color: "var(--ai-primary)" }}>
                  {att.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp and status */}
        <div className="ai-message-meta">
          <time className="ai-message-time" dateTime={message.timestamp}>
            {formatTime(message.timestamp)}
          </time>
          {isUser && (
            <span className="ai-message-status" aria-label="Message delivered">
              <DoubleCheckIcon />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
