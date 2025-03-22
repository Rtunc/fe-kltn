import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import styles from './forecastComponent.module.css';
import AQIRankingButton from '../../components/AQIrankingbutton';

export const ForecastTable = ({name}) => {
  const dummyData = [
    { day: 'Thứ 2', aqi: 45 },
    { day: 'Thứ 3', aqi: 67 },
    { day: 'Thứ 4', aqi: 89 },
    { day: 'Thứ 5', aqi: 123 },
    { day: 'Thứ 6', aqi: 156 },
    { day: 'Thứ 7', aqi: 98 },
    { day: 'Chủ nhật', aqi: 76 }
  ];

  return (
<div className = {styles.forecast_table_container}>
<div className = {styles.title}>
<i class="fa-solid fa-chart-simple"></i> Dự báo 7 ngày tiếp theo tại: {name}</div>

<Table>
  <TableHead>
    <TableRow style={{height: '48px'}}>
      <TableCell align="center" style={{fontWeight: 600, color: 'black'}}>#</TableCell>
      <TableCell align="left" style={{fontWeight: 600, color: 'black'}}>Thứ</TableCell>
      <TableCell align="center" style={{fontWeight: 600, color: 'black'}}>AQI VN</TableCell>
      <TableCell align="center" style={{fontWeight: 600, color: 'black'}}>Xu hướng</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {dummyData.map((row, index) => (
      <TableRow 
        key={index}
        hover
        style={{height: '48px', '&:hover': {backgroundColor: 'rgba(0, 0, 0, 0.04)'}}}
      >
        <TableCell align="center" style={{color: 'black'}}>{index + 1}</TableCell>
        <TableCell align="left" style={{color: 'black'}}><div style={{display: 'flex', alignItems: 'center'}}><div className={styles.location_icon}></div><div>{row.day}</div></div></TableCell>
        <TableCell align="center"><AQIRankingButton value={row.aqi}/></TableCell>
        <TableCell align="center" style={{color: 'black'}}>
          {index > 0 ? (
            row.aqi > dummyData[index-1].aqi ? 
            `↑ (+${row.aqi - dummyData[index-1].aqi})` : 
            `↓ (${row.aqi - dummyData[index-1].aqi})`
          ) : '-'}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
</div>

  );
};