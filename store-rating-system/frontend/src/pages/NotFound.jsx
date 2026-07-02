import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
    <p className="text-7xl mb-4">🔍</p>
    <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
    <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary">
      Go Home
    </Link>
  </div>
);

export default NotFound;
