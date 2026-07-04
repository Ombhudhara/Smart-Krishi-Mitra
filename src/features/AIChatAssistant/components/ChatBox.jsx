// ─────────────────────────────────────────────────────────────────────────────
// ChatBox.jsx
// Main orchestrator — coordinates collapsible sidebar state & theme toggling
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* Components */
import ChatHeader from "./ChatHeader";
import ChatSidebar from "./ChatSidebar";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";
import SuggestedQuestions from "./SuggestedQuestions";
import EmptyChat from "./EmptyChat";

/* Services & Utilities */
import { sendMessageToAI, generateConversationTitle } from "../services/aiService";
import { generateId } from "../utils/chatHelpers";
import { dummyConversations } from "../data/dummyMessages";
import { getStrings, DEFAULT_LANGUAGE } from "../utils/languages";

/* Styles */
import "../styles/ChatBox.css";
import "../styles/ChatSidebar.css";
import "../styles/ChatInput.css";

/**
 * ChatBox — the main chat interface orchestrator.
 *
 * Props:
 * @param {Function} onClose    - Close the chat (in floating mode)
 * @param {boolean}  showClose  - Whether to show the X close button
 */
function ChatBox({ onClose, showClose = true }) {
  /* ── Language state ── */
  const [langCode, setLangCode] = useState(DEFAULT_LANGUAGE);
  const [langFade, setLangFade] = useState(false);

  /* ── Theme state (light / dark) ── */
  const [theme, setTheme] = useState("light");

  /* ── Sidebar Collapsed state (desktop) ── */
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  /* ── Conversations state ── */
  const [conversations, setConversations] = useState(dummyConversations);
  const [activeConvId, setActiveConvId] = useState(dummyConversations[0]?.id || null);

  /* ── UI state ── */
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Scroll anchor */
  const messagesEndRef = useRef(null);

  /* Current language UI strings */
  const strings = getStrings(langCode);

  /* Get the active conversation object — memoized so reference is stable */
  const messages = useMemo(() => {
    const conv = conversations.find((c) => c.id === activeConvId);
    return conv?.messages || [];
  }, [conversations, activeConvId]);

  /* Auto-scroll to bottom on new message */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ── Handle language change — add fade transition ── */
  function handleLangChange(newCode) {
    if (newCode === langCode) return;
    setLangFade(true);
    setLangCode(newCode);
    setTimeout(() => setLangFade(false), 350);
  }

  /* ── Handle theme toggle ── */
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  /* ── Handle Sidebar Toggle (Mobile vs Desktop Collapsible) ── */
  const handleToggleSidebar = useCallback(() => {
    if (window.innerWidth <= 768) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, []);

  /* ── Handle sending a message ── */
  const handleSendMessage = useCallback(
    async (text, attachments = []) => {
      if (!text.trim() && attachments.length === 0) return;

      const userMessage = {
        id: generateId("msg"),
        role: "user",
        text,
        timestamp: new Date().toISOString(),
        attachments: attachments.map((a) => ({
          name: a.name,
          url: a.url,
          type: a.type,
        })),
      };

      let targetConvId = activeConvId;

      setConversations((prev) => {
        const active = prev.find((c) => c.id === activeConvId);
        if (active) {
          return prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: [...c.messages, userMessage],
                  title:
                    c.messages.length === 0
                      ? generateConversationTitle(text)
                      : c.title,
                  preview: text,
                  timestamp: new Date().toISOString(),
                }
              : c
          );
        }
        return prev;
      });

      setIsTyping(true);

      try {
        const aiResponse = await sendMessageToAI(text, messages, langCode);

        const aiMessage = {
          id: generateId("msg"),
          role: "ai",
          text: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetConvId
              ? { ...c, messages: [...c.messages, aiMessage], preview: aiResponse.slice(0, 80) }
              : c
          )
        );
      } catch (error) {
        console.error("AI service error:", error);
        const errorMessage = {
          id: generateId("msg"),
          role: "ai",
          text: strings.errorMessage,
          timestamp: new Date().toISOString(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === targetConvId
              ? { ...c, messages: [...c.messages, errorMessage] }
              : c
          )
        );
      } finally {
        setIsTyping(false);
      }
    },
    [activeConvId, messages, langCode, strings]
  );

  /* ── Handle suggested question chip ── */
  function handleSuggestedQuestion(text) {
    handleSendMessage(text, []);
  }

  /* ── Start a new conversation ── */
  function handleNewChat() {
    const newConv = {
      id: generateId("conv"),
      title: "New Conversation",
      preview: "Start a new farming query…",
      timestamp: new Date().toISOString(),
      pinned: false,
      category: "today",
      messages: [],
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newConv.id);
  }

  /* ── Clear messages in current chat ── */
  function handleClearChat() {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId ? { ...c, messages: [], preview: "Cleared…" } : c
      )
    );
  }

  /* ── Delete a conversation ── */
  function handleDeleteConversation(convId) {
    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== convId);
      if (convId === activeConvId) {
        setActiveConvId(updated[0]?.id || null);
      }
      return updated;
    });
  }

  /* ── Pin / unpin a conversation ── */
  function handlePinConversation(convId) {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, pinned: !c.pinned } : c
      )
    );
  }

  /* ── Select a conversation ── */
  function handleSelectConversation(convId) {
    setActiveConvId(convId);
  }

  return (
    <div className={`ai-chatbox ai-chat-module ${theme}-theme ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      {/* Mobile sidebar drawer backdrop */}
      {sidebarOpen && (
        <div
          className="ai-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (Collapsible & Drawer) ── */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConvId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        onPinConversation={handlePinConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        strings={strings}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />

      {/* ── Main Chat Area ── */}
      <main className="ai-chat-main">
        {/* Header */}
        <ChatHeader
          onClearChat={handleClearChat}
          onNewChat={handleNewChat}
          onClose={onClose}
          onToggleSidebar={handleToggleSidebar}
          showClose={showClose}
          currentLang={langCode}
          onLangChange={handleLangChange}
          strings={strings}
          theme={theme}
          toggleTheme={toggleTheme}
          isSidebarCollapsed={sidebarCollapsed}
        />

        {/* Messages / Empty state Welcome Screen */}
        <div className={`ai-content-body-wrap ${langFade ? "ai-lang-fade" : ""}`}>
          {messages.length === 0 && !isTyping ? (
            <EmptyChat
              onQuickAction={handleSuggestedQuestion}
              strings={strings}
              langCode={langCode}
            />
          ) : (
            <section
              className="ai-messages-panel"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
            >
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isTyping && <TypingIndicator typingText={strings.typingText} />}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} aria-hidden="true" />
            </section>
          )}
        </div>

        {/* Suggested questions chips row (rendered at bottom when conversation is active) */}
        {messages.length > 0 && !isTyping && (
          <SuggestedQuestions
            onSelect={handleSuggestedQuestion}
            langCode={langCode}
            label={strings.suggestedLabel}
          />
        )}

        {/* Input bar */}
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
          strings={strings}
          langCode={langCode}
        />
      </main>
    </div>
  );
}

export default ChatBox;
