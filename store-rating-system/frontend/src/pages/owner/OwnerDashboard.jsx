import React, { useEffect, useState } from 'react';
import { ownerService } from '../../services/ownerService';
import Loader from '../../components/Loader.jsx';
import { EmptyState, ErrorState } from '../../components/EmptyState.jsx';
import RatingStars from '../../components/RatingStars.jsx';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ownerService
      .getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>

      <div className="card mb-8 flex items-center gap-4">
        <RatingStars value={Math.round(data.overallAverageRating || 0)} readOnly size="text-3xl" />
        <div>
          <p className="text-2xl font-bold">{data.overallAverageRating || 'N/A'}</p>
          <p className="text-sm text-gray-500">Average rating across all your stores</p>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Your Stores</h2>
      {data.stores.length === 0 ? (
        <EmptyState message="You don't own any stores yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {data.stores.map((s) => (
            <div key={s.id} className="card">
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{s.address || '—'}</p>
              <div className="flex items-center gap-2">
                <RatingStars value={Math.round(s.averageRating || 0)} readOnly size="text-sm" />
                <span className="text-xs text-gray-400">{s.averageRating || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="font-semibold mb-3">Ratings Received</h2>
      <div className="card p-0 overflow-x-auto">
        {data.raters.length === 0 ? (
          <EmptyState message="No ratings received yet." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Store</th>
                <th>Rating</th>
                <th>Rated Date</th>
              </tr>
            </thead>
            <tbody>
              {data.raters.map((r) => (
                <tr key={r.id}>
                  <td>{r.userName}</td>
                  <td>{r.userEmail}</td>
                  <td>{r.storeName}</td>
                  <td>
                    <RatingStars value={r.rating} readOnly size="text-sm" />
                  </td>
                  <td>{new Date(r.ratedDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
