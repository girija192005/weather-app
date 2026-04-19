import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`http://localhost:5000/weather?city=${city}`);
      const data = res.data;

      setWeather(data.list[0]);

      // Get one forecast per day (every 24hrs = 8 entries apart)
      const daily = data.list.filter((_, i) => i % 8 === 0).slice(1, 6);
      setForecast(daily);
    } catch {
      setError("City not found. Please try again.");
      setWeather(null);
      setForecast([]);
    }
    setLoading(false);
  };

  const getDay = (timestamp) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[new Date(timestamp * 1000).getDay()];
  };

  const getIcon = (icon) =>
    `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      {loading && <p className="loading">Fetching weather...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{city.toUpperCase()}</h2>
          <img src={getIcon(weather.weather[0].icon)} alt="icon" />
          <h3>{Math.round(weather.main.temp)}°C</h3>
          <p>{weather.weather[0].description}</p>
          <div className="details">
            <span>💧 {weather.main.humidity}%</span>
            <span>💨 {weather.wind.speed} m/s</span>
            <span>🌡️ Feels {Math.round(weather.main.feels_like)}°C</span>
          </div>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h4>5-Day Forecast</h4>
          <div className="forecast-grid">
            {forecast.map((day, i) => (
              <div key={i} className="forecast-card">
                <p>{getDay(day.dt)}</p>
                <img src={getIcon(day.weather[0].icon)} alt="icon" />
                <p>{Math.round(day.main.temp)}°C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;