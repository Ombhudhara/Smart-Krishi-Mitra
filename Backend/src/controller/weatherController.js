import Weather from "../models/Weather.js";
import mapService from "../services/mapService.js";
import weatherService from "../services/weatherService.js";

const logWeatherSearch = async (userId, lat, lon, locationName) => {
  try {
    await Weather.create({
      user: userId,
      favoriteLocation: locationName || `Coords: ${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`,
      lastFetched: new Date(),
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    });
  } catch (error) {
    console.error("Error logging weather query:", error);
  }
};

const getUvCategory = (uv) => {
  const uvVal = parseFloat(uv);
  if (isNaN(uvVal)) return "Low";
  if (uvVal <= 2) return "Low";
  if (uvVal <= 5) return "Moderate";
  if (uvVal <= 7) return "High";
  if (uvVal <= 10) return "Very High";
  return "Extreme";
};

const getAqiText = (aq) => {
  if (!aq) return "32 (Good)";
  const epa = aq.aqi || 1;
  const pm25 = Math.round(aq.pm25 || 10);
  const statuses = ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"];
  return `${pm25} (${statuses[epa - 1] || "Good"})`;
};

const getConditionEmoji = (conditionText) => {
  const text = (conditionText || "").toLowerCase();
  if (text.includes("thunder") || text.includes("storm")) return "⛈️";
  if (text.includes("heavy rain") || text.includes("torrential")) return "🌧️";
  if (text.includes("moderate rain") || text.includes("patchy rain")) return "🌦️";
  if (text.includes("light rain") || text.includes("drizzle") || text.includes("shower")) return "🌦️";
  if (text.includes("snow") || text.includes("sleet") || text.includes("ice")) return "❄️";
  if (text.includes("cloudy") || text.includes("overcast")) return "☁️";
  if (text.includes("mist") || text.includes("fog") || text.includes("haze")) return "🌫️";
  if (text.includes("partly cloudy") || text.includes("sunny intervals")) return "⛅";
  if (text.includes("sunny") || text.includes("clear")) return "☀️";
  return "☀️";
};

const calculateCropSuitability = (temp, humidity, rainChance) => {
  // Grapes suitability calculation
  let grapesPct = 85;
  if (humidity > 70) grapesPct -= (humidity - 70) * 1.5;
  if (temp > 32) grapesPct -= (temp - 32) * 2;
  if (temp < 15) grapesPct -= (15 - temp) * 3;
  grapesPct = Math.max(10, Math.min(95, Math.round(grapesPct)));
  
  let grapesStatus = "Excellent";
  let grapesColor = "#43A047";
  if (grapesPct < 40) { grapesStatus = "Poor"; grapesColor = "#E53935"; }
  else if (grapesPct < 70) { grapesStatus = "Average"; grapesColor = "#FFB300"; }
  
  // Onion suitability calculation
  let onionPct = 80;
  if (rainChance > 50) onionPct -= (rainChance - 50);
  if (humidity > 75) onionPct -= 15;
  onionPct = Math.max(10, Math.min(95, Math.round(onionPct)));
  let onionStatus = "Excellent";
  let onionColor = "#43A047";
  if (onionPct < 40) { onionStatus = "Poor"; onionColor = "#E53935"; }
  else if (onionPct < 70) { onionStatus = "Average"; onionColor = "#FFB300"; }

  // Tomato suitability calculation
  let tomatoPct = 80;
  if (humidity > 75) tomatoPct -= 20;
  if (temp > 35) tomatoPct -= 15;
  tomatoPct = Math.max(10, Math.min(95, Math.round(tomatoPct)));
  let tomatoStatus = "Excellent";
  let tomatoColor = "#43A047";
  if (tomatoPct < 40) { tomatoStatus = "Poor"; tomatoColor = "#E53935"; }
  else if (tomatoPct < 70) { tomatoStatus = "Average"; tomatoColor = "#FFB300"; }

  // Soybean suitability calculation
  let soybeanPct = 75;
  if (humidity > 50 && humidity < 80) soybeanPct += 10;
  if (temp > 38 || temp < 15) soybeanPct -= 20;
  soybeanPct = Math.max(10, Math.min(95, Math.round(soybeanPct)));
  let soybeanStatus = "Excellent";
  let soybeanColor = "#43A047";
  if (soybeanPct < 40) { soybeanStatus = "Poor"; soybeanColor = "#E53935"; }
  else if (soybeanPct < 70) { soybeanStatus = "Average"; soybeanColor = "#FFB300"; }

  return [
    { name: 'Grapes', pct: grapesPct, status: grapesStatus, desc: grapesPct < 50 ? 'High moisture increases mildew risk.' : 'Optimal ambient moisture and temperature.', color: grapesColor },
    { name: 'Onion', pct: onionPct, status: onionStatus, desc: rainChance > 60 ? 'Risk of soil waterlogging. Ensure drainage.' : 'Good soil condition for bulb development.', color: onionColor },
    { name: 'Tomato', pct: tomatoPct, status: tomatoStatus, desc: humidity > 80 ? 'High moisture may cause flower dropping.' : 'Warm conditions favor ripening.', color: tomatoColor },
    { name: 'Soybean', pct: soybeanPct, status: soybeanStatus, desc: 'Moist soils are ideal for vegetative stages.', color: soybeanColor },
    { name: 'Wheat', pct: 0, status: 'Off-Season', desc: 'Rabi crop. Currently uncultivated.', color: '#757575' }
  ];
};

