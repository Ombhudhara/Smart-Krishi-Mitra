import api from "./api";

export const getCurrentWeather = (lat, lon) => api.get("/weather", { params: { lat, lon } });
export const getHourlyForecast = (lat, lon) => api.get("/weather/hourly", { params: { lat, lon } });
export const getWeeklyForecast = (lat, lon) => api.get("/weather/weekly", { params: { lat, lon } });
export const getAirQuality = (lat, lon) => api.get("/weather/aqi", { params: { lat, lon } });