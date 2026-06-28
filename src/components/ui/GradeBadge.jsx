import React from 'react';
import { GRADE_COLORS, GRADE_BG } from '../../utils/constants';

const sizes = {
  sm: { badge: 'w-8 h-8 text-sm', label: 'text-xs' },
  md: { badge: 'w-12 h-12 text-xl', label: 'text-xs' },
  lg: { badge: 'w-20 h-20 text-4xl', label: 'text-sm' },
};

const GradeBadge = ({ grade, size = 'md', showLabel = false }) => {
  if (!grade) return null;
  const color = GRADE_COLORS[grade] || '#9E9E9E';
  const bg = GRADE_BG[grade] || '#F5F5F5';
  const sz = sizes[size] || sizes.md;

  const labels = { A: 'Excellent', B: 'Good', C: 'Fair', D: 'Poor', F: 'Critical' };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`${sz.badge} rounded-2xl flex items-center justify-center font-bold shadow-md`}
        style={{ backgroundColor: bg, color, border: `2px solid ${color}` }}
      >
        {grade}
      </div>
      {showLabel && (
        <span className={`${sz.label} font-medium`} style={{ color }}>
          {labels[grade]}
        </span>
      )}
    </div>
  );
};

export default GradeBadge;
