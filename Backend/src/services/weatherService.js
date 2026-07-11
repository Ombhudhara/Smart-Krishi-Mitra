import axios from "axios";

// Retrieve configurations from environment
const API_KEY = process.env.WEATHER_API_KEY;
const API_URL = process.env.WEATHER_API_URL || "https://api.weatherapi.com/v1";

// Create Axios Client Instance
const weatherClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10-second request timeout limit
});

/**
 * Reusable helper to handle Axios request, validation, and error logging.
 * 
 * @param {string} endpoint - API path.
 * @param {object} params - Query parameters.
 * @returns {Promise<object>} Response data.
 */
const makeRequest = async (endpoint, params = {}) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const apiUrl = process.env.WEATHER_API_URL || "https://api.weatherapi.com/v1";
    if (!apiKey) {
      throw new Error("Weather API credentials are not set. Set WEATHER_API_KEY in environment variables.");
    }
    const response = await weatherClient.get(endpoint, {
      baseURL: apiUrl,
      params: {
        key: apiKey,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    let message = "Weather API request failed.";
    if (error.response) {
      const apiErr = error.response.data?.error;
      message = apiErr ? apiErr.message : `API responded with code ${error.response.status}`;
      console.error(`WeatherAPI response error [Status ${error.response.status}]:`, message);
    } else if (error.request) {
      message = "Connection timeout or weather provider server is currently unreachable.";
      console.error("WeatherAPI network/timeout error:", error.message);
    } else {
      message = error.message;
      console.error("Weather service system error:", error.message);
    }
    throw new Error(message);
  }
};

// ── RESPONSE MAPPERS ─────────────────────────────────────────────────────────

const mapLocation = (loc) => {
  if (!loc) return {};
  return {
    city: loc.name,
    state: loc.region,
    country: loc.country,
    latitude: loc.lat,
    longitude: loc.lon,
    localTime: loc.localtime,
  };
};

const mapCurrent = (curr) => {
  if (!curr) return {};
  return {
    temp: curr.temp_c,
    feelsLike: curr.feelslike_c,
    humidity: curr.humidity,
    windSpeed: curr.wind_kph,
    windDirection: curr.wind_dir,
    pressure: curr.pressure_mb,
    visibility: curr.vis_km,
    uvIndex: curr.uv,
    condition: curr.condition?.text || "",
    icon: curr.condition?.icon || "",
    lastUpdated: curr.last_updated,
  };
};

const mapAirQuality = (aq) => {
  if (!aq) return {};
  return {
    aqi: aq["us-epa-index"] || null,
    pm25: aq.pm2_5 || 0,
    pm10: aq.pm10 || 0,
    co: aq.co || 0,
    no2: aq.no2 || 0,
    o3: aq.o3 || 0,
    so2: aq.so2 || 0,
  };
};

const mapForecastDay = (fd) => {
  if (!fd) return {};
  return {
    date: fd.date,
    sunrise: fd.astro?.sunrise || "",
    sunset: fd.astro?.sunset || "",
    maxTemp: fd.day?.maxtemp_c,
    minTemp: fd.day?.mintemp_c,
    avgTemp: fd.day?.avgtemp_c,
    chanceOfRain: fd.day?.daily_chance_of_rain || 0,
    chanceOfSnow: fd.day?.daily_chance_of_snow || 0,
    humidity: fd.day?.avghumidity || 0,
    windSpeed: fd.day?.maxwind_kph || 0,
    condition: fd.day?.condition?.text || "",
    icon: fd.day?.condition?.icon || "",
  };
};

const mapHour = (h) => {
  if (!h) return {};
  return {
    time: h.time,
    temperature: h.temp_c,
    humidity: h.humidity,
    rainChance: h.chance_of_rain || 0,
    windSpeed: h.wind_kph,
    condition: h.condition?.text || "",
    icon: h.condition?.icon || "",
  };
};

const mapAlerts = (alertsObj) => {
  if (!alertsObj || !Array.isArray(alertsObj.alert)) return [];
  return alertsObj.alert.map((a) => ({
    alertTitle: a.event,
    severity: a.severity || "Normal",
    description: a.desc,
    effectiveTime: a.effective,
    expiryTime: a.expires,
  }));
};

// ── EXPORTED SERVICE MODULES ──────────────────────────────────────────────────

/**
 * 1. Fetch current weather conditions for a query location (city, postcode, or lat/lon).
 * 
 * @param {string} location - Query search term.
 * @returns {Promise<object>} Mapped weather properties.
 */
export const getCurrentWeather = async (location) => {
  const data = await makeRequest("/current.json", { q: location, aqi: "yes" });
  return {
    ...mapLocation(data.location),
    ...mapCurrent(data.current),
    airQuality: mapAirQuality(data.current?.air_quality),
  };
};

/**
 * 2. Fetch daily forecast summary values for 1, 3, or 7 days.
 * 
 * @param {string} location - Query search term.
 * @param {number} [days=7] - Forecast range days.
 * @returns {Promise<Array<object>>} Forecast arrays list.
 */
export const getForecast = async (location, days = 7) => {
  const data = await makeRequest("/forecast.json", { q: location, days, aqi: "no", alerts: "no" });
  if (!data.forecast || !Array.isArray(data.forecast.forecastday)) {
    return [];
  }
  return data.forecast.forecastday.map(mapForecastDay);
};

/**
 * 3. Fetch hourly forecasts list.
 * 
 * @param {string} location - Query search term.
 * @returns {Promise<Array<object>>} Hourly forecast array.
 */
export const getHourlyForecast = async (location) => {
  const data = await makeRequest("/forecast.json", { q: location, days: 1, aqi: "no", alerts: "no" });
  const dayForecast = data.forecast?.forecastday?.[0];
  if (!dayForecast || !Array.isArray(dayForecast.hour)) {
    return [];
  }
  return dayForecast.hour.map(mapHour);
};

/**
 * 4. Search cities and coordinate references.
 * 
 * @param {string} query - Target search term.
 * @returns {Promise<Array<object>>} Match locations lists.
 */
export const searchLocation = async (query) => {
  const results = await makeRequest("/search.json", { q: query });
  if (!Array.isArray(results)) return [];
  return results.map((loc) => ({
    city: loc.name,
    state: loc.region,
    country: loc.country,
    latitude: loc.lat,
    longitude: loc.lon,
  }));
};

/**
 * 5. Fetch specific air quality metrics.
 * 
 * @param {string} location - Query search term.
 * @returns {Promise<object>} Mapped AQI values.
 */
export const getAirQuality = async (location) => {
  const data = await makeRequest("/current.json", { q: location, aqi: "yes" });
  return mapAirQuality(data.current?.air_quality);
};

/**
 * 6. Fetch astronomy values (sunrise, sunset, moon details).
 * 
 * @param {string} location - Query search term.
 * @returns {Promise<object>} Mapped astronomy object.
 */
export const getAstronomy = async (location) => {
  const data = await makeRequest("/astronomy.json", { q: location });
  return {
    sunrise: data.astronomy?.astro?.sunrise || "",
    sunset: data.astronomy?.astro?.sunset || "",
    moonrise: data.astronomy?.astro?.moonrise || "",
    moonset: data.astronomy?.astro?.moonset || "",
    moonPhase: data.astronomy?.astro?.moon_phase || "",
  };
};

/**
 * 7. Fetch active climate alerts.
 * 
 * @param {string} location - Query search term.
 * @returns {Promise<Array<object>>} Alert lists or empty array.
 */
export const getWeatherAlerts = async (location) => {
  const data = await makeRequest("/forecast.json", { q: location, days: 1, aqi: "no", alerts: "yes" });
  return mapAlerts(data.alerts);
};

/**
 * 8. Combine current, forecast, hourly, air quality, astronomy, and alerts.
 * Optimizes performance by making a single, aggregated request to WeatherAPI.com.
 * 
 * @param {string} location - Query location search.
 * @returns {Promise<object>} Combined weather report object.
 */
export const getCompleteWeather = async (location) => {
  const data = await makeRequest("/forecast.json", { q: location, days: 7, aqi: "yes", alerts: "yes" });
  
  const loc = mapLocation(data.location);
  const current = mapCurrent(data.current);
  const airQuality = mapAirQuality(data.current?.air_quality);
  
  let forecast = [];
  let hourly = [];
  let astronomy = {};
  
  if (data.forecast && Array.isArray(data.forecast.forecastday)) {
    forecast = data.forecast.forecastday.map(mapForecastDay);
    
    // FIX: declare firstDay before using it
    const firstDay = data.forecast.forecastday[0];
    
    // Map hourly forecasts from all available forecast days to allow rolling lists
    hourly = [];
    data.forecast.forecastday.forEach((day) => {
      if (day && Array.isArray(day.hour)) {
        hourly.push(...day.hour.map(mapHour));
      }
    });
    
    // Map astronomy from first day
    if (firstDay && firstDay.astro) {
      astronomy = {
        sunrise: firstDay.astro.sunrise,
        sunset: firstDay.astro.sunset,
        moonrise: firstDay.astro.moonrise,
        moonset: firstDay.astro.moonset,
        moonPhase: firstDay.astro.moon_phase,
      };
    }
  }

  const alerts = mapAlerts(data.alerts);

  return {
    location: loc,
    current,
    forecast,
    hourly,
    airQuality,
    astronomy,
    alerts,
  };
};

export default {
  getCurrentWeather,
  getForecast,
  getHourlyForecast,
  searchLocation,
  getAirQuality,
  getAstronomy,
  getWeatherAlerts,
  getCompleteWeather,
};
