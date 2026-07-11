import api from "./api";

export const getListings = (filters = {}) => api.get("/listings", { params: filters });
export const getListingById = (id) => api.get(`/listings/${id}`);
export const searchListings = (query) => api.get("/listings/search", { params: { q: query } });
export const contactSeller = (listingId) => api.post(`/listings/${listingId}/contact`);