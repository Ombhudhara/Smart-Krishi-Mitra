import api from "./api";

export const getCurrentWeather = (lat, lon, q) => api.get("/weather", { params: { lat, lon, q } });
export const getHourlyForecast = (lat, lon) => api.get("/weather/hourly", { params: { lat, lon } });
export const getWeeklyForecast = (lat, lon) => api.get("/weather/weekly", { params: { lat, lon } });
export const getAirQuality = (lat, lon) => api.get("/weather/aqi", { params: { lat, lon } });