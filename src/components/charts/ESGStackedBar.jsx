import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ESG_CHART_COLORS } from '../../utils/constants';

const ESGStackedBar = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
        <XAxis
          dataKey="period"
          tick={{ fontSize: 11, fill: '#9E9E9E' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fill: '#9E9E9E' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          formatter={(v) => [`${Number(v).toFixed(1)} pts`]}
        />
        <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="environmentScore" name="Environment" stackId="esg" fill={ESG_CHART_COLORS.environment} radius={[0,0,0,0]} maxBarSize={40} />
        <Bar dataKey="socialScore" name="Social" stackId="esg" fill={ESG_CHART_COLORS.social} maxBarSize={40} />
        <Bar dataKey="governanceScore" name="Governance" stackId="esg" fill={ESG_CHART_COLORS.governance} radius={[6,6,0,0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ESGStackedBar;
