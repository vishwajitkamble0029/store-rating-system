import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = ({ onToggleSidebar, darkMode, onToggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onToggleSidebar} className="lg:hidden text-xl">
          ☰
        </button>
        <h1 className="font-semibold text-lg text-primary-600">Store Rating System</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleDarkMode}
          className="btn-secondary px-2.5 py-2"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-medium">{user?.name}</span>
          <span className="text-xs text-gray-400">{user?.role}</span>
        </div>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
