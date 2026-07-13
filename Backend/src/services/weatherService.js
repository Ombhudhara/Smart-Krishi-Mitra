import axios from "axios";

// Helper to map WMO Weather Codes to text descriptions
const getConditionText = (code) => {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return map[code] || "Clear sky";
};

/**
 * 8. Combine current, forecast, hourly, air quality, astronomy, and alerts.
 * We are now using Open-Meteo which is 100% free and requires no API key!
 * 
 * @param {string} location - Query location search. (Usually "lat,lon")
 * @returns {Promise<object>} Combined weather report object.
 */
export const getCompleteWeather = async (location) => {
  try {
    let lat = 23.0225; // Default Ahmedabad
    let lon = 72.5714;
    let state = "";
    let country = "";
    let cityName = location;

    // ── STEP 1: Resolve coordinates from city name ────────────────────────────
    if (location && location.includes(",")) {
      const parts = location.split(",");
      if (!isNaN(parseFloat(parts[0])) && !isNaN(parseFloat(parts[1]))) {
        lat = parseFloat(parts[0]);
        lon = parseFloat(parts[1]);
      } else {
        // "City, State" format — keep as text query
        cityName = location;
      }
    }

    if (location && !location.match(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/) && location.trim().length > 0) {
      // --- Primary: Nominatim OpenStreetMap (most accurate, sorts by importance) ---
      try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=5&addressdetails=1&countrycodes=`;
        const nomRes = await axios.get(nomUrl, {
          headers: { "User-Agent": "SmartKrishiMitra/2.0 (contact@smartkrishimitra.org)" },
          timeout: 6000
        });
        if (nomRes.data && nomRes.data.length > 0) {
          // Nominatim sorts by importance by default (most prominent city first)
          const best = nomRes.data[0];
          lat = parseFloat(best.lat);
          lon = parseFloat(best.lon);
          state = best.address?.state || "";
          country = best.address?.country || "";
          cityName = best.address?.city || best.address?.town || best.address?.village || best.address?.county || best.name || location;
          console.log(`[WeatherService] Nominatim resolved "${location}" → ${cityName}, ${state} (${lat}, ${lon})`);
        }
      } catch (nomErr) {
        console.warn(`[WeatherService] Nominatim failed: ${nomErr.message}. Trying Open-Meteo geocoder...`);
        // --- Fallback: Open-Meteo Geocoding API ---
        try {
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=5&language=en&format=json`;
          const geoRes = await axios.get(geoUrl, { timeout: 6000 });
          if (geoRes.data.results && geoRes.data.results.length > 0) {
            // Pick best match by population (highest = most prominent city)
            const sorted = [...geoRes.data.results].sort((a, b) => (b.population || 0) - (a.population || 0));
            const best = sorted[0];
            lat = best.latitude;
            lon = best.longitude;
            state = best.admin1 || "";
            country = best.country || "";
            cityName = best.name || location;
            console.log(`[WeatherService] Open-Meteo Geocoder resolved "${location}" → ${cityName}, ${state} (${lat}, ${lon})`);
          }
        } catch (geoErr) {
          console.warn(`[WeatherService] Open-Meteo geocoder also failed: ${geoErr.message}. Using default.`);
        }
      }
    }

    // ── STEP 2: Fetch Weather from Open-Meteo Forecast API ───────────────────
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
    const weatherRes = await axios.get(weatherUrl, { timeout: 10000 });
    const wData = weatherRes.data;

    // ── STEP 3: Fetch Air Quality Data ────────────────────────────────────────
    const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`;
    let aqiData = {};
    try {
      const aqiRes = await axios.get(aqiUrl, { timeout: 6000 });
      if (aqiRes.data && aqiRes.data.current) {
        aqiData = aqiRes.data.current;
      }
    } catch (e) {
      console.error("Failed to fetch AQI", e.message);
    }

    // ── STEP 4: Format current weather ───────────────────────────────────────
    const current = {
      temp: wData.current.temperature_2m,
      feelsLike: wData.current.apparent_temperature,
      humidity: wData.current.relative_humidity_2m,
      windSpeed: wData.current.wind_speed_10m,
      windDirection: wData.current.wind_direction_10m,
      pressure: wData.current.surface_pressure,
      visibility: 10, // Default visibility (not in free tier)
      uvIndex: wData.daily.uv_index_max?.[0] || 0,
      condition: getConditionText(wData.current.weather_code),
      lastUpdated: wData.current.time
    };

    // ── STEP 5: Format Air Quality ────────────────────────────────────────────
    const airQuality = {
      aqi: aqiData.us_aqi || null,
      pm25: aqiData.pm2_5 || 0,
      pm10: aqiData.pm10 || 0,
      co: aqiData.carbon_monoxide || 0,
      no2: aqiData.nitrogen_dioxide || 0,
      o3: aqiData.ozone || 0,
      so2: aqiData.sulphur_dioxide || 0
    };

    // ── STEP 6: Format daily forecast (7 days) ────────────────────────────────
    const forecast = wData.daily.time.map((timeStr, idx) => ({
      date: timeStr,
      sunrise: wData.daily.sunrise[idx] || "",
      sunset: wData.daily.sunset[idx] || "",
      maxTemp: wData.daily.temperature_2m_max[idx],
      minTemp: wData.daily.temperature_2m_min[idx],
      chanceOfRain: wData.daily.precipitation_probability_max?.[idx] || 0,
      condition: getConditionText(wData.daily.weather_code[idx]),
      windSpeed: 0
    }));

    // ── STEP 7: Format hourly forecast ────────────────────────────────────────
    const hourly = wData.hourly.time.map((timeStr, idx) => ({
      time: timeStr,
      temperature: wData.hourly.temperature_2m[idx],
      humidity: wData.hourly.relative_humidity_2m[idx],
      rainChance: wData.hourly.precipitation_probability[idx] || 0,
      windSpeed: wData.hourly.wind_speed_10m[idx],
      condition: getConditionText(wData.hourly.weather_code[idx])
    }));

    // ── STEP 8: Astronomy ─────────────────────────────────────────────────────
    const astronomy = {
      sunrise: forecast[0]?.sunrise || "",
      sunset: forecast[0]?.sunset || ""
    };

    // ── STEP 9: Build Response ────────────────────────────────────────────────
    return {
      location: { city: cityName, state, country, latitude: lat, longitude: lon },
      current,
      forecast,
      hourly,
      airQuality,
      astronomy,
      alerts: []
    };
  } catch (error) {
    console.error("Open-Meteo weather fetch error:", error.message);
    throw new Error("Weather service is temporarily unavailable.");
  }
};


export const getCurrentWeather = async (loc) => getCompleteWeather(loc);
export const getForecast = async (loc) => getCompleteWeather(loc);
export const getHourlyForecast = async (loc) => getCompleteWeather(loc);
export const getAirQuality = async (loc) => getCompleteWeather(loc);
export const getAstronomy = async (loc) => getCompleteWeather(loc);
export const getWeatherAlerts = async (loc) => [];
export const searchLocation = async (query) => {
  // Using open meteo geocoding
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const geoRes = await axios.get(geoUrl);
    if (!geoRes.data.results) return [];
    return geoRes.data.results.map((loc) => ({
      city: loc.name,
      state: loc.admin1 || "",
      country: loc.country || "",
      latitude: loc.latitude,
      longitude: loc.longitude,
    }));
  } catch (err) {
    return [];
  }
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
