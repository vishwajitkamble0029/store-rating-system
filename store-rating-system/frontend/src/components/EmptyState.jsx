import React from 'react';

export const EmptyState = ({ message = 'No records found.' }) => (
  <div className="text-center py-14 text-gray-400">
    <p className="text-4xl mb-2">🗂️</p>
    <p className="text-sm">{message}</p>
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.' }) => (
  <div className="text-center py-14 text-red-500">
    <p className="text-4xl mb-2">⚠️</p>
    <p className="text-sm">{message}</p>
  </div>
);
