import api from "./api";

export const getTransactions = (filters = {}) => api.get("/transactions", { params: filters });
export const getTransactionById = (id) => api.get(`/transactions/${id}`);
export const updateTransactionStatus = (id, status) => api.put(`/transactions/${id}/status`, { status });
export const downloadInvoice = (id) => api.get(`/transactions/${id}/invoice`, { responseType: "blob" });