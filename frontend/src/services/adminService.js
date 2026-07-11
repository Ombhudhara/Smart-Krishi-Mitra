import api from "./api";

export const getAllUsers = (filters = {}) => api.get("/admin/users", { params: filters });
export const verifyUser = (userId) => api.put(`/admin/users/${userId}/verify`);
export const suspendUser = (userId) => api.put(`/admin/users/${userId}/suspend`);
export const getPlatformStats = () => api.get("/admin/stats");
export const getReportedListings = () => api.get("/admin/listings/reported");
export const moderateListing = (listingId, action) => api.put(`/admin/listings/${listingId}/moderate`, { action });