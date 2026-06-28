import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const EmissionsBarChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#9E9E9E' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9E9E9E' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
        />
        <Tooltip
          formatter={(v) => [`${Number(v).toLocaleString()} kg CO₂`, 'Emissions']}
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.value > 10000 ? '#FF7043' : '#2E7D32'}
              fillOpacity={0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default EmissionsBarChart;
