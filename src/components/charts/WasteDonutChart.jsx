import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const WasteDonutChart = ({ recycled = 65, nonRecycled = 35 }) => {
  const data = [
    { name: 'Recycled', value: recycled },
    { name: 'Landfill', value: nonRecycled },
  ];
  const COLORS = ['#2E7D32', '#ECEFF1'];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            strokeWidth={2}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} stroke={index === 0 ? '#2E7D32' : '#CFD8DC'} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v) => [`${v}%`]}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-20px' }}>
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-800">{recycled}%</div>
          <div className="text-xs text-gray-500 font-medium">Recycled</div>
        </div>
      </div>
    </div>
  );
};

export default WasteDonutChart;
