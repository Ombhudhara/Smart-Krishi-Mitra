import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import Card from '../../components/Card/Card';
import NotificationBell from '../../components/NotificationBell/NotificationBell';
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

const CONTACTS = [
  {
    id: 'c1',
    name: 'Raj Patel',
    role: 'Farmer',
    avatar: '👨‍🌾',
    online: true,
    lastSeen: 'Online',
    phone: '+91 98765 43210',
    location: 'Nashik, Maharashtra',
    crops: 'Wheat, Onion, Tomato',
  },
  {
    id: 'c2',
    name: 'AgroMart Store',
    role: 'Vendor',
    avatar: '🏪',
    online: true,
    lastSeen: 'Online',
    phone: '+91 87654 32109',
    location: 'Pune, Maharashtra',
    products: 'Seeds, Fertilizers, Pesticides',
  },
  {
    id: 'c3',
    name: 'Amit Sharma',
    role: 'Customer',
    avatar: '🧑‍💼',
    online: false,
    lastSeen: 'Last seen 2h ago',
    phone: '+91 76543 21098',
    location: 'Mumbai, Maharashtra',
  },
  {
    id: 'c4',
    name: 'Priya Devi',
    role: 'Farmer',
    avatar: '👩‍🌾',
    online: true,
    lastSeen: 'Online',
    phone: '+91 65432 10987',
    location: 'Indore, MP',
    crops: 'Soybean, Cotton',
  },
  {
    id: 'c5',
    name: 'KrishiMart India',
    role: 'Vendor',
    avatar: '🛒',
    online: false,
    lastSeen: 'Last seen 30m ago',
    phone: '+91 54321 09876',
    location: 'Ahmedabad, Gujarat',
    products: 'Drip Irrigation, Machinery',
  },
  {
    id: 'c6',
    name: 'Sneha Reddy',
    role: 'Customer',
    avatar: '👩',
    online: false,
    lastSeen: 'Last seen 5h ago',
    phone: '+91 43210 98765',
    location: 'Hyderabad, Telangana',
  },
  {
    id: 'c7',
    name: 'Suresh Kumar',
    role: 'Farmer',
    avatar: '👨‍🌾',
    online: true,
    lastSeen: 'Online',
    phone: '+91 32109 87654',
    location: 'Lucknow, UP',
    crops: 'Rice, Sugarcane, Potato',
  },
  {
    id: 'c8',
    name: 'FertilizeKing',
    role: 'Vendor',
    avatar: '🧪',
    online: true,
    lastSeen: 'Online',
    phone: '+91 21098 76543',
    location: 'Jaipur, Rajasthan',
    products: 'DAP, Urea, Micronutrients',
  },
];

