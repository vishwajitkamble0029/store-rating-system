import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import Loader from '../../components/Loader.jsx';
import { ErrorState } from '../../components/EmptyState.jsx';

const StatCard = ({ icon, label, value, color }) => (
  <div className="card flex items-center gap-4">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="bg-blue-100 dark:bg-blue-500/10" />
        <StatCard icon="🏬" label="Total Stores" value={stats.totalStores} color="bg-green-100 dark:bg-green-500/10" />
        <StatCard icon="⭐" label="Total Ratings" value={stats.totalRatings} color="bg-yellow-100 dark:bg-yellow-500/10" />
      </div>

      <div className="card">
        <h2 className="font-semibold mb-3">Overview</h2>
        <div className="space-y-3">
          {[
            { label: 'Users', value: stats.totalUsers, max: Math.max(stats.totalUsers, stats.totalStores, stats.totalRatings, 1) },
            { label: 'Stores', value: stats.totalStores, max: Math.max(stats.totalUsers, stats.totalStores, stats.totalRatings, 1) },
            { label: 'Ratings', value: stats.totalRatings, max: Math.max(stats.totalUsers, stats.totalStores, stats.totalRatings, 1) },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full"
                  style={{ width: `${(row.value / row.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
