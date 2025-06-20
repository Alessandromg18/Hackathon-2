import React from 'react';

interface ErrorMessageProps {
  error: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="text-red-600 text-center py-4">
      <h2 className="text-lg font-semibold">Error</h2>
      <p>{error}</p>
    </div>
  );
};
