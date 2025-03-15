import React from 'react';

const SmallBarChart = () => {
  const legendItems = [
    { label: 'Tốt', color: '#00e400', textColor: 'black' },
    { label: 'Trung bình', color: '#ffff00', textColor: 'black' },
    { label: 'Kém', color: '#ff7e00', textColor: 'black' },
    { label: 'Xấu', color: '#ff0000', textColor: 'black' },
    { label: 'Rất xấu', color: '#8f3f97', textColor: 'white' },
    { label: 'Nguy hiểm', color: '#7e0023', textColor: 'white' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      zIndex: 1000,
      borderRadius: '6px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {legendItems.map((item, index) => (
          <div
            key={index}
            style={{
              width: '80px',
              height: '24px',
              backgroundColor: item.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ fontSize: '12px', color: item.textColor }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmallBarChart;