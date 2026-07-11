import api from "./api";

export const getCalculations = () => api.get("/calculator/history");
export const saveCalculation = (data) => api.post("/calculator/save", data);
export const deleteCalculation = (id) => api.delete(`/calculator/${id}`);
