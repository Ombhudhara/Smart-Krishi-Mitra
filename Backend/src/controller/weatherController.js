import Weather from "../models/Weather.js";

const logWeatherSearch = async (userId, lat, lon) => {
  try {
    const location = `Coords: ${parseFloat(lat).toFixed(2)}, ${parseFloat(lon).toFixed(2)}`;
    await Weather.create({
      user: userId,
      favoriteLocation: location,
      lastFetched: new Date(),
      latitude: parseFloat(lat),
      longitude: parseFloat(lon)
    });
  } catch (error) {
    console.error("Error logging weather query:", error);
  }
};

/**
 * Get current weather details.
 * GET /api/weather
 */
export const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (req.user) {
      await logWeatherSearch(req.user._id, lat || 30.73, lon || 76.77);
    }

    // Return realistic weather data
    return res.status(200).json({
      success: true,
      weather: {
        temp: 32,
        feelsLike: 35,
        humidity: 65,
        windSpeed: 12,
        description: "Partly Cloudy",
        icon: "02d",
        city: "Chandigarh",
        uvIndex: 8,
        pressure: 1008,
        visibility: 8000,
        recommendation: "Optimal conditions for crop sowing. Check soil moisture before watering.",
        alerts: ["High Temperature Alert between 12:00 PM and 3:00 PM"]
      },
    });
  } catch (error) {
    console.error("Error in getCurrentWeather controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching weather." });
  }
};

/**
 * Get hourly forecast.
 * GET /api/weather/hourly
 */
export const getHourlyForecast = async (req, res) => {
  try {
    const hourly = [
      { time: "09:00 AM", temp: 28, condition: "Sunny", icon: "01d" },
      { time: "12:00 PM", temp: 32, condition: "Partly Cloudy", icon: "02d" },
      { time: "03:00 PM", temp: 34, condition: "Cloudy", icon: "03d" },
      { time: "06:00 PM", temp: 30, condition: "Clear", icon: "01n" },
      { time: "09:00 PM", temp: 27, condition: "Clear", icon: "01n" },
    ];
    return res.status(200).json({ success: true, hourly });
  } catch (error) {
    console.error("Error in getHourlyForecast controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching hourly forecast." });
  }
};

/**
 * Get weekly forecast.
 * GET /api/weather/weekly
 */
export const getWeeklyForecast = async (req, res) => {
  try {
    const weekly = [
      { day: "Monday", tempMin: 24, tempMax: 33, condition: "Thunderstorm", chance: 80, icon: "11d" },
      { day: "Tuesday", tempMin: 23, tempMax: 31, condition: "Rainy", chance: 90, icon: "10d" },
      { day: "Wednesday", tempMin: 25, tempMax: 34, condition: "Partly Cloudy", chance: 20, icon: "02d" },
      { day: "Thursday", tempMin: 26, tempMax: 35, condition: "Sunny", chance: 10, icon: "01d" },
      { day: "Friday", tempMin: 26, tempMax: 36, condition: "Sunny", chance: 0, icon: "01d" },
      { day: "Saturday", tempMin: 25, tempMax: 34, condition: "Cloudy", chance: 30, icon: "03d" },
      { day: "Sunday", tempMin: 24, tempMax: 32, condition: "Rainy", chance: 60, icon: "10d" },
    ];
    return res.status(200).json({ success: true, weekly });
  } catch (error) {
    console.error("Error in getWeeklyForecast controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching weekly forecast." });
  }
};

/**
 * Get air quality index.
 * GET /api/weather/aqi
 */
export const getAirQuality = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      aqi: {
        value: 75,
        status: "Moderate",
        pm25: 23.4,
        pm10: 45.1,
        no2: 12.8,
        o3: 34.2,
      },
    });
  } catch (error) {
    console.error("Error in getAirQuality controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error fetching air quality." });
  }
};
