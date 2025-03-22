import React from 'react';
import styles from './windbox.module.css';
import Wind from '../../components/wind';

export function WindBox({ weatherData }) {
  const createInfoPopup = (e, content) => {
    const popup = document.createElement('div');
    const iconRect = e.target.getBoundingClientRect();
    
    popup.style.cssText = `
      position: absolute;
      top: ${iconRect.bottom + 10}px;
      left: ${iconRect.left}px;
      padding: 20px;
      background-color: white;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      border-radius: 12px;
      z-index: 1000;
      max-width: 320px;
      font-size: 14px;
      line-height: 1.5;
      color: #4a4a4a;
      animation: fadeIn 0.2s ease-in;
    `;
    
    popup.innerHTML = content;

    // Handle click outside popup
    const handleClickOutside = (event) => {
      if (!popup.contains(event.target) && event.target !== e.target) {
        popup.style.animation = 'fadeOut 0.2s ease-out';
        setTimeout(() => {
          document.body.removeChild(popup);
          document.removeEventListener('click', handleClickOutside);
        }, 180);
      }
    };

    // Add styles for animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);

    // Add click outside listener after a small delay to prevent immediate closing
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    document.body.appendChild(popup);
  };

  return (
    <div className={styles.windbox}>
      <Wind />
      <div className={styles.windtext}>
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
          Tốc độ gió
          <i 
            className="fa fa-info-circle"
            style={{cursor: 'pointer', color: '#666', transition: 'color 0.2s'}}
            onMouseOver={(e) => e.target.style.color = '#000'} 
            onMouseOut={(e) => e.target.style.color = '#666'}
            onClick={(e) => createInfoPopup(e, 'Tốc độ gió là thước đo vận tốc của không khí di chuyển theo chiều ngang trên bề mặt trái đất. Đơn vị đo là km/h (kilômét trên giờ).')}
          />
        </div>
        <div style={{fontSize: '28px', fontWeight: '600', color: '#2c3e50'}}>
          {(weatherData.wind.speed * 3.6).toFixed(1)} <span style={{fontSize: '16px', fontWeight: '400'}}>km/h</span>
        </div>
      </div>

      <hr style={{
        border: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(49, 52, 61, 0.2), transparent)',
        margin: '20px 0'
      }} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1px 2fr',
        gap: '30px',
        padding: '0 40px 20px'
      }}>
        <div className={styles.wind_speed}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            Tốc Độ Gió Giật
            <i 
              className="fa-solid fa-circle-info"
              style={{cursor: 'pointer', color: '#666', transition: 'color 0.2s'}}
              onMouseOver={(e) => e.target.style.color = '#000'}
              onMouseOut={(e) => e.target.style.color = '#666'}
              onClick={(e) => createInfoPopup(e, 'Tốc độ gió giật là tốc độ gió tối đa đo được trong một khoảng thời gian ngắn. Đây là chỉ số quan trọng để đánh giá mức độ nguy hiểm của gió trong thời tiết xấu.')}
            />
          </div>
          <div style={{margin: '15px 0', color: '#3498db'}}>
            <i className="fa-solid fa-wind" style={{marginRight: '10px', fontSize: '20px'}}></i>
            <i className="fa-solid fa-leaf" style={{fontSize: '18px'}}></i>
          </div>
          <div style={{fontSize: '20px', fontWeight: '600', color: '#2c3e50'}}>
            {(weatherData.wind.gust).toFixed(1)} <span style={{fontSize: '14px', fontWeight: '400'}}>km/h</span>
          </div>
        </div>

        <div style={{
          width: '1px',
          backgroundColor: 'rgba(49, 52, 61, 0.15)',
          alignSelf: 'stretch'
        }} />

        <div className={styles.wind_direction}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
            Hướng Gió
            <i 
              className="fa-solid fa-circle-info"
              style={{cursor: 'pointer', color: '#666', transition: 'color 0.2s'}}
              onMouseOver={(e) => e.target.style.color = '#000'}
              onMouseOut={(e) => e.target.style.color = '#666'}
              onClick={(e) => createInfoPopup(e, 'Được xác định bằng các điểm trên la bàn như N, S, E hoặc W để biết gió đến từ đâu.')}
            />
          </div>
          <div style={{margin: '15px 0', color: '#3498db'}}>
            <i 
              className="fa-solid fa-location-arrow" 
              style={{
                transform: `rotate(${weatherData.wind.deg}deg)`,
                fontSize: '20px',
                transition: 'transform 0.3s ease'
              }}
            />
          </div>
          <div style={{fontSize: '20px', fontWeight: '600', color: '#2c3e50'}}>
            {weatherData.wind.deg}°
          </div>
        </div>
      </div>
    </div>
  );
}
