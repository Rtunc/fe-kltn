import React from 'react';
import styles from './weatherPage.module.css';
import Wind from '../../components/wind';

export function WindBox({ weatherData }) {
  return (
    <div className = {styles.windbox}>
      <Wind></Wind>
      <div className={styles.windtext}>
        Tốc độ gió
        <i 
          className="fa fa-info-circle" 
          style={{marginLeft: '8px', cursor: 'pointer'}}
          onClick={(e) => {
            const popup = document.createElement('div');
            
            // Lấy vị trí của icon được click
            const iconRect = e.target.getBoundingClientRect();
            
            popup.style.position = 'absolute';
            popup.style.top = `${iconRect.bottom + 10}px`; // Hiển thị popup dưới icon
            popup.style.left = `${iconRect.left}px`;
            popup.style.padding = '20px';
            popup.style.backgroundColor = 'white';
            popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            popup.style.borderRadius = '8px';
            popup.style.zIndex = '1000';
            popup.style.maxWidth = '300px'; // Giới hạn chiều rộng
            popup.innerHTML = 'Tốc độ gió là thước đo vận tốc của không khí di chuyển theo chiều ngang trên bề mặt trái đất. Đơn vị đo là km/h (kilômét trên giờ).';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '×';
            closeBtn.style.position = 'absolute';
            closeBtn.style.right = '10px';
            closeBtn.style.top = '10px';
            closeBtn.style.border = 'none';
            closeBtn.style.background = 'none';
            closeBtn.style.fontSize = '20px';
            closeBtn.style.cursor = 'pointer';
            closeBtn.onclick = () => document.body.removeChild(popup);
            
            popup.appendChild(closeBtn);
            document.body.appendChild(popup);
          }}
        ></i>
      </div>
      <div className = {styles.windtext}><span>{(weatherData.wind.speed * 3.6).toFixed(1)}</span> km/h</div>
      <hr style={{
        border: 0,
        minWidth: '1px',
        minHeight: '1px',
        opacity: 0.25,
        width: '100%',
        height: '1px',
        backgroundImage: 'linear-gradient(to right, transparent, rgb(49, 52, 61), transparent)'
      }} />
    <div className = {styles.table_content}></div>
      <div className = {styles.wind_speed}>
        <div>Tốc Độ Gió Giật</div>
        <div><i class="fa-solid fa-wind"></i> <i class="fa-solid fa-leaf"></i></div>
        <div><span>{(weatherData.wind.speed * 3.6).toFixed(1)}</span> km/h</div>
      </div>
      <div className = {styles.wind_direction}>
        <div>Hướng</div>
        <div><i class="fa-solid fa-wind"></i> <i class="fa-solid fa-leaf"></i></div>
        <div><span>{(weatherData.wind.speed * 3.6).toFixed(1)}</span> km/h</div>
      </div>
    </div>  
  );
}
