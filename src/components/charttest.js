import { RadialBarChart, RadialBar } from "recharts";

export default function PressureGauge({ data }) {
  // Format data for RadialBarChart
  const chartData = [
    {
      name: 'Pressure',
      value: data
    }
  ];

  return (
    <div style={{ position: 'relative' }}>
      <RadialBarChart
        width={100}
        height={100}
        cx={50}
        cy={50}
        innerRadius={20}
        outerRadius={40}
        barSize={10}
        data={chartData}
        startAngle={180}
        endAngle={0}
      >
        <RadialBar 
          minAngle={0} 
          background 
          clockWise 
          dataKey="value" 
          fill="#6495ED"
          maxValue={100} // Đặt giá trị tối đa là 100
        />
      </RadialBarChart>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        {data}%
      </div>
    </div>
    
  );
}
