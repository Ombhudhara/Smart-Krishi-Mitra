import api from "./api";

export const getMyProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);
export const changePassword = (data) => api.put("/profile/password", data);
export const changeLanguage = (language) => api.put("/profile/language", { language });
export const updateNotificationSettings = (settings) => api.put("/profile/notifications", settings);

export const uploadProfilePhoto = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.put("/profile/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProfilePhoto = () => api.delete("/profile/image");

export const uploadCoverPhoto = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return api.put("/profile/cover", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCoverPhoto = () => api.delete("/profile/cover");

export const getPublicProfile = (userId) => api.get(`/profile/public/${userId}`);