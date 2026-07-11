// ─────────────────────────────────────────────────────────────────────────────
// chatHelpers.js
// Utility functions: time formatting, unique ID generation, markdown parser
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";

/**
 * Format a timestamp as a human-readable time string.
 * @param {string|Date} timestamp
 * @returns {string} e.g. "2:45 PM" or "Yesterday 3:00 PM"
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return timeStr;
  if (isYesterday) return `Yesterday ${timeStr}`;
  return (
    date.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
    " " +
    timeStr
  );
}

/**
 * Generate a unique ID for messages and conversations
 */
export function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Group conversations by time category (today, yesterday, lastWeek, older)
 * @param {Array} conversations
 * @returns {Object} grouped
 */
export function groupConversationsByTime(conversations) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groups = { pinned: [], today: [], yesterday: [], lastWeek: [], older: [] };

  conversations.forEach((conv) => {
    if (conv.pinned) {
      groups.pinned.push(conv);
      return;
    }
    const convDate = new Date(conv.timestamp);
    if (convDate >= today) groups.today.push(conv);
    else if (convDate >= yesterday) groups.yesterday.push(conv);
    else if (convDate >= lastWeek) groups.lastWeek.push(conv);
    else groups.older.push(conv);
  });

  return groups;
}

/**
 * Truncate text to a maximum number of characters, appending ellipsis if needed.
 */
export function truncate(text, maxLen = 60) {
  if (!text || text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "…";
}

// ─────────────────────────────────────────────────────────────────────────────
// Custom Markdown → React element parser
// Supports: headings (#, ##, ###), bold (**), italic (*), bullet lists,
//           numbered lists, tables (| header |), code blocks (```),
//           inline code (`), blockquotes (>), callout tips (💡), warnings (⚠️)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse a single inline text segment handling bold and italic.
 */
function parseInline(text, key) {
  // Split on bold (**text**) and italic (*text*)
  const parts = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const segment = match[0];
    if (segment.startsWith("**")) {
      parts.push(<strong key={`${key}-b-${match.index}`}>{segment.slice(2, -2)}</strong>);
    } else if (segment.startsWith("`")) {
      parts.push(<code key={`${key}-c-${match.index}`} className="ai-inline-code">{segment.slice(1, -1)}</code>);
    } else {
      parts.push(<em key={`${key}-i-${match.index}`}>{segment.slice(1, -1)}</em>);
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

/**
 * Parse a markdown table block into a React table element.
 */
function parseTable(lines, key) {
  const rows = lines.map((line) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell !== "")
  );

  const headers = rows[0];
  // rows[1] is the separator line (---|---|---)
  const bodyRows = rows.slice(2);

  return (
    <div key={key} className="ai-table-wrapper">
      <table className="ai-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>{parseInline(h, `th-${key}-${i}`)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bodyRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>{parseInline(cell, `td-${key}-${rIdx}-${cIdx}`)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Main markdown parser — converts markdown text to React elements.
 * @param {string} markdownText
 * @returns {React.ReactNode[]}
 */
export function parseMarkdownToReact(markdownText) {
  if (!markdownText) return null;

  const lines = markdownText.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // ── Code Block (``` ... ```) ──
    if (line.trim().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`code-${i}`} className="ai-code-block">
          <code>{codeLines.join("\n")}</code>
        </pre>
      );
      i++;
      continue;
    }

    // ── Table block ──
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(parseTable(tableLines, `table-${i}`));
      continue;
    }

    // ── Headings ──
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={`h4-${i}`} className="ai-h3">
          {parseInline(line.slice(4), `h4-${i}`)}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="ai-h2">
          {parseInline(line.slice(3), `h3-${i}`)}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="ai-h1">
          {parseInline(line.slice(2), `h2-${i}`)}
        </h2>
      );
      i++;
      continue;
    }

    // ── Tip Blockquote (💡 / >) ──
    if (line.startsWith("> ")) {
      const quoteContent = line.slice(2);
      const isTip = quoteContent.includes("💡") || quoteContent.toLowerCase().includes("tip");
      const isWarning = quoteContent.includes("⚠️") || quoteContent.toLowerCase().includes("warning");
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className={`ai-blockquote ${isTip ? "ai-blockquote--tip" : isWarning ? "ai-blockquote--warning" : ""}`}
        >
          {parseInline(quoteContent, `bq-${i}`)}
        </blockquote>
      );
      i++;
      continue;
    }

    // ── Bullet Lists (- or *) ──
    if (line.match(/^[-*] /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        listItems.push(
          <li key={`li-${i}`}>{parseInline(lines[i].slice(2), `li-${i}`)}</li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="ai-ul">
          {listItems}
        </ul>
      );
      continue;
    }

    // ── Numbered Lists (1. 2. ...) ──
    if (line.match(/^\d+\. /)) {
      const listItems = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        listItems.push(
          <li key={`oli-${i}`}>
            {parseInline(lines[i].replace(/^\d+\. /, ""), `oli-${i}`)}
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="ai-ol">
          {listItems}
        </ol>
      );
      continue;
    }

    // ── Horizontal Rule ──
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(<hr key={`hr-${i}`} className="ai-hr" />);
      i++;
      continue;
    }

    // ── Empty Line ──
    if (line.trim() === "") {
      i++;
      continue;
    }

    // ── Plain Paragraph ──
    elements.push(
      <p key={`p-${i}`} className="ai-p">
        {parseInline(line, `p-${i}`)}
      </p>
    );
    i++;
  }

  return elements;
}
