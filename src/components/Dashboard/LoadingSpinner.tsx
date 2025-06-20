import React from 'react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-1/4 bg-gray-200 rounded"></div>
    </div>
  );
};
