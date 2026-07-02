import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Loader from '../../components/Loader.jsx';
import { ErrorState } from '../../components/EmptyState.jsx';
import RatingStars from '../../components/RatingStars.jsx';

const UserDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService
      .getUserDetails(id)
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load user details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/users" className="text-sm text-primary-600 hover:underline mb-4 inline-block">
        ← Back to Users
      </Link>
      <h1 className="text-2xl font-bold mb-6">User Details</h1>

      <div className="card space-y-3 mb-6">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Name</p>
          <p className="font-medium">{data.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Email</p>
          <p className="font-medium">{data.email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Address</p>
          <p className="font-medium">{data.address || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Role</p>
          <p className="font-medium">{data.role}</p>
        </div>
      </div>

      {data.role === 'OWNER' && (
        <>
          <div className="card mb-6 flex items-center gap-4">
            <RatingStars value={Math.round(data.overallAverageRating || 0)} readOnly size="text-2xl" />
            <div>
              <p className="text-xl font-bold">{data.overallAverageRating || 'N/A'}</p>
              <p className="text-sm text-gray-500">Overall Average Rating</p>
            </div>
          </div>

          <h2 className="font-semibold mb-3">Stores Owned</h2>
          <div className="card p-0 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {data.stores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td className="max-w-xs truncate">{s.address || '—'}</td>
                    <td>{s.averageRating || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDetails;
