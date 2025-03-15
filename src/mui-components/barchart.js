import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const dummyDataset = [
  { timestamp: '2024-01-01 00:00:00', aqi: 50 },
  { timestamp: '2024-01-01 01:00:00', aqi: 40 },
  { timestamp: '2024-01-01 02:00:00', aqi: 60 },
  { timestamp: '2024-01-01 03:00:00', aqi: 80 },
  { timestamp: '2024-01-01 04:00:00', aqi: 100 },
  { timestamp: '2024-01-01 05:00:00', aqi: 120 },
  { timestamp: '2024-01-01 06:00:00', aqi: 140 },
  { timestamp: '2024-01-01 07:00:00', aqi: 130 },
  { timestamp: '2024-01-01 08:00:00', aqi: 90 },
  { timestamp: '2024-01-01 09:00:00', aqi: 70 },
  { timestamp: '2024-01-01 10:00:00', aqi: 60 },
  { timestamp: '2024-01-01 11:00:00', aqi: 50 },
  { timestamp: '2024-01-01 12:00:00', aqi: 45 },
  { timestamp: '2024-01-01 13:00:00', aqi: 55 },
  { timestamp: '2024-01-01 14:00:00', aqi: 65 },
  { timestamp: '2024-01-01 15:00:00', aqi: 75 },
  { timestamp: '2024-01-01 16:00:00', aqi: 85 },
  { timestamp: '2024-01-01 17:00:00', aqi: 95 },
  { timestamp: '2024-01-01 18:00:00', aqi: 105 },
  { timestamp: '2024-01-01 19:00:00', aqi: 115 },
  { timestamp: '2024-01-01 20:00:00', aqi: 125 },
  { timestamp: '2024-01-01 21:00:00', aqi: 135 },
  { timestamp: '2024-01-01 22:00:00', aqi: 145 },
  { timestamp: '2024-01-01 23:00:00', aqi: 155 }
];

const BarChartComponent = ({ dataset }) => {
  const chartSetting = {
    yAxis: [{ label: 'AQI' }],
    series: [{ dataKey: 'aqi', label: 'Air Quality Index' }],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  };

  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ scaleType: 'band', dataKey: 'timestamp', tickPlacement: 'middle', tickLabelPlacement: 'middle' }]}
      {...chartSetting}
    />
  );
};

const TickPlacementChart = ({ data = dummyDataset }) => {
  return (
    <div style={{ width: '100%' }}>
      <BarChartComponent dataset={data} />
    </div>
  );
};

export default TickPlacementChart;