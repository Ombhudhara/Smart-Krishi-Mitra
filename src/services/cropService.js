import api from "./api";

export const getAllCrops = () => api.get("/crops");
export const getCropById = (id) => api.get(`/crops/${id}`);
export const searchCrops = (query) => api.get(`/crops/search`, { params: { q: query } });
export const getCropsBySeason = (season) => api.get(`/crops/season/${season}`);