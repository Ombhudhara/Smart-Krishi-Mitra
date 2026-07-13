import api from "./api";

export const getConversations = () => api.get("/chat/conversations");
export const getMessages = (conversationId) => api.get(`/chat/messages/${conversationId}`);
export const sendMessage = (data) => api.post("/chat/messages", data);
export const sendImageMessage = (formData) => api.post("/chat/messages", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const startConversation = (recipientId) => api.post("/chat/conversations", { recipientId });
export const getContacts = () => api.get("/chat/contacts");
export const deleteMessage = (messageId) => api.delete(`/chat/messages/${messageId}`);
export const markConversationRead = (conversationId) => api.put(`/chat/conversations/${conversationId}/read`);