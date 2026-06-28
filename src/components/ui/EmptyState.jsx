import React from 'react';

const EmptyState = ({ icon = '📭', title = 'No data found', description = '', action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
    {description && <p className="text-sm text-gray-400 max-w-xs mb-4">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
