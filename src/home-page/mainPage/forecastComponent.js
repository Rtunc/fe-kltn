import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import styles from './forecastComponent.module.css';
import AQIRankingButton from '../../components/AQIrankingbutton';
import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axios';



export const ForecastTable = ({name}) => {
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/forecast-aqi', {
          params: { province: name }
        });
        if (Array.isArray(response.data)) {
          setForecastData(response.data);
        } else {
          console.error('Received non-array data:', response.data);
          setForecastData([]);
        }
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setError('Failed to load forecast data');
        setForecastData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [name]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
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
  if (!forecastData || forecastData.length === 0) return <div>No forecast data available</div>;
  

  return (
    <div className = {styles.forecast_table_container}>
      <div className = {styles.title}>
        <i className="fa-solid fa-chart-simple"></i> Dự báo 7 ngày tiếp theo tại: {name}
      </div>

      <Table>
        <TableHead>
          <TableRow style={{height: '48px'}}>
            <TableCell align="center" style={{fontWeight: 600, color: 'black'}}>#</TableCell>
            <TableCell align="left" style={{fontWeight: 600, color: 'black'}}>Thứ</TableCell>
            <TableCell align="center" style={{fontWeight: 600, color: 'black'}}>AQI VN</TableCell>
            <TableCell align="center" style={{fontWeight: 600, color: 'black'}}>Xu hướng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {forecastData.map((row, index) => (
            <TableRow 
              key={index}
              hover
              style={{height: '48px', '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}}}
            >
              <TableCell align="center" style={{color: 'black'}}>{index + 1}</TableCell>
              <TableCell align="left" style={{color: 'black'}}><div style={{display: 'flex', alignItems: 'center'}}><div className={styles.location_icon}></div><div>{row.day ? row.day : (new Date(row.timestamp).getDay() === 0 ? 'Chủ nhật' : `Thứ ${new Date(row.timestamp).getDay() + 1}`)}</div></div></TableCell>
              <TableCell align="center"><AQIRankingButton value={row.aqi}/></TableCell>
              <TableCell align="center" style={{color: 'black'}}>
                {index > 0 ? (
                  row.aqi > forecastData[index-1].aqi ? 
                  `↑ (+${row.aqi - forecastData[index-1].aqi})` : 
                  `↓ (${row.aqi - forecastData[index-1].aqi})`
                ) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};