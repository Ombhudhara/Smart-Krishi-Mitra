import React from 'react';
import PropTypes from 'prop-types';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiHumidity, 
  WiStrongWind, 
  WiUmbrella,
  WiThunderstorm
} from 'react-icons/wi';
import { MdLocationOn } from 'react-icons/md';
import './WeatherCard.css';

const DUMMY_WEATHER = {
  location: 'Navi Mumbai, Maharashtra',
  temperature: 28,
  condition: 'Partly Cloudy',
  humidity: 65, // %
  wind: 12, // km/h
  rain: 20, // %
  forecast: [
    { id: 1, day: 'Mon', temp: 29, icon: 'sunny' },
    { id: 2, day: 'Tue', temp: 27, icon: 'cloudy' },
    { id: 3, day: 'Wed', temp: 26, icon: 'rain' },
    { id: 4, day: 'Thu', temp: 28, icon: 'sunny' },
    { id: 5, day: 'Fri', temp: 30, icon: 'sunny' },
  ]
};

const WeatherCard = ({ weather = DUMMY_WEATHER, className = '' }) => {
  const data = { ...DUMMY_WEATHER, ...weather };
  
  // Render main condition icon dynamically
  const renderMainIcon = () => {
    const cond = data.condition.toLowerCase();
    if (cond.includes('rain') || cond.includes('shower')) return <WiRain />;
    if (cond.includes('thunder')) return <WiThunderstorm />;
    if (cond.includes('cloud')) return <WiCloudy />;
    return <WiDaySunny />;
  };

  // Render small forecast icons
  const renderForecastIcon = (type) => {
    switch(type) {
      case 'rain': return <WiRain />;
      case 'cloudy': return <WiCloudy />;
      case 'thunder': return <WiThunderstorm />;
      case 'sunny':
      default: return <WiDaySunny />;
    }
  };

  return (
    <div className={`skm-weather-card ${className}`}>
      
      {/* Top Header - Location */}
      <div className="skm-weather-header">
        <MdLocationOn className="skm-weather-loc-icon" />
        <span className="skm-weather-location">{data.location}</span>
      </div>

      {/* Main Temperature & Condition */}
      <div className="skm-weather-main">
        <div className="skm-weather-icon-lg">
          {renderMainIcon()}
        </div>
        <div className="skm-weather-temp-wrap">
          <h2 className="skm-weather-temp">{data.temperature}&deg;C</h2>
          <p className="skm-weather-condition">{data.condition}</p>
        </div>
      </div>

      {/* Metrics Row (Humidity, Wind, Rain) */}
      <div className="skm-weather-metrics">
        <div className="skm-weather-metric">
          <WiHumidity className="skm-wm-icon" />
          <div className="skm-wm-data">
            <span className="skm-wm-val">{data.humidity}%</span>
            <span className="skm-wm-label">Humidity</span>
          </div>
        </div>
        
        <div className="skm-weather-metric skm-wm-center">
          <WiStrongWind className="skm-wm-icon" />
          <div className="skm-wm-data">
            <span className="skm-wm-val">{data.wind} km/h</span>
            <span className="skm-wm-label">Wind</span>
          </div>
        </div>

        <div className="skm-weather-metric">
          <WiUmbrella className="skm-wm-icon" />
          <div className="skm-wm-data">
            <span className="skm-wm-val">{data.rain}%</span>
            <span className="skm-wm-label">Rain Chance</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <div className="skm-weather-forecast">
        <h4 className="skm-forecast-title">5-Day Forecast</h4>
        <div className="skm-forecast-list">
          {data.forecast.map((day) => (
            <div key={day.id} className="skm-forecast-item">
              <span className="skm-forecast-day">{day.day}</span>
              <div className="skm-forecast-icon">
                {renderForecastIcon(day.icon)}
              </div>
              <span className="skm-forecast-temp">{day.temp}&deg;</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

WeatherCard.propTypes = {
  weather: PropTypes.shape({
    location: PropTypes.string,
    temperature: PropTypes.number,
    condition: PropTypes.string,
    humidity: PropTypes.number,
    wind: PropTypes.number,
    rain: PropTypes.number,
    forecast: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      day: PropTypes.string,
      temp: PropTypes.number,
      icon: PropTypes.string
    }))
  }),
  className: PropTypes.string
};

export default WeatherCard;
