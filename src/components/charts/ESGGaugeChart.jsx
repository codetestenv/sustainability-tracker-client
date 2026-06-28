import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { getGrade } from '../../utils/formatters';
import { GRADE_COLORS } from '../../utils/constants';

const ESGGaugeChart = ({ score = 0 }) => {
  const grade = getGrade(score);
  const color = GRADE_COLORS[grade] || '#9E9E9E';

  const data = [
    { value: 100, fill: '#F0F0F0' },
    { value: score, fill: color },
  ];

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={200} height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="65%"
          outerRadius="90%"
          startAngle={225}
          endAngle={-45}
          data={data}
          barSize={16}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={8}
            background={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <div className="text-4xl font-bold" style={{ color }}>
          {Math.round(score)}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">/ 100</div>
        <div
          className="mt-1 px-2.5 py-0.5 rounded-full text-sm font-bold"
          style={{ backgroundColor: GRADE_COLORS[grade] + '20', color }}
        >
          Grade {grade}
        </div>
      </div>
    </div>
  );
};

export default ESGGaugeChart;
