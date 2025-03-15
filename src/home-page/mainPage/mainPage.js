import AQIGaugeChart from '../../components/Airgaugechart'
import TickPlacementChart from '../../mui-components/barchart'
import styles from './mainPage.module.css'
const InfoCard = ({ selectedLocation, formattedData }) => {
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
      <TickPlacementChart data={formattedData}/>
    </div>
  );
};

export default InfoCard;