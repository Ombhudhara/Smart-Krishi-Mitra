// ─────────────────────────────────────────────────────────────────────────────
// SuggestedQuestions.jsx
// Horizontal scrollable chips — language-aware via prop
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { getSuggestedQuestions } from "../utils/languages";

/**
 * Renders horizontally scrollable question chips in the selected language.
 *
 * @param {{
 *   onSelect: (text: string) => void,
 *   langCode: string,
 *   label: string
 * }} props
 */
function SuggestedQuestions({ onSelect, langCode = "en", label = "✨ Quick Questions" }) {
  const questions = getSuggestedQuestions(langCode);

  return (
    <div className="ai-suggested-wrapper">
      <p className="ai-suggested-label">{label}</p>
      <div className="ai-suggested-chips" role="list">
        {questions.map((q) => (
          <button
            key={q.id}
            className="ai-chip"
            role="listitem"
            onClick={() => onSelect(q.text)}
            title={q.text}
          >
            <span className="ai-chip-icon" aria-hidden="true">{q.icon}</span>
            {q.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
