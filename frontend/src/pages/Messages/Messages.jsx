import React, { useState, useEffect, useRef } from 'react';

import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import NotificationBell from '../../components/NotificationBell/NotificationBell';

import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import Card from '../../components/Card/Card';
import { useAuth } from '../../context/AuthContext';
import { getConversations, getMessages, sendMessage, sendImageMessage, markConversationRead, getContacts, deleteMessage } from '../../services/chatService';
import { 
  FiSearch, FiSend, FiX, FiCheck, FiBox, FiMessageSquare, FiTrash2, FiImage, FiPaperclip, FiLoader
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
  { icon: <FiBox />, label: 'Negotiate Price', text: 'Can we negotiate the price?' },
  { icon: <FiBox />, label: 'Delivery Status', text: 'What is the delivery status?' },
  { icon: <FiSearch />, label: 'Crop Availability', text: 'Is this crop available right now?' },
];

/* ═══════════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */



// ─── Message Bubble (WhatsApp Style) ──────────────────────────────
function MessageBubble({ message, isSelf, onDelete }) {
  const statusIcon = () => {
    if (!isSelf) return null;
    if (message.isRead) return <span className="msg-status msg-status--read"><FiCheck /><FiCheck style={{marginLeft: '-8px'}}/></span>;
    if (message.delivered) return <span className="msg-status msg-status--delivered"><FiCheck /><FiCheck style={{marginLeft: '-8px'}}/></span>;
    return <span className="msg-status msg-status--sent"><FiCheck /></span>;
  };

  return (
    <div className={`msg-bubble-row ${isSelf ? 'msg-bubble-row--self' : 'msg-bubble-row--other'}`}>
      <div className={`msg-bubble ${isSelf ? 'msg-bubble--self' : 'msg-bubble--other'}`}>
        {/* Text */}
        <div className="msg-text" style={{ fontStyle: message.deleted ? 'italic' : 'normal', color: message.deleted ? '#888' : 'inherit' }}>
          {message.imageUrl && !message.deleted && (
            <div className="msg-image-wrap" onClick={() => window.open(message.imageUrl, '_blank')}>
              <img src={message.imageUrl} alt="Uploaded" className="msg-photo" />
            </div>
          )}
          {message.text}
        </div>

        <div className="msg-meta">
          <span className="msg-time">{message.time}</span>
          {statusIcon()}
          {isSelf && !message.deleted && (
            <button className="msg-delete-btn" onClick={() => onDelete(message._id)} title="Delete Message">
              <FiTrash2 size={12} />
            </button>
          )}
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
        {contact.avatar ? (
          <img src={contact.avatar} alt={contact.name} className="msg-conv-avatar" style={{ objectFit: 'cover' }} />
        ) : (
          <span className="msg-conv-avatar">{contact.name?.charAt(0).toUpperCase()}</span>
        )}
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

function DraggableFAB({ onClick }) {
  const [position, setPosition] = useState(null);
  const draggingRef = useRef(false);
  const startPosRef = useRef({ offsetX: 0, offsetY: 0 });
  const hasMovedRef = useRef(false);

  const handlePointerDown = (e) => {
    draggingRef.current = true;
    hasMovedRef.current = false;
    const rect = e.currentTarget.getBoundingClientRect();
    startPosRef.current = {
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;
    hasMovedRef.current = true;
    let newX = e.clientX - startPosRef.current.offsetX;
    let newY = e.clientY - startPosRef.current.offsetY;
    newX = Math.max(0, Math.min(newX, window.innerWidth - 60));
    newY = Math.max(0, Math.min(newY, window.innerHeight - 60));
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const handleClick = (e) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (onClick) onClick(e);
  };

  return (
    <button 
      className="msg-fab" 
      title="Ask AI Assistant"
      style={position ? { left: position.x, top: position.y, bottom: 'auto', right: 'auto', margin: 0, transition: 'none' } : {}}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
    >
      <FiMessageSquare color="#2E7D32" size={24} style={{ pointerEvents: 'none' }} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function Messages() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showUnread, setShowUnread] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const activeChatRef = useRef(activeChat);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [onlineUsersMap, setOnlineUsersMap] = useState(new Set());

  // Sync activeChatRef for socket callback closures
  useEffect(() => {
    activeChatRef.current = activeChat;
    setIsPartnerTyping(false); // Reset typing status when switching chats
  }, [activeChat]);

  // Setup Socket.io real-time connection
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    
    // Resolve base URL safely across CRA and Vite environments
    let apiBase = "http://localhost:5000/api";
    try {
      if (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
        apiBase = import.meta.env.VITE_API_BASE_URL;
      }
    } catch (e) {}
    try {
      if (process && process.env && process.env.REACT_APP_API_BASE_URL) {
        apiBase = process.env.REACT_APP_API_BASE_URL;
      }
    } catch (e) {}

    const socketUrl = apiBase.replace(/\/api\/?$/, "");

    console.log("[Socket Client] Connecting to:", socketUrl);
    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"]
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

    socket.on("messageDeleted", ({ messageId, conversationId }) => {
      if (activeChatRef.current === conversationId) {
        setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, deleted: true, text: 'This message was deleted' } : m));
      }
      loadConversations();
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsersMap(new Set(users));
    });

    socket.on("userOnline", (userId) => {
      setOnlineUsersMap(prev => {
        const next = new Set(prev);
        next.add(userId);
        return next;
      });
    });

    socket.on("userOffline", (userId) => {
      setOnlineUsersMap(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    return () => {
      console.log("[Socket Client] Disconnecting socket...");
      socket.disconnect();
    };
  }, [user]);

  // Active conversation object
  const activeConv = conversations.find((c) => c._id === activeChat);
  const activeContact = activeConv?.participants.find((p) => p._id !== user?._id);

  const loadConversations = async () => {
    try {
      const [convRes, contactsRes] = await Promise.all([
        getConversations(),
        getContacts()
      ]);
      if (convRes.data?.success) {
        setConversations(convRes.data.conversations);
      }
      if (contactsRes.data?.success) {
        setContacts(contactsRes.data.contacts);
      }
    } catch (err) {
      console.error("Error loading conversations or contacts:", err);
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

  // Generate chat list items: existing conversations + new contacts
  const chatListItems = [];

  // Add existing conversations
  conversations.forEach((conv) => {
    const partner = conv.participants.find((p) => p._id !== user?._id);
    if (!partner) return;

    let lastMsgRender = 'No messages yet';
    if (conv.lastMessage) {
      if (conv.lastMessage.messageType === 'Image' || conv.lastMessage.imageUrl) {
        lastMsgRender = <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><FiImage size={12}/> Photo</span>;
      } else {
        lastMsgRender = conv.lastMessage.text;
      }
    }

    chatListItems.push({
      _id: conv._id,
      isConv: true,
      partner,
      lastMessage: lastMsgRender,
      lastTime: conv.lastMessage ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      unread: (conv.lastMessage && conv.lastMessage.sender?._id !== user?._id && !conv.lastMessage.isRead) ? 1 : 0
    });
  });

  // Add contacts that don't have a conversation yet
  contacts.forEach((contact) => {
    if (contact._id === user?._id) return;
    const exists = chatListItems.some(item => item.partner._id === contact._id);
    if (!exists) {
      // Create a pseudo-conversation for the contact
      chatListItems.push({
        _id: `contact-${contact._id}`,
        isConv: false,
        partner: contact,
        lastMessage: 'Start a new conversation',
        lastTime: '',
        unread: 0
      });
    }
  });

  // Filter conversations
  const filteredConversations = chatListItems.filter((item) => {
    const partner = item.partner;
    if (searchQuery && !partner.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterRole !== 'All' && partner.role !== filterRole) return false;
    return true;
  });


  const totalUnread = conversations.reduce((acc, conv) => {
    // If last message exists and is not sent by current user, check read status
    const isUnread = conv.lastMessage && conv.lastMessage.sender?._id !== user?._id && !conv.lastMessage.isRead;
    return acc + (isUnread ? 1 : 0);
  }, 0);

  const handleSelectChat = async (item) => {
    if (item.isConv) {
      setActiveChat(item._id);
      setMobileView('chat');
      try {
        await markConversationRead(item._id);
        loadConversations();
      } catch (err) {
        console.error(err);
      }
    } else {
      // It's a new contact, start a conversation first via API or just set activeChat to a temporary state.
      // But the backend `sendMessage` handles creating one if activeConvId is missing but recipientId is given.
      // Wait, we need an activeChat ID. The easiest is to call startConversation.
      import('../../services/chatService').then(async ({ startConversation }) => {
        try {
          const res = await startConversation(item.partner._id);
          if (res.data?.success) {
            setActiveChat(res.data.conversation._id);
            setMobileView('chat');
            loadConversations();
          }
        } catch (err) {
          console.error(err);
        }
      });
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    
    if (inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 10);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSendMessage = async () => {
    if ((!messageInput.trim() && !selectedImage) || !activeChat || isUploading) return;

    try {
      const text = messageInput.trim();
      setMessageInput('');
      setIsUploading(true);

      // Emit stopTyping immediately
      if (socketRef.current && activeContact) {
        socketRef.current.emit("stopTyping", {
          conversationId: activeChat,
          receiverId: activeContact._id
        });
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      let res;
      if (selectedImage) {
        const formData = new FormData();
        formData.append('conversationId', activeChat);
        if (text) formData.append('text', text);
        formData.append('image', selectedImage);
        res = await sendImageMessage(formData);
        removeImage();
      } else {
        res = await sendMessage({ conversationId: activeChat, text });
      }

      if (res.data?.success) {
        setMessages((prev) => [...prev, res.data.message]);
        loadConversations();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsUploading(false);
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

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await deleteMessage(messageId);
      if (res.data?.success) {
        setMessages((prev) => prev.map(m => m._id === messageId ? { ...m, deleted: true, text: 'This message was deleted' } : m));
      }
    } catch (err) {
      console.error("Error deleting message:", err);
    }
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
                  filteredConversations.map((item) => {
                    const partner = item.partner;
                    const contactObj = {
                      id: partner._id,
                      name: partner.fullName,
                      role: partner.role,
                      avatar: partner.profileImage || null,
                      online: onlineUsersMap.has(partner._id),
                    };
                    const convData = {
                      lastMessage: item.lastMessage,
                      lastTime: item.lastTime,
                      unread: item.unread
                    };
                    return (
                      <ConversationCard
                        key={item._id}
                        contact={contactObj}
                        conversation={convData}
                        isActive={activeChat === item._id}
                        onClick={() => handleSelectChat(item)}
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
                    <div className="msg-chat-user-info" onClick={() => navigate(`/profile/${activeContact?._id}`)} style={{ cursor: 'pointer' }} title="View Profile">
                      <div className="msg-chat-avatar-wrap" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                        {activeContact?.profileImage ? (
                          <img src={activeContact.profileImage} alt={activeContact.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="msg-chat-avatar">
                            {activeContact?.fullName?.charAt(0).toUpperCase()}
                          </span>
                        )}
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
                        onDelete={handleDeleteMessage}
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
                  {activeContact?.privacySettings?.allowMessages === false ? (
                    <div className="msg-input-area" style={{ justifyContent: 'center', background: '#f0f2f5' }}>
                      <p style={{ color: '#54656F', fontStyle: 'italic', margin: 0 }}>This user is not accepting messages.</p>
                    </div>
                  ) : (
                    <div className="msg-input-container-wrapper" style={{ display: 'flex', flexDirection: 'column' }}>
                      {imagePreview && (
                        <div className="msg-image-preview-container">
                          <img src={imagePreview} alt="Preview" className="msg-image-preview" />
                          <button className="msg-image-remove" onClick={removeImage}><FiX /></button>
                        </div>
                      )}
                      <div className="msg-input-area">
                        <div className="msg-input-wrap">
                          <label className="msg-attachment-btn" title="Attach Image">
                            <FiPaperclip size={20} color="#54656F" />
                            <input type="file" accept="image/jpeg,image/png,image/jpg,image/webp" hidden onChange={handleImageSelect} />
                          </label>
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
                          disabled={(!messageInput.trim() && !selectedImage) || isUploading}
                          style={{ opacity: (messageInput.trim() || selectedImage) && !isUploading ? 1 : 0.5, cursor: (messageInput.trim() || selectedImage) && !isUploading ? 'pointer' : 'default' }}
                        >
                          {isUploading ? <FiLoader className="spin-icon" /> : <FiSend />}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Floating AI Assistant */}
              <DraggableFAB />

            </section>

          </div>
        </main>
      </div>
    </div>
  );
}


