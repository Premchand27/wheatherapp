import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [backgroundStyle, setBackgroundStyle] = useState({});

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const currentWeatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`
        );
        setCurrentWeather(currentWeatherResponse.data);

        const forecastResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`
        );
        setForecastData(forecastResponse.data.list);

        setBackgroundBasedOnWeather(currentWeatherResponse.data.weather[0].main);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setLoading(false);
      }
    };

    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  // Function to set background based on weather
  const setBackgroundBasedOnWeather = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        setBackgroundStyle({
          background: 'linear-gradient(to right, #fbc2eb, #a6c1ee)',
        });
        break;
      case 'clouds':
        setBackgroundStyle({
          background: 'linear-gradient(to right, #d7d2cc, #304352)',
        });
        break;
      case 'rain':
        setBackgroundStyle({
          background: 'linear-gradient(to right, #3a7bd5, #3a6073)',
        });
        break;
      case 'snow':
        setBackgroundStyle({
          background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
        });
        break;
      default:
        setBackgroundStyle({
          background: 'linear-gradient(to right, #6a11cb, #2575fc)',
        });
    }
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'snow':
        return '❄️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="container" style={backgroundStyle}>
      <h1 className="text-center mb-4">Weather App</h1>
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city"
            value={location}
            onChange={handleLocationChange}
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : currentWeather ? (
        <div>
          <div className="text-center">
            <h2>
              {currentWeather.name}, {currentWeather.sys.country}
            </h2>
            <p>Current Temperature: {currentWeather.main.temp} °C</p>
            <p>Humidity: {currentWeather.main.humidity} %</p>
            <p>
              Condition: {getWeatherIcon(currentWeather.weather[0].main)}{' '}
              {currentWeather.weather[0].main}
            </p>
          </div>

          <h3 className="text-center my-4">Forecast</h3>
          <div className="row">
            {forecastData.map((forecast, index) => (
              <div className="col-md-4 mb-3" key={index}>
                <div className="card forecast-card shadow-sm">
                  <div className="card-body text-center">
                    <h5 className="forecast-date">
                      {new Date(forecast.dt_txt).toLocaleString()}
                    </h5>
                    <div className="weather-icon mb-3">
                      <span style={{ fontSize: '2.5rem' }}>
                        {getWeatherIcon(forecast.weather[0].main)}
                      </span>
                    </div>
                    <p className="temperature">{forecast.main.temp} °C</p>
                    <p className="condition">{forecast.weather[0].main}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center">No data available</p>
      )}
    </div>
  );
};

export default WeatherApp;
