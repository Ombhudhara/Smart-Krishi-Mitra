import api from "./api";

export const getNews = (category) => api.get("/news", { params: { category } });
export const getNewsById = (id) => api.get(`/news/${id}`);
export const getGovSchemes = () => api.get("/schemes");
export const getSchemeById = (id) => api.get(`/schemes/${id}`);
export const bookmarkItem = (id, type) => api.post("/bookmarks", { id, type });
export const getBookmarks = () => api.get("/bookmarks");