const CONVERSATIONS_DATA = {
  c1: {
    lastMessage: 'Thanks bhai, the wheat seeds are excellent quality!',
    lastTime: '2:30 PM',
    unread: 0,
    messages: [
      { id: 'm1', from: 'c1', text: 'Namaste! I heard you got a great wheat yield this season?', time: '10:15 AM', status: 'read', type: 'text' },
      { id: 'm2', from: 'self', text: 'Haan bhai! 42 quintals per acre. Used HD-3226 variety with proper irrigation scheduling.', time: '10:18 AM', status: 'read', type: 'text' },
      { id: 'm3', from: 'c1', text: 'That\'s amazing! What fertilizer ratio did you follow?', time: '10:20 AM', status: 'read', type: 'text' },
      { id: 'm4', from: 'self', text: 'N:P:K at 120:60:40 kg/ha. Split nitrogen into 3 doses — basal, first irrigation, and second irrigation. Also added 25 kg ZnSO4.', time: '10:22 AM', status: 'read', type: 'text' },
      { id: 'm5', from: 'c1', text: 'Can you share the seed supplier details? I want to try the same variety next season.', time: '10:25 AM', status: 'read', type: 'text' },
      { id: 'm6', from: 'self', text: 'Sure! I got it from AgroMart Store in Pune. Very reliable. I\'ll share their contact.', time: '10:28 AM', status: 'read', type: 'text' },
      { id: 'm7', from: 'self', text: '📱 AgroMart Store: +91 87654 32109 (Pune, Maharashtra)', time: '10:29 AM', status: 'read', type: 'text' },
      { id: 'm8', from: 'c1', text: 'Perfect! Also, what\'s the current mandi rate for wheat in your area?', time: '2:15 PM', status: 'read', type: 'text' },
      { id: 'm9', from: 'self', text: 'MSP is ₹2,275/quintal this year. But local mandi is giving ₹2,350 because of high demand.', time: '2:22 PM', status: 'read', type: 'text' },
      { id: 'm10', from: 'c1', text: 'Thanks bhai, the wheat seeds are excellent quality!', time: '2:30 PM', status: 'read', type: 'text' },
    ],
  },
  c2: {
    lastMessage: 'Your order of DAP fertilizer is dispatched. Tracking: AGM-7842',
    lastTime: '1:45 PM',
    unread: 3,
    messages: [
      { id: 'm1', from: 'self', text: 'Namaste! Do you have DAP fertilizer in stock?', time: '9:00 AM', status: 'read', type: 'text' },
      { id: 'm2', from: 'c2', text: 'Namaste ji! Yes, DAP is available. We have 50 kg bags at ₹1,350 per bag. MRP is ₹1,400.', time: '9:05 AM', status: 'read', type: 'text' },
      { id: 'm3', from: 'self', text: 'I need 20 bags for my 5-acre wheat field. Can you offer a bulk discount?', time: '9:08 AM', status: 'read', type: 'text' },
      { id: 'm4', from: 'c2', text: 'For 20 bags, we can give ₹1,300/bag. Total: ₹26,000. Free delivery above ₹25,000!', time: '9:12 AM', status: 'read', type: 'text' },
      { id: 'm5', from: 'self', text: 'That\'s a good deal. Do you also have Zinc Sulphate?', time: '9:15 AM', status: 'read', type: 'text' },
      { id: 'm6', from: 'c2', text: 'Yes! ZnSO4 21% available at ₹52/kg. For 25 kg, it\'ll be ₹1,300.', time: '9:18 AM', status: 'read', type: 'text' },
      { id: 'm7', from: 'self', text: 'Perfect. Add 25 kg ZnSO4 to my order. Total kitna hoga?', time: '9:20 AM', status: 'read', type: 'text' },
      { id: 'm8', from: 'c2', text: 'Updated Order:\n📦 DAP 50kg x 20 bags = ₹26,000\n📦 ZnSO4 25kg = ₹1,300\n🚚 Delivery: FREE\n💰 Grand Total: ₹27,300\n\nPayment: UPI / Cash on Delivery', time: '9:25 AM', status: 'read', type: 'text' },
      { id: 'm9', from: 'self', text: 'Order confirmed! I\'ll pay via UPI. When will it be delivered?', time: '9:30 AM', status: 'read', type: 'text' },
      { id: 'm10', from: 'c2', text: 'Your order of DAP fertilizer is dispatched. Tracking: AGM-7842', time: '1:45 PM', status: 'delivered', type: 'text' },
      { id: 'm11', from: 'c2', text: '📄 Invoice: INV-2025-0784\nAgroMart Store, Pune\nDate: June 29, 2025\nTotal: ₹27,300', time: '1:46 PM', status: 'delivered', type: 'file', fileName: 'Invoice_AGM_0784.pdf', fileSize: '128 KB' },
      { id: 'm12', from: 'c2', text: 'Delivery expected by tomorrow 4 PM. Our driver Ramesh will contact you. 🙏', time: '1:48 PM', status: 'delivered', type: 'text' },
    ],
  },
  c3: {
    lastMessage: 'Can you deliver 50 kg organic wheat to Mumbai?',
    lastTime: '12:10 PM',
    unread: 2,
    messages: [
      { id: 'm1', from: 'c3', text: 'Hello! I saw your listing for organic wheat on Smart Krishi Mitra.', time: '11:30 AM', status: 'read', type: 'text' },
      { id: 'm2', from: 'self', text: 'Namaste! Yes, I have organic wheat available. HD-3226 variety, freshly harvested last week.', time: '11:33 AM', status: 'read', type: 'text' },
      { id: 'm3', from: 'c3', text: 'Is it really organic? Do you have any certification?', time: '11:35 AM', status: 'read', type: 'text' },
      { id: 'm4', from: 'self', text: 'Yes sir, I have NPOP organic certification. No chemical fertilizers used. Only vermicompost and neem-based pest control. I can share the certificate.', time: '11:38 AM', status: 'read', type: 'text' },
      { id: 'm5', from: 'self', text: '📄 Organic Certificate — NPOP Certified\nFarm: Patel Organic Farm\nValid until: March 2026', time: '11:39 AM', status: 'read', type: 'file', fileName: 'NPOP_Certificate.pdf', fileSize: '340 KB' },
      { id: 'm6', from: 'c3', text: 'Excellent! What\'s the price per kg?', time: '11:42 AM', status: 'read', type: 'text' },
      { id: 'm7', from: 'self', text: 'Organic wheat: ₹45/kg for retail, ₹38/kg for bulk (above 25 kg). Regular market price is ₹28/kg.', time: '11:45 AM', status: 'read', type: 'text' },
      { id: 'm8', from: 'c3', text: 'I\'d like 50 kg. So that\'s ₹38 x 50 = ₹1,900. Correct?', time: '11:50 AM', status: 'read', type: 'text' },
      { id: 'm9', from: 'self', text: 'Yes, ₹1,900 + delivery charges based on location. Where do you need delivery?', time: '11:55 AM', status: 'read', type: 'text' },
      { id: 'm10', from: 'c3', text: 'Can you deliver 50 kg organic wheat to Mumbai?', time: '12:10 PM', status: 'delivered', type: 'text' },
      { id: 'm11', from: 'c3', text: '📍 Delivery Address: Andheri West, Mumbai 400058', time: '12:11 PM', status: 'delivered', type: 'location', location: 'Andheri West, Mumbai 400058' },
    ],
  },
  c4: {
    lastMessage: 'My soybean is looking great this year!',
    lastTime: '11:20 AM',
    unread: 0,
    messages: [
      { id: 'm1', from: 'c4', text: 'Namaste! How is your Kharif season going?', time: '10:00 AM', status: 'read', type: 'text' },
      { id: 'm2', from: 'self', text: 'Going well! Cotton is growing nicely. How about yours?', time: '10:05 AM', status: 'read', type: 'text' },
      { id: 'm3', from: 'c4', text: 'My soybean is looking great this year!', time: '11:20 AM', status: 'read', type: 'text' },
    ],
  },
  c5: {
    lastMessage: 'We have new drip irrigation kits at 30% subsidy.',
    lastTime: 'Yesterday',
    unread: 1,
    messages: [
      { id: 'm1', from: 'c5', text: 'Namaste! We have new drip irrigation kits at 30% subsidy under PM Krishi Sinchai Yojana. Interested?', time: 'Yesterday 4:30 PM', status: 'read', type: 'text' },
      { id: 'm2', from: 'self', text: 'Yes! I have 3 acres of cotton. Which kit would you recommend?', time: 'Yesterday 4:35 PM', status: 'read', type: 'text' },
      { id: 'm3', from: 'c5', text: 'We have new drip irrigation kits at 30% subsidy.', time: 'Yesterday 4:40 PM', status: 'delivered', type: 'text' },
    ],
  },
  c6: {
    lastMessage: 'Do you have fresh tomatoes available?',
    lastTime: 'Yesterday',
    unread: 1,
    messages: [
      { id: 'm1', from: 'c6', text: 'Hi! Do you have fresh tomatoes available? I need 10 kg for my restaurant.', time: 'Yesterday 2:00 PM', status: 'read', type: 'text' },
      { id: 'm2', from: 'self', text: 'Yes! Farm-fresh tomatoes, picked this morning. ₹35/kg for restaurants.', time: 'Yesterday 2:15 PM', status: 'read', type: 'text' },
      { id: 'm3', from: 'c6', text: 'Do you have fresh tomatoes available?', time: 'Yesterday 2:20 PM', status: 'delivered', type: 'text' },
    ],
  },
  c7: {
    lastMessage: 'Rice transplanting done. Fingers crossed!',
    lastTime: 'Mon',
    unread: 0,
    messages: [
      { id: 'm1', from: 'c7', text: 'Rice transplanting done. Fingers crossed!', time: 'Mon 6:30 PM', status: 'read', type: 'text' },
    ],
  },
  c8: {
    lastMessage: 'New Urea Neem Coated stock available!',
    lastTime: 'Sun',
    unread: 0,
    messages: [
      { id: 'm1', from: 'c8', text: 'New Urea Neem Coated stock available! ₹266 per 45kg bag. Bulk discounts available.', time: 'Sun 10:00 AM', status: 'read', type: 'text' },
    ],
  },
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

// ─── Typing Indicator ─────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="msg-bubble-row msg-bubble-row--other">
      <div className="msg-bubble msg-bubble--other msg-typing-bubble" style={{ padding: '12px', minWidth: '50px' }}>
        <span className="msg-typing-dot" />
        <span className="msg-typing-dot" />
        <span className="msg-typing-dot" />
      </div>
    </div>
  );
}

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
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showUnread, setShowUnread] = useState(false);
  const [conversations, setConversations] = useState(CONVERSATIONS_DATA);
  const [isTyping, setIsTyping] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const activeContact = CONTACTS.find((c) => c.id === activeChat);
  const activeConv = activeChat ? conversations[activeChat] : null;

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConv?.messages?.length, isTyping]);

  // Focus input when chat changes
  useEffect(() => {
    if (activeChat && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [activeChat]);

  // Filter conversations
  const filteredContacts = CONTACTS.filter((c) => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filterRole !== 'All' && c.role !== filterRole) return false;
    if (showUnread && (!conversations[c.id] || conversations[c.id].unread === 0)) return false;
    return true;
  });

  // Sort by unread first, then by time
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const convA = conversations[a.id];
    const convB = conversations[b.id];
    if (!convA || !convB) return 0;
    if (convA.unread > 0 && convB.unread === 0) return -1;
    if (convA.unread === 0 && convB.unread > 0) return 1;
    return 0;
  });

  const totalUnread = Object.values(conversations).reduce((s, c) => s + (c.unread || 0), 0);

  const handleSelectChat = (contactId) => {
    setActiveChat(contactId);
    setMobileView('chat');
    // Mark as read
    setConversations((prev) => ({
      ...prev,
      [contactId]: { ...prev[contactId], unread: 0 },
    }));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      from: 'self',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'delivered',
      type: 'text',
    };

    setConversations((prev) => ({
      ...prev,
      [activeChat]: {
        ...prev[activeChat],
        messages: [...prev[activeChat].messages, newMsg],
        lastMessage: newMsg.text,
        lastTime: newMsg.time,
      },
    }));

    setMessageInput('');

    // Simulate typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const autoReply = {
        id: `m-${Date.now() + 1}`,
        from: activeChat,
        text: getAutoReply(activeContact?.role),
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        status: 'read',
        type: 'text',
      };
      setConversations((prev) => ({
        ...prev,
        [activeChat]: {
          ...prev[activeChat],
          messages: [...prev[activeChat].messages, autoReply],
          lastMessage: autoReply.text,
          lastTime: autoReply.time,
        },
      }));
    }, 2000 + Math.random() * 1500);
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
        user={{ name: CURRENT_USER.name, role: CURRENT_USER.role }}
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
                {sortedContacts.length === 0 ? (
                  <div className="msg-empty-chat" style={{ padding: '20px' }}>
                    <p>No conversations found</p>
                  </div>
                ) : (
                  sortedContacts.map((contact) => (
                    <ConversationCard
                      key={contact.id}
                      contact={contact}
                      conversation={conversations[contact.id]}
                      isActive={activeChat === contact.id}
                      onClick={() => handleSelectChat(contact.id)}
                    />
                  ))
                )}
              </div>
            </aside>

            {/* ── RIGHT PANEL — Chat Window ──────────── */}
            <section className={`msg-chat-panel ${mobileView === 'chat' ? 'msg-chat--visible' : ''}`}>
              {!activeChat ? (
                <EmptyChatView onQuickContact={handleSelectChat} />
              ) : (
                <>
                  {/* Chat Header */}
                  <div className="msg-chat-header">
                    <button className="msg-back-btn" onClick={handleBackToList}>
                      ← 
                    </button>
                    <div className="msg-chat-user-info">
                      <div className="msg-chat-avatar-wrap">
                        <span className="msg-chat-avatar">{activeContact.avatar}</span>
                      </div>
                      <div className="msg-chat-user-text">
                        <div className="msg-chat-user-name">{activeContact.name}</div>
                        <div className="msg-chat-user-status">
                          <span className={`msg-role-badge msg-role--${activeContact.role.toLowerCase()}`}>{activeContact.role}</span>
                          <span className="msg-chat-last-seen">
                            {activeContact.online ? 'Online' : activeContact.lastSeen}
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
                    {activeConv?.messages.map((msg) => (
                      <MessageBubble
                        key={msg.id}
                        message={msg}
                        isSelf={msg.from === 'self'}
                      />
                    ))}
                    {isTyping && <TypingIndicator />}
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
                        onChange={(e) => setMessageInput(e.target.value)}
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

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPER
   ═══════════════════════════════════════════════════════════════════════════════ */

function getAutoReply(role) {
  const farmerReplies = [
    'I will check and let you know soon. 🙏',
    'My next harvest is expected in 2 weeks. I will keep you updated!',
    'Sure! I can arrange that. Let me check with the local transport.',
    'The weather has been great lately, crop looks very healthy!',
    'Yes, I use organic farming methods. No chemicals at all.',
  ];
  const vendorReplies = [
    'Thank you for your order! We will process it shortly. 🙏',
    'Currently we have a special 15% discount on bulk orders above ₹20,000.',
    'Yes, that product is available. Would you like to add it to your order?',
    'Your delivery is on track. Expected arrival by tomorrow evening.',
    'We also have a new range of bio-fertilizers. Very popular this season!',
  ];
  const customerReplies = [
    'Thank you! I will confirm my order quantity today. 🙏',
    'Can you share photos of the produce? I want to check quality.',
    'That price works for me. Please proceed with the packing.',
    'I need delivery to my Mumbai address. Is that possible?',
    'Your organic certification looks good. I trust your produce!',
  ];

  const replies = role === 'Vendor' ? vendorReplies : role === 'Customer' ? customerReplies : farmerReplies;
  return replies[Math.floor(Math.random() * replies.length)];
}
