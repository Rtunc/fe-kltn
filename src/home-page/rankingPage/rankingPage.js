import React, { useState, useEffect } from 'react';
import styles from './rankingPage.module.css';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import AQIRankingButton from '../../components/AQIrankingbutton';
const RankingPage = () => {


  const [simulatedTime, setSimulatedTime] = useState('');

  useEffect(() => {
    const fetchSimulatedTime = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/get_simulated_time');
        const data = await response.json();
        const date = new Date(data.time);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        setSimulatedTime(formattedDate);
        
      } catch (error) {
        console.error('Error fetching simulated time:', error);
      }
    };

    fetchSimulatedTime();
  }, []);


  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/get_place_with_current_aqi');
        const data = await response.json();
        // Sort data by vn_aqi in ascending order
        data.sort((a, b) => a.vn_aqi - b.vn_aqi);
        setRankingData(data); 
      } catch (error) {
        console.error('Error fetching ranking data:', error);
      }
    };

    fetchRankingData();
  }, []);
  return (
    <div className={styles.WrapperRankingPage}>
        <div className={styles.title} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
            <div>Xếp hạng tỉnh/ thành phố</div>
            <div style={{fontSize: '16px', color: '#666'}}>
                {simulatedTime || 'Loading...'}
            </div>
        </div>
        <div style={{textAlign: 'left', fontSize: '12px'}}>
            Địa điểm đã lưu
        </div>
        
        <Table>
            <TableHead>
                <TableRow style={{height: '48px'}}>
                    <TableCell align="center" style={{fontWeight: 600}}>#</TableCell>
                    <TableCell align="left" style={{fontWeight: 600}}>ĐỊA ĐIỂM</TableCell>
                    <TableCell align="center" style={{fontWeight: 600}}>AQI VN</TableCell>
                    <TableCell align="center" style={{fontWeight: 600}}>HÔM QUA</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rankingData.map((row, index) => (
                    <TableRow 
                        key={index}
                        hover
                        style={{height: '48px', '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}}}
                    >
                        <TableCell align="center">{index + 1}</TableCell>
                        <TableCell align="left"><div style={{display: 'flex', alignItems: 'center'}}><div className={styles.location_icon}><i className="fa-solid fa-location-dot"/></div><div >{row.province_name}</div></div></TableCell>
                        <TableCell align="center"><AQIRankingButton value={row.vn_aqi}/></TableCell>
                        <TableCell align="center">-</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
};

export default RankingPage;
