import api from "./api";

export const getGovSchemes = (filters = {}) => api.get("/schemes", { params: filters });
export const getSchemeById = (id) => api.get(`/schemes/${id}`);
export const checkEligibility = (data) => api.post("/schemes/check-eligibility", data);
export const applyForScheme = (schemeId, data) => api.post(`/schemes/${schemeId}/apply`, data);