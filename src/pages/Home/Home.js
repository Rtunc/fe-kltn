import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './Home.module.css'
import SmallBarChart from '../../components/smallbarchart'
import {EnvironmentFilled, SortAscendingOutlined, SettingOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import AQIGaugeChart from '../../components/Airgaugechart'
import 'leaflet/dist/leaflet.css';
import AQIMarker from '../../components/iconAQI'
import TickPlacementChart from '../../mui-components/barchart'
import InfoCard from '../../home-page/mainPage/mainPage'
import RankingPage from '../../home-page/rankingPage/rankingPage'
// MapWithMarkers được render bên trong MapContainer nên có thể sử dụng useMap hook
const MapWithMarkers = ({ locations, onLocationSelect }) => {
  const map = useMap();

  // Sử dụng useEffect để theo dõi thay đổi của locations
  useEffect(() => {
    if (locations.length > 0) {
      // Cập nhật map khi locations thay đổi
      const bounds = locations.map(loc => loc.position);
      map.fitBounds(bounds);
    }
  }, [locations, map]);

  const handleMarkerClick = (location) => {
    // Only zoom out if location is not visible on current map bounds
    const bounds = map.getBounds();
    if (!bounds.contains(location.position)) {
      map.flyTo([16.0, 106.0], 5, {
        duration: 1.5, // Duration in seconds
        easeLinearity: 0.25
      });
    }

    // After zoom out transition, fly to selected location
    setTimeout(() => {
      map.flyTo(location.position, 13, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }, 0);

    // Update both position and aqi when marker is clicked
    onLocationSelect({
      position: location.position,
      aqi: location.aqi,
      name: location.name
    });
  };

  return (
    <>
      {locations.map(location => (
        <AQIMarker
          key={location.id}
          position={location.position}
          aqi={location.aqi}
          onClick={() => handleMarkerClick(location)}
        />
      ))}
    </>
  );
};

const Home = () => {
  const [data, setData] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState({
    position: [0, 0],
    name: "Hà Nội",
    aqi: NaN
  });
  
  const [formattedData, setFormattedData] = useState([]);

  // Fetch hourly data when selectedLocation changes
  useEffect(() => {
    const fetchHourlyData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/get_hourly_data?q=${selectedLocation.name}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch hourly data');
        }
        const data = await response.json();
        console.log('Fetched hourly data:', data); // Log để debug
        
        // Transform data to only keep timestamp and rename vn_aqi to aqi
        const formattedData = data.map(item => ({
          timestamp: item.timestamp,
          aqi: item.vn_aqi
        }));
        
        setFormattedData(formattedData);
      } catch (error) {
        console.error('Error fetching hourly data:', error);
      }
    };

    if (selectedLocation.name) {
      fetchHourlyData();
    }
  }, [selectedLocation.name]);
  
  // Fetch data khi component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/get_place_with_current_aqi');
        if (!response.ok) {
          throw new Error('Failed to fetch locations');
        }
        const data = await response.json();
        const formattedLocations = data.map((location, index) => ({
          id: index + 1,
          position: [location.longitude, location.latitude],
          name: location.province_name,
          aqi: location.vn_aqi
        }));
        console.log('Fetched locations:', formattedLocations); // Log để debug
        setLocations(formattedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <div>
      <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>

      
        <div className={`${styles.box} ${styles.container}`} style={{ position: 'absolute', top: 100, left: '240px', transform: 'translateX(-50%)', zIndex: 1000 }}>
          
          <div className={styles.tabiconline} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              <div className={`${styles.tabiconline_item} ${styles.active}`}>
                <EnvironmentFilled className={styles.tabiconline_item_icon} onClick={() => setSelectedTab(0)} />
              </div>
              <div className={`${styles.tabiconline_item} ${styles.active}`}>
                <EnvironmentFilled className={styles.tabiconline_item_icon} onClick={() => setSelectedTab(1)} />
              </div>
              <div className={`${styles.tabiconline_item} ${styles.active}`}>
                <SortAscendingOutlined className={styles.tabiconline_item_icon} onClick={() => setSelectedTab(2)} />
              </div>
            </div>

            <div className={styles.tabiconline_item}>
              <MenuUnfoldOutlined className={styles.tabiconline_item_icon} />
            </div>
          </div>


          {selectedTab === 0 && <InfoCard selectedLocation={selectedLocation} formattedData={formattedData} />}
          {selectedTab === 1 && <div>Page 2 Content</div>}
          {selectedTab === 2 && <RankingPage/>}
        </div>
        
        <MapContainer
          center={selectedLocation.position}
          zoom={13}
          style={{ width: '100%', height: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Chỉ render MapWithMarkers khi có dữ liệu locations */}
          {locations.length > 0 && <MapWithMarkers locations={locations} onLocationSelect={setSelectedLocation} />}
        </MapContainer>

        <SmallBarChart />


      </div>
    </div>

  );
};

export default Home;
