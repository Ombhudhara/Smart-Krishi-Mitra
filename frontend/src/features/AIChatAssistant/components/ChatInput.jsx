// ─────────────────────────────────────────────────────────────────────────────
// ChatInput.jsx
// Premium clean input area matching the mockup exactly
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useRef, useCallback } from "react";
import FileUploader from "./FileUploader";
import VoiceRecorder from "./VoiceRecorder";

const MAX_CHARS = 1000;

/* ── SVG Icon helpers ── */
function ImageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/**
 * Full-featured chat input bar.
 *
 * Props:
 * @param {Function} onSendMessage  - Called with (text, attachments[])
 * @param {boolean}  disabled       - Disable input while AI is responding
 * @param {Object}   strings        - Language strings (from languages.js)
 * @param {string}   langCode       - Current language code
 */
function ChatInput({ onSendMessage, disabled, strings = {}, langCode = "en" }) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [showVoice, setShowVoice] = useState(false);
  const textareaRef = useRef(null);

  /* Auto-resize textarea */
  function autoResize(el) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  /* Handle text change */
  function handleChange(e) {
    const val = e.target.value;
    if (val.length <= MAX_CHARS) {
      setText(val);
      autoResize(e.target);
    }
  }

  /* Send on Enter (Shift+Enter = newline) */
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  /* Handle send */
  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    onSendMessage(trimmed, attachments);
    setText("");
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }
  }, [text, attachments, onSendMessage]);

  /* Add files from upload */
  function handleFilesAdded(files) {
    const processed = files.map((f) => ({
      file: f,
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : "document",
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : null,
    }));
    setAttachments((prev) => [...prev, ...processed]);
  }

  /* Remove an attachment */
  function removeAttachment(index) {
    setAttachments((prev) => {
      const updated = [...prev];
      if (updated[index].url) URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  }

  /* Voice transcript received */
  function handleVoiceTranscript(transcript) {
    setText(transcript);
    setShowVoice(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  }

  /* Character count styling */
  const charsLeft = MAX_CHARS - text.length;
  const countClass =
    charsLeft < 50 ? "at-limit" : charsLeft < 150 ? "near-limit" : "";

  const placeholder = strings.inputPlaceholder || "Ask anything about farming…";
  const ttImage     = strings.tooltipImage     || "Upload Image";
  const ttDoc       = strings.tooltipDoc       || "Upload Document";
  const ttVoice     = strings.tooltipVoice     || "Voice Input";

  return (
    <div className="ai-input-bar">
      {/* ── Attachment Previews ── */}
      {attachments.length > 0 && (
        <div className="ai-attachment-previews">
          {attachments.map((att, idx) => (
            <div key={idx} className="ai-attachment-item">
              {att.type === "image" ? (
                <img src={att.url} alt={att.name} className="ai-attachment-thumb" />
              ) : (
                <div className="ai-attachment-doc-icon">📄</div>
              )}
              <span className="ai-attachment-name">{att.name}</span>
              <button
                className="ai-attachment-remove"
                onClick={() => removeAttachment(idx)}
                aria-label={`Remove ${att.name}`}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Input Container (cleaner UI) ── */}
      <div className="ai-input-container">
        {/* Voice overlay */}
        {showVoice && (
          <VoiceRecorder
            onTranscript={handleVoiceTranscript}
            onCancel={() => setShowVoice(false)}
            langCode={langCode}
            strings={strings}
          />
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="ai-chat-textarea"
          className="ai-textarea"
          placeholder={placeholder}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || showVoice}
          rows={1}
          aria-label={placeholder}
          aria-multiline="true"
        />

        {/* Toolbar bottom inside the box */}
        <div className="ai-input-toolbar">
          <div className="ai-toolbar-left">
            {/* Attachment */}
            <FileUploader
              onFilesAdded={handleFilesAdded}
              accept=".pdf,.doc,.docx,.txt,.csv,.xlsx"
              inputId="ai-doc-upload"
            >
              <button
                className="ai-toolbar-btn"
                data-tooltip={ttDoc}
                aria-label={ttDoc}
                type="button"
              >
                <PaperclipIcon />
              </button>
            </FileUploader>

            {/* Image Upload */}
            <FileUploader
              onFilesAdded={handleFilesAdded}
              accept="image/*"
              inputId="ai-image-upload"
            >
              <button
                className="ai-toolbar-btn"
                data-tooltip={ttImage}
                aria-label={ttImage}
                type="button"
              >
                <ImageIcon />
              </button>
            </FileUploader>

            {/* Voice Input */}
            <button
              className="ai-toolbar-btn"
              onClick={() => setShowVoice(true)}
              data-tooltip={ttVoice}
              aria-label={ttVoice}
              id="ai-voice-btn"
              type="button"
            >
              <MicIcon />
            </button>
          </div>

          <div className="ai-toolbar-right">
            {/* Clean send icon matching mockup */}
            <button
              className="ai-input-send-btn"
              onClick={handleSend}
              disabled={disabled || (!text.trim() && attachments.length === 0)}
              aria-label="Send message"
              id="ai-send-btn"
              title="Send (Enter)"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── Subtitle hints matching mockup ── */}
      <div className="ai-input-hint-row">
        <span className="ai-input-hint-text">
          {strings.inputHintSend || "Press Enter to send · Shift + Enter for new line"}
        </span>
        <span className={`ai-input-char-count ${countClass}`}>
          {text.length} / {MAX_CHARS}
        </span>
      </div>
    </div>
  );
}

export default ChatInput;
