import "./App.css";
import { useState } from "react";

function getBackgroundClass(temp) {
  if (temp < 10) return "cold";
  if (temp < 20) return "mild";
  if (temp < 30) return "warm";
  return "hot";
}
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" });
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌦️";
  return "⛈️";
}
function getWeatherAnimationClass(code) {
  if (code === 0) return "bg-sunny";
  if (code <= 48) return "bg-cloudy";
  if (code <= 67) return "bg-rainy";
  if (code <= 77) return "bg-snowy";
  return "bg-stormy";
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  async function handleSearch(e) {
    e.preventDefault();

    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en`,
    );
    const geoData = await geoResponse.json();
    console.log("city", geoData);

    const { latitude, longitude, name } = geoData.results[0];

    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=6`,
    );
    const weatherData = await weatherResponse.json();
    console.log("Meteo", weatherData);
    setWeather(weatherData);
  }

  function handleCityChange(e) {
    setCity(e.target.value);
    setWeather(null);
  }

  return (
    <div
      className={`app ${weather ? getBackgroundClass(weather.current.temperature_2m) : "default"}`}
    >
      <h1>Weather App</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter a city"
        />
        <button type="submit">Search</button>
      </form>

      {!weather && (
        <div className="intro-bg">
         {/*} <span className="intro-icon icon-0">🌤️</span>*/}
          <span className="intro-icon icon-1">☀️</span>
          <span className="intro-icon icon-2">☁️</span>
          <span className="intro-icon icon-5">☁️</span>
          <span className="intro-icon icon-3">🌧️</span>
          <span className="intro-icon icon-4">❄️</span>
        </div>
      )}

      {weather && (
        <div className="weather">
          <h2>{city}</h2>
          <div
            className={`weather-bg ${getWeatherAnimationClass(weather.current.weather_code)}`}
          >
            {getWeatherIcon(weather.current.weather_code)}
          </div>
          <p>
            {
              <p>
                {getWeatherIcon(weather.current.weather_code)}{" "}
                {weather.current.temperature_2m}°C
              </p>
            }
          </p>
          <div className="forecast">
            {weather.daily.time.map((date, index) => (
              <div key={date} className="forecast-day">
                <p>{formatDate(date)}</p>
                <p>{getWeatherIcon(weather.daily.weather_code[index])}</p>
                <p>
                  {weather.daily.temperature_2m_max[index]}° /{" "}
                  {weather.daily.temperature_2m_min[index]}°
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
