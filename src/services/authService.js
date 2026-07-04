import api from "./api";

export const register = (data) => api.post("/auth/register", data);
export const login = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");
export const verifyOtp = (data) => api.post("/auth/verify-otp", data);