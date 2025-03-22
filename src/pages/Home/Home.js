import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { SortAscendingOutlined } from '@ant-design/icons';
import 'leaflet/dist/leaflet.css';
import styles from './Home.module.css';
import SmallBarChart from '../../components/smallbarchart';
import AQIMarker from '../../components/iconAQI';
import InfoCard from '../../home-page/mainPage/mainPage';
import RankingPage from '../../home-page/rankingPage/rankingPage';
import WeatherComponent from '../../home-page/weatherPage/weatherPage';

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
    const bounds = map.getBounds();
    if (!bounds.contains(location.position)) {
      map.flyTo([16.0, 106.0], 5, {
        duration: 1.5,
        easeLinearity: 0.25
      });

      setTimeout(() => {
        map.flyTo(location.position, 13, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }, 0);
    } else {
      map.flyTo(location.position, 13, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }

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
  const [locations, setLocations] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState({
    position: [0, 0],
    name: "",
    aqi: NaN
  });
  const [formattedData, setFormattedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Tạo ref để truy cập map
  const mapRef = useRef(null);
  const contentPageRef = useRef(null);

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
        console.log(formattedLocations);
        setLocations(formattedLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocations();
  }, []);

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
        console.log(data);
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

  // Xử lý tìm kiếm khi input thay đổi
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // Hàm xử lý transition map đến location
  const flyToLocation = (location) => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;
    const bounds = map.getBounds();
    
    // Nếu vị trí không nằm trong viewport hiện tại, zoom out trước
    if (!bounds.contains(location.position)) {
      map.flyTo([16.0, 106.0], 5, {
        duration: 1.5,
        easeLinearity: 0.25
      });

      // Sau đó bay đến vị trí được chọn
      setTimeout(() => {
        map.flyTo(location.position, 13, {
          duration: 1.5,
          easeLinearity: 0.25
        });
      }, 0);
    } else {
      // Nếu vị trí đã nằm trong viewport, bay thẳng đến
      map.flyTo(location.position, 13, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  };

  // Cập nhật hàm handleLocationSelect
  const handleLocationSelect = (location) => {
    setSearchTerm(location.name);
    setShowDropdown(false);
    
    // Cập nhật selected location
    setSelectedLocation({
      position: location.position,
      name: location.name,
      aqi: location.aqi
    });

    // Thực hiện transition trên map
    if (mapRef.current) {
      flyToLocation(location);
    }
  };

  // Effect để tìm kiếm khi searchTerm thay đổi
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    
    const timeoutId = setTimeout(() => {
      // Tìm kiếm trong danh sách locations
      const results = locations.filter(location =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setIsLoading(false);
      setShowDropdown(true);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, locations]);

  const handleClick = () => {
    if (contentPageRef.current) {
      contentPageRef.current.style.display = 
        contentPageRef.current.style.display === 'none' ? 'block' : 'none';
    }
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div className={styles.searchBar} style={{ position: 'absolute', top: 24, left: '240px', transform: 'translateX(-50%)', zIndex: 1000 }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '400px',
        }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            height: '35px',
          }}>
            <i className="fa-solid fa-magnifying-glass" style={{color: '#666', marginRight: '8px'}}></i>
            <input 
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm địa điểm..."
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Dropdown Results */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: '4px',
              marginTop: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1001
            }}>
              {isLoading ? (
                <div style={{ padding: '10px', textAlign: 'center' }}>
                  Đang tìm kiếm...
                </div>
              ) : searchResults.length > 0 ? (
                <div>
                  {searchResults.map((location, index) => (
                    <div
                      key={location.id || index}
                      onClick={() => handleLocationSelect(location)}
                      style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div>
                        <div style={{ fontSize: '14px' }}>{location.name}</div>
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#82c91e',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        AQI: {location.aqi}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.box} ${styles.container}`} style={{ position: 'absolute', top: 100, left: '240px', width: '400px', transform: 'translateX(-50%)', zIndex:999 }}>
        <div className={styles.tabiconline} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex' }}>
            <div className={`${styles.tabiconline_item} ${selectedTab === 0 ? styles.active : ''}`}>
              <img 
                src="/air-quality-index-aqi-icon-white_116137-12900.avif"
                alt="AQI Icon"
                className={styles.tabiconline_item_icon}
                onClick={() => setSelectedTab(0)}
                style={{color: selectedTab === 0 ? '#1890ff' : 'inherit'}}
              />
            </div>
            <div className={`${styles.tabiconline_item} ${selectedTab === 1 ? styles.active : ''}`}>
              <i 
                className="fa-solid fa-sun"
                onClick={() => setSelectedTab(1)} 
                style={{padding: '16px', color: selectedTab === 1 ? '#1890ff' : 'inherit'}}
              />
            </div>
            <div className={`${styles.tabiconline_item} ${selectedTab === 2 ? styles.active : ''}`}>
              <SortAscendingOutlined 
                className={styles.tabiconline_item_icon} 
                onClick={() => setSelectedTab(2)}
                style={{color: selectedTab === 2 ? '#1890ff' : 'inherit'}}
              />
            </div>
          </div>

          <div className={styles.tabiconline_item}>
            <div 
              className={styles.tabiconline_item_collapse}
              onClick={handleClick}
            >
              <i className={`fa-solid ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
            </div>
          </div>
        </div>

        <div 
          ref={contentPageRef}
          style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          {selectedTab === 0 && <InfoCard selectedLocation={selectedLocation} formattedData={formattedData} />}
          {selectedTab === 1 && <WeatherComponent name={selectedLocation.name} />}
          {selectedTab === 2 && <RankingPage/>}
        </div>
      </div>
      
      <MapContainer
        ref={mapRef}
        center={selectedLocation.position}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        whenCreated={(map) => { mapRef.current = map; }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.length > 0 && (
          <MapWithMarkers 
            locations={locations} 
            onLocationSelect={setSelectedLocation}
          />
        )}
      </MapContainer>

      <SmallBarChart />
    </div>
  );
};

export default Home;
