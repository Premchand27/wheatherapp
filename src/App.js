import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const WeatherApp = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`);
        setCurrentWeather(currentWeatherResponse.data);

        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`);
        setForecastData(forecastResponse.data.list);

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

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  return (
    <div className='container'>
      <h1>Weather App</h1>
      <input
        type="text"
        className='input'
        placeholder="Enter city"
        value={location}
        onChange={handleLocationChange}
      />
      {loading ? (
        <p>Loading...</p>
      ) : currentWeather ? (
        <div>
          <h2>{currentWeather.name}, {currentWeather.sys.country}</h2>
          <p>Current Temperature: {currentWeather.main.temp} °C</p>
          <p>Humidity: {currentWeather.main.humidity} %</p>
          <p>Condition: {currentWeather.weather[0].main}</p>

          <h2>Forecast</h2>
          <ul>
            {forecastData.map((forecast, index) => (
              <li key={index}>
                {forecast.dt_txt}: {forecast.main.temp} °C - {forecast.weather[0].main}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default WeatherApp;
