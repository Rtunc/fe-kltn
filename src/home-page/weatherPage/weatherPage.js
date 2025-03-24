import React, { useState, useEffect } from 'react';
import styles from './weatherPage.module.css';
import {WindBox} from './windbox';
const WeatherComponent = ({ name }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=9d026f9defad1a66e14194bf4ac5425b`
        );
        
        if (!response.ok) {
          throw new Error('Weather data fetch failed');
        }

        const data = await response.json();
        console.log(data);
        setWeatherData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [name]);

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
  if (error) return <div>Error: {error}</div>;
  if (!weatherData) return null;

  return (
    <div className = {styles.weatherPage}>
        <WindBox weatherData={weatherData} />

        
        <div className = {styles.doam_title}> 
          <div>Độ ẩm</div>
          <div style={{display:'flex'}}>
            <div className = {styles.doam_content}>
            <span>
              59%
            </span>
            <span>
              Điểm
            </span>
            </div>
            <div className = {styles.doam_icon}>

            </div>
            

          </div>
        </div>
    </div>

  );
};

export default WeatherComponent;
