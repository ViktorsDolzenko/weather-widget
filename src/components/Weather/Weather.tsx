import React, {useState} from "react";
import axios from "axios";
import moment from "moment";

import { KEY } from "../../const";
import { cloudy, hurricane, rain, snow, sunny } from "./weatherType";

import "./winderCondition.scss";
import "./weather.scss";
import {CSSTransition} from "react-transition-group";

export const Weather = () => {
  const [currentWeatherData, setCurrentWeatherData] = useState([]);
  const [foreCast, setForeCast] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true)

  const getCurrentWeather = async (query: string) => {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/current?&city=${query ? query : ""}&key=${KEY}`)
    setCurrentWeatherData(response.data.data)
  };

  const getForecast = async (query: string) => {
    const response = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?&city=${query ? query : ""}&key=${KEY}&days=5`)
    setForeCast(response.data.data);
    if(foreCast === undefined) return
   foreCast.shift();
    setLoading(false)
  };

  const handleCityChange = (e: any) => {
    setQuery(e.target.value);
  };

  const handleOnSubmit = async (e: any) => {
    e.preventDefault();
  await getCurrentWeather(query);
  await getForecast(query);
  setLoading(false)
  };

  const getCondition = (weatherCode: number) => {
    if (weatherCode >= 200 && weatherCode <= 233) {
      return hurricane;
    }

    if (weatherCode >= 300 && weatherCode <= 522) {
      return rain;
    }

    if (weatherCode >= 600 && weatherCode <= 610) {
      return snow;
    }

    if (weatherCode === 800) {
      return sunny;
    }

    if (weatherCode >= 801 && weatherCode <= 900) {
      return cloudy;
    }
  };

  return (
    <div className="weather">
      <form onSubmit={handleOnSubmit}>
        <div className="input_wrapper">
        <input className="city-input"
          type="text"
          onChange={(e) => handleCityChange(e)}
          value={query}
          name="city"
        />
        <label className={query.length !== 0 ? "move-up" : "city-label"} htmlFor="city">Your City</label>
        </div>
          <button type="submit">Search</button>
      </form>
        <div className="weather-wrapper">
          { currentWeatherData &&
          currentWeatherData.map((weather: any) => {
            return (
                loading ? <h1>Loading</h1> :
                    <CSSTransition classNames="slide" appear={true} timeout={600} in={true} key={weather.city_name}>
                <div className="currentWeather">
                  <div className="gradient">
                    <div className="country">
                      Location: {`${weather.city_name}, ${weather.country_code}`}
                    </div>
                    <div className="temperature">
                      {Math.floor(weather.temp)} °C
                    </div>
                    {getCondition(weather.weather.code)}
                    <div>{weather.weather.description}</div>
                  </div>
                </div>
                      </CSSTransition>
            );
          })}
          <div className="forecast-wrapper">
            {foreCast &&
            foreCast.map((weather: any) => {
              return (
                  <CSSTransition classNames="leftSlide" appear={true} timeout={400} in={true} key={weather.ts}>
                  <div className="forecast">
                    <div className="forecast-date">
                      {moment(weather.ts * 1000).format("dddd")}
                    </div>
                    <div>{Math.round(weather.temp)} °C</div>
                    <img
                        className="forecast-icon"
                        src={`https://www.weatherbit.io/static/img/icons/${weather.weather.icon}.png`}
                        alt="weather-condition"
                    />
                  </div>
                  </CSSTransition>
              );
            })}
          </div>
        </div>
    </div>
  );
};
