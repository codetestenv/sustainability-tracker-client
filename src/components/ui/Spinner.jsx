import React from 'react';

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-7 h-7 border-2',
  lg: 'w-12 h-12 border-3',
  xl: 'w-16 h-16 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`${sizeMap[size]} rounded-full border-primary-200 border-t-primary-800 animate-spin inline-block ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
