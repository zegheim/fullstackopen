import React, { useState, useEffect } from "react";
import axios from "axios";

const Result = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  } else if (countries.length > 1) {
    return countries.map((c) => (
      <ToggledResult key={c.alpha2Code} country={c} />
    ));
  } else if (countries.length === 1) {
    return <DetailedResult country={countries[0]} />;
  } else {
    return <p>No matches found, try relaxing your filter</p>;
  }
};

const ToggledResult = ({ country }) => {
  const [isVisible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!isVisible);
  };

  return (
    <>
      <div>
        {country.name}{" "}
        <button onClick={toggleVisibility}>
          {isVisible ? "hide" : "show"}
        </button>
      </div>
      {isVisible ? <DetailedResult country={country} /> : null}
    </>
  );
};

const DetailedResult = ({ country }) => {
  const languages = country.languages.map((l) => (
    <li key={l.iso639_1}>{l.name}</li>
  ));

  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital {country.capital}</p>
      <p>population {country.population}</p>
      <h3>languages</h3>
      <ul>{languages}</ul>
      <img src={country.flag} alt={`Flag of ${country.name}`} width="100" />
      <Weather city={country.capital} />
    </div>
  );
};

const Weather = ({ city, countryCode }) => {
  const [weather, setWeather] = useState({
    isReady: false,
  });

  const params = {
    appid: process.env.REACT_APP_API_KEY,
    q: `${city},${countryCode}`,
    units: "metric",
  };

  const getWeather = () => {
    axios
      .get("https://api.openweathermap.org/data/2.5/weather", { params })
      .then((response) => {
        setWeather({ isReady: true, ...response.data });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(getWeather, []);

  if (weather.isReady) {
    return (
      <div>
        <h3>Weather in {city}</h3>
        <p>
          <strong>temperature:</strong> {weather.main.temp} Celsius
        </p>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
          alt={`${weather.weather[0].description} icon`}
          width="50"
        />
        <p>
          <strong>wind:</strong> {weather.wind.speed} m/s, {weather.wind.deg}°
        </p>
      </div>
    );
  }

  return <p>Loading weather data...</p>;
};

export default Result;
