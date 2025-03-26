import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';

const BarChartComponent = ({ dataset, label, dataKey }) => {
  // Transform dataset to only include timestamp and selected dataKey
  const transformedData = dataset.map(item => ({
    timestamp: item.timestamp,
    [dataKey]: item[dataKey]
  }));

  const chartSetting = {
    yAxis: [{ label }],
    series: [{ dataKey }],
    height: 300,
    sx: {
      [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
        transform: 'translateX(-10px)',
      },
    },
  };

  return (
    <BarChart
      dataset={transformedData}
      xAxis={[{ 
        scaleType: 'band', 
        dataKey: 'timestamp', 
        tickPlacement: 'middle', 
        tickLabelPlacement: 'middle',
        tickLabelStyle: { fontSize: 12 }
      }]}
      {...chartSetting}
    />
  );
};

const TickPlacementChart = ({ data, label, dataKey }) => {
  return (
    <div style={{ width: '100%' }}>
      <BarChartComponent dataset={data} label={label} dataKey={dataKey} />
    </div>
  );
};

export default TickPlacementChart;