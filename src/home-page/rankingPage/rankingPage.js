import React, { useState, useEffect } from 'react';
import styles from './rankingPage.module.css';

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
    </div>
  );
};

export default RankingPage;
