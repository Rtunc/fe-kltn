import React, { useState, useRef, useEffect } from 'react';
import AQIGaugeChart from '../../components/Airgaugechart'
import TickPlacementChart from '../../mui-components/barchart'

const Test = () => {
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    // Update width initially
    updateWidth();

    // Add resize listener
    window.addEventListener('resize', updateWidth);

    // Cleanup
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getBarColor = (value) => {
    if (value <= 50) return '#00e400'; // Tốt
    if (value <= 100) return '#ffff00'; // Trung bình  
    if (value <= 150) return '#ff7e00'; // Kém
    if (value <= 200) return '#ff0000'; // Xấu
    if (value <= 300) return '#8f3f97'; // Rất xấu
    return '#7e0023'; // Nguy hiểm
  };

  const mockData = Array(24).fill().map(() => Math.floor(Math.random() * 300));

  return (
    <div ref={containerRef} style={{ width: '400px' }}>
      <i className="fa-solid fa-magnifying-glass"></i>
      <h1>Dữ liệu cảm biến:</h1>

      <div style={{ width: containerWidth, height: 300, backgroundColor: '#ffffff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ 
          width: '100%',
          height: 200,
          display: 'flex',
          alignItems: 'flex-end',
          position: 'relative'
        }}>
          {/* Thêm trục Y với các mốc giá trị */}
          <div style={{
            position: 'absolute',
            left: -30,
            top: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column-reverse',
            justifyContent: 'space-between'
          }}>
            {Array.from({length: 9}, (_, i) => i * 20).map((value) => (
              <div key={value} style={{
                fontSize: '10px',
                color: '#666'
              }}>
                {value}
              </div>
            ))}
          </div>

          {/* Thêm các đường kẻ ngang */}
          {Array.from({length: 9}, (_, i) => i * 20).map((value) => (
            <div key={value} style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: `${(value / 160) * 100}%`,
              borderBottom: '1px dashed rgba(0,0,0,0.1)',
              zIndex: 1
            }} />
          ))}

          {mockData.map((value, i) => {
            const currentTime = new Date();
            currentTime.setHours(currentTime.getHours() - (23 - i));
            const timeString = currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.min(value, 300) / 3}%`,
                  backgroundColor: getBarColor(value),
                  borderRadius: '4px 4px 0 0',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  cursor: 'pointer',
                  zIndex: 2
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  const tooltip = e.currentTarget.querySelector('.tooltip');
                  if (tooltip) tooltip.style.display = 'block';
                  const verticalLine = e.currentTarget.querySelector('.vertical-line');
                  if (verticalLine) verticalLine.style.display = 'block';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  const tooltip = e.currentTarget.querySelector('.tooltip');
                  if (tooltip) tooltip.style.display = 'none';
                  const verticalLine = e.currentTarget.querySelector('.vertical-line');
                  if (verticalLine) verticalLine.style.display = 'none';
                }}
              >
                <div 
                  className="vertical-line"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    top: '-200%',
                    left: '50%',
                    width: '1px',
                    height: '300%',
                    borderLeft: '2px dashed rgba(0,0,0,0.2)',
                    pointerEvents: 'none',
                    zIndex: 999
                  }}
                />
                <div 
                  className="tooltip"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    zIndex: 1000
                  }}
                >
                  {`${timeString}: ${value} AQI`}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: '#666',
          fontSize: 12,
          marginTop: 8
        }}>
          <span>24h qua</span>
          <span>Dữ liệu AQI</span>
        </div>
      </div>

    </div>

  );
};

export default Test;
