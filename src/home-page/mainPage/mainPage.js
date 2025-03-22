import AQIGaugeChart from '../../components/Airgaugechart'
import TickPlacementChart from '../../mui-components/barchart'
import styles from './mainPage.module.css'
import { ForecastTable } from './forecastComponent';
import { Segmented } from 'antd';
import { useState } from 'react';




const InfoCard = ({ selectedLocation, formattedData }) => {
  const [selectedDataKey, setSelectedDataKey] = useState('aqi');
  const [selectedLabel, setSelectedLabel] = useState('AQI');

  const getSuggestion = (aqi) => {
    if (aqi <= 50) {
      return "Chất lượng không khí tốt. Thích hợp cho các hoạt động ngoài trời.";
    } else if (aqi <= 100) {
      return "Chất lượng không khí ở mức chấp nhận được; tuy nhiên, một số chất gây ô nhiễm có thể ảnh hưởng tới sức khỏe của một số ít những người nhạy cảm với không khí bị ô nhiễm.";
    } else if (aqi <= 150) {
      return "Không khí không lành mạnh cho nhóm người nhạy cảm. Người già và trẻ em nên hạn chế ra ngoài.";
    } else if (aqi <= 200) {
      return "Không khí không lành mạnh. Mọi người nên hạn chế hoạt động ngoài trời. Đeo khẩu trang khi ra ngoài.";
    } else if (aqi <= 300) {
      return "Không khí rất không lành mạnh. Tránh hoạt động ngoài trời. Đeo khẩu trang và kính bảo vệ khi buộc phải ra ngoài.";
    } else {
      return "Nguy hiểm! Tránh mọi hoạt động ngoài trời. Đóng kín cửa và sử dụng máy lọc không khí trong nhà.";
    }
  };


  const getAQIColor = (aqi) => {
    if (aqi <= 50) {
      return { backgroundColor: '#a8e05f', borderColor: '#87c13c' }; // Xanh lá - Tốt
    } else if (aqi <= 100) {
      return { backgroundColor: '#fdd74b', borderColor: '#efbe22' }; // Vàng - Trung bình
    } else if (aqi <= 150) {
      return { backgroundColor: '#fe9b57', borderColor: '#e97d32' }; // Cam - Không tốt cho nhóm nhạy cảm
    } else if (aqi <= 200) {
      return { backgroundColor: '#fe6a69', borderColor: '#e64c4b' }; // Đỏ - Không lành mạnh
    } else if (aqi <= 300) {
      return { backgroundColor: '#a97abc', borderColor: '#8a5d9d' }; // Tím - Rất không lành mạnh
    } else {
      return { backgroundColor: '#a87383', borderColor: '#915e6b' }; // Nâu đỏ - Nguy hiểm
    }
  };

  return (
    <div className={styles.info_card} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className={styles.title}>Điểm đang chọn </div>
      <div className={styles.location_info}>
        <strong>Tỉnh, thành phố:</strong> {selectedLocation.name}
        <br />
        <br />
        <span>
          <strong>Kinh độ:</strong> {selectedLocation.position[1]}, <strong>Vĩ độ: </strong> {selectedLocation.position[0]}
        </span>
      </div>


      <AQIGaugeChart value={selectedLocation.aqi} />

      <div className={styles.chart_container}>
        <div className={styles.chart_title}>
          Diễn biến AQI và nồng độ các chất ô nhiễm 24h qua
        </div>
        <Segmented
          options={['AQI', 'CO', 'No2', 'O3', 'PM-10', 'PM-2.5','SO2']} 
          onChange={(value) => {
            console.log(value); 
            setSelectedLabel(value);
            console.log(selectedLabel);
            switch(value) {
              case 'AQI':
                setSelectedDataKey('aqi');
                break;
              case 'CO': 
                setSelectedDataKey('co');
                break;
              case 'No2':
                setSelectedDataKey('no2');
                break;
              case 'O3':
                setSelectedDataKey('o3');
                break;
              case 'PM-10':
                setSelectedDataKey('pm10');
                break;
              case 'PM-2.5':
                setSelectedDataKey('pm25');
                break;
              case 'SO2':
                setSelectedDataKey('so2');
                break;
              default:
                setSelectedDataKey('aqi');
            }
            console.log(selectedLabel);
          }}
        />
        <TickPlacementChart data={formattedData} label={selectedLabel} dataKey={selectedDataKey}/>
       
      </div>


      {/* Thẻ in ra khuyến cáo */}
      <div className={styles.sugestion} style={getAQIColor(selectedLocation.aqi)}>
        <div className={styles.icon}>
        <i style = {{backgroundColor: getAQIColor(selectedLocation.aqi).borderColor}} class="fa-solid fa-heart-pulse"></i>
        </div>
        <div>
        <div className={styles.title}>Khuyến cáo</div>
          <div className={styles.sugestion_text}>
            {getSuggestion(selectedLocation.aqi)}
          </div>
        </div>
      </div>


      <ForecastTable name={selectedLocation.name} />



    </div>
  );
};

export default InfoCard;