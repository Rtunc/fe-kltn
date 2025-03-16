import React from 'react';

const AQIRankingButton = ({ value }) => {
  // Function to determine background color based on AQI value
  const getBackgroundColor = (aqi) => {
    if (aqi <= 50) return '#00e400';
    if (aqi <= 100) return '#ffff00'; 
    if (aqi <= 150) return '#ff7e00';
    if (aqi <= 200) return '#ff0000';
    if (aqi <= 300) return '#8f3f97';
    return '#7e0023';
  };

  return (
    <div
      style={{
        width: '56px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        backgroundColor: getBackgroundColor(value),
        color: value <= 50 ? '#000' : '#fff',
        fontSize: '14px',
        fontWeight: '500'
      }}
    >
      {value}
    </div>
  );
};

export default AQIRankingButton;
