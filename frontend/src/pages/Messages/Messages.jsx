import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Card from '../../components/Card/Card';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { getConversations, getMessages, sendMessage, markConversationRead } from '../../services/chatService';
import { 
  FiSearch, FiPhone, FiMoreVertical, FiPaperclip, 
  FiImage, FiSmile, FiSend, FiX, FiCheck, FiFileText,
  FiMapPin, FiPhoneCall, FiDollarSign, FiBox, FiMessageSquare
} from 'react-icons/fi';
import './Messages.css';

/* ═══════════════════════════════════════════════════════════════════════════════
   DUMMY DATA — Realistic agricultural conversations
   ═══════════════════════════════════════════════════════════════════════════════ */

// eslint-disable-next-line no-unused-vars
const CURRENT_USER = {
  id: 'user-self',
  name: 'You',
  role: 'Farmer',
  avatar: '👨‍🌾', // Kept for avatar only as assumed
};



const QUICK_ACTIONS = [
  { icon: <FiBox />, label: 'Product Details', text: 'Can you share the product details?' },
  { icon: <FiDollarSign />, label: 'Negotiate Price', text: 'Can we negotiate the price?' },
  { icon: <FiFileText />, label: 'Delivery Status', text: 'What is the delivery status?' },
  { icon: <FiSearch />, label: 'Crop Availability', text: 'Is this crop available right now?' },
  { icon: <FiMapPin />, label: 'Share Location', text: 'Here is my delivery location:' },
  { icon: <FiPhoneCall />, label: 'Request Call', text: 'Can we talk over a phone call?' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */



// ─── Message Bubble (WhatsApp Style) ──────────────────────────────
function MessageBubble({ message, isSelf }) {
  const statusIcon = () => {
    if (!isSelf) return null;
    if (message.status === 'read') return <span className="msg-status msg-status--read"><FiCheck /><FiCheck style={{marginLeft: '-8px'}}/></span>;
    if (message.status === 'delivered') return <span className="msg-status msg-status--delivered"><FiCheck /><FiCheck style={{marginLeft: '-8px'}}/></span>;
    return <span className="msg-status msg-status--sent"><FiCheck /></span>;
  };

  return (
    <div className={`msg-bubble-row ${isSelf ? 'msg-bubble-row--self' : 'msg-bubble-row--other'}`}>
      <div className={`msg-bubble ${isSelf ? 'msg-bubble--self' : 'msg-bubble--other'}`}>
        
        {/* File attachment */}
        {message.type === 'file' && (
          <div className="msg-file-preview" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '8px' }}>
            <FiFileText size={24} color="#54656F" />
            <div className="msg-file-info" style={{ flex: 1 }}>
              <div className="msg-file-name" style={{ fontSize: '13px', fontWeight: 600 }}>{message.fileName}</div>
              <div className="msg-file-size" style={{ fontSize: '11px', color: '#667781' }}>{message.fileSize}</div>
            </div>
          </div>
        )}

        {/* Location */}
        {message.type === 'location' && (
          <div className="msg-location-preview" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', background: 'rgba(0,0,0,0.05)', padding: '8px', borderRadius: '8px' }}>
            <FiMapPin size={24} color="#54656F" />
            <span className="msg-location-text" style={{ fontSize: '13px', fontWeight: 500 }}>{message.location}</span>
          </div>
        )}

        {/* Text */}
        <div className="msg-text">{message.text}</div>

        <div className="msg-meta">
          <span className="msg-time">{message.time}</span>
          {statusIcon()}
        </div>
      </div>
    </div>
  );
}

// ─── Date Divider ─────────────────────────────────────────────────
function DateDivider({ text }) {
  return (
    <div className="msg-date-divider">
      <span>{text}</span>
    </div>
  );
}

// ─── Conversation Card ────────────────────────────────────────────
function ConversationCard({ contact, conversation, isActive, onClick }) {
  const roleClass = `msg-role-badge msg-role--${contact.role.toLowerCase()}`;
  return (
    <Card
      className={`msg-conv-card ${isActive ? 'msg-conv-card--active' : ''}`}
      onClick={onClick}
    >
      <div className="msg-conv-avatar-wrap">
        <span className="msg-conv-avatar">{contact.avatar}</span>
        {contact.online && <span className="msg-online-dot" />}
      </div>
      <div className="msg-conv-info">
        <div className="msg-conv-top">
          <span className="msg-conv-name">{contact.name}</span>
          <span className="msg-conv-time">{conversation.lastTime}</span>
        </div>
        <div className="msg-conv-bottom">
          <span className={roleClass}>{contact.role}</span>
          <span className="msg-conv-last">{conversation.lastMessage}</span>
        </div>
      </div>
      {conversation.unread > 0 && (
        <span className="msg-unread-badge">{conversation.unread}</span>
      )}
    </Card>
  );
}

