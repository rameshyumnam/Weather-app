import React, { useEffect, useRef, useState } from 'react';
import { FaSkyatlas, FaWater } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { MdLocationPin } from "react-icons/md";
import { FaTemperatureHigh } from "react-icons/fa";
import { FaWind } from "react-icons/fa";
import "./Weather.css";

// Formatinf Time
const formatTime = (time) => {
  const date = new Date(time * 1000);
  let hours = date.getHours();
  let minutes = date.getMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
}

const Weather = () => {

  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDayTime, setIsDayTime] = useState(true);

  const search = async (city) => {
    if (city === '') {
      setErrorMessage('Please Enter a City Name.');
      setWeatherData(false);
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=326996529aede5607fcd40d8af36859b`;
      const response = await fetch(url);
      const dataJSON = await response.json();
      console.log(dataJSON);

      if (!response.ok) {
        setErrorMessage(dataJSON.message);
        setWeatherData(false);
        return;
      }

      setWeatherData({
        icon: dataJSON.weather[0].icon,
        temperature: Math.floor(dataJSON.main.temp),
        description: dataJSON.weather[0].description,
        location: dataJSON.name,
        minTemp: Math.floor(dataJSON.main.temp_min),
        maxTemp: Math.floor(dataJSON.main.temp_max),
        feelsLike: Math.floor(dataJSON.main.feels_like),
        humidity: dataJSON.main.humidity,
        windSpeed: dataJSON.wind.speed,
        sunrise: dataJSON.sys.sunrise,
        sunset: dataJSON.sys.sunset
      })
    } catch (err) {
      console.log('Error Fetching Weather Data:', err);
      setWeatherData(false);
    }
  }

  useEffect(() => {
    // Change background according to day and night.
    if (weatherData) {
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime >= weatherData.sunrise && currentTime < weatherData.sunset) {
        setIsDayTime(true);
      } else {
        setIsDayTime(false);
    }
    }
  },[weatherData]);

  useEffect(() => {
    search('Imphal')
  },[])

  return (
    <div className={`weather ${isDayTime ? 'day' : 'night'}`}>
      <header className='head'>
        <h1 className='min-logo'><FaSkyatlas style={{
          fontSize: "50px",
          color: '#d8edff'
        }} /></h1>
        <h1 className="logo">
            <FaSkyatlas className='sky-icon' style={{
                fontSize: "70px",
                color: '#d8edff'
            }}
            /> SkyCast
        </h1>
        <div className="search-container">
            <input ref={inputRef} type="text" placeholder='Search City' />
            <p className='search-icon' onClick={() => search(inputRef.current.value)}><IoSearchSharp /></p>
        </div>
      </header>
      {weatherData ? <>
        <div className="weather-container">
          <div className='row'>
              <img src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`} alt="" />
              <p className="temperature">{weatherData.temperature}⁰C</p>
              <p className="description">{weatherData.description}</p>
          </div>
          <div className="col-container">
            <div className='col'>
              <p className="location"><MdLocationPin className='location-icon' style={{
                fontSize: '45px',
                color: '#75ffbfff'
              }} /> {weatherData.location}</p>
              <p className='avg-temp'><FaTemperatureHigh className='temp-icon' style={{
                fontSize: '45px',
                color: '#75ffbfff'
              }} /> {weatherData.minTemp}⁰C/{weatherData.maxTemp}⁰C Feels Like {weatherData.feelsLike}⁰C</p>
            </div>
              <div className="col" id='col'>
                  <div className='col-div'>
                      <FaWater className='humid-icon' style={{
                        fontSize: '45px',
                        color: '#75ffbfff'
                      }} />
                      <div>
                          <p>{weatherData.humidity} %</p>
                          <span>Humidity</span>
                      </div>
                  </div>
                  <div className='col-div'>
                      <FaWind className='wind-icon' style={{
                        fontSize: '45px',
                        color: '#75ffbfff'
                      }} />
                      <div>
                          <p>{weatherData.windSpeed} Km/h</p>
                          <span>Wind Speed</span>
                      </div>
                  </div>
              </div>
            </div>
          </div>
        <div className="time-container">
          <p>Sunrise: {formatTime(weatherData.sunrise)}</p>
          <p>Sunset: {formatTime(weatherData.sunset)}</p>
        </div>
      </> : <>
        <h1 className='err-msg'>{errorMessage}</h1>
      </>}
    </div>
  )
}

export default Weather
