import React from 'react';

const Loader = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
    <div className="h-10 w-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);

export default Loader;