// ─── Empty Chat Placeholder ───────────────────────────────────────
function EmptyChatView({ onQuickContact }) {
  return (
    <div className="msg-empty-chat">
      <div className="msg-empty-illustration">
        <svg viewBox="0 0 240 200" className="msg-empty-svg" aria-hidden="true" width="200" height="160">
          <defs>
            <linearGradient id="emptyBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8F5E9" />
              <stop offset="100%" stopColor="#C8E6C9" />
            </linearGradient>
          </defs>
          <rect width="240" height="200" fill="url(#emptyBg)" rx="20" />
          <rect x="40" y="40" width="100" height="28" rx="14" fill="white" opacity="0.9" />
          <rect x="50" y="48" width="60" height="4" rx="2" fill="#A5D6A7" />
          <rect x="50" y="56" width="40" height="4" rx="2" fill="#C8E6C9" />
          <rect x="100" y="80" width="100" height="28" rx="14" fill="#2E7D32" opacity="0.85" />
          <rect x="110" y="88" width="60" height="4" rx="2" fill="#A5D6A7" />
          <rect x="110" y="96" width="40" height="4" rx="2" fill="#66BB6A" />
          <rect x="50" y="120" width="80" height="24" rx="12" fill="white" opacity="0.9" />
          <rect x="58" y="128" width="50" height="4" rx="2" fill="#A5D6A7" />
          <rect x="58" y="136" width="30" height="4" rx="2" fill="#C8E6C9" />
          <g transform="translate(160,120)">
            <rect x="0" y="0" width="36" height="56" rx="6" fill="white" opacity="0.95" />
            <rect x="4" y="6" width="28" height="38" rx="3" fill="#E8F5E9" />
            <circle cx="18" cy="50" r="4" fill="#C8E6C9" />
            <rect x="8" y="12" width="18" height="3" rx="1.5" fill="#A5D6A7" />
            <rect x="8" y="18" width="14" height="3" rx="1.5" fill="#C8E6C9" />
            <rect x="8" y="26" width="20" height="3" rx="1.5" fill="#66BB6A" opacity="0.5" />
          </g>
          <circle cx="30" cy="170" r="12" fill="#FFD54F" opacity="0.3" />
          <circle cx="200" cy="30" r="18" fill="#66BB6A" opacity="0.2" />
        </svg>
      </div>
      <h2 className="msg-empty-title">Smart Krishi Messaging</h2>
      <p className="msg-empty-desc">
        Connect seamlessly with farmers, vendors, and customers. Select a conversation to start chatting.
      </p>
      <div className="msg-empty-badge">
        <FiCheck /> End-to-end Encrypted
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showUnread, setShowUnread] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Sync activeChatRef for socket callback closures
  useEffect(() => {
    activeChatRef.current = activeChat;
    setIsPartnerTyping(false); // Reset typing status when switching chats
  }, [activeChat]);

  // Setup Socket.io real-time connection
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
    const socketUrl = VITE_API_BASE_URL.replace(/\/api\/?$/, "");

    console.log("[Socket Client] Connecting to:", socketUrl);
    const socket = io(socketUrl, {
      auth: { token }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket Client] Connected successfully.");
    });

    socket.on("messageReceived", (newMessage) => {
      console.log("[Socket Client] Real-time message received:", newMessage);
      if (activeChatRef.current === newMessage.conversation) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === newMessage._id)) return prev;
          return [...prev, newMessage];
        });
        markConversationRead(newMessage.conversation).catch(console.error);
      }
      loadConversations();
    });

    socket.on("userTyping", ({ conversationId }) => {
      if (activeChatRef.current === conversationId) {
        setIsPartnerTyping(true);
      }
    });

    socket.on("userStopTyping", ({ conversationId }) => {
      if (activeChatRef.current === conversationId) {
        setIsPartnerTyping(false);
      }
    });

    return () => {
      console.log("[Socket Client] Disconnecting socket...");
      socket.disconnect();
    };
  }, [user]);

  // Active conversation object
  const activeConv = conversations.find((c) => c._id === activeChat);
  const activeContact = activeConv?.participants.find((p) => p._id !== user?._id);

  // Fetch conversations list on mount
  const loadConversations = async () => {
    try {
      const res = await getConversations();
      if (res.data?.success) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  // Fetch messages when activeChat changes
  useEffect(() => {
    if (activeChat) {
      const fetchMessages = async () => {
        try {
          const res = await getMessages(activeChat);
          if (res.data?.success) {
            setMessages(res.data.messages);
            await markConversationRead(activeChat);
          }
        } catch (err) {
          console.error("Error loading messages:", err);
        }
      };
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages?.length]);

  // Focus input when chat changes
  useEffect(() => {
    if (activeChat && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [activeChat]);

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const partner = conv.participants.find((p) => p._id !== user?._id);
    if (!partner) return false;
    if (searchQuery && !partner.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterRole !== 'All' && partner.role !== filterRole) return false;
    return true;
  });

  const totalUnread = conversations.reduce((acc, conv) => {
    // If last message exists and is not sent by current user, check read status
    const isUnread = conv.lastMessage && conv.lastMessage.sender?._id !== user?._id && !conv.lastMessage.isRead;
    return acc + (isUnread ? 1 : 0);
  }, 0);

  const handleSelectChat = async (convId) => {
    setActiveChat(convId);
    setMobileView('chat');
    try {
      await markConversationRead(convId);
      loadConversations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (!activeChat || !socketRef.current || !activeContact) return;

    // Emit typing status
    socketRef.current.emit("typing", {
      conversationId: activeChat,
      receiverId: activeContact._id
    });

    // Debounce stopTyping event
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        socketRef.current.emit("stopTyping", {
          conversationId: activeChat,
          receiverId: activeContact._id
        });
      }
    }, 2000);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat) return;

    try {
      const text = messageInput.trim();
      setMessageInput('');

      // Emit stopTyping immediately
      if (socketRef.current && activeContact) {
        socketRef.current.emit("stopTyping", {
          conversationId: activeChat,
          receiverId: activeContact._id
        });
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      const res = await sendMessage({ conversationId: activeChat, text });
      if (res.data?.success) {
        setMessages((prev) => [...prev, res.data.message]);
        loadConversations();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (text) => {
    setMessageInput(text);
    inputRef.current?.focus();
  };

  const handleBackToList = () => {
    setMobileView('list');
    setActiveChat(null);
  };

  return (
    <div className="msg-root">
      {/* ═══ NAVBAR ═══════════════════════════════════ */}
      <Navbar 
        user={user}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        notificationSlot={<NotificationBell notifications={[]} />}
      />

      {/* ═══ MAIN LAYOUT ═════════════════════════════ */}
      <div className="msg-page-layout">
        
        {/* ── Global Sidebar ──────────────────────── */}
        <Sidebar 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          activeItem="messages"
          onNavigate={(item) => navigate(item.path)}
          onLogout={() => navigate('/login')}
        />

        {/* ── Page Content ────────────────────────── */}
        <main className="msg-main-content">
          <div className="msg-layout">

            {/* ── LEFT PANEL — Conversation List ─────── */}
            <aside className={`msg-sidebar ${mobileView === 'list' ? 'msg-sidebar--visible' : ''}`}>

              {/* Sidebar Header */}
              <div className="msg-sidebar-header">
                <div className="msg-sidebar-title-row">
                  <h2 className="msg-sidebar-title">Messages</h2>
                </div>

                {/* Search */}
                <div className="msg-sidebar-search">
                  <FiSearch className="msg-search-icon" />
                  <input
                    type="text"
                    className="msg-search-input"
                    placeholder="Search or start new chat"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button className="msg-search-clear" onClick={() => setSearchQuery('')}><FiX /></button>
                  )}
                </div>

                {/* Filter Chips */}
                <div className="msg-filter-chips">
                  {['All', 'Unread', 'Farmer', 'Vendor', 'Customer'].map((f) => (
                    <button
                      key={f}
                      className={`msg-filter-chip ${
                        (f === 'Unread' && showUnread) ||
                        (f !== 'Unread' && f === filterRole)
                          ? 'msg-filter-chip--active'
                          : ''
                      }`}
                      onClick={() => {
                        if (f === 'Unread') {
                          setShowUnread(!showUnread);
                        } else {
                          setFilterRole(f);
                          setShowUnread(false);
                        }
                      }}
                    >
                      {f}
                      {f === 'Unread' && totalUnread > 0 && (
                        <span className="msg-chip-count">{totalUnread}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversation List */}
              <div className="msg-conv-list">
                {filteredConversations.length === 0 ? (
                  <div className="msg-empty-chat" style={{ padding: '20px' }}>
                    <p>No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => {
                    const partner = conv.participants.find((p) => p._id !== user?._id);
                    if (!partner) return null;
                    const contactObj = {
                      id: conv._id,
                      name: partner.fullName,
                      role: partner.role,
                      avatar: partner.role === 'Farmer' ? '👨‍🌾' : (partner.role === 'Vendor' ? '🏬' : '🤵'),
                      online: true,
                    };
                    const convData = {
                      lastMessage: conv.lastMessage?.text || 'No messages yet',
                      lastTime: conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                      unread: (conv.lastMessage && conv.lastMessage.sender?._id !== user?._id && !conv.lastMessage.isRead) ? 1 : 0
                    };
                    return (
                      <ConversationCard
                        key={conv._id}
                        contact={contactObj}
                        conversation={convData}
                        isActive={activeChat === conv._id}
                        onClick={() => handleSelectChat(conv._id)}
                      />
                    );
                  })
                )}
              </div>
            </aside>

            {/* ── RIGHT PANEL — Chat Window ──────────── */}
            <section className={`msg-chat-panel ${mobileView === 'chat' ? 'msg-chat--visible' : ''}`}>
              {!activeChat ? (
                <EmptyChatView onQuickContact={(contactId) => handleSelectChat(contactId)} />
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="msg-chat-header">
                    <button className="msg-back-btn" onClick={handleBackToList}>
                      ← 
                    </button>
                    <div className="msg-chat-user-info">
                      <div className="msg-chat-avatar-wrap">
                        <span className="msg-chat-avatar">
                          {activeContact?.role === 'Farmer' ? '👨‍🌾' : (activeContact?.role === 'Vendor' ? '🏬' : '🤵')}
                        </span>
                      </div>
                      <div className="msg-chat-user-text">
                        <div className="msg-chat-user-name">{activeContact?.fullName}</div>
                        <div className="msg-chat-user-status">
                          <span className={`msg-role-badge msg-role--${(activeContact?.role || 'Farmer').toLowerCase()}`}>{activeContact?.role}</span>
                          <span className="msg-chat-last-seen">
                            {isPartnerTyping ? <span style={{ color: "#2E7D32", fontWeight: "bold" }}>typing...</span> : "Online"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="msg-chat-actions">
                      <button className="msg-chat-action-btn" title="Voice Call"><FiPhone /></button>
                      <button className="msg-chat-action-btn" title="Search"><FiSearch /></button>
                      <button className="msg-chat-action-btn" title="More Options"><FiMoreVertical /></button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="msg-messages-area">
                    <DateDivider text="Today" />
                    {messages.map((msg) => (
                      <MessageBubble
                        key={msg._id}
                        message={{
                          ...msg,
                          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }}
                        isSelf={msg.sender?._id === user?._id || msg.sender === user?._id}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions */}
                  {showQuickActions && (
                    <div className="msg-quick-actions">
                      <div className="msg-quick-actions-row">
                        {QUICK_ACTIONS.map((action, i) => (
                          <button
                            key={i}
                            className="msg-quick-chip"
                            onClick={() => handleQuickAction(action.text)}
                          >
                            {action.icon} {action.label}
                          </button>
                        ))}
                        <button className="msg-quick-chip" onClick={() => setShowQuickActions(false)} title="Hide">
                           <FiX /> Hide
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="msg-input-area">
                    <div className="msg-input-actions">
                      <button className="msg-input-btn" title="Emoji"><FiSmile /></button>
                      <button className="msg-input-btn" title="Attach File"><FiPaperclip /></button>
                      <button className="msg-input-btn" title="Image"><FiImage /></button>
                    </div>
                    <div className="msg-input-wrap">
                      <textarea
                        ref={inputRef}
                        className="msg-input-field"
                        placeholder="Type your message..."
                        value={messageInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        rows={1}
                      />
                    </div>
                    <button 
                      className="msg-send-btn" 
                      onClick={handleSendMessage} 
                      title="Send"
                      disabled={!messageInput.trim()}
                      style={{ opacity: messageInput.trim() ? 1 : 0.5, cursor: messageInput.trim() ? 'pointer' : 'default' }}
                    >
                      <FiSend />
                    </button>
                  </div>
                </>
              )}

              {/* Floating AI Assistant */}
              <button className="msg-fab" title="Ask AI Assistant">
                 <FiMessageSquare color="#2E7D32" size={24} />
              </button>

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}


