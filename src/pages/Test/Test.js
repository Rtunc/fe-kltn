import React from 'react';
import AQIGaugeChart from '../../components/Airgaugechart'
import TickPlacementChart from '../../mui-components/barchart'
const Test = () => {


  return (
    <div>
      <i className="fa-solid fa-magnifying-glass"></i>
      <h1>Dữ liệu cảm biến:</h1>
      <div>
        <AQIGaugeChart value={87}></AQIGaugeChart>
        <TickPlacementChart />
      </div>

    </div>

  );
};

export default Test;
