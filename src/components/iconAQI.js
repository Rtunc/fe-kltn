import L from 'leaflet';
import { Marker } from 'react-leaflet';

const getAQIColor = (aqi) => {
  if (aqi <= 50) return { color: '#00e400', textColor: 'black' }; // Tốt
  if (aqi <= 100) return { color: '#ffff00', textColor: 'black' }; // Trung bình
  if (aqi <= 150) return { color: '#ff7e00', textColor: 'black' }; // Kém
  if (aqi <= 200) return { color: '#ff0000', textColor: 'black' }; // Xấu
  if (aqi <= 300) return { color: '#8f3f97', textColor: 'white' }; // Rất xấu
  return { color: '#7e0023', textColor: 'white' }; // Nguy hiểm
};

const AQIMarker = ({ position, aqi, onClick }) => {
  const { color, textColor } = getAQIColor(aqi);

  // Tạo icon tùy chỉnh với chỉ số AQI và vòng tròn bên ngoài
  const customIcon = L.divIcon({
    className: 'custom-icon',
    html: `<div style="
             position: relative;
             display: flex; 
             align-items: center; 
             justify-content: center;
             animation: pulse 2s infinite;
           ">
             <div style="
               background-color: ${color}; 
               border-radius: 50%; 
               width: 28px; 
               height: 28px; 
               display: flex; 
               align-items: center; 
               justify-content: center; 
               font-size: 12px; 
               color: ${textColor};
               font-family: 'Helvetica Neue', Arial, Helvetica, sans-serif;
               z-index: 1;
             ">
               ${aqi}
             </div>
             <div style="
               position: absolute;
               border-radius: 50%;
               width: 36px;
               height: 36px;
               border: 2px solid ${color}; /* Cùng màu với vòng tròn bên trong */
               opacity: 0.5; /* Độ mờ để tạo hiệu ứng */
               z-index: 0;
             "></div>
           </div>
           <style>
             @keyframes pulse {
               0% { transform: scale(1); }
               50% { transform: scale(1.1); }
               100% { transform: scale(1); }
             }
           </style>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <Marker position={position} icon={customIcon} eventHandlers={{ click: onClick }}/>
  );
};

export default AQIMarker;