import React from 'react'
import '../navigation/Nav.css'
import { FaSearchLocation } from "react-icons/fa";
import '../cssfolder/weather.css'
import { useState } from 'react';
import { useEffect } from 'react';
import Clouds from '../assets/weatherImgs/weatherImgs/clouds.png';
import Rain from '../assets/weatherImgs/weatherImgs/rain.png';
// import Mist from '../assets/weatherImgs/weatherImgs/mist.png';
import Clear from '../assets/weatherImgs/weatherImgs/clear.png';
import Snow from '../assets/weatherImgs/weatherImgs/snowy.png';
import Storm from '../assets/weatherImgs/weatherImgs/Storm.png';
import axios from 'axios'
import { FaThermometerHalf } from "react-icons/fa";
import { WiRaindrop } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
const Weather = () => {
  const aiKey = "e14ac28f29b77e1a1e08c4a126394f8f";
  const [cityName, setCityName] = useState("");
  const [handleError, sethandleError] = useState(false);
  const [weatherData, setWeatherData] = useState({});
  const [currentForecast, setCurrentForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foreCast, setForeCast] = useState([]);

  const getCurrentForecast = (forecast) => {
    const today = new Date().toISOString().slice(0, 10);
    return forecast.filter((item) => item.dt_txt.startsWith(today));
  };
  const getForecast = (forecast) =>{
    const today = '12:00:00';

    return forecast.filter((item)=>{
      return item.dt_txt.endsWith(today)
    })
  }

  function  getWeatherData() {
    if (cityName.trim() !== ""){
      setIsLoading(true)
      const currentWeatherUrl = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${aiKey}&units=metric`);



      const forcastWeatherUrl = axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${aiKey}&units=metric`);
      
      Promise.all([currentWeatherUrl, forcastWeatherUrl])
      .then((res)=>{
        // current weather data 
        setWeatherData(res[0].data)

        // for today's forecast 
        const forecastData = getCurrentForecast(res[1].data.list)
        setCurrentForecast(forecastData)

        // remaining forecast data 
        const remainingForecast = getForecast(res[1].data.list);
        setForeCast(remainingForecast)
        
   console.log(currentForecast)
        sethandleError(false);
        setIsLoading(false);
      })
      .catch((error)=>{
        console.log(error);
        sethandleError(true);
        setIsLoading(false);
      })
    }
}
// console.log(foreCast)

const weatherImgs = {
    Clouds: Clouds,
    Clear: Clear,
    Rain: Rain,
    Snow: Snow,
    Storm: Storm,
    Thunderstorm: Storm,
  }

  const weatherImg = weatherData.weather && weatherImgs[weatherData.weather[0].main];
  console.log(currentForecast);
  

  return (
    <div className='page-content'>

      <div className='weather-content'>

        <div className='weather-page1'>

          {/* search input field  */}
          <div className='search-bar'>
            <input type="text" placeholder='search cities' onChange={(e)=>(setCityName(e.target.value))} 
            onKeyDown={(e)=> e.key === "Enter" ? getWeatherData() : null}/>
            <FaSearchLocation onClick={getWeatherData}/>
          </div>

          {/* current weather  */}
          {
            isLoading ? <h1>Loading....</h1> : handleError ? <h1>Location Not Found : 404 Error </h1>
            :
            <div className='weatherCard1'>
              <div className='weather-texts'>
                <h1>{weatherData.name}</h1>
                {
                  weatherData.weather && <p>{weatherData.weather[0].description}</p>
                }
                {
                  weatherData.main &&<h2>{Math.floor(weatherData.main.temp)}&#176;C</h2>
                }

              </div>
              <div className='weather-imgs'><img src={weatherImg} alt="" /></div>
            </div>
          }

          {/* forecast weather  */}
          {
            !isLoading && !handleError && currentForecast.length > 0 &&
            <div className='forecast-card'>
            <h2>Today's Forecast</h2>
            <div className='forecast-weather'>
              {currentForecast.map((forecast,index)=>(
                <div className='hourly-forecast' key={index}>
                  <p>{new Date(forecast.dt_txt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  </p>
                  <img src={`${weatherImgs[forecast.weather[0].main]}`} alt="" />
                  <p>{forecast.main.temp}</p>

                </div>
              ))}
            </div>
          </div>
          }
          {
            !isLoading && !handleError && weatherData.main && (
              <div className='airCondition'>
              <div className='airCondition1'>
                <div>
                  <span>
                    <FaThermometerHalf/>
                    <p>Real Feel</p>
                  </span>
                  <p>{weatherData.main && Math.floor(weatherData.main.feels_like)}&#176;</p>
                </div>
                <div>
                  <span>
                    <WiRaindrop/>
                    <p>Chance of raining</p>
                  </span>
                  <p>
                    {currentForecast[0] && Math.floor(currentForecast[0].pop) * 100}%
                  </p>
                </div>
              </div>
              <div className='airCondition2'>
                <div>
                  <span>
                    <FaWind/>
                    <p>Wind</p>
                  </span>
                  <p>{currentForecast[0] && Math.floor(currentForecast[0].wind.speed)}m/s</p>
                </div>
                <div>
                  <span>
                    <WiHumidity/>
                    <p>Humidity</p>
                  </span>
                  <p>{currentForecast[0] && Math.floor(currentForecast[0].main.humidity)}%</p>
                </div>
              </div>
            </div>
            )}
        </div>

        <div className='weather-page2'>
          {
            !isLoading && !handleError && foreCast.length > 0 && (
              <div className='remainingForecast'>
              <h2>5 days forecast</h2>
              <div className='remainingForecast-card'>
                {
                  foreCast.map((forecast,index)=>(
                    <div>
                      <p>
                        {
                          new Date(forecast.dt_txt).toLocaleDateString('en-US',{
                            weekday:'long',
                          })
                        }
                      </p>
                      <img src={`${forecast.weather && weatherImgs[forecast.weather[0].main]}`} alt=""className='forecastmainimg' />
                      <p>{forecast.weather[0].main}</p>
                    </div>
                  ))
                }
              </div>
            </div>
            )
          }
        </div>

      </div>
    </div>
  )
}

export default Weather