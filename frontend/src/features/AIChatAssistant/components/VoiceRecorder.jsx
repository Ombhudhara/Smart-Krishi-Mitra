// ─────────────────────────────────────────────────────────────────────────────
// VoiceRecorder.jsx
// UI-only voice recording component — language-aware strings via prop
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef } from "react";
import { transcribeVoice } from "../services/aiService";

/**
 * Voice recorder overlay inside the input bar.
 *
 * Props:
 * @param {Function} onTranscript - Called with the transcript text when recording stops
 * @param {Function} onCancel    - Called when user clicks "Cancel"
 * @param {string}   langCode    - Current language code for transcription
 * @param {Object}   strings     - Language strings
 */
function VoiceRecorder({ onTranscript, onCancel, langCode = "en", strings = {} }) {
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

  const voiceRecording   = strings.voiceRecording   || "🎙️ Recording";
  const voiceTranscribing = strings.voiceTranscribing || "⏳ Transcribing…";
  const voiceSpeakHint   = strings.voiceSpeakHint   || "Speak clearly…";
  const voiceStopSend    = strings.voiceStopSend    || "Stop & Send";
  const voiceCancel      = strings.voiceCancel      || "Cancel";

  /* Start timer on mount */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  /* Format seconds as MM:SS */
  function formatTimer(s) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  /* Handle stop recording */
  async function handleStop() {
    clearInterval(timerRef.current);
    setIsTranscribing(true);
    try {
      const transcript = await transcribeVoice(new Blob(), langCode);
      onTranscript(transcript);
    } catch {
      onCancel();
    }
  }

  return (
    <div className="ai-voice-overlay">
      <p className="ai-voice-status">
        {isTranscribing
          ? voiceTranscribing
          : `${voiceRecording} — ${formatTimer(timer)}`}
      </p>

      {!isTranscribing && (
        <div className="ai-voice-waves" aria-hidden="true">
          <span className="ai-wave-bar" />
          <span className="ai-wave-bar" />
          <span className="ai-wave-bar" />
          <span className="ai-wave-bar" />
          <span className="ai-wave-bar" />
          <span className="ai-wave-bar" />
          <span className="ai-wave-bar" />
        </div>
      )}

      {isTranscribing && (
        <div style={{ display: "flex", gap: 6 }} aria-label="Loading">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "var(--ai-primary)",
                animation: `typingBounce 1.2s ease ${i * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {!isTranscribing && (
        <p className="ai-voice-transcript">{voiceSpeakHint}</p>
      )}

      {!isTranscribing && (
        <div className="ai-voice-actions">
          <button className="ai-voice-stop-btn" onClick={handleStop}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <rect x="5" y="5" width="14" height="14" rx="2" />
            </svg>
            {voiceStopSend}
          </button>
          <button className="ai-voice-cancel-btn" onClick={onCancel}>
            {voiceCancel}
          </button>
        </div>
      )}
    </div>
  );
}

export default VoiceRecorder;
