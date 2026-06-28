import React from 'react';

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="text-4xl mb-3">⚠️</div>
    <p className="text-red-600 font-medium mb-1">Something went wrong</p>
    <p className="text-sm text-gray-500 mb-4">{message || 'An unexpected error occurred'}</p>
    {onRetry && (
      <button className="btn-outline btn-sm" onClick={onRetry}>
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
