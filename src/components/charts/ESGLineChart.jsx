import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { ESG_CHART_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-card-hover border border-gray-100 p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{Number(p.value).toFixed(1)}</span>
        </div>
      ))}
    </div>
  );
};

const ESGLineChart = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
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
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
        />
        <Line
          type="monotone"
          dataKey="environmentScore"
          name="Environment"
          stroke={ESG_CHART_COLORS.environment}
          strokeWidth={2.5}
          dot={{ r: 4, fill: ESG_CHART_COLORS.environment }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="socialScore"
          name="Social"
          stroke={ESG_CHART_COLORS.social}
          strokeWidth={2.5}
          dot={{ r: 4, fill: ESG_CHART_COLORS.social }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="governanceScore"
          name="Governance"
          stroke={ESG_CHART_COLORS.governance}
          strokeWidth={2.5}
          dot={{ r: 4, fill: ESG_CHART_COLORS.governance }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="totalScore"
          name="Total"
          stroke={ESG_CHART_COLORS.total}
          strokeWidth={3}
          strokeDasharray="5 3"
          dot={{ r: 4, fill: ESG_CHART_COLORS.total }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ESGLineChart;
