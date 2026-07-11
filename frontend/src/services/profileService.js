import api from "./api";

export const getMyProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);
export const changePassword = (data) => api.put("/profile/password", data);
export const changeLanguage = (language) => api.put("/profile/language", { language });
export const updateNotificationSettings = (settings) => api.put("/profile/notifications", settings);