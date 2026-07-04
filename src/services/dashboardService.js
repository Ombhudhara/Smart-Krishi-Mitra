import api from "./api";

export const getDashboardSummary = () => api.get("/dashboard/summary");
export const getRecentActivity = () => api.get("/dashboard/activity");
export const getQuickStats = () => api.get("/dashboard/stats");