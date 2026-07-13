export const getMockWeatherData = (location) => {
  const now = new Date();
  
  const mockHourly = Array.from({ length: 24 }).map((_, i) => ({
    time: new Date(now.getTime() + i * 3600000).toISOString(),
    temperature: 28 + Math.sin(i / 3) * 5,
    humidity: 60 + Math.cos(i / 3) * 20,
    rainChance: i % 4 === 0 ? 20 : 0,
    windSpeed: 10 + Math.random() * 5,
    condition: i % 5 === 0 ? "Cloudy" : "Clear",
    icon: ""
  }));

  const mockForecast = Array.from({ length: 7 }).map((_, i) => ({
    date: new Date(now.getTime() + i * 86400000).toISOString().split('T')[0],
    sunrise: "06:00 AM",
    sunset: "06:45 PM",
    maxTemp: 33,
    minTemp: 24,
    avgTemp: 28,
    chanceOfRain: 15,
    chanceOfSnow: 0,
    humidity: 65,
    windSpeed: 12,
    condition: "Sunny",
    icon: ""
  }));

  return {
    location: {
      city: typeof location === 'string' ? location.split(',')[0] : "Mock City",
      state: "Mock State",
      country: "India",
      latitude: 23.0,
      longitude: 72.0,
      localTime: now.toISOString()
    },
    current: {
      temp: 29,
      feelsLike: 31,
      humidity: 65,
      windSpeed: 12,
      windDirection: "N",
      pressure: 1012,
      visibility: 10,
      uvIndex: 5,
      condition: "Partly cloudy",
      icon: "",
      lastUpdated: now.toISOString()
    },
    forecast: mockForecast,
    hourly: mockHourly,
    airQuality: {
      aqi: 2,
      pm25: 15,
      pm10: 25,
      co: 0.1,
      no2: 0.05,
      o3: 0.02,
      so2: 0.01
    },
    astronomy: {
      sunrise: "06:00 AM",
      sunset: "06:45 PM",
      moonrise: "08:00 PM",
      moonset: "07:00 AM",
      moonPhase: "Waning Crescent"
    },
    alerts: [
      {
        alertTitle: "Heat Wave Warning",
        severity: "Moderate",
        desc: "Temperatures are expected to rise above 40C in the coming days.",
        effectiveTime: now.toISOString(),
        expiryTime: new Date(now.getTime() + 86400000 * 2).toISOString()
      }
    ]
  };
};
