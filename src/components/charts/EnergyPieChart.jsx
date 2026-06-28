import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#2E7D32', '#A5D6A7', '#1565C0', '#90CAF9'];

const EnergyPieChart = ({ data = [] }) => {
  const defaultData = data.length > 0 ? data : [
    { name: 'Solar', value: 35 },
    { name: 'Wind', value: 20 },
    { name: 'Grid (Non-renewable)', value: 35 },
    { name: 'Other Renewable', value: 10 },
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={defaultData}
          cx="50%"
          cy="45%"
          outerRadius={95}
          dataKey="value"
          labelLine={false}
          label={renderCustomLabel}
        >
          {defaultData.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(v, name) => [`${v}%`, name]}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EnergyPieChart;
