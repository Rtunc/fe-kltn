import React, { useState, useEffect } from 'react';
import styles from './weatherPage.module.css';
import {WindBox} from './windbox';
import { Gauge } from '@mui/x-charts/Gauge';

const WeatherComponent = ({ name }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
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

        <div className={styles.metricsContainer}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
            width: '100%'
          }}>
            {/* Block 1 */}
            <div className={styles.box} style={{
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flex: '1'
            }}>
   
              <h5 style={{marginTop: 0, marginBottom: '15px', color: '#2c3e50',  alignItems: 'left'}}>
                Chỉ số tia cực tím
              </h5>
              <div className={styles.uv_container}>
                {/* UV Icon based on value */}
                <div className={styles.uv_icon}>
                  {weatherData.uvi <= 2 && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="green">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    </svg>
                  )}
                  {weatherData.uvi > 2 && weatherData.uvi <= 5 && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#FFA500">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    </svg>
                  )}
                  {weatherData.uvi > 5 && weatherData.uvi <= 7 && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#FF4500">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    </svg>
                  )}
                  {weatherData.uvi > 7 && weatherData.uvi <= 10 && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#FF0000">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    </svg>
                  )}
                  {weatherData.uvi > 10 && (
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="#800080">
                      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                    </svg>
                  )}
                </div>
                <div className={styles.uv_value}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: 'bold',
                    color: weatherData.uvi <= 2 ? 'green' :
                           weatherData.uvi <= 5 ? '#FFA500' :
                           weatherData.uvi <= 7 ? '#FF4500' :
                           weatherData.uvi <= 10 ? '#FF0000' : '#800080'
                  }}>
                    {weatherData.uvi}
                  </span>
                  <div style={{
                    fontSize: '14px',
                    marginTop: '5px',
                    color: '#666'
                  }}>
                    {weatherData.uvi <= 2 ? 'Thấp' :
                     weatherData.uvi <= 5 ? 'Trung bình' :
                     weatherData.uvi <= 7 ? 'Cao' :
                     weatherData.uvi <= 10 ? 'Rất cao' : 'Cực kỳ cao'}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Block 2 */}
            <div className={styles.box} style={{
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              flex: '1'
            }}>
              <h4 style={{marginTop: 0, marginBottom: 0,color: '#2c3e50'}}>
                Áp suất
              </h4>
              <div className={styles.pressure_container}>
              <Gauge width={100} height={100} value={weatherData.main.pressure/1500*100} startAngle={-90} endAngle={90} hideText/>
              <div className = {styles.pressure_value}>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{weatherData.main.pressure}</span> <br/>
                mBar

              </div>
              
              </div>
            </div>
          </div>
        </div>
       
       
    </div>

  );
};

export default WeatherComponent;
