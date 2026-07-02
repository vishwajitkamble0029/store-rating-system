import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import SearchBar from '../../components/SearchBar.jsx';
import SortableHeader from '../../components/SortableHeader.jsx';
import Pagination from '../../components/Pagination.jsx';
import Loader from '../../components/Loader.jsx';
import { EmptyState, ErrorState } from '../../components/EmptyState.jsx';
import RatingStars from '../../components/RatingStars.jsx';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  const fetchStores = useCallback(() => {
    setLoading(true);
    adminService
      .listStores({ search, sortBy, sortOrder, page, limit: 10 })
      .then((res) => {
        setStores(res.data);
        setPagination(res.pagination);
      })
      .catch(() => setError('Failed to load stores'))
      .finally(() => setLoading(false));
  }, [search, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Link to="/admin/stores/add" className="btn-primary">
          + Add Store
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar onSearch={(v) => { setSearch(v); setPage(1); }} placeholder="Search name, email, address..." />
      </div>

      <div className="card overflow-x-auto p-0">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} />
        ) : stores.length === 0 ? (
          <EmptyState message="No stores found." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <SortableHeader label="Store Name" field="name" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Email" field="email" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Address" field="address" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <SortableHeader label="Avg Rating" field="averageRating" sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort} />
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td className="max-w-xs truncate">{s.address || '—'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <RatingStars value={Math.round(s.averageRating || 0)} readOnly size="text-sm" />
                      <span className="text-xs text-gray-400">({s.averageRating || 'N/A'})</span>
                    </div>
                  </td>
                  <td>{s.owner ? s.owner.name : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Stores;
