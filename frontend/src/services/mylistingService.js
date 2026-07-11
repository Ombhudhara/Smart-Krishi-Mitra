import api from "./api";

export const getMyListings = () => api.get("/listings/mine");
export const createListing = (data) => api.post("/listings", data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);
export const toggleListingStatus = (id, status) => api.put(`/listings/${id}/status`, { status });