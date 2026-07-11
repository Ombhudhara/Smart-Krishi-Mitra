import api from "./api";

export const getConversations = () => api.get("/chat/conversations");
export const getMessages = (conversationId) => api.get(`/chat/messages/${conversationId}`);
export const sendMessage = (data) => api.post("/chat/messages", data);
export const startConversation = (recipientId) => api.post("/chat/conversations", { recipientId });
export const markConversationRead = (conversationId) => api.put(`/chat/conversations/${conversationId}/read`);