const calculateAgronomySuggestions = (temp, humidity, rainChance) => {
  const suggestions = [];
  let id = 1;
  
  if (rainChance > 50) {
    suggestions.push({
      id: id++,
      title: "Delay Irrigation",
      desc: `Precipitation probability is ${rainChance}%. Running drip lines will waterlog roots and waste fertilizer.`,
      icon: "💧",
      priority: "High",
      priorityColor: "#E53935"
    });
    suggestions.push({
      id: id++,
      title: "Ditch & Drainage Check",
      desc: "Verify drainage channels immediately to prevent water accumulation near standing onion/vegetable plots.",
      icon: "🚜",
      priority: "High",
      priorityColor: "#E53935"
    });
  } else {
    suggestions.push({
      id: id++,
      title: "Maintain Standard Irrigation",
      desc: "Weather is dry. Continue normal drip schedules based on crop-specific water requirements.",
      icon: "💧",
      priority: "Medium",
      priorityColor: "#FFB300"
    });
  }

  if (humidity > 80) {
    suggestions.push({
      id: id++,
      title: "Fungicide Warning",
      desc: `High humidity (${humidity}%) creates downy mildew vectors. Prepare copper-based sprays to apply once leaves dry.`,
      icon: "🧪",
      priority: "High",
      priorityColor: "#E53935"
    });
  } else {
    suggestions.push({
      id: id++,
      title: "Pest Scouting",
      desc: "Dry weather favors insect pests. Inspect crop leaves for thrips or aphid colonies.",
      icon: "🐛",
      priority: "Low",
      priorityColor: "#43A047"
    });
  }

  if (temp > 35) {
    suggestions.push({
      id: id++,
      title: "Heat Stress Mitigation",
      desc: `Temperatures reaching ${temp}°C. Apply light morning irrigation to cool soil and crop canopy.`,
      icon: "🌡️",
      priority: "High",
      priorityColor: "#E53935"
    });
  }

  return suggestions;
};

/**
 * Get current combined weather details by resolving coordinates via Map API and forecasts via Weather API.
 * GET /api/weather
 */
export const getCurrentWeather = async (req, res) => {
  try {
    let { lat, lon, q } = req.query;
    let resolvedLocation = null;

    // 1. Resolve coordinates using Map Service
    if (q && q.trim()) {
      console.log(`[Weather Controller] Resolving search query location: "${q}"`);
      const mapRes = await mapService.searchLocation(q);
      if (mapRes.success && mapRes.data && mapRes.data.length > 0) {
        resolvedLocation = mapRes.data[0];
        lat = resolvedLocation.latitude;
        lon = resolvedLocation.longitude;
      }
    }

    // Default Fallback coordinates: Ahmedabad, Gujarat
    const DEFAULT_LAT = 23.0225;
    const DEFAULT_LON = 72.5714;

    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);

    if (isNaN(parsedLat) || isNaN(parsedLon)) {
      lat = DEFAULT_LAT;
      lon = DEFAULT_LON;
      console.log(`[Weather Controller] Coordinates missing/invalid. Defaulting to Ahmedabad: ${lat}, ${lon}`);
    } else {
      lat = parsedLat;
      lon = parsedLon;
    }

    // 2. Fetch Address details via Map Service reverse geocoding
    if (!resolvedLocation) {
      console.log(`[Weather Controller] Reverse geocoding coords: ${lat}, ${lon}`);
      const revRes = await mapService.reverseGeocode(lat, lon);
      if (revRes.success && revRes.data) {
        resolvedLocation = revRes.data;
      }
    }

    const city = resolvedLocation?.village || resolvedLocation?.city || resolvedLocation?.district || "Ahmedabad";
    const state = resolvedLocation?.state || "Gujarat";
    const displayName = resolvedLocation?.displayName || `${city}, ${state}`;

    // Log the search to database if authorized
    if (req.user) {
      await logWeatherSearch(req.user._id, lat, lon, displayName);
    }

    // 3. Fetch Weather reports via Weather Service
    console.log(`[Weather Controller] Fetching complete weather data for: ${lat}, ${lon}`);
    const weatherData = await weatherService.getCompleteWeather(`${lat},${lon}`);

    const current = weatherData.current;
    const weatherLoc = weatherData.location;

    // 4. Map the WeatherAPI response into combined frontend DTO
    // Find index of the hour matching or closest to the location's local time
    let startIdx = 0;
    const localTimeStr = resolvedLocation?.localTime || weatherLoc?.localTime;
    if (localTimeStr) {
      const locTime = new Date(localTimeStr);
      if (!isNaN(locTime.getTime())) {
        const currentLocEpoch = locTime.getTime();
        let minDiff = Infinity;
        weatherData.hourly.forEach((h, idx) => {
          if (h.time) {
            const hTime = new Date(h.time);
            if (!isNaN(hTime.getTime())) {
              const diff = Math.abs(hTime.getTime() - currentLocEpoch);
              if (diff < minDiff) {
                minDiff = diff;
                startIdx = idx;
              }
            }
          }
        });
      }
    } else {
      const currentHour = new Date().getHours();
      startIdx = currentHour;
    }

    const currentHourly = weatherData.hourly?.[startIdx] || {};
    const rainChance = currentHourly.rainChance || 0;

    // Map Hourly Forecast (next 7 hours starting from current hour)
    const hourlyForecast = weatherData.hourly.slice(startIdx, startIdx + 7).map((h, i) => {
      const timeStr = h.time ? new Date(h.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
      return {
        time: i === 0 ? "Now" : (timeStr || "Now"),
        temp: `${Math.round(h.temperature)}°C`,
        icon: getConditionEmoji(h.condition),
        rain: `${h.rainChance}%`,
        wind: `${Math.round(h.windSpeed)}km/h`
      };
    });

    // Map Weekly Forecast
    const weeklyForecast = weatherData.forecast.map((d) => {
      const dayName = d.date ? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' }) : "";
      return {
        day: dayName || "Day",
        icon: getConditionEmoji(d.condition),
        min: `${Math.round(d.minTemp)}°C`,
        max: `${Math.round(d.maxTemp)}°C`,
        rain: `${d.chanceOfRain}%`,
        wind: `${Math.round(d.windSpeed)}km/h`
      };
    });

    // Map Climate Alerts
    const alerts = weatherData.alerts.map((a) => {
      const isCrit = (a.severity || "").toLowerCase().includes("critical") || (a.severity || "").toLowerCase().includes("severe");
      return {
        severity: isCrit ? "Critical" : "Moderate",
        type: a.alertTitle || "Weather Alert",
        desc: a.description || "",
        color: isCrit ? "#C62828" : "#F57F17",
        bg: isCrit ? "#FFEBEE" : "#FFF8E1",
        icon: isCrit ? "🚨" : "⚠️"
      };
    });

    // Map Charts values
    const charts = {
      temp: weatherData.hourly.slice(startIdx, startIdx + 7).map(h => Math.round(h.temperature)),
      humidity: weatherData.hourly.slice(startIdx, startIdx + 7).map(h => h.humidity),
      rain: weatherData.hourly.slice(startIdx, startIdx + 7).map(h => h.rainChance)
    };

    // Construct response matching expected DTO
    const responsePayload = {
      city,
      state,
      temp: current.temp || 30,
      condition: current.condition || "Clear",
      icon: getConditionEmoji(current.condition),
      feelsLike: `${Math.round(current.feelsLike)}°C`,
      humidity: `${current.humidity}%`,
      windSpeed: `${current.windSpeed} km/h`,
      uvIndex: `${current.uvIndex} (${getUvCategory(current.uvIndex)})`,
      visibility: `${current.visibility} km`,
      airQuality: getAqiText(weatherData.airQuality),
      pressure: `${current.pressure} hPa`,
      sunrise: weatherData.astronomy?.sunrise || "06:00 AM",
      sunset: weatherData.astronomy?.sunset || "07:00 PM",
      hourly: hourlyForecast,
      daily: weeklyForecast,
      alerts,
      cropSuitability: calculateCropSuitability(current.temp, current.humidity, rainChance),
      aiSuggestions: calculateAgronomySuggestions(current.temp, current.humidity, rainChance),
      charts
    };

    return res.status(200).json({
      success: true,
      weather: responsePayload
    });

  } catch (error) {
    console.error("Error in getCurrentWeather controller:", error.message || error);
    try {
      import("fs").then((fs) => {
        fs.writeFileSync("weather-error.log", `${new Date().toISOString()}\nError: ${error.message}\nStack: ${error.stack}\n`);
      });
    } catch (fsErr) {
      console.error("Failed to write error log:", fsErr);
    }
    return res.status(500).json({ success: false, message: "Server error fetching weather." });
  }
};

/**
 * Fallbacks to prevent routing crashes
 */
export const getHourlyForecast = (req, res) => getCurrentWeather(req, res);
export const getWeeklyForecast = (req, res) => getCurrentWeather(req, res);
export const getAirQuality = (req, res) => getCurrentWeather(req, res